function Coin(x, y, camera) {
    this.width = Config.tileSize * 0.7;
    this.height = Config.tileSize * 0.7;
    this.x = x * Config.tileSize - (this.width / 2) + (Config.tileSize / 2);
    this.y = y * Config.tileSize - (this.height / 2) + (Config.tileSize / 2);
    this.animation = new Animation(8, 1);
    this.camera = camera;
}

Coin.prototype.update = function(deltatime) {
    this.animation.update(deltatime);
};

Coin.prototype.draw = function(context) {
    var key = "coin_0" + (this.animation.getFrame() + 1);
    context.drawImage(Assets.tilesAtlas, Atlas.tiles[key].x, Atlas.tiles[key].y, Atlas.tiles[key].width, Atlas.tiles[key].height, this.x - this.camera.x, this.y - this.camera.y, this.width, this.height);
};

Coin.prototype.left = function() {
    return this.x - this.camera.x;
};

Coin.prototype.right = function() {
    return (this.x + this.width) - this.camera.x;
};

Coin.prototype.top = function() {
    return this.y - this.camera.y;
};

Coin.prototype.bottom = function() {
    return (this.y + this.height) - this.camera.y;
};

Coin.prototype.playSound = function() {
    Assets.playAudio(Assets.coin_sound, false);
};

Coin.prototype.collide = function(entity) { 
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = this.width / 2 + entity.width / 2;
    var sizeY = this.height / 2 + entity.height / 2;
    return diffX < sizeX && diffY < sizeY;
};


