let matrix4x4Instance = null;

class Matrix4x4 {
    
    constructor() {
        
    }
    
    static getInstance() {
        if (matrix4x4Instance === null) {
            matrix4x4Instance = new Matrix4x4();
        }
        return matrix4x4Instance;
    }
 
    getZRotationM4x4(theta) {  
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        var matrix = [
            cos, -sin, 0, 0,
            sin,  cos, 0, 0,
            0,      0, 1, 0,
            0,      0, 0, 1
        ];
        return matrix;
    }
    
    getYRotationM4x4(theta) {  
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        var matrix = [
            cos,  0, sin, 0,
            0,    1,   0, 0,
            -sin, 0, cos, 0,
            0,    0,   0, 1
        ];
        return matrix;
    }
    
    getXRotationM4x4(theta) {  
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        var matrix = [
            1,   0,    0, 0,
            0, cos, -sin, 0,
            0, sin,  cos, 0,
            0,   0,    0, 1
        ];
        return matrix;
    }
    
    transposeM4x4(matrix) {
        var newMatrix = [];
        for (var a = 0; a < 4 * 4; a++) {
            var x = a % 4;
            var y = parseInt(a / 4);
            var value = matrix[a];
            newMatrix[x * 4 + y] = value;
        }
        return newMatrix;
    }
    
    transform(matrix4x4, vector) {
        var newVector = new Vector(0, 0, 0);
        newVector.x = matrix4x4[0] * vector.x + matrix4x4[1] * vector.y + matrix4x4[2] * vector.z + matrix4x4[3] * vector.w;
        newVector.y = matrix4x4[4] * vector.x + matrix4x4[5] * vector.y + matrix4x4[6] * vector.z + matrix4x4[7] * vector.w;
        newVector.z = matrix4x4[8] * vector.x + matrix4x4[9] * vector.y + matrix4x4[10] * vector.z + matrix4x4[11] * vector.w;
        newVector.w = matrix4x4[12] * vector.x + matrix4x4[13] * vector.y + matrix4x4[14] * vector.z + matrix4x4[15] * vector.w;
        
        if (newVector.w !== 1) {
            newVector.x /= newVector.w;
            newVector.y /= newVector.w;
            newVector.z /= newVector.w;
        }
        return newVector;
    }
    
    transformM4x4(matrix4x4a, matrix4x4b) {
        var newMatrix = [];
        for (var a = 0, x = 0, y = 0; a < 4 * 4; a++) {
            if (a % 4 === 0 && a > 0) {
                x += 4;
            }
            newMatrix[a] = 0;
            for (var i = 0, ny = y; i < 4; i++) {
                var nx = x + i;
                //console.log(nx + "," + ny);
                newMatrix[a] += matrix4x4a[nx] * matrix4x4b[ny];
                ny += 4;                
            }
            //console.log("---->");
            y++;
            y %= 4;
        }
        return newMatrix;
    }
    
    buildOrthonormalMatrix(xAxis, yAxis, zAxis) {
        var matrix = [
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
                  0,       0,       0, 1,
        ];
        return matrix;
    }
    
    getTranslationOfViewMatrix(cameraPosition) {
        var matrix = [
            1, 0, 0, -cameraPosition.x,
            0, 1, 0, -cameraPosition.y,
            0, 0, 1, -cameraPosition.z,
            0, 0, 0, 1
        ];
        return matrix;
    }
    
    getIdentityMatrix() {
        var matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return matrix;
    }
    
    getViewMatrix(cameraViewDir) {
        var zAxis = cameraViewDir;
        var tmp = new Vector(0, 1, 0);
        var xAxis = tmp.cross(cameraViewDir).normalize();          
        var yAxis = cameraViewDir.cross(xAxis).normalize();

        var transposed = this.buildOrthonormalMatrix(xAxis, yAxis, zAxis);
        transposed = this.transposeM4x4(transposed);
        return transposed;
    }
    
    getPespectiveProjectionMatrix(fov, near, far, aspectRatio) {
        /*
        aspectRatio = width / height
        f1 = far / (far - near)
        f2 = -far * near / (far - near)
        
        -> Normalize the values from -1 to 1 when divided by the Z component, with these values
        -> you can rasterize the image to the screen
        scaleX = 1 / aspectRatio * Math.tan(fov * 0.5 * Math.PI / 180)
        scaleY = 1 / Math.tan(fov * 0.5 * Math.PI / 180)
        
        x = x * scaleX
        y = y * scaleY
        z = z * f1 + f2
        w = z
        --------------------------------------------------------------
        
        f1 = far / (far - near)
        f2 = -far * near / (far - near)
        z = z * f1 + f2
        
        This equation normalize the Z value to [0-1] range values, similar to this but not equal:
        z = (z - near) / (far - near)
        This give us the ratio BUT in order to normalize the value with the help of the 'transform' method
        which transforms the coordinates to perspective coordinates if the W value is different than 1 dividing by it,
        it has to be done like this:
        
        f1 = (far * z) / (far - near)
        f2 = (far * near) / (far - near)
        
        finalValue = (f1 - f2) / z
        
        The final value is divided by Z (Which is W in the perspective matrix) to normalize the values in the range from 0 to 1
         */
        
        var matrix = this.getIdentityMatrix();
        var tan = Math.tan(fov * 0.5 * Math.PI / 180);
        var scaleX = 1 / aspectRatio * tan;
        var scaleY = 1 / tan;
        matrix[0] = scaleX;
        matrix[5] = scaleY;
        matrix[10] = far / (far - near);
        matrix[11] = -far * near / (far - near);
        matrix[14] = 1;
        matrix[15] = 0;
        return matrix;
    }
    
    get2DProjectionVector(vector) {
        var ratio = 300 / (300 + vector.z);
        var x = vector.x * ratio;
        var y = vector.y * ratio;
        return new Vector(x, y, 0, 0);
    }
}


