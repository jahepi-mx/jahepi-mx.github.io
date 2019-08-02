function FlyDemonEnemy(x, y, width, height, velocityX, velocityY, health, distance, camera) {
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.isDisposable = false;
    this.isDead = false;
    this.health = health;
    this.origHealth = health;
    this.isMortal = true;
    this.hasGuns = false;
    
    this.leftAnimation = new Animation(4, 2);
    this.rightAnimation = new Animation(4, 2);
    this.frontAnimation = new Animation(4, 2);
    this.deadAnimation = new Animation(6, 1);
    this.deadAnimation.stopAtSequenceNumber(1, this.onStopDeadAnimation.bind(this));
    this.directions = [-1, 0, 1];
    
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize - (this.height / 2) + (Config.tileSize / 2);
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.traveledX = 0;
    this.traveledY = 0;
    this.degrees = 0;
    this.direction = this.directions[Math.round(Math.random() * 2)];
    this.changeDirection = Math.random() * 4 + 2;
    this.changeDirectionTime = 0;
    this.damagePoints = 1;
    this.distance = distance;
}

FlyDemonEnemy.prototype.onStopDeadAnimation = function() {
    this.isDisposable = true;
};

FlyDemonEnemy.prototype.draw = function(context) {
    
    // Draw life bar
    if (this.health > 0) {
        context.fillStyle='#000';
        context.fillRect(this.x - this.traveledX - this.camera.x + (this.width / 2 - 25), this.y - this.traveledY - this.camera.y - 20, 50, 6);
        context.fillStyle='#ff0000';
        context.fillRect(this.x - this.traveledX - this.camera.x + (this.width / 2 - 24), this.y - this.traveledY - this.camera.y - 19, 48 * (this.health / this.origHealth), 4);
    }
    
    var name = "";
    if (this.isDead) {
        name = "explo_" + (this.deadAnimation.getFrame() + 1);
    } else if (this.direction === 0) {
        name = "fly_demon" + (this.frontAnimation.getFrame() + 1);
    } else if (this.direction === 1) {
        name = "fly_demon_left" + (this.leftAnimation.getFrame() + 1);
    } else {
        name = "fly_demon_right" + (this.rightAnimation.getFrame() + 1);
    }
    context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.traveledX - this.camera.x, this.y - this.traveledY - this.camera.y, this.width, this.height);
};

FlyDemonEnemy.prototype.update = function(deltatime) {
    
    if (this.isDead) {
        this.deadAnimation.update(deltatime);
        return;
    } else if (this.direction === 0) {
        this.frontAnimation.update(deltatime);
    } else if (this.direction === 1) {
        this.leftAnimation.update(deltatime);
    } else {
        this.rightAnimation.update(deltatime);
    }
    
    this.changeDirectionTime += deltatime;
    
    if (this.changeDirectionTime >= this.changeDirection) {
        this.changeDirectionTime = 0;
        this.changeDirection = Math.random() * 2 + 2;
        this.direction = this.directions[Math.round(Math.random() * 2)];     
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
        this.velocityX = Math.abs(this.velocityX);
    }
    
    if (this.direction === -1) {
        this.velocityX = -Math.abs(this.velocityX);
    }
    
    if (this.direction !== 0) {
        this.traveledX += this.velocityX * deltatime;
    }
    
    this.degrees += 60 * deltatime;
    this.degrees %= 360;
    this.traveledY += this.velocityY * Math.cos(Math.PI / 180 * this.degrees) * deltatime;
};

FlyDemonEnemy.prototype.collide = function(entity) {
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

FlyDemonEnemy.prototype.left = function() {
    return this.x - this.traveledX - this.camera.x;
};

FlyDemonEnemy.prototype.right = function() {
    return (this.x + this.width) - this.traveledX - this.camera.x;
};

FlyDemonEnemy.prototype.top = function() {
    return this.y - this.traveledY -  this.camera.y;
};

FlyDemonEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.traveledY - this.camera.y;
};



