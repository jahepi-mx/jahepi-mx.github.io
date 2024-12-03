class Player {
    
    constructor(camera, x, y, wx, wy) {
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.moveAnimation = new Animation(4, 2);
        this.position = new Vector(x, y);
        this.left = this.right = false;
        this.vel = new Vector(0, 0);
        this.accel = new Vector(0, -60);
        this.friction = new Vector(0.9, 0.9);
        this.size = new Vector(124*2, 60*2);
        this.camera = camera;
        this.wx = wx;
        this.wy = wy;
        this.speed = 100;

        this.prevPos = this.position.clone();
        this.stuckTime = 0;
        this.stuckTimeLimit = 1;
        this.dir = 1;

        this.changeDirTime = 0;
        this.changeDirTimeLimit = 5 * Math.random() * 5;
    }

    update(dt, things) {
        if (this.left) {
            //this.vel.x = -this.speed;
        }
        if (this.right) {
            //this.vel.x = this.speed;
        }

        this.vel.x = this.speed * this.dir;

        this.stuckTime += dt;
        if (this.stuckTime >= this.stuckTimeLimit) {
            this.stuckTime = 0;
            var dist = (this.position.x - this.prevPos.x) * (this.position.x - this.prevPos.x) + (this.position.y - this.prevPos.y) * (this.position.y - this.prevPos.y)
            this.prevPos = this.position.clone();
            if (dist < 10) {
                this.dir *= -1;
            }
        }

        this.changeDirTime += dt;
        if (this.changeDirTime > this.changeDirTimeLimit) {
            this.changeDirTime = 0;
            this.changeDirTimeLimit = 5 * Math.random() * 5;
            this.dir *= -1;
        }

        var testXDir = new Vector(this.position.x + this.vel.x * dt, this.position.y);
        var testYDir = new Vector(this.position.x, this.position.y + this.vel.y * dt);
        var xCollision = false;
        var yCollision = false;
        for (let thing of things) {
            if (thing.collide(testXDir, this.size)) {
                xCollision = true;
            }
            if (thing.collide(testYDir, this.size)) {
                yCollision = true;
            }
        }
        if (xCollision == false) {
            this.position.x += this.vel.x * dt;
        }
        if (yCollision == false) {
            this.position.y += this.vel.y * dt;
        } else {
            this.vel.y = 0;
        }

        this.vel.x += this.accel.x;
        this.vel.y += this.accel.y;
        this.vel.x *= this.friction.x;
        this.vel.y *= this.friction.y;
        this.moveAnimation.update(dt);
    }

    render(context) {
        var image =  "thomas_" + (this.vel.x > 0 ? "" : "left_")+ (this.moveAnimation.getFrame() + 1);
        var x = this.wx + this.position.x + this.camera.xOffset() - this.size.x * 0.5;
        var y = this.wy - (this.position.y + this.camera.yOffset() + this.size.y * 0.5);

        context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[image].x, this.atlas.sprites[image].y, this.atlas.sprites[image].width, this.atlas.sprites[image].height, 
            x,  y, this.size.x, this.size.y);
    }

}