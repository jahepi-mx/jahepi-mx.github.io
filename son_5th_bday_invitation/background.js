let backDirs = [[-2,0], [-1,0], [0,0], [1,0], [2,0], [3,0], [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1], [3,-1], [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2], [3,-2], [-2,-3], [-1,-3], [0,-3], [1,-3], [2,-3], [3,-3]];

class Background {
    
    constructor(camera, x, y, wx, wy, sw, sh, dir) {
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance(); 
        this.position = new Vector(x, y);
        this.size = new Vector(sw, sh);
        this.camera = camera;
        this.wx = wx;
        this.wy = wy;
        this.image = "sky";
        this.dir = dir;
    }

    static renderBackgrounds(context, player, camera, wx, wy, sw, sh) {
        var x = parseInt(player.position.x / sw);
        var y = parseInt(player.position.y / sh);
        
        x = parseInt((x * sw + camera.xOffset() - camera.xOffset() / 1.2) / sw);
        y = parseInt((y * sh + camera.yOffset() - camera.yOffset() / 1.2) / sh);
        for (let dir of backDirs) {
            var background = new Background(camera, (x + dir[0]) * sw, (y + dir[1]) * sh, wx, wy, sw, sh, dir);
            background.render(context);
        }
    }

    render(context) {
        var x = this.wx + this.position.x + this.camera.xOffset() / 1.2 - this.size.x * 0.5;
        var y = this.wy - (this.position.y + this.camera.yOffset() / 1.2 + this.size.y * 0.5);
        context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[this.image].x, this.atlas.sprites[this.image].y, this.atlas.sprites[this.image].width, this.atlas.sprites[this.image].height, 
            x,  y, this.size.x, this.size.y);

        /*
        context.fillStyle = "blue";
        context.font = "20px Arial";
        context.fillText(this.dir[0] + "," + this.dir[1], x, y);
        context.fillRect(x, y, 30, 30);
        */
    }
}