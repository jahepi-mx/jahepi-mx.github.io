function GameController() {
    this.time = 0;
    this.vectorMoves = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]];
    this.camera = new Camera();
    this.collisionPrecision = 5;
    this.levelManager = new LevelManager();
    this.enemiesBlasts = [];
    this.platforms = [];
    this.hero = new Hero(0, 0, Config.heroSize, Config.heroSize, this.collisionPrecision, this.camera);
    this.initLevel();
}

GameController.prototype.update = function(deltatime) {
    
    this.time += deltatime;
   
    // Ladder implementation, when the hero is nearby a ladder tile, he is able to climb it.
    var currentX = Math.floor(Math.round((this.camera.x + this.hero.centerX) / Config.tileSize));
    var currentY = Math.floor(Math.round((this.camera.y + this.hero.centerY) / Config.tileSize));
    var foundOnLadder = false;
    for (var v = 0; v < this.vectorMoves.length; v++) {
        var tmpX = currentX + this.vectorMoves[v][0];
        var tmpY = currentY + this.vectorMoves[v][1];
        var tile = this.getTile(tmpY * this.currentLevel.mapWidth + tmpX);
        if (tile !== null) {
            if ((tile.type === Tile.LADDER_TYPE || tile.type === Tile.LADDER_TOP_TYPE) && tile.collide(this.hero)) {
                foundOnLadder = true;
                if (!this.hero.isJumping && (this.hero.isUp || this.hero.isDown)) {
                    this.hero.isOnLadder = true;
                    // Center hero on ladder
                    this.hero.x = (tile.x - this.hero.left()) + tile.width / 2 - this.hero.width / 2;
                    break;
                }
            }
        }
    }
    if (this.hero.isOnLadder && !foundOnLadder) {
        this.hero.isOnLadder = false;
    }
    // End of ladder implementation
    
    this.hero.update(deltatime);
    var platformOffset = 40;
    
    var movingPlatform = null;
    
    // Hero collision detection
    for (var i = 0; i < this.collisionPrecision; i++) {
        var oldX = this.hero.x;
        var oldY = this.hero.y;
        this.hero.updateX(deltatime);
        this.camera.move(this.hero.x, this.hero.y);
        currentX = Math.floor(Math.round((this.camera.x + this.hero.centerX) / Config.tileSize));
        currentY = Math.floor(Math.round((this.camera.y + this.hero.centerY) / Config.tileSize));
        for (var v = 0; v < this.vectorMoves.length; v++) {
            var tmpX = currentX + this.vectorMoves[v][0];
            var tmpY = currentY + this.vectorMoves[v][1];
            var tile = this.getTile(tmpY * this.currentLevel.mapWidth + tmpX);
            if (tile !== null) {
               if (tile.type === Tile.WALL_TYPE) { 
                    if (tile.collide(this.hero)) {
                        this.hero.x = oldX;
                        this.camera.move(this.hero.x, this.hero.y);
                        break;
                    }
                } 
            }
        }
        oldX = this.hero.x;
        oldY = this.hero.y;
        this.hero.updateY(deltatime);
        this.camera.move(this.hero.x, this.hero.y);
        for (var v = 0; v < this.vectorMoves.length; v++) {
            var tmpX = currentX + this.vectorMoves[v][0];
            var tmpY = currentY + this.vectorMoves[v][1];
            var tile = this.getTile(tmpY * this.currentLevel.mapWidth + tmpX);
            if (tile !== null) {
               if (tile.type === Tile.WALL_TYPE){ 
                    if (tile.collide(this.hero)) {
                        this.hero.y = oldY;
                        this.hero.setJumping(false);
                        this.camera.move(this.hero.x, this.hero.y);
                        break;
                    }
                }
                // Platform collision condition
                var isPlatformCollision = tile.type === Tile.PLATFORM_TYPE && this.hero.velocityY >= 0 && this.hero.bottom() > tile.top() && this.hero.bottom() < tile.top() + platformOffset;
                var isLadderTopCollision = tile.type === Tile.LADDER_TOP_TYPE && !this.hero.isDown && !this.hero.isOnLadder && this.hero.velocityY >= 0 && this.hero.bottom() > tile.top() && this.hero.bottom() < tile.top() + platformOffset;
                
                if (isPlatformCollision || isLadderTopCollision) {
                    if (this.hero.right() >= tile.left() && this.hero.right() <= tile.right()) {
                        this.hero.y = oldY;
                        this.camera.move(this.hero.x, this.hero.y);
                        this.hero.setJumping(false);
                        break;
                    } else if (this.hero.left() >= tile.left() && this.hero.left() <= tile.right()) {
                        this.hero.y = oldY;
                        this.camera.move(this.hero.x, this.hero.y);
                        this.hero.setJumping(false);
                        break;
                    }
                }
            }
            
            for (var a = 0; a < this.platforms.length; a++) {
                var isMovingPlatformCollision = this.hero.velocityY >= 0 && this.hero.bottom() > this.platforms[a].top() && this.hero.bottom() < this.platforms[a].top() + this.platforms[a].height / 2;
                if (isMovingPlatformCollision) {
                    if (this.hero.right() >= this.platforms[a].left() && this.hero.right() <= this.platforms[a].right()) {
                        this.hero.setJumping(false);
                        movingPlatform = this.platforms[a];
                        this.hero.isOnMovingPlatform = true;
                        break;
                    } else if (this.hero.left() >= this.platforms[a].left() && this.hero.left() <= this.platforms[a].right()) {
                        this.hero.setJumping(false);
                        movingPlatform = this.platforms[a];
                        this.hero.isOnMovingPlatform = true;                      
                        break;
                    }
                }
            }
        }
    }
    
    for (var y = this.getMinEnemyY(); y <= this.getMaxEnemyY(); y++) {
        for (var x = this.getMinEnemyX(); x <= this.getMaxEnemyX(); x++) {
            var enemy = this.getEnemy(y * this.currentLevel.mapWidth + x);
            if (enemy !== null) {
                enemy.update(deltatime);
                if (!enemy.isDead) {
                    this.hero.collide(enemy);
                }
                
                if (enemy.isMortal) {
                    for (var i = 0; i < this.hero.blasts.length; i++) {
                        if (!this.hero.blasts[i].collided && enemy.collide(this.hero.blasts[i])) {
                            this.hero.blasts[i].collided = true;
                        }
                    }
                }
                
                if (enemy.hasGuns) {
                    if (enemy.isShooting) {
                        enemy.shoot(this.hero.left() + this.hero.width / 2, this.hero.top() + this.hero.height / 2, this.enemiesBlasts);
                    }
                    enemy.changeDirection(this.hero.centerX);                    
                }
                
                if (enemy.isDisposable) {
                    this.enemies[y * this.currentLevel.mapWidth + x] = null;
                } 
            }
        }
    }
    
    for (var i = 0; i < this.enemiesBlasts.length; i++) {
        if (this.enemiesBlasts[i].isDisposable) {
            this.enemiesBlasts[i] = null;
            this.enemiesBlasts.splice(i, 1);
        } else {
            this.enemiesBlasts[i].update(deltatime);
            if (!this.enemiesBlasts[i].collided) {
                this.hero.collide(this.enemiesBlasts[i]);
            }
        }
    }
    
    for (var i = 0; i < this.platforms.length; i++) {
        if (Math.abs(this.platforms[i].left()) <= MovingPlatform.VISIBILITY_DISTANCE) {
            this.platforms[i].update(deltatime);
        }
    }
    
    if (movingPlatform !== null) {
        if (movingPlatform.type === MovingPlatform.CIRCULAR) {
            this.hero.x += movingPlatform.moveDistanceX;
            this.hero.y += movingPlatform.moveDistanceY;
        } else if (movingPlatform.type === MovingPlatform.HORIZONTAL) 
            this.hero.x += movingPlatform.moveDistanceX;
        else 
            this.hero.y += movingPlatform.moveDistanceY;
    } else {
        this.hero.isOnMovingPlatform = false;
    }
    
    for (var y = this.getMinY(); y <= this.getMaxY(); y++) {
        for (var x = this.getMinX(); x <= this.getMaxX(); x++) {
            var coin = this.getCoin(y * this.currentLevel.mapWidth + x);
            if (coin !== null) {
                coin.update(deltatime);
                if (coin.collide(this.hero)) {
                    coin.playSound();
                    this.coins[y * this.currentLevel.mapWidth + x] = null;
                    this.currentLevel.currentNumberOfCoins++;
                }
            }           
            var tile = this.getTile(y * this.currentLevel.mapWidth + x);
            if (tile !== null) {
                
                if (tile.type === Tile.WALL_TYPE) {
                    // Verify if any hero blast collide with a tile
                    for (var i = 0; i < this.hero.blasts.length; i++) {
                        this.hero.blasts[i].collide(tile);
                    }                  
                    // Verify if any enemy blast collide with a tile
                    for (var i = 0; i < this.enemiesBlasts.length; i++) {
                        this.enemiesBlasts[i].collide(tile);
                    }
                }
            }
        } 
    }
    this.hero.updateXFriction(deltatime);
    this.currentLevel.checkpoint(deltatime);
};

GameController.prototype.getTile = function(index) {
    if (index >= 0 && index < this.tiles.length && this.tiles[index] !== null) {
        return this.tiles[index];
    }
    return null;
};

GameController.prototype.getEnemy = function(index) {
    if (index >= 0 && index < this.enemies.length && this.enemies[index] !== null) {
        return this.enemies[index];
    }
    return null;
};

GameController.prototype.getCoin = function(index) {
    if (index >= 0 && index < this.coins.length && this.coins[index] !== null) {
        return this.coins[index];
    }
    return null;
};

GameController.prototype.getMinX = function() {
    var minX = Math.floor(((this.camera.x + this.hero.centerX) / Config.tileSize) - this.camera.width);
    return Math.max(0, minX);
};

GameController.prototype.getMaxX = function() {
    var maxX = Math.floor(((this.camera.x + this.hero.centerX) / Config.tileSize) + this.camera.width);
    return maxX;
};

GameController.prototype.getMinY = function() {
    var minY = Math.floor(((this.camera.y + this.hero.centerY) / Config.tileSize) - this.camera.height);
    return Math.max(0, minY);
};

GameController.prototype.getMaxY = function() {
    var maxY = Math.floor(((this.camera.y + this.hero.centerY) / Config.tileSize) + this.camera.height);
    return maxY;
};

GameController.prototype.getMinEnemyX = function() {
    var minX = Math.floor(((this.camera.x + this.hero.centerX) / Config.tileSize) - this.currentLevel.visibilityEnemyRatioX);
    return Math.max(0, minX);
};

GameController.prototype.getMaxEnemyX = function() {
    var maxX = Math.floor(((this.camera.x + this.hero.centerX) / Config.tileSize) + this.currentLevel.visibilityEnemyRatioX);
    return maxX;
};

GameController.prototype.getMinEnemyY = function() {
    var minY = Math.floor(((this.camera.y + this.hero.centerY) / Config.tileSize) - this.currentLevel.visibilityEnemyRatioY);
    return Math.max(0, minY);
};

GameController.prototype.getMaxEnemyY = function() {
    var maxY = Math.floor(((this.camera.y + this.hero.centerY) / Config.tileSize) + this.currentLevel.visibilityEnemyRatioY);
    return maxY;
};

GameController.prototype.jump = function() {
    if (!this.isCurrentLevelFinish()) this.hero.jump();
};

GameController.prototype.moveUp = function(bool) {
    if (!this.isCurrentLevelFinish()) this.hero.moveUp(bool);
};

GameController.prototype.moveDown = function(bool) {
    if (!this.isCurrentLevelFinish()) this.hero.moveDown(bool);
};

GameController.prototype.moveRight = function(bool) {
    if (!this.isCurrentLevelFinish()) this.hero.moveRight(bool);
};

GameController.prototype.moveLeft = function(bool) {
    if (!this.isCurrentLevelFinish()) this.hero.moveLeft(bool);
};

GameController.prototype.shoot = function() {
    if (!this.isCurrentLevelFinish()) this.hero.shoot();
};

GameController.prototype.isHeroDead = function() {
    return this.hero.isDead;
};

GameController.prototype.isCurrentLevelFinish = function() {
    return this.currentLevel.currentNumberOfCoins === this.currentLevel.totalNumberOfCoins;
};

GameController.prototype.isLastLevel = function() {
    return this.levelManager.isLastLevel();
};

GameController.prototype.nextLevel = function() {
    this.currentLevel = this.levelManager.getCurrentLevel();
    this.currentLevel.dispose(true);
    this.levelManager.nextLevel();
    this.initLevel();
};

GameController.prototype.initLevel = function() {
    this.enemiesBlasts = [];
    this.currentLevel = this.levelManager.getCurrentLevel();
    this.currentLevel.dispose(false);
    this.currentLevel.setup(this.camera);
    this.tiles = this.currentLevel.tiles;
    this.enemies = this.currentLevel.enemies;
    this.platforms = this.currentLevel.platforms;
    this.coins = this.currentLevel.coins;
    this.hero.x = this.currentLevel.startX;
    this.hero.y = this.currentLevel.startY;
    this.camera.move(this.hero.x, this.hero.y);
    this.hero.resetState();
};