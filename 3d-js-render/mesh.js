class Mesh {
    
    constructor() {
        this.translation = new Vector(0, 0, 0);
        this.triangles = [];
        this.matrix4x4 = Matrix4x4.getInstance();
    }
    
    addTriangle(triangle) {
        this.triangles.push(triangle);
    }
    
    transformViewMatrix(localTransMatrix, cameraViewDir, cameraPosition) {
        var translationMatrix = this.matrix4x4.getTranslationOfViewMatrix(cameraPosition);
        var viewMatrix = this.matrix4x4.getViewMatrix(cameraViewDir);
        for (let triangle of this.triangles) {
            // Change local space
            triangle.transformLocal(localTransMatrix);
            // Translate to world space
            triangle.translate(this.translation);
            // Transform to View Space
            triangle.transormViewMatrix(translationMatrix, viewMatrix);  
        }
    }
    
    transform(localTransMatrix) {
        for (let triangle of this.triangles) {
            // Change local space
            triangle.transformLocal(localTransMatrix);
            // Translate to world space
            triangle.translate(this.translation);
        }
    }
    
    render(context) {
        for (let triangle of this.triangles) {
            // Project mesh
            triangle.renderWireframe(context);
        }
    }
}