class Splash {
    constructor(camera, x, y, direction) {
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance(); 
        this.position = new Vector();
        this.explodePosition = new Vector();
        this.velocity = new Vector();
        this.splashSize = new Vector();
        this.splashSize.x = 60;
        this.splashSize.y = 20;
        this.explodeSize = new Vector();
        this.explodeSize.x = 35;
        this.explodeSize.y = 50;
        this.position.x = x;
        this.position.y = y;
        this.explodePosition.x = x;
        this.explodePosition.y = y;
        this.camera = camera;
        this.direction = direction;
        this.velocity.x = (Math.random() * 200 + 200) * direction;
        this.velocity.y = 0;
        this.dispose = false;

        this.explodeAnimation = new Animation(3, 3);
        this.splashAnimation = new Animation(4, 3);

        this.explodeAnimation.stopAtSequenceNumber(1, this.onStopExplode.bind(this));

    }

    onStopExplode() {

    }

    update(dt) {
        this.position.addSelf(this.velocity.mul(dt));
        this.dispose = this.position.x < -this.splashSize.x || this.position.x > this.camera.worldWidth + this.splashSize.x;

        this.explodeAnimation.update(dt);
        this.splashAnimation.update(dt);
    }

    render(context) {
        var image = (this.direction.x > 0 ? "" : "left_") + "water_splash_" + (this.splashAnimation.getFrame() + 1);
        context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[image].x, this.atlas.sprites[image].y, this.atlas.sprites[image].width, this.atlas.sprites[image].height, 
            this.position.x - this.camera.offset.x - this.splashSize.x * 0.5,  this.camera.offset.y - this.position.y - this.splashSize.y * 0.5, this.splashSize.x, this.splashSize.y);

        if (!this.explodeAnimation.isStopped()) {
            var image = (this.direction.x > 0 ? "" : "left_") + "water_explode_" + (this.explodeAnimation.getFrame() + 1);
        context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[image].x, this.atlas.sprites[image].y, this.atlas.sprites[image].width, this.atlas.sprites[image].height, 
            this.explodePosition.x - this.camera.offset.x - this.explodeSize.x * 0.5,  this.camera.offset.y - this.explodePosition.y - this.explodeSize.y * 0.5, this.explodeSize.x, this.explodeSize.y);
        }
    }
}