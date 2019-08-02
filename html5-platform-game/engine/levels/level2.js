function Level2() {
    this.loaded = false;
    this.startX = Config.tileSize * 22 - Config.worldWidth / 2 + Config.heroSize / 2;
    this.startY = Config.tileSize * 14  - Config.worldHeight / 2 - Config.heroSize / 2;
}

Level2.prototype.setup = function(camera) {
    
    this.levelName = "Boss 1: DragonMad";
    this.mapWidth = 30;
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
    this.visibilityEnemyRatioX = 30; // 30 tiles 
    this.visibilityEnemyRatioY = 20; // 20 tiles
    this.checkpointTime = 0;
    this.checkpointTimeLimit = 2;
    this.isCheckpoint = false;
    this.coins = [];
        
    this.map = [
        43, 43, 43, 43, 45, 49, 49, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 42, 49, 69, 49, 49, 69, 49, 49, 102, 43, 43, 43, 44, 46, 43, 43, 43, 47, 49, 49, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 42, 49, 69, 49, 49, 69, 49, 49, 43, 43, 43, 43, 43, 46, 43, 43, 43, 45, 49, 42, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 42, 49, 69, 49, 49, 69, 49, 49, 46, 43, 44, 43, 43, 46, 43, 43, 43, 45, 49, 42, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 42, 49, 69, 49, 49, 69, 49, 49, 46, 43, 44, 43, 43, 46, 43, 43, 43, 45, 49, 42, 69, 49, 49, 69, 49, 41, 69, 49, 49, 69, 42, 42, 69, 49, 49, 69, 49, 49, 46, 43, 43, 43, 44, 46, 43, 43, 43, 45, 49, 42, 69, 49, 49, 69, 49, 41, 69, 42, 49, 69, 41, 42, 69, 49, 42, 69, 49, 49, 43, 43, 43, 43, 44, 43, 43, 43, 43, 47, 49, 49, 69, 49, 41, 69, 49, 49, 69, 42, 49, 69, 49, 49, 69, 41, 42, 69, 49, 49, 46, 43, 43, 43, 44, 43, 43, 43, 43, 45, 49, 49, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 49, 49, 69, 49, 49, 46, 43, 43, 43, 44, 46, 43, 43, 43, 45, 49, 49, 69, 49, 41, 69, 49, 49, 69, 49, 49, 69, 49, 41, 69, 49, 49, 69, 49, 49, 46, 43, 43, 43, 44, 46, 43, 43, 43, 45, 49, 49, 69, 49, 41, 69, 42, 49, 69, 49, 49, 69, 49, 41, 69, 42, 49, 69, 49, 49, 46, 43, 43, 43, 44, 46, 43, 43, 43, 45, 41, 42, 69, 49, 49, 69, 42, 42, 69, 41, 42, 69, 49, 49, 69, 42, 49, 69, 49, 49, 46, 43, 43, 43, 44, 46, 43, 43, 43, 47, 41, 42, 69, 49, 49, 69, 49, 49, 69, 41, 42, 69, 49, 49, 69, 49, 42, 69, 49, 49, 46, 43, 44, 43, 43, 46, 43, 43, 43, 45, 41, 42, 69, 49, 49, 69, 49, 49, 69, 41, 42, 69, 49, 49, 69, 49, 49, 69, 49, 49, 46, 43, 44, 43, 43, 46, 43, 43, 43, 47, 49, 49, 49, 49, 49, 49, 49, 93, 94, 41, 93, 94, 49, 93, 94, 49, 41, 49, 42, 49, 43, 43, 44, 43, 44, 46, 43, 46, 43, 45, 49, 49, 49, 49, 49, 49, 49, 95, 96, 49, 95, 96, 49, 95, 96, 49, 49, 49, 49, 49, 46, 43, 44, 43, 44, 46, 43, 46, 43, 43, 48, 48, 48, 48, 48, 100, 100, 48, 48, 100, 48, 48, 100, 48, 48, 100, 48, 48, 48, 48, 43, 43, 43, 43, 43, 46, 43, 46, 46, 46, 43, 44, 43, 43, 44, 81, 81, 44, 44, 81, 44, 43, 81, 44, 44, 81, 43, 43, 46, 43, 43, 43, 43, 43, 43, 46, 43, 46, 46, 43, 43, 44, 43, 43, 43, 43, 43, 43, 43, 44, 44, 44, 43, 44, 43, 43, 43, 43, 46, 46, 46, 43, 43, 43, 43, 46, 43, 43, 43, 43, 43, 44, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 44, 43, 43, 43, 43, 43, 46, 43, 43, 43, 43, 46, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43
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
    
    this.enemies[15 * this.mapWidth + 10] = new StaticEnemy(10, 15, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[15 * this.mapWidth + 11] = new StaticEnemy(11, 15, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[15 * this.mapWidth + 14] = new StaticEnemy(14, 15, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[15 * this.mapWidth + 17] = new StaticEnemy(17, 15, this.camera, StaticEnemy.FIRE_TYPE);
    this.enemies[15 * this.mapWidth + 20] = new StaticEnemy(20, 15, this.camera, StaticEnemy.FIRE_TYPE);
    
    this.enemies[14 * this.mapWidth + 8] = new DragonBossEnemy(8, 14, Config.tileSize * 4, Config.tileSize * 4, 50, this, this.camera);
    
    this.loaded = true;
};

Level2.prototype.dispose = function(all) {
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

Level2.prototype.checkpoint = function(deltatime) {
    
};