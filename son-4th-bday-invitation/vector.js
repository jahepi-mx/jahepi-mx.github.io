
class Vector {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    add(vector) {
        var tmp = this.clone();
        tmp.x += vector.x;
        tmp.y += vector.y;
        return tmp;
    }

    addSelf(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector) {
        var tmp = this.clone();
        tmp.x = vector.x - this.x;
        tmp.y = vector.y - this.y;
        return tmp;
    }

    subSelf(vector) {
        this.x = vector.x - this.x;
        this.y = vector.y - this.y;
        return this;
    }

    mul(scalar) {
        var tmp = this.clone();
        tmp.x *= scalar;
        tmp.y *= scalar;
        return tmp;
    }
    
    mulSelf(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    clone() {
        var vector = new Vector();
        vector.x = this.x;
        vector.y = this.y;
        return vector;
    }
}