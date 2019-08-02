StaticEnemy.STING_TYPE = 1;
StaticEnemy.BUOY_TYPE = 2;
StaticEnemy.FIRE_TYPE = 4;
StaticEnemy.STING_DARK_TYPE = 8;

function StaticEnemy(x, y, camera, type) {
    this.width = Config.tileSize;
    this.height = Config.tileSize;
    this.x = x * this.width;
    this.y = y * this.height;
    this.isMortal = false;
    this.isDead = false;
    this.hasGuns = false;
    this.type = type;
    this.camera = camera;
    this.damagePoints = 100;
}

StaticEnemy.prototype.update = function(deltatime) {
};

StaticEnemy.prototype.draw = function(context) {
    var key = "";
    if (this.type === StaticEnemy.STING_TYPE) {
        key = "pick";
    } else if (this.type === StaticEnemy.STING_DARK_TYPE) {
        key = "set2_pick2";
    } else if (this.type === StaticEnemy.BUOY_TYPE) {
        key = "set2_buoy";
    } else if (this.type === StaticEnemy.FIRE_TYPE) {
        key = "set2_fire";
    }
    context.drawImage(Assets.tilesAtlas, Atlas.tiles[key].x, Atlas.tiles[key].y, Atlas.tiles[key].width, Atlas.tiles[key].height, this.x - this.camera.x, this.y - this.camera.y, this.width + 1, this.height + 1);
};

StaticEnemy.prototype.left = function() {
    return this.x - this.camera.x;
};

StaticEnemy.prototype.right = function() {
    return (this.x + this.width) - this.camera.x;
};

StaticEnemy.prototype.top = function() {
    return this.y - this.camera.y;
};

StaticEnemy.prototype.bottom = function() {
    return (this.y + this.height) - this.camera.y;
};