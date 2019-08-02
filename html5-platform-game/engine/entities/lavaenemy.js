function LavaEnemy(x, y, camera) {
    this.width = Config.tileSize;
    this.height = Config.tileSize;
    this.x = x * this.width;
    this.y = y * this.height;
    this.animation = new Animation(6, 1);
    this.isMortal = false;
    this.hasGuns = false;
    this.camera = camera;
    this.damagePoints = 100;
}

LavaEnemy.prototype.update = function(deltatime) {
    this.animation.update(deltatime);
};

LavaEnemy.prototype.draw = function(context) {
    var key = "lava" + (this.animation.getFrame() + 1);
    context.drawImage(Assets.tilesAtlas, Atlas.tiles[key].x, Atlas.tiles[key].y, Atlas.tiles[key].width, Atlas.tiles[key].height, this.x - this.camera.x, this.y - this.camera.y, this.width + 1, this.height + 1);
};

LavaEnemy.prototype.left = function() {
    return this.x - this.camera.x;
};

LavaEnemy.prototype.right = function() {
    return (this.x + this.width) - this.camera.x;
};

LavaEnemy.prototype.top = function() {
    return this.y - this.camera.y;
};

LavaEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.camera.y;
};

