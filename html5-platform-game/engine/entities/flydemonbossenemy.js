function FlyDemonBossEnemy(x, y, width, height, ratioDistance, health, offsetX, offsetY, offsetYTo, level, camera) {
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.isDisposable = false;
    this.isDead = false;
    this.health = health;
    this.origHealth = health;
    this.isMortal = true;
    this.isShooting = false;
    this.isRotating = false;
    this.hasGuns = true;
    this.nextShootTime = 0;
    this.nextShootTimeCount = 0;
    this.shootType = 2;
    this.shootsCount = 0;
    this.nextRotateTime = 5;
    this.nextRotateTimeCount = 0;
    this.damagePoints = 1;
    this.level = level;
    
    this.frontAnimation = new Animation(4, 2);
    this.deadAnimation = new Animation(6, 1);
    this.deadAnimation.stopAtSequenceNumber(1, this.onStopDeadAnimation.bind(this));
    
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize + offsetY;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.offsetYTo = offsetYTo;
    this.traveledX = 0;
    this.traveledY = 0;
    this.ratioX = 0;
    this.ratioY = 0;
    this.degrees = 0;
    this.ratioDistance = ratioDistance;
}

FlyDemonBossEnemy.prototype.onStopDeadAnimation = function() {
    this.isDisposable = true;
};

FlyDemonBossEnemy.prototype.draw = function(context) {
    
    // Draw life bar
    if (this.health > 0) {
        context.fillStyle='#000';
        context.fillRect(this.x - this.traveledX - this.camera.x + (this.width / 2 - 25) + (this.ratioX * this.ratioDistance), this.y + this.height + 25 - this.traveledY - this.camera.y - 20 + (this.ratioY * this.ratioDistance), 50, 6);
        context.fillStyle='#ff0000';
        context.fillRect(this.x - this.traveledX - this.camera.x + (this.width / 2 - 24) + (this.ratioX * this.ratioDistance), this.y + this.height + 25 - this.traveledY - this.camera.y - 19 + (this.ratioY * this.ratioDistance), 48 * (this.health / this.origHealth), 4);
    }
    
    var name = "";
    if (this.isDead) {
        name = "explo_" + (this.deadAnimation.getFrame() + 1);
    } else {
        name = "fly_demon" + (this.frontAnimation.getFrame() + 1);
    }
    context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.traveledX - this.camera.x + (this.ratioX * this.ratioDistance), this.y - this.traveledY - this.camera.y  + (this.ratioY * this.ratioDistance), this.width, this.height);
};

FlyDemonBossEnemy.prototype.changeDirection = function(x) {
    
};

FlyDemonBossEnemy.prototype.shoot = function(x, y, blasts) {
    if (this.isShooting) {
        
        Assets.playAudio(Assets.enemy_laser_sound, false);
        this.isShooting = false;
        
        if (this.shootType === 1) {
            var diffX = (this.left() + this.width / 2) - x;
            var diffY = (this.top() + this.height / 2) - y;
            var radians = Math.atan2(diffY, diffX);
            blasts.push(new EnemyBlast(this, radians, 0.3, EnemyBlast.RED_TYPE, false, 0, 0, this.camera));
        } else {
            this.shootType = 1;
            blasts.push(new EnemyBlast(this, Math.PI / 180 * -45, 0.3, EnemyBlast.RED_TYPE, false, 0, 0, this.camera));
            blasts.push(new EnemyBlast(this, Math.PI / 180 * -90, 0.3, EnemyBlast.RED_TYPE, false, 0, 0, this.camera));
            blasts.push(new EnemyBlast(this, Math.PI / 180 * -135, 0.3, EnemyBlast.RED_TYPE, false, 0, 0, this.camera));
            this.nextShootTime = 3;
        }
        
        this.shootsCount++;
        if (this.shootsCount % 4 === 0) {
            this.shootType = 2;
            this.shootsCount = 0;
            this.nextShootTime = 3;
        }
    }
};

FlyDemonBossEnemy.prototype.update = function(deltatime) {
    
    if (this.isDead) {
        this.deadAnimation.update(deltatime);
        return;
    } else {
        this.frontAnimation.update(deltatime);
    }
    
    if (this.traveledY >= this.offsetYTo) {
        this.traveledY -= 20 * deltatime;
        return;
    }
    
    this.nextShootTimeCount += deltatime;
    if (this.nextShootTimeCount >= this.nextShootTime && !this.isDead) {
        if (this.shootType === 1) {
            this.nextShootTime = 0.5;
        }
        this.nextShootTimeCount = 0;
        this.isShooting = true;
    }
    
    if (this.isRotating === false) {
        this.nextRotateTimeCount += deltatime;
    }
    
    if (this.nextRotateTimeCount >= this.nextRotateTime && !this.isDead) {
        this.nextRotateTimeCount = 0;
        this.isRotating = true;
    }
    
    if (this.isRotating) {
        this.degrees += 90 * deltatime;
        if (this.degrees >= 360) {
            this.degrees = 0;
            this.isRotating = false;
        }
    }
    
    this.ratioX = Math.cos(Math.PI / 180 * this.degrees);
    this.ratioY = Math.sin(Math.PI / 180 * this.degrees);
    
    this.traveledX += ((this.left() - this.offsetX) * deltatime) * 0.5;

};

FlyDemonBossEnemy.prototype.collide = function(entity) {
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

FlyDemonBossEnemy.prototype.left = function() {
    return this.x - this.traveledX - this.camera.x + (this.ratioX * this.ratioDistance);
};

FlyDemonBossEnemy.prototype.right = function() {
    return (this.x + this.width) - this.traveledX - this.camera.x + (this.ratioX * this.ratioDistance);
};

FlyDemonBossEnemy.prototype.top = function() {
    return this.y - this.traveledY -  this.camera.y + (this.ratioY * this.ratioDistance);
};

FlyDemonBossEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.traveledY - this.camera.y + (this.ratioY * this.ratioDistance);
};



