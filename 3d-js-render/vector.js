class Vector {
    
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = 1;
    }
    
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
    
    addThis(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }
    
    sub(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
    
    subThis(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }
    
    mul(scalar) {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    mulThis(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    
    div(scalar) {
        return new Vector(this.x / scalar, this.y / scalar, this.z / scalar);
    }
    
    divThis(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }
    
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    
    normalize() {
        var length = this.length();
        return new Vector(this.x / length, this.y / length, this.z / length);
    }
    
    normalizeThis() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
    }
    
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
    
    cross(vector) {
        /*
         cx = aybz − azby
         cy = azbx − axbz
         cz = axby − aybx
         */
        var newVector = new Vector(0, 0, 0);
        newVector.x = this.y * vector.z - this.z * vector.y;
        newVector.y = this.z * vector.x - this.x * vector.z;
        newVector.z = this.x * vector.y - this.y * vector.x;
        return newVector;
    }
    
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    
    rasterize(width, height) {
        this.x = width * 0.5 * this.x;
        this.y = height * 0.5 * this.y;
    }
}