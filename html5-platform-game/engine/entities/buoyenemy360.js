function BuoyEnemy360(x, y, width, height, degrees, radius, camera) {
    this.width = width;
    this.height = height;
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize - (this.height / 2) + (Config.tileSize / 2);
    this.isMortal = false;
    this.hasGuns = false;
    this.camera = camera;
    this.damagePoints = 100;
    this.degrees = 0;
    this.degreesVelocity = degrees;
    this.radius = radius;
    this.traveledX = 0;
    this.traveledY = 0;
}

BuoyEnemy360.prototype.update = function(deltatime) {
    var radians = Math.PI / 180 * this.degrees;
    this.traveledX = Math.cos(radians) * this.radius;
    this.traveledY = Math.sin(radians) * this.radius;
    this.degrees += this.degreesVelocity * deltatime;
    this.degrees %= 360;
};

BuoyEnemy360.prototype.draw = function(context) {
    var key = "bomb2";
    context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, this.x - this.traveledX - this.camera.x, this.y - this.traveledY - this.camera.y, this.width, this.height);
};

BuoyEnemy360.prototype.left = function() {
    return this.x - this.traveledX - this.camera.x;
};

BuoyEnemy360.prototype.right = function() {
    return (this.x + this.width) - this.traveledX - this.camera.x;
};

BuoyEnemy360.prototype.top = function() {
    return this.y - this.traveledY - this.camera.y;
};

BuoyEnemy360.prototype.bottom = function() {
    return (this.y + this.height) - this.traveledY - this.camera.y;
};

