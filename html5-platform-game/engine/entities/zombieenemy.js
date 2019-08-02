function ZombieEnemy(x, y, width, height, velocity, distance, health, camera) {
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.isDisposable = false;
    this.health = health;
    this.origHealth = health;
    this.isDead = false;
    this.isMortal = true;
    this.isShooting = false;
    this.hasGuns = true;
    this.damagePoints = 1;
    this.nextShootTime = 0;
    this.nextShootTimeCount = 0;
    this.shootInterval = 5;
    
    this.leftAnimation = new Animation(3, 1);
    this.rightAnimation = new Animation(3, 1);
    this.deadAnimation = new Animation(6, 1);
    this.deadAnimation.stopAtSequenceNumber(1, this.onStopDeadAnimation.bind(this));
    this.directions = [-1, 1];
    
    this.distance = distance;
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize + (Config.tileSize - this.height);
    this.velocity = velocity;
    this.traveledX = 0;
    this.direction = this.directions[Math.round(Math.random())];
    this.currChangeDirection = Math.random() * 2 + 2;
    this.changeDirectionTime = 0;
}

ZombieEnemy.prototype.onStopDeadAnimation = function() {
    this.isDisposable = true;
};

ZombieEnemy.prototype.draw = function(context) {
    
    // Draw life bar
    if (this.health > 0) {
        context.fillStyle='#000';
        context.fillRect(this.x - this.traveledX - this.camera.x + (this.width / 2 - 25), this.y - this.camera.y - 20, 50, 6);
        context.fillStyle='#ff0000';
        context.fillRect(this.x - this.traveledX - this.camera.x + (this.width / 2 - 24), this.y - this.camera.y - 19, 48 * (this.health / this.origHealth), 4);
    }
    var name = "";
    if (this.isDead) {
        name = "explo_" + (this.deadAnimation.getFrame() + 1);
    } else if (this.direction === 1) {
        name = "zombie_left_" + (this.leftAnimation.getFrame() + 1);
    } else {
        name = "zombie_right_" + (this.rightAnimation.getFrame() + 1);
    }
    context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.traveledX - this.camera.x, this.y - this.camera.y, this.width, this.height);
};

ZombieEnemy.prototype.shoot = function(x, y, blasts) {
    if (this.direction === -1) {
        Assets.playAudio(Assets.enemy_laser_sound, false);
        blasts.push(new EnemyBlast(this, Math.PI, 0.30, EnemyBlast.SPHERE_TYPE, false, 0, 0, this.camera));
    }
    if (this.direction === 1) {
        Assets.playAudio(Assets.enemy_laser_sound, false);
        blasts.push(new EnemyBlast(this, 0, 0.30, EnemyBlast.SPHERE_TYPE, false, 0, 0, this.camera));
    }
    this.isShooting = false;
};

ZombieEnemy.prototype.changeDirection = function(x) {
    if (this.velocity === 0) {
        var diff = x - this.left();
        this.direction = diff < 0 ? 1 : -1;
    }
};

ZombieEnemy.prototype.update = function(deltatime) {
    
    if (this.isDead) {
        this.deadAnimation.update(deltatime);
        return;
    } else if (this.direction === 1) {
        if (this.velocity !== 0) {
            this.leftAnimation.update(deltatime);
        }
    } else {
        if (this.velocity !== 0) {
            this.rightAnimation.update(deltatime);
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

    if (this.velocity !== 0) {
        this.changeDirectionTime += deltatime;

        if (this.changeDirectionTime >= this.currChangeDirection) {
            this.changeDirectionTime = 0;
            this.currChangeDirection = Math.random() * 3 + 2;
            this.direction = this.directions[Math.round(Math.random())];     
        }
        
        if (this.traveledX < -this.distance) {
            this.direction = 1;
            this.traveledX = -this.distance;
        }

        if (this.traveledX > 0) {
            this.direction = -1;
            this.traveledX = 0;
        }

        if (this.direction === 1) {
            this.velocity = Math.abs(this.velocity);
        }

        if (this.direction === -1) {
            this.velocity = -Math.abs(this.velocity);
        }

        this.traveledX += this.velocity * deltatime;
    }
};

ZombieEnemy.prototype.collide = function(entity) {
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
        }
        return true;
    }
    return false;
};

ZombieEnemy.prototype.left = function() {
    return this.x - this.traveledX - this.camera.x;
};

ZombieEnemy.prototype.right = function() {
    return (this.x + this.width) - this.traveledX - this.camera.x;
};

ZombieEnemy.prototype.top = function() {
    return this.y - this.camera.y;
};

ZombieEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.camera.y;
};