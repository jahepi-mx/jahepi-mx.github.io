class Triangle {
    
    constructor() {
        this.vLocal1 = new Vector(0, 0, 0);
        this.vLocal2 = new Vector(0, 0, 0);
        this.vLocal3 = new Vector(0, 0, 0);
        
        this.vWorld1 = new Vector(0, 0, 0);
        this.vWorld2 = new Vector(0, 0, 0);
        this.vWorld3 = new Vector(0, 0, 0);
        
        // For precalculated normal
        this.isPrecalculatedNormal = false;
        this.vNormal = new Vector(0, 0, 0);
        this.vNormalLocal = new Vector(0, 0, 0); // (Normal + this.vLocal1)
        this.vNormalWorld = new Vector(0, 0, 0);
        
        this.matrix4x4 = Matrix4x4.getInstance();
    }
    
    transformLocal(matrix) {
        this.vLocal1 = this.matrix4x4.transform(matrix, this.vLocal1);
        this.vLocal2 = this.matrix4x4.transform(matrix, this.vLocal2);
        this.vLocal3 = this.matrix4x4.transform(matrix, this.vLocal3);
        if (this.isPrecalculatedNormal) {
            this.vNormalLocal = this.matrix4x4.transform(matrix, this.vNormalLocal);
        }
    }
    
    translate(vector) {
        this.vWorld1 = this.vLocal1.add(vector);
        this.vWorld2 = this.vLocal2.add(vector);
        this.vWorld3 = this.vLocal3.add(vector);
        if (this.isPrecalculatedNormal) {
            this.vNormalWorld = this.vNormalLocal.add(vector);
        }
    }
    
    transormViewMatrix(translation, transpose) {
        this.vWorld1 = this.matrix4x4.transform(translation, this.vWorld1);
        this.vWorld2 = this.matrix4x4.transform(translation, this.vWorld2);
        this.vWorld3 = this.matrix4x4.transform(translation, this.vWorld3);

        this.vWorld1 = this.matrix4x4.transform(transpose, this.vWorld1);
        this.vWorld2 = this.matrix4x4.transform(transpose, this.vWorld2);
        this.vWorld3 = this.matrix4x4.transform(transpose, this.vWorld3);
        
        if (this.isPrecalculatedNormal) {
            this.vNormalWorld = this.matrix4x4.transform(translation, this.vNormalWorld);
            this.vNormalWorld = this.matrix4x4.transform(transpose, this.vNormalWorld);
        }
    }
    
    getLocalNormal() {
        var sub1 = this.vLocal2.sub(this.vLocal1);
        var sub2 = this.vLocal3.sub(this.vLocal1);
        return sub1.cross(sub2).normalizeThis().mulThis(10);
    }
    
    getWorldNormal() {
        var sub1 = this.vWorld2.sub(this.vWorld1);
        var sub2 = this.vWorld3.sub(this.vWorld1);
        return sub1.cross(sub2).normalizeThis();
    }
    
    isVisible() {
        if (this.isPrecalculatedNormal) {
            var normal = this.vNormalWorld.sub(this.vWorld1);
            var dot = this.vWorld1.normalize().dot(normal);
            return dot <= 0;
        }
        
        var dot = this.vWorld1.normalize().dot(this.getWorldNormal());
        return dot <= 0;
    }
    
    render(context, projectionMatrix) {
        
        // Camera View to 2D projection space normalized.
        var vWorld1 = this.matrix4x4.transform(projectionMatrix, this.vWorld1);
        var vWorld2 = this.matrix4x4.transform(projectionMatrix, this.vWorld2);
        var vWorld3 = this.matrix4x4.transform(projectionMatrix, this.vWorld3);
        
        // Rasterization
        vWorld1.rasterize(width, height);
        vWorld2.rasterize(width, height);
        vWorld3.rasterize(width, height);
            
        var tmpTriangle = new Triangle();
        tmpTriangle.vWorld1 = vWorld1;
        tmpTriangle.vWorld2 = vWorld2;
        tmpTriangle.vWorld3 = vWorld3;
        tmpTriangle.vLocal1 = this.vLocal1;
        tmpTriangle.vLocal2 = this.vLocal2;
        tmpTriangle.vLocal3 = this.vLocal3;
        var clippedTriangles = clipping.clipScreenTriangle(tmpTriangle);
        
        for (let clippedTri of clippedTriangles) {
            
            // Lighting
            var dot = 0;
            var lightSource = new Vector(0, 0, 1);
            if (this.isPrecalculatedNormal) {
                dot = this.vNormal.dot(lightSource);
            } else {
                var normal = clippedTri.getLocalNormal().normalizeThis();
                dot = normal.dot(lightSource);
            }

            var ratio = (dot + 1) / 2;
            var color = parseInt(255 * ratio);
            context.beginPath();
            context.fillStyle = "rgb(" + color + ", " + color + ", " + color + ")";
            context.strokeStyle = context.fillStyle;
            context.moveTo(origX + clippedTri.vWorld1.x, origY - clippedTri.vWorld1.y);
            context.lineTo(origX + clippedTri.vWorld2.x, origY - clippedTri.vWorld2.y);
            context.lineTo(origX + clippedTri.vWorld3.x, origY - clippedTri.vWorld3.y);
            context.lineTo(origX + clippedTri.vWorld1.x, origY - clippedTri.vWorld1.y);
            context.stroke();
            context.fill();
        }
    }
    
    getAverageZ() {
        return (this.vWorld1.z + this.vWorld2.z + this.vWorld3.z) / 3;
    }
}