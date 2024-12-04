
class Camera {

    constructor() {
        this.viewPortWidth = 480;
        this.viewPortHeight = 400;
        this.worldWidth = 2000;
        this.worldHeight = 400;
        this.offset = new Vector();
        this.offset.x = 0;
        this.offset.y = this.viewPortHeight;
        this.position = new Vector();
    }

    update() {
        var offsetX = this.position.x - this.viewPortWidth * 0.5;
        var leftLimit = 0;
        var rightLimit = (this.worldWidth - this.viewPortWidth * 0.5) - this.viewPortWidth * 0.5;
        if (offsetX <= leftLimit) {
            this.offset.x = leftLimit;
        } else if (offsetX >= rightLimit) {
            this.offset.x = rightLimit;
        } else {
            this.offset.x = offsetX;
        }
    }
}