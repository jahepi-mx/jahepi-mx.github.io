function Level4() {
    this.loaded = false;
    this.startX = Config.tileSize * 13 - Config.worldWidth / 2 + Config.heroSize / 2;
    this.startY = Config.tileSize * 13  - Config.worldHeight / 2 - Config.heroSize / 2;
}

Level4.prototype.setup = function(camera) {
    
    this.levelName = "Boss 2: Dracula";
    this.mapWidth = 50;
    this.mapHeight = 20;
    this.camera = camera;
    this.camera.height = 4;
    this.tiles = [];
    this.enemies = [];
    this.platforms = [];
    this.totalNumberOfCoins = 1;
    this.currentNumberOfCoins = 0;
    this.music = Assets.playAudio(Assets.boss_music, true);
    this.atlasBackground = Atlas.tiles.cave_background;
    this.visibilityEnemyRatioX = 60; // 30 tiles 
    this.visibilityEnemyRatioY = 20; // 20 tiles
    this.checkpointTime = 0;
    this.checkpointTimeLimit = 2;
    this.isCheckpoint = false;
    this.coins = [];
        
    this.map = [
        50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 52, 53, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 52, 53, 50, 50, 50, 50, 50, 50, 50, 50, 51, 52, 53, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 52, 53, 50, 50, 50, 50, 50, 56, 56, 55, 51, 52, 53, 50, 51, 52, 53, 50, 50, 50, 56, 56, 55, 50, 50, 50, 50, 51, 52, 53, 50, 56, 55, 54, 50, 50, 51, 52, 53, 50, 50, 50, 50, 51, 52, 53, 50, 50, 50, 56, 55, 54, 50, 50, 51, 52, 53, 51, 52, 53, 54, 55, 54, 50, 56, 56, 55, 51, 52, 53, 50, 50, 51, 52, 53, 50, 50, 56, 56, 55, 50, 50, 51, 52, 53, 50, 56, 55, 56, 51, 52, 53, 50, 56, 56, 56, 50, 50, 50, 50, 50, 50, 50, 50, 56, 54, 56, 56, 55, 56, 51, 52, 53, 50, 50, 50, 50, 56, 55, 54, 51, 52, 53, 56, 56, 50, 50, 50, 50, 50, 50, 50, 56, 55, 54, 50, 50, 50, 50, 56, 55, 56, 51, 52, 53, 50, 50, 50, 50, 50, 50, 50, 87, 50, 50, 50, 50, 87, 87, 50, 54, 54, 54, 87, 50, 87, 50, 87, 87, 87, 56, 56, 56, 87, 50, 50, 87, 87, 50, 87, 87, 50, 87, 50, 50, 87, 50, 50, 87, 50, 50, 87, 54, 55, 56, 87, 50, 50, 87, 88, 89, 87, 86, 88, 89, 88, 89, 86, 86, 88, 89, 88, 89, 86, 89, 86, 88, 86, 86, 86, 88, 89, 89, 86, 88, 89, 86, 86, 88, 86, 86, 88, 86, 88, 88, 86, 88, 89, 86, 89, 88, 86, 88, 89, 88, 86, 89, 88, 86, 76, 76, 79, 76, 76, 78, 100, 100, 100, 100, 100, 100, 77, 76, 78, 101, 77, 77, 76, 79, 77, 76, 76, 78, 101, 101, 77, 76, 79, 76, 76, 79, 76, 78, 101, 77, 76, 78, 100, 100, 100, 100, 100, 100, 79, 76, 76, 77, 76, 76, 78, 76, 79, 76, 76, 78, 81, 81, 81, 81, 81, 81, 77, 77, 76, 77, 76, 76, 76, 76, 76, 76, 79, 76, 76, 77, 76, 76, 76, 76, 76, 77, 76, 78, 79, 78, 76, 80, 81, 81, 81, 81, 81, 81, 77, 76, 77, 76, 76, 76, 76, 76, 76, 78, 76, 76, 79, 77, 76, 76, 77, 76, 76, 76, 76, 77, 77, 77, 79, 76, 77, 76, 76, 76, 76, 77, 77, 76, 76, 76, 76, 76, 76, 78, 76, 76, 76, 76, 76, 77, 76, 77, 76, 78, 76, 76, 76, 77, 76, 76, 76, 76, 76, 78, 79, 76, 77, 76, 76, 76, 76, 77, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 77, 76, 76, 77, 76, 76, 76, 78, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 78, 76, 76, 76, 76, 76, 76, 76, 76, 76, 77, 77, 76, 76, 76, 76, 76, 76, 79, 76, 76, 76, 77, 76, 76, 76, 76, 76, 76, 78, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 77, 76, 76, 76, 76, 77, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 77, 77, 76, 76, 76, 77, 77, 77, 77, 76, 76, 76, 76, 76, 76, 76, 76, 76
    ];
    
    for (var i = 0; i < this.map.length; i++) {       
        if (this.map[i] === 0) {
            this.tiles[i] = null;
        } else {
            this.tiles[i] = new Tile(i % this.mapWidth, Math.floor(i / this.mapWidth), Config.tileSize, Config.tileSize, this.map[i], this.camera);
        }
        this.enemies[i] = null;
        this.coins[i] = null;
    }
    
    
    this.enemies[14 * this.mapWidth + 6] = new StaticEnemy(6, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 7] = new StaticEnemy(7, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 8] = new StaticEnemy(8, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 9] = new StaticEnemy(9, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 10] = new StaticEnemy(10, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 11] = new StaticEnemy(11, 14, this.camera, StaticEnemy.FIRE_TYPE);
    
    this.enemies[14 * this.mapWidth + 38] = new StaticEnemy(38, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 39] = new StaticEnemy(39, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 40] = new StaticEnemy(40, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 41] = new StaticEnemy(41, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 42] = new StaticEnemy(42, 14, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[14 * this.mapWidth + 43] = new StaticEnemy(43, 14, this.camera, StaticEnemy.FIRE_TYPE);
    
    this.enemies[14 * this.mapWidth + 15] = new StaticEnemy(15, 14, this.camera, StaticEnemy.BUOY_TYPE);
    this.enemies[14 * this.mapWidth + 24] = new StaticEnemy(24, 14, this.camera, StaticEnemy.BUOY_TYPE);
    this.enemies[14 * this.mapWidth + 25] = new StaticEnemy(25, 14, this.camera, StaticEnemy.BUOY_TYPE);
    this.enemies[14 * this.mapWidth + 34] = new StaticEnemy(34, 14, this.camera, StaticEnemy.BUOY_TYPE);
    
    this.enemies[11 * this.mapWidth + 15] = new FlyDemonBossEnemy(15, 11, Config.tileSize * 3, Config.tileSize * 3, Config.tileSize * 2, 40, Config.tileSize * 4, -Config.tileSize * 3.5, -Config.tileSize, this, this.camera);
    
    
    this.loaded = true;
};

Level4.prototype.dispose = function(all) {
    if (this.loaded) {
        if (all) {
            this.loaded = false;
            this.coins = null;
        }
        this.enemies = null;
        this.tiles = null;
        try {
            if (this.music !== null) {
                this.music.stop();
            }
        } catch (e) {}
        this.music = null;
    }
};

Level4.prototype.checkpoint = function(deltatime) {
    
};