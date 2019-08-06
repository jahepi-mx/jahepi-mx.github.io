let utilsInstance = null;

class Utils {
    
    static getInstance() {
        if (utilsInstance === null) {
            utilsInstance = new Utils();
        }
        return utilsInstance;
    }
    
    generateMesh(textFile, scale) {
	var mesh = new Mesh();
	var lines = textFile.split("\n");
        var vertexs = [];
        var normals = [];
        var a = 0;
        var e = 0;
        for (let line of lines) {
            line = line.replace(/  +/g, ' ');
            var parts = line.split(" ");
            if (parts[0] === "v") {
                vertexs[a] = new Vector(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                vertexs[a].mulThis(scale);
                a++;
            } else if (parts[0] === "vn") {
                normals[e] = new Vector(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                e++;
            } else if (parts[0] === "f") {
                var triangle = new Triangle();
                triangle.vLocal1 = vertexs[parseInt(parts[1].split("/")[0]) - 1];
                triangle.vLocal2 = vertexs[parseInt(parts[2].split("/")[0]) - 1];
                triangle.vLocal3 = vertexs[parseInt(parts[3].split("/")[0]) - 1];
                if (parts[1].split("/").length === 3) {
                    triangle.isPrecalculatedNormal = true;
                    triangle.vNormal = normals[parseInt(parts[1].split("/")[2]) - 1];
                    triangle.vNormalLocal = triangle.vNormal.add(triangle.vLocal1);
                }
                mesh.addTriangle(triangle);
            }
        }
        return mesh;
    }
}