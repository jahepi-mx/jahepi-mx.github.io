class Ball {
    constructor(camera, x, y, direction, image) {
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance(); 
        this.position = new Vector();
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.friction = 0.97;
        this.size = new Vector();
        this.size.x = 15;
        this.size.y = 15;
        this.position.x = x;
        this.position.y = y;
        this.camera = camera;
        this.direction = direction;
        this.acceleration.y = -10;
        this.velocity.x = (Math.random() * 400 + 300) * direction;
        this.velocity.y = Math.random() * 300 + 100;
        this.time = 0;
        this.dispose = false;
        this.image = image;
    }

    update(dt) {
        this.time += dt;
        var tmp = this.position.add(this.velocity.mul(dt));
        if (tmp.y < 65) {
            this.velocity.y *= -1;
        } else {
            this.position.x = tmp.x;
            this.position.y = tmp.y;
        }
        this.velocity.mulSelf(this.friction);
        this.velocity.addSelf(this.acceleration);
        if (this.time > 30) {
            this.dispose = true;
        }
    }

    render(context) {
        var image = this.image;
        context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[image].x, this.atlas.sprites[image].y, this.atlas.sprites[image].width, this.atlas.sprites[image].height, 
            this.position.x - this.camera.offset.x - this.size.x * 0.5,  this.camera.offset.y - this.position.y - this.size.y * 0.5, this.size.x, this.size.y);
    }
}