function BuoyEnemy(x, y, width, height, downVelocity, upVelocity, distance, pause, camera) {
    this.width = width;
    this.height = height;
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize - (this.height / 2) + (Config.tileSize / 2);
    this.isMortal = false;
    this.hasGuns = false;
    this.camera = camera;
    this.damagePoints = 100;
    this.upVelocity = upVelocity;
    this.downVelocity = downVelocity;
    this.distance = distance;
    this.traveledY = 0;
    this.direction = 1;
    this.isPaused = false;
    this.pauseTime = 0;
    this.pauseTimeLimit = pause;
}

BuoyEnemy.prototype.update = function(deltatime) {
    
    if (this.isPaused) {
        this.pauseTime += deltatime;
        if (this.pauseTime >= this.pauseTimeLimit) {
            this.isPaused = false;
            this.pauseTime = 0;
        }
    }
    
    if (this.direction === 1 && !this.isPaused) {
        this.traveledY += this.upVelocity * deltatime;
    }
    
    if (this.direction === -1 && !this.isPaused) {
        this.traveledY -= this.downVelocity * deltatime;
    }
    
    if (this.traveledY > this.distance) {
        this.direction = -1;
        this.traveledY = this.distance;
        this.isPaused = true;
    }
    
    if (this.traveledY < 0) {
        this.direction = 1;
        this.traveledY = 0;
        this.isPaused = true;
    }
};

BuoyEnemy.prototype.draw = function(context) {
    var key = "bomb2";
    context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, this.x - this.camera.x, this.y - this.traveledY - this.camera.y, this.width, this.height);
};

BuoyEnemy.prototype.left = function() {
    return this.x - this.camera.x;
};

BuoyEnemy.prototype.right = function() {
    return (this.x + this.width) - this.camera.x;
};

BuoyEnemy.prototype.top = function() {
    return this.y - this.traveledY - this.camera.y;
};

BuoyEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.traveledY - this.camera.y;
};

