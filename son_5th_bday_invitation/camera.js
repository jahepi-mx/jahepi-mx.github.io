class Camera {
    
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.xLimit = 0;
        this.yLimit = 0;
    }

    update(targetPos, dt) {
        var diffX = targetPos.x - this.position.x;
        var diffY = targetPos.y - this.position.y;
        this.position.x += diffX * dt * 0.8;
        this.position.y += diffY * dt * 0.8;
    }

    xOffset() {
        return this.xLimit - this.position.x;
    }

    yOffset() {
        return this.yLimit - this.position.y;
    }



}