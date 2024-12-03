class Thing {
    
    constructor(camera, x, y, wx, wy, sw, sh, partWidth) {
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance(); 
        this.position = new Vector(x, y);
        this.size = new Vector(sw, sh);
        this.camera = camera;
        this.wx = wx;
        this.wy = wy;
        this.partWidth = partWidth;
    }

    render(context) {
        var x = this.wx + this.position.x + this.camera.xOffset() - this.size.x * 0.5;
        var y = this.wy - (this.position.y + this.camera.yOffset() + this.size.y * 0.5);
        
        //context.fillStyle = "green";
        //context.fillRect(x, y, this.size.x, this.size.y);
        var length = parseInt(this.size.x / this.partWidth);
        for (var i = 0; i < length; i++) {
            var image = i == 0 ? "left_rail" : (i == length - 1 ? "right_rail" : "rail");
            context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[image].x, this.atlas.sprites[image].y, this.atlas.sprites[image].width, this.atlas.sprites[image].height, 
                x,  y - 40, this.partWidth + 1, this.size.y);
            x += this.partWidth;
        }
    }

    collide(pos, size) {
        var diffX = Math.abs(pos.x - this.position.x);
        var diffY = Math.abs(pos.y - this.position.y);
        var w = this.size.x * 0.5 + size.x * 0.5;
        var h = this.size.y * 0.5 + size.y * 0.5;
        return diffX < w && diffY < h;
    }

}