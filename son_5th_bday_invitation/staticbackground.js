let staticBackDirs = [[-2,0], [-1,0], [0,0], [1,0], [2,0]];

class StaticBackground {
    
    constructor(camera, x, y, wx, wy, sw, sh, dir) {
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance(); 
        this.position = new Vector(x, y);
        this.size = new Vector(sw, sh);
        this.camera = camera;
        this.wx = wx;
        this.wy = wy;
        this.image = "back";
        this.dir = dir;
    }

    static renderBackgrounds(context, player, camera, wx, wy, sw, sh) {
        var x = parseInt(player.position.x / sw);
        x = parseInt((x * sw + camera.xOffset() - camera.xOffset() / 5) / sw);
        for (let dir of staticBackDirs) {
            var background = new StaticBackground(camera, (x + dir[0]) * sw, 0, wx, wy, sw, sh, dir);
            background.render(context);
        }
    }

    render(context) {
        var x = this.wx + this.position.x + this.camera.xOffset() / 5 - this.size.x * 0.5;
        var y = this.wy - (this.size.y * 0.5);
        context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[this.image].x, this.atlas.sprites[this.image].y, this.atlas.sprites[this.image].width, this.atlas.sprites[this.image].height, 
            x,  y, this.size.x + 1, this.size.y);
    }
}