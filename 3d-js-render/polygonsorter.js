class PolygonSorter {
    
    constructor(meshes, clipping) {
        this.triangles = [];
        for (let mesh of meshes) {
            for (let triangle of mesh.triangles) {
                if (triangle.isVisible()) {
                    var newTriangles = clipping.clipNearZPlane(triangle);
                    for (let newTriangle of newTriangles) {
                        this.triangles.push(newTriangle);
                    }
                }
            }
        }
    }
    
    sort() {
        this.triangles.sort(function(t1, t2) {
            return t1.getAverageZ() > t2.getAverageZ() ? -1 : t1.getAverageZ() < t2.getAverageZ() ? 1 : 0;
        });
    }
}


