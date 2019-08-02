function DragonBossEnemy(x, y, width, height, health, level, camera) {
    this.x = x * Config.tileSize - (width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize - (height - Config.tileSize);
    this.width = width;
    this.height = height;
    this.camera = camera;
    this.health = health;
    this.origHealth = health;
    this.isDisposable = false;
    this.isDead = false;
    this.isDamage = false;
    this.isShooting = false;
    this.isMortal = true;
    this.hasGuns = true;
    this.blastFlag = false;
    this.direction = -1;
    this.nextShootTime = 0;
    this.nextShootTimeCount = 0;
    this.shootInterval = 7;
    this.level = level;
    this.damagePoints = 1;
    
    this.idleAnimation = new Animation(5, 1);
    this.shootAnimation = new Animation(9, 2);
    this.deadAnimation = new Animation(6, 1);
    this.damageAnimation = new Animation(3, 2);
    this.damageAnimation.stopAtSequenceNumber(1, this.onStopDamageAnimation.bind(this));
    this.deadAnimation.stopAtSequenceNumber(1, this.onStopDeadAnimation.bind(this));
    this.shootAnimation.stopAtSequenceNumber(1, this.onStopShootAnimation.bind(this));
}

DragonBossEnemy.prototype.onStopShootAnimation = function() {
    this.shootAnimation.reset();
    this.isShooting = false;
    this.blastFlag = false;
};

DragonBossEnemy.prototype.onStopDeadAnimation = function() {
    this.isDisposable = true;
};

DragonBossEnemy.prototype.onStopDamageAnimation = function() {
    this.isDamage = false;
};

DragonBossEnemy.prototype.changeDirection = function(x) {
    var diff = x - this.left();
    this.direction = diff < 0 ? -1 : 1;
};

DragonBossEnemy.prototype.shoot = function(x, y, blasts) {
    if (!this.blastFlag) {
        Assets.playAudio(Assets.enemy_laser_sound, false);
        this.blastFlag = true;
        var diffX = (this.left() + this.width / 2) - x;
        var diffY = (this.top() + this.height / 2) - y;
        var radians = Math.atan2(diffY, diffX);
        var shoot1 = new EnemyBlast(this, radians + (Math.PI / 180 * -15), 0.30, EnemyBlast.SPHERE_TYPE, true, 0, 0, this.camera);
        shoot1.velocityX = 40 + Math.random() * 110;
        shoot1.velocityY = 350;
        shoot1.traveledXLimit = 2000;
        shoot1.traveledYLimit = 2000;
        blasts.push(shoot1);
        var shoot2 = new EnemyBlast(this, radians + (Math.PI / 180 * -30), 0.30, EnemyBlast.SPHERE_TYPE, true, 0, 0, this.camera);
        shoot2.velocityX = 120 + Math.random() * 190;
        shoot2.velocityY = 350;
        shoot2.traveledXLimit = 2000;
        shoot2.traveledYLimit = 2000;
        blasts.push(shoot2);
        var shoot3 = new EnemyBlast(this, radians + (Math.PI / 180 * -45), 0.30, EnemyBlast.SPHERE_TYPE, true, 0, 0, this.camera);
        shoot3.velocityX = 210 + Math.random() * 280;
        shoot3.velocityY = 350;
        shoot3.traveledXLimit = 2000;
        shoot3.traveledYLimit = 2000;
        blasts.push(shoot3);
        var shoot4 = new EnemyBlast(this, radians + (Math.PI / 180 * -60), 0.30, EnemyBlast.SPHERE_TYPE, true, 0, 0, this.camera);
        shoot4.velocityX = 300 + Math.random() * 370;
        shoot4.velocityY = 350;
        shoot4.traveledXLimit = 2000;
        shoot4.traveledYLimit = 2000;
        blasts.push(shoot4);
    }
};

DragonBossEnemy.prototype.update = function(deltatime) {
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
    
    if (this.isDamage && !this.damageAnimation.isStopped()) {
        this.damageAnimation.update(deltatime);
    } else if (this.isDead) {
        this.deadAnimation.update(deltatime);
    } else if (this.isShooting) {
        this.shootAnimation.update(deltatime);
    } else {
       this.idleAnimation.update(deltatime); 
    }
};

DragonBossEnemy.prototype.draw = function(context) {
    
    // Draw life bar
    if (this.health > 0) {
        context.fillStyle='#000';
        context.fillRect(this.x - this.camera.x + (this.width / 2 - 25), this.y - this.camera.y - 20, 50, 6);
        context.fillStyle='#ff0000';
        context.fillRect(this.x - this.camera.x + (this.width / 2 - 24), this.y - this.camera.y - 19, 48 * (this.health / this.origHealth), 4);
    }
    
    var key = "";
    if (this.isDamage && !this.damageAnimation.isStopped()) {
        key = "dragon_hit" + (this.damageAnimation.getFrame() + 1);
    } else if (this.isDead) {
        key = "explo_" + (this.deadAnimation.getFrame() + 1);
    }  else if (this.isShooting) {
        key = "dragon_attack" + (this.shootAnimation.getFrame() + 1);
    } else {
        key = "dragon_idle" + (this.idleAnimation.getFrame() + 1);
    }
    if (key !== "") {
        if (this.direction === -1) {
            context.save();
            context.scale(this.direction, 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, - (this.x - this.camera.x) - this.width, this.y - this.camera.y, this.width, this.height);
            context.restore();
        } else {
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, this.x - this.camera.x, this.y - this.camera.y, this.width, this.height);
        }
    }
};

DragonBossEnemy.prototype.collide = function(entity) {
    if (this.isDead) {
        return false;
    }
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = this.width / 2 + entity.width / 2;
    var sizeY = this.height / 2 + entity.height / 2;
    if (diffX < sizeX && diffY < sizeY) {
        if (!this.isDamage) {
            Assets.playAudio(Assets.explosion_sound, false);
            this.health--;
            if (this.health <= 0) {
                this.isDead = true;
                this.level.currentNumberOfCoins++;
            } else {
                this.damageAnimation.reset();
                this.isDamage = true;
            }
        }
        return true;
    }
    return false;
};

DragonBossEnemy.prototype.left = function() {
    return this.x - this.camera.x;
};

DragonBossEnemy.prototype.right = function() {
    return (this.x + this.width) - this.camera.x;
};

DragonBossEnemy.prototype.top = function() {
    return this.y - this.camera.y;
};

DragonBossEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.camera.y;
};