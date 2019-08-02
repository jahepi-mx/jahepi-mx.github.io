// Static class members
BeetleEnemy.VERTICAL = 1;
BeetleEnemy.HORIZONTAL = 2;

function BeetleEnemy(x, y, width, height, type, velocity, maxDistance, camera) {
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.type = type;
    this.isDisposable = false;
    this.isMortal = true;
    this.isDead = false;
    this.hasGuns = false;
    this.damagePoints = 1;
    
    this.animation = new Animation(3, 2);
    
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    if (this.type === BeetleEnemy.VERTICAL) {
        this.y = y * Config.tileSize - (this.height / 2) + (Config.tileSize / 2);
    }
    if (this.type === BeetleEnemy.HORIZONTAL) {
        this.y = y * Config.tileSize - (this.height - Config.tileSize);
    }
    this.maxDistance = maxDistance;
    this.velocity = velocity;
    this.traveled = 0;
    this.direction = 1;
}

BeetleEnemy.prototype.draw = function(context) {
    if (this.type === BeetleEnemy.VERTICAL) {
        if (this.direction === -1) {
            var name = "beetle_up" + (this.animation.getFrame() + 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.camera.x, this.y - this.traveled - this.camera.y, this.width, this.height);
        } else {
            var name = "beetle_down" + (this.animation.getFrame() + 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.camera.x, this.y - this.traveled - this.camera.y, this.width, this.height);
        }
    }
    if (this.type === BeetleEnemy.HORIZONTAL) {
        if (this.direction === 1) {
            var name = "beetle_left" + (this.animation.getFrame() + 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.traveled - this.camera.x, this.y - this.camera.y, this.width, this.height);
        } else {
            var name = "beetle_right" + (this.animation.getFrame() + 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[name].x, Atlas.enemies[name].y, Atlas.enemies[name].width, Atlas.enemies[name].height, this.x - this.traveled - this.camera.x, this.y - this.camera.y, this.width, this.height);
        }
    }
};

BeetleEnemy.prototype.update = function(deltatime) {
    this.animation.update(deltatime);
    if (this.type === BeetleEnemy.HORIZONTAL) {
        if (this.direction === -1) {
            this.traveled -= this.velocity * deltatime;
            if (this.traveled < -this.maxDistance) {
                this.direction = 1;
                this.traveled = -this.maxDistance;
            }
        } else {
            this.traveled += this.velocity * deltatime;
            if (this.traveled > 0) {
                this.direction = -1;
                this.traveled = 0;
            }
        }
    } else {
        if (this.direction === -1) {
            this.traveled += this.velocity * deltatime;
            if (this.traveled > this.maxDistance) {
                this.direction = 1;
                this.traveled = this.maxDistance;
            }
        } else {
            this.traveled -= this.velocity * deltatime;
            if (this.traveled < 0) {
                this.direction = -1;
                this.traveled = 0;
            }
        }
    }
};

BeetleEnemy.prototype.collide = function(entity) {
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = this.width / 2 + entity.width / 2;
    var sizeY = this.height / 2 + entity.height / 2;
    return diffX < sizeX && diffY < sizeY;
};

BeetleEnemy.prototype.left = function() {
    if (this.type === BeetleEnemy.VERTICAL) {
        return this.x - this.camera.x;
    }
    return this.x - this.traveled - this.camera.x;
};

BeetleEnemy.prototype.right = function() {
    if (this.type === BeetleEnemy.VERTICAL) {
        return (this.x + this.width) - this.camera.x;
    }
    return (this.x + this.width) - this.traveled - this.camera.x;
};

BeetleEnemy.prototype.top = function() {
    if (this.type === BeetleEnemy.VERTICAL) {
        return this.y - this.traveled - this.camera.y;
    }
    return this.y - this.camera.y;
};

BeetleEnemy.prototype.bottom = function() {
    if (this.type === BeetleEnemy.VERTICAL) {
        return (this.y + this.height) - this.traveled - this.camera.y;
    }
    return (this.y + this.height) - this.camera.y;
};
