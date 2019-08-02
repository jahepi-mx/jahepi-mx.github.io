class MovingTile extends Tile {
    
    constructor(x, y, w, h, shiftOffset) {
        super(x, y, w, h, 0, true, null, null);
        this.toX = 0;
        this.toY = 0;
        this.origX = this.x;
        this.origY = this.y;
        this.vertexPath = [];
        this.origVertexPath = [];
        this.level = LevelManager.getInstance().current();
        this.drops = this.level.drops;
        this.isDead = false;
        this.explosiveDrop = false;
        this.colors = ["#264826", "#69b069", "#192e19", "#0b140b"];
        this.shiftOffset = shiftOffset;
        
        var xTmp = Math.floor(this.x / Tile.getWidth());
        var yTmp = Math.floor(this.y / Tile.getHeight());
        this.addVertex(yTmp * this.level.getWidth() + xTmp);
        this.sleepAnimation = new Animation(7, 2);
        this.sleepAnimation.stopAtSequenceNumber(1, null);
        this.wakeupAnimation = new Animation(7, 2);
        this.wakeupAnimation.stopAtSequenceNumber(1, null);
        this.config = Config.getInstance();
        this.shift = true;
    }
    
    addVertex(vertex) {
        this.vertexPath.push(vertex);
        this.origVertexPath.push(vertex);
        return this;
    }
    
    update(deltatime) {
        
        if (this.explosiveDrop) {
            this.assets.playAudio(this.assets.torch, false, this.config.soundEffectVolume);
            for (var b = 0; b < 10; b++) {
                var dropSize = Math.ceil(Math.random() * this.config.getWidthByResolution(3) + this.config.getWidthByResolution(5));
                var colorIndex = Math.floor(Math.random() * 4);
                var drop = new Drop(this.left() + this.w / 2 - dropSize / 2, this.top() + this.h / 2 - dropSize / 2 , dropSize, dropSize, Math.ceil(Math.random() * this.config.getHeightByResolution(10) + this.config.getHeightByResolution(35)), this.colors[colorIndex]);
                drop.collided = true;
                drop.speedX = Math.ceil(Math.random() * this.config.getWidthByResolution(20) + this.config.getWidthByResolution(10))  * (Math.random() < 0.5 ? 1 : -1);
                drop.speedY = -drop.speedY;
                this.drops.push(drop);
            }
            this.explosiveDrop = false;                     
        }
        
        if (this.isDead) return;
        
        if (this.shift) {
            this.shift = false;
            var vertex = this.vertexPath.shift();
            this.toX = Math.floor(vertex % this.level.getWidth()) * Tile.getWidth();
            this.toY = Math.floor(vertex / this.level.getWidth()) * Tile.getHeight();
            this.vertexPath.push(vertex);
        }
        
        this.x += (this.toX - this.x) * deltatime;
        this.y += (this.toY - this.y) * deltatime;
        
        var diffX = Math.abs(this.toX - this.x);
        var diffY = Math.abs(this.toY - this.y);
        
        if (diffX <= this.shiftOffset && diffY <= this.shiftOffset) {
            this.shift = true;
        }
        
        if (diffX <= this.config.getWidthByResolution(10) && diffY <= this.config.getHeightByResolution(10)) {
            this.sleepAnimation.update(deltatime);
            this.wakeupAnimation.reset();
        } else {
            this.wakeupAnimation.update(deltatime);
            this.sleepAnimation.reset();
        }
    }
    
    render(context) {
        if (this.isDead) return;
        var diffX = Math.abs(this.toX - this.x);
        var diffY = Math.abs(this.toY - this.y);
        if (diffX <= this.config.getWidthByResolution(10) && diffY <= this.config.getHeightByResolution(10)) {
            var frame = "sleep" + (this.sleepAnimation.getFrame() + 1);
            context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[frame].x, this.atlas.sprites[frame].y, this.atlas.sprites[frame].width, this.atlas.sprites[frame].height, this.x, this.y, this.w + 1, this.h + 1);
        } else {
            var frame = "wakeup" + (this.wakeupAnimation.getFrame() + 1);
            context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[frame].x, this.atlas.sprites[frame].y, this.atlas.sprites[frame].width, this.atlas.sprites[frame].height, this.x, this.y, this.w + 1, this.h + 1);
        }
    }
    
    reset() {
       this.isDead = false;
       this.explosiveDrop = false;
       this.shift = true;
       this.toX = 0;
       this.toY = 0;
       this.x = this.origX;
       this.y = this.origY;
       this.vertexPath = this.origVertexPath.slice(0);
    }
    
    die() {
        this.isDead = true;
        this.explosiveDrop = true;
    }
}


