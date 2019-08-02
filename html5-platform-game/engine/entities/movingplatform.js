// Static class members
MovingPlatform.VERTICAL = 1;
MovingPlatform.HORIZONTAL = 2;
MovingPlatform.CIRCULAR = 4;
MovingPlatform.VISIBILITY_DISTANCE = 2000;

function MovingPlatform(x, y, width, height, type, velocity, maxDistance, camera) {
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.type = type;
    
    this.x = x * Config.tileSize;
    this.y = y * Config.tileSize;
    this.maxDistance = maxDistance;
    this.velocity = velocity;
    this.traveledX = 0;
    this.traveledY = 0;
    this.moveDistanceX = 0;
    this.moveDistanceY = 0;
    this.direction = -1;
    this.degrees = 0;
}

MovingPlatform.prototype.draw = function(context) {
    context.drawImage(Assets.tilesAtlas, Atlas.tiles.rock.x, Atlas.tiles.rock.y, Atlas.tiles.rock.width, Atlas.tiles.rock.height, this.x - this.traveledX - this.camera.x, this.y - this.traveledY - this.camera.y, this.width, this.height);
};

MovingPlatform.prototype.update = function(deltatime) {
    if (this.type === MovingPlatform.CIRCULAR) {        
        this.degrees += this.velocity * deltatime;
        var radians = Math.PI / 180 * this.degrees;
        this.moveDistanceX = Math.cos(radians) * this.maxDistance * deltatime;
        this.moveDistanceY = Math.sin(radians) * this.maxDistance * deltatime;
        this.traveledX += this.moveDistanceX;
        this.traveledY += this.moveDistanceY;  
        this.moveDistanceX = -this.moveDistanceX;
        this.moveDistanceY = -this.moveDistanceY;
        
    } else if (this.type === MovingPlatform.HORIZONTAL) {
        if (this.direction === -1) {          
            this.traveledX -= this.velocity * deltatime;
            if (this.traveledX <= -this.maxDistance) {
                this.direction = 1;
                this.moveDistanceX = 0;
            } else {
                this.moveDistanceX = this.velocity * deltatime;
            }
        } else {          
            this.traveledX += this.velocity * deltatime;
            if (this.traveledX >= 0) {
                this.direction = -1;
                this.moveDistanceX = 0;
            } else {
                this.moveDistanceX = -(this.velocity * deltatime);
            }
        }
    } else {
        if (this.direction === -1) {           
            this.traveledY += this.velocity * deltatime;
            if (this.traveledY >= this.maxDistance) {
                this.direction = 1;
                this.moveDistanceY = 0;
            } else {
                this.moveDistanceY = -(this.velocity * deltatime);
            }
        } else {          
            this.traveledY -= this.velocity * deltatime;
            if (this.traveledY <= 0) {
                this.direction = -1;
                this.moveDistanceY = 0;
            } else {
                this.moveDistanceY = this.velocity * deltatime;
            }
        }
    }
};

MovingPlatform.prototype.collide = function(entity) {
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = this.width / 2 + entity.width / 2;
    var sizeY = this.height / 2 + entity.height / 2;
    return diffX < sizeX && diffY < sizeY;
};

MovingPlatform.prototype.left = function() {
    return this.x - this.traveledX - this.camera.x;
};

MovingPlatform.prototype.right = function() {
    return (this.x + this.width) - this.traveledX - this.camera.x;
};

MovingPlatform.prototype.top = function() {
    return this.y - this.traveledY - this.camera.y;
};

MovingPlatform.prototype.bottom = function() {
    return (this.y + this.height) - this.traveledY - this.camera.y;
};
