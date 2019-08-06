class Clipping {
    
    constructor() {
        // Near Z Plane
        this.nearPoint = new Vector(0, 0, 1);
        this.nearNormal = new Vector(0, 0, 1);
        
        // Screen 4 Planes 
        this.xLeftPoint = new Vector(-width * 0.5, 0, 0);
        this.xLeftNormal = new Vector(1, 0, 0);
        this.xRightPoint = new Vector(width * 0.5, 0, 0);
        this.xRightNormal = new Vector(-1, 0, 0);
        this.yUpPoint = new Vector(0, height * 0.5, 0);
        this.yUpNormal = new Vector(0, -1, 0);
        this.yDownPoint = new Vector(0, -height * 0.5, 0);
        this.yDownNormal = new Vector(0, 1, 0);
    }
    
    clipNearZPlane(triangle) {
        var array = [];
        var outside = [];
        var inside = [];
        triangle.vWorld1.z > this.nearPoint.z ? inside.push(triangle.vWorld1) : outside.push(triangle.vWorld1);
        triangle.vWorld2.z > this.nearPoint.z ? inside.push(triangle.vWorld2) : outside.push(triangle.vWorld2);
        triangle.vWorld3.z > this.nearPoint.z ? inside.push(triangle.vWorld3) : outside.push(triangle.vWorld3);
        this.getClippedTriangles(inside, outside, triangle, this.nearNormal, this.nearPoint, array);
        return array;
    }
    
    clipScreenXLeft(triangle, array) {
        var outside = [];
        var inside = [];
        triangle.vWorld1.x > this.xLeftPoint.x ? inside.push(triangle.vWorld1) : outside.push(triangle.vWorld1);
        triangle.vWorld2.x > this.xLeftPoint.x ? inside.push(triangle.vWorld2) : outside.push(triangle.vWorld2);
        triangle.vWorld3.x > this.xLeftPoint.x ? inside.push(triangle.vWorld3) : outside.push(triangle.vWorld3);
        this.getClippedTriangles(inside, outside, triangle, this.xLeftNormal, this.xLeftPoint, array);
        return array;
    }
    
    clipScreenXRight(triangle, array) {
        var outside = [];
        var inside = [];
        triangle.vWorld1.x < this.xRightPoint.x ? inside.push(triangle.vWorld1) : outside.push(triangle.vWorld1);
        triangle.vWorld2.x < this.xRightPoint.x ? inside.push(triangle.vWorld2) : outside.push(triangle.vWorld2);
        triangle.vWorld3.x < this.xRightPoint.x ? inside.push(triangle.vWorld3) : outside.push(triangle.vWorld3);
        this.getClippedTriangles(inside, outside, triangle, this.xRightNormal, this.xRightPoint, array);
        return array;
    }
    
    clipScreenYUp(triangle, array) {
        var outside = [];
        var inside = [];
        triangle.vWorld1.y < this.yUpPoint.y ? inside.push(triangle.vWorld1) : outside.push(triangle.vWorld1);
        triangle.vWorld2.y < this.yUpPoint.y ? inside.push(triangle.vWorld2) : outside.push(triangle.vWorld2);
        triangle.vWorld3.y < this.yUpPoint.y ? inside.push(triangle.vWorld3) : outside.push(triangle.vWorld3);
        this.getClippedTriangles(inside, outside, triangle, this.yUpNormal, this.yUpPoint, array);
        return array;
    }
    
    clipScreenYDown(triangle, array) {
        var outside = [];
        var inside = [];
        triangle.vWorld1.y > this.yDownPoint.y ? inside.push(triangle.vWorld1) : outside.push(triangle.vWorld1);
        triangle.vWorld2.y > this.yDownPoint.y ? inside.push(triangle.vWorld2) : outside.push(triangle.vWorld2);
        triangle.vWorld3.y > this.yDownPoint.y ? inside.push(triangle.vWorld3) : outside.push(triangle.vWorld3);
        this.getClippedTriangles(inside, outside, triangle, this.yDownNormal, this.yDownPoint, array);
        return array;
    }
    
    clipScreenTriangle(triangle) {
        var stack1 = [];
        var stack2 = [];
        this.clipScreenXLeft(triangle, stack1);
        while (stack1.length > 0) {
            this.clipScreenYUp(stack1.pop(), stack2);
        }
        while (stack2.length > 0) {
            this.clipScreenXRight(stack2.pop(), stack1);
        }
        while (stack1.length > 0) {
            this.clipScreenYDown(stack1.pop(), stack2);
        }
        // Returns all the clipped triangles from a triangle.
        return stack2;
    }
    
    getClippedTriangles(inside, outside, triangle, normal, point, array) {
        if (inside.length === 3) {
            
            array.push(triangle);
            
        } else if (inside.length === 1 && outside.length === 2) {
            
            var d1 = normal.dot(inside[0].sub(point));
            var d2 = normal.dot(outside[0].sub(point));
            var t = d1 / (d1 - d2);
            var intersection1 = inside[0].add(outside[0].sub(inside[0]).mul(t));
            
            d1 = normal.dot(inside[0].sub(point));
            d2 = normal.dot(outside[1].sub(point));
            t = d1 / (d1 - d2);
            var intersection2 = inside[0].add(outside[1].sub(inside[0]).mul(t));
            
            var newTriangle = new Triangle();
            newTriangle.vWorld1 = inside[0];
            newTriangle.vWorld2 = intersection1;
            newTriangle.vWorld3 = intersection2;
            newTriangle.vLocal1 = triangle.vLocal1;
            newTriangle.vLocal2 = triangle.vLocal2;
            newTriangle.vLocal3 = triangle.vLocal3;
            array.push(newTriangle);
            
        } else if (inside.length === 2 && outside.length === 1) {
            
            var d1 = normal.dot(inside[0].sub(point));
            var d2 = normal.dot(outside[0].sub(point));
            var t = d1 / (d1 - d2);
            var intersection1 = inside[0].add(outside[0].sub(inside[0]).mul(t));
            
            d1 = normal.dot(inside[1].sub(point));
            d2 = normal.dot(outside[0].sub(point));
            t = d1 / (d1 - d2);
            var intersection2 = inside[1].add(outside[0].sub(inside[1]).mul(t));
            
            var newTriangle1 = new Triangle();
            newTriangle1.vWorld1 = inside[0];
            newTriangle1.vWorld2 = intersection2;
            newTriangle1.vWorld3 = inside[1];
            newTriangle1.vLocal1 = triangle.vLocal1;
            newTriangle1.vLocal2 = triangle.vLocal2;
            newTriangle1.vLocal3 = triangle.vLocal3;
            array.push(newTriangle1);
            
            var newTriangle2 = new Triangle();
            newTriangle2.vWorld1 = inside[0];
            newTriangle2.vWorld2 = intersection1;
            newTriangle2.vWorld3 = intersection2;
            newTriangle2.vLocal1 = triangle.vLocal1;
            newTriangle2.vLocal2 = triangle.vLocal2;
            newTriangle2.vLocal3 = triangle.vLocal3;
            array.push(newTriangle2);
        }
    }
}
