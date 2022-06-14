class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }

    addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lengthNoSqrt() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    scale(scalar) {
        return this.normalize().mul(scalar);
    }

    normalize() {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }
}