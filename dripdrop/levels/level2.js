class Level2 extends Level {
    constructor() { 
        super(21, 12);
        this.helpPopup = new HelpPopup(null, "help", "help2");
    }
    
    init(ice) {
        
        this.ice = ice;
        
        this.map = [
            13,13,13,17,13,13,13,17,13,13,13,13,12,17,13,13,13,13,13,13,13,
            13,13,13,17,13,12,13,17,13,12,13,13,13,17,13,13,17,13,13,13,13,
            13,13,13,17,17,17,17,17,13,13,13,13,13,17,13,13,17,13,13,13,13,
            12,13,13,13,12,13,13,18,18,18,18,18,18,18,17,17,17,13,12,13,13,
            13,13,13,13,13,13,21,3,3,3,3,3,3,3,20,13,13,13,13,13,13,
            13,13,17,17,17,17,21,3,3,3,3,3,3,3,20,17,17,17,17,13,13,
            13,13,17,13,13,13,17,36,36,38,5,40,23,36,17,13,13,12,17,17,17,
            17,17,17,13,13,13,21,3,3,3,3,3,42,3,20,17,17,13,13,13,13,
            13,13,12,13,13,13,21,3,3,3,3,3,5,3,20,13,17,13,13,13,13,
            13,13,13,13,13,13,13,23,23,23,23,23,23,23,13,13,17,17,13,13,13,
            17,17,17,17,17,17,17,17,13,13,13,13,13,17,13,13,13,17,12,13,13,
            13,13,13,13,13,13,13,17,13,13,13,12,13,17,13,13,13,17,13,13,13
        ];
        
        this.ice.reset();
        this.ice.setXY(8 * this.tileWidth + this.tileWidth / 2 - this.ice.w / 2, 5 * this.tileHeight + this.tileHeight / 2 -  this.ice.h / 2);

        this.fadeTiles[6 * this.mapWidth + 10] = new FadeTile(10, 6, this.tileWidth, this.tileHeight, 1, 1, 1, "bg3", 0);
        this.fadeTiles[8 * this.mapWidth + 12] = new FadeTile(12, 8, this.tileWidth, this.tileHeight, 0.5, 1, 1, "bg3", 0);
        
        for (var y = 0; y < this.mapHeight; y++) {
            for (var x = 0; x < this.mapWidth; x++) {
                if (this.map[y * this.mapWidth + x] >= 6 && this.map[y * this.mapWidth + x] <= 45) {
                    this.tiles[y * this.mapWidth + x] = new Tile(x, y, this.tileWidth, this.tileHeight, this.map[y * this.mapWidth + x], false, "tiles" + this.map[y * this.mapWidth + x], "bg3");
                } else if (this.map[y * this.mapWidth + x] === 5) {
                    this.tiles[y * this.mapWidth + x] = this.fadeTiles[y * this.mapWidth + x];
                } else {
                    this.tiles[y * this.mapWidth + x] = new Tile(x, y, this.tileWidth, this.tileHeight, this.map[y * this.mapWidth + x], true, "bg" + this.map[y * this.mapWidth + x], null);
                }
            }
        }
        
        this.ice.tiles = this.tiles;
        this.ice.drops = this.drops;
        this.checkpoints.push(new Checkpoint(8, 8, this.config.getWidthByResolution(50), this.config.getHeightByResolution(50), 1));
        this.checkpoints.push(new Checkpoint(13, 8, this.config.getWidthByResolution(50), this.config.getHeightByResolution(50), 2));
    }
    
    reset() {
        this.ice.reset();
        this.ice.setXY(8 * this.tileWidth + this.tileWidth / 2 - this.ice.w / 2, 5 * this.tileHeight + this.tileHeight / 2 -  this.ice.h / 2);
        for (var a = 0; a < this.checkpoints.length; a++) {
            this.checkpoints[a].reset();
        }
        for (var a = 0; a < this.enemies.length; a++) {
            this.enemies[a].reset();
        }
         for (var a = 0; a < this.items.length; a++) {
            this.items[a].reset();
        }
        this.fadeTiles[6 * this.mapWidth + 10].reset();
        this.fadeTiles[8 * this.mapWidth + 12].reset();
        
        this.currCheckpoint = 1;
        this.drops = [];
    }
    
    reachCheckpoint(checkpoint) {
        if (this.currCheckpoint === checkpoint.id) {
            if (this.currCheckpoint === this.checkpoints.length) {
                this.isFinish = true;
            }
            this.currCheckpoint++;
            return true;
        }
        return false;
    }
};

