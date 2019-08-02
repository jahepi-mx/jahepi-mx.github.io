function SkeletonBossEnemy(x, y, width, height, velocityX, distance, health, level, shootInterval, camera) {
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.isDisposable = false;
    this.health = health;
    this.origHealth = health;
    this.isDead = false;
    this.isMortal = true;
    this.isJumping = false;
    this.isShooting = false;
    this.hasGuns = true;
    this.damagePoints = 1;
    this.nextShootTime = 0;
    this.nextShootTimeCount = 0;
    this.shootInterval = shootInterval;
    this.level = level;
    
    this.leftAnimation = new Animation(3, 2);
    this.rightAnimation = new Animation(3, 2);
    this.deadAnimation = new Animation(6, 1);
    this.deadAnimation.stopAtSequenceNumber(1, this.onStopDeadAnimation.bind(this));
    this.directions = [-1, 1];
    
    this.distance = distance;
    this.origDistance = distance;
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize + (Config.tileSize - this.height);
    this.velocityX = velocityX;
    this.velocityY = 0;
    this.traveledX = Math.random() * this.distance;
    this.traveledY = 0;
    this.direction = this.directions[Math.round(Math.random())];
    this.currChangeDirection = Math.random() * 2 + 2;
    this.changeDirectionTime = 0;
    this.jumpTime = 0;
    this.jumpTimeLimit = Math.random() * 3 + 2;
}

SkeletonBossEnemy.prototype.onStopDeadAnimation = function() {
    this.isDisposable = true;
};

SkeletonBossEnemy.prototype.draw = function(context) {
    
    // Draw life bar
    if (this.health > 0) {
        context.fillStyle='#000';
        context.fillRect(this.x + this.traveledX - this.camera.x + (this.width / 2 - 25), this.y + this.traveledY - this.camera.y - 20, 50, 6);
        context.fillStyle='#ff0000';
        context.fillRect(this.x + this.traveledX - this.camera.x + (this.width / 2 - 24), this.y + this.traveledY - this.camera.y - 19, 48 * (this.health / this.origHealth), 4);
    }
    var name = "";
    if (this.isDead) {
        name = "explo_" + (this.deadAnimation.getFrame() + 1);
    } else if (this.direction === -1) {
        name = "skeleton_left_" + (this.leftAnimation.getFrame() + 1);
    } else {
        name = "skeleton_right_" + (this.rightAnimation.getFrame() + 1);
    }
    context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x + this.traveledX - this.camera.x, this.y + this.traveledY - this.camera.y, this.width, this.height);
};

SkeletonBossEnemy.prototype.shoot = function(x, y, blasts) {
    if (this.direction === 1) {
        Assets.playAudio(Assets.enemy_laser_sound, false);
        blasts.push(new EnemyBlast(this, Math.PI, 0.30, EnemyBlast.FIRE_TYPE, true, 100, 300, this.camera));
    }
    if (this.direction === -1) {
        Assets.playAudio(Assets.enemy_laser_sound, false);
        blasts.push(new EnemyBlast(this, 0, 0.30, EnemyBlast.FIRE_TYPE, true, 100, 300, this.camera));
    }
    this.isShooting = false;
};

SkeletonBossEnemy.prototype.changeDirection = function(x) {
    var diff = x - this.left();
    this.direction = diff < 0 ? -1 : 1;
};

SkeletonBossEnemy.prototype.update = function(deltatime) {
    
    if (this.isDead) {
        this.deadAnimation.update(deltatime);
        return;
    } else if (this.direction === -1) {
        this.leftAnimation.update(deltatime);
    } else {
        this.rightAnimation.update(deltatime);
    }
    
    var diff = this.distance - this.traveledX;
    
    this.traveledX += diff * deltatime;
    
    this.jumpTime += deltatime;
    if (this.jumpTime >= this.jumpTimeLimit && !this.isJumping) {
        this.jumpTimeLimit = Math.random() * 3 + 2;
        this.jumpTime = 0;
        this.isJumping = true;
        this.velocityY = -300;
    }
    
    if (this.isJumping) {
        this.velocityY += Config.gravity * deltatime;
        this.traveledY += this.velocityY * deltatime;
        if (this.traveledY > 0) {
            this.traveledY = 0;
            this.isJumping = false;
        }
    }
    
    this.nextShootTimeCount += deltatime;
    
    if (this.nextShootTime === 0) {
        // Shoots randomly in X seconds interval
        this.nextShootTime = Math.random() * this.shootInterval;
    }
    
    if (this.nextShootTimeCount >= this.nextShootTime && !this.isDead) {
        this.nextShootTime = 0;
        this.nextShootTimeCount = 0;
        this.isShooting = true;
    }
    
    this.changeDirectionTime += deltatime;
    
    if (this.changeDirectionTime >= this.currChangeDirection) {
        this.changeDirectionTime = 0;
        this.currChangeDirection = Math.random() * 3 + 2;
        this.distance = Math.random() * this.origDistance;
    }
};

SkeletonBossEnemy.prototype.collide = function(entity) {
    if (this.isDead) {
        return false;
    }
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = this.width / 2 + entity.width / 2;
    var sizeY = this.height / 2 + entity.height / 2;
    if (diffX < sizeX && diffY < sizeY) {
        Assets.playAudio(Assets.explosion_sound, false);
        this.health--;
        if (this.health <= 0) {
            this.isDead = true;
            this.level.currentNumberOfCoins++;
        }
        return true;
    }
    return false;
};

SkeletonBossEnemy.prototype.left = function() {
    return this.x + this.traveledX - this.camera.x;
};

SkeletonBossEnemy.prototype.right = function() {
    return (this.x + this.width) + this.traveledX - this.camera.x;
};

SkeletonBossEnemy.prototype.top = function() {
    return this.y + this.traveledY - this.camera.y;
};

SkeletonBossEnemy.prototype.bottom = function() {
    return (this.y + this.height) + this.traveledY - this.camera.y;
};