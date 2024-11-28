class Sector {

    constructor(id, player, camera, zBottom, height, tan, hw3d, hh3d, hw, hh, zCam) {
        this.id = id;
        this.player = player;
        this.positions = [];
        this.localPositions = [];
        this.innerSectors = [];
        this.mins = [];
        this.maxs = [];
        this.zBottom = zBottom;
        this.height = height;
        this.zUp = zBottom + height;
        this.min = Number.MAX_VALUE;
        this.max = Number.MIN_VALUE;
        this.hasFloor = true;
        this.hasCeiling = true;
        this.lines = [];
        this.camera = camera;
        this.tan = tan;
        this.hw3d = hw3d;
        this.hh3d = hh3d;
        this.tanH = this.tan * this.hh3d;
        this.tanW = this.tan * this.hw3d;
        this.hw = hw;
        this.hh = hh;
        this.collided = false;
        this.isInside = false;
        this.zCam = zCam;
        this.epsilon = 1;
        // For ceiling and floor texturing
        this.minx = Number.MAX_VALUE;
        this.maxx = Number.MIN_VALUE;
        this.miny = Number.MAX_VALUE;
        this.maxy = Number.MIN_VALUE;
        this.floorTexture = null;
        this.ceilingTexture = null;
    }

    add(x1, y1, x2, y2, color, floor, ceiling, isWall, draw, connectedSector, textureTop, textureBottom) {
        this.lines.push(new Line(this.hw, this.hh, x1, y1, x2, y2, color, this.player, this.zBottom, this.height, floor, ceiling, isWall, draw, connectedSector, textureTop, textureBottom));
        this.minx = Math.min(x1, this.minx);
        this.maxx = Math.max(x1, this.maxx);
        this.miny = Math.min(y1, this.miny);
        this.maxy = Math.max(y1, this.maxy);
        this.positions.push(new Vector(x1, y1));
        this.localPositions.push(new Vector(x1, y1));
    }

    update(dt) {
        for (var i = 0; i < this.positions.length; i++) {
            let vector = this.player.convertToLocal(this.positions[i].x, this.positions[i].y, true);
            this.localPositions[i].x = vector.x;
            this.localPositions[i].y = vector.y;
        }
        if (this.hasFloor || this.hasCeiling) this.getFloorCeilingLocalPositions();
    }

    getFloorCeilingLocalPositions() {
        this.mins = [];
        this.maxs = [];
        this.min = Number.MAX_VALUE;
        this.max = Number.MIN_VALUE;
        var len = this.localPositions.length;
        for (var a = 0; a < len; a++) {
            var aPos = this.localPositions[a];
            var bPos = this.localPositions[(a + 1) % len];
            var xA = aPos.x | 0;
            var yA = aPos.y | 0;
            var xB = bPos.x | 0;
            var yB = bPos.y | 0;
            if (yB < yA) {
                var tmpX = xA;
                var tmpY = yA;
                xA = xB;
                yA = yB;
                xB = tmpX;
                yB = tmpY;
            }
            var xDiff = xB - xA;
            var yDiff = yB - yA;
            for (var y = yA; y <= yB; y++) {
                // p.y + d.y*? = t
                // ? = (t - p.y) / d.y
                if (yDiff != 0 && y >= 1) {
                    var ratio = (y - yA) / yDiff;
                    var x = xA + ratio * xDiff;
                    if (this.mins[y] === undefined) {
                        this.mins[y] = x;
                    }
                    if (this.maxs[y] === undefined) {
                        this.maxs[y] = x;
                    }
                    this.mins[y] = Math.min(x, this.mins[y]);
                    this.maxs[y] = Math.max(x, this.maxs[y]);
                    this.min = Math.min(y, this.min);
                    this.max = Math.max(y, this.max);
                }
            }
        }
    }

    render(localContext, stack, bounds, imageData, sort) {
        var hasIntersections = false;
        this.collided = false;
        this.isInside = true;
        var sign = null;
        for (let line of this.lines) {
            line.update(0);
            line.localRender(localContext);
            var cross = line.cross();
            if (Math.abs(cross) > stack.epsilon) {
                sign = sign == null ? cross >= 0 : sign;
                this.isInside = sign && cross < 0 ? false : this.isInside;
                this.isInside = !sign && cross >= 0 ? false : this.isInside;
            }
            if (line.hasIntersectionPoints()) {
                hasIntersections = true;
                line.intersectLocalRender(localContext);
                line.intersectA.z -= this.camera.z;
                line.intersectB.z -= this.camera.z;
                line.intersectA.z += line.z;
                line.intersectB.z += line.z;
                this.collided = line.isWall && line.intersect(this.player.wallSensor) != null ? true : this.collided;
                if (line.connectedSector != null) stack.addSector(line.connectedSector, line.getBounds(this.tan * this.hw3d, this.tan * this.hh3d, -this.hw3d, this.hw3d, this.hh3d, -this.hh3d));
                if (line.draw && line.floor == 0 && line.ceiling == 0) this.drawWall(line, 0, line.height, bounds, imageData, sort, line.textureBottom);
                if (line.draw && line.floor > 0) this.drawWall(line, 0, line.floor, bounds, imageData, sort, line.textureBottom);
                if (line.draw && line.ceiling > 0) this.drawWall(line, line.height - line.ceiling, line.height, bounds, imageData, sort, line.textureTop);
            }
        }
        if (!hasIntersections) {
            return;
        }
        if (this.hasCeiling) this.drawSurface(this.zUp, bounds, this.ceilingTexture, imageData, sort);
        if (this.hasFloor) this.drawSurface(this.zBottom, bounds, this.floorTexture, imageData, sort);
    }
    /* The idea behind this is to get the Z screen coordinates, which represent the screen height. We then loop through that range, retrieving the Y world coordinate (depth) and the X world coordinate, 
       and convert them to X screen coordinates. As we loop through this range, we convert each pixel back to world coordinates to get the color of the texture. */
    drawSurface(height, bounds, texture, imageData, sort) {
        var zScreenMinA = (-this.camera.z + height) * (1 / this.min) * this.tanH;
        var zScreenMaxA = (-this.camera.z + height) * (1 / this.max) * this.tanH;
        zScreenMinA = zScreenMinA < bounds.bottom ? bounds.bottom : zScreenMinA;
        zScreenMinA = zScreenMinA > bounds.top ? bounds.top : zScreenMinA;
        zScreenMaxA = zScreenMaxA < bounds.bottom ? bounds.bottom : zScreenMaxA;
        zScreenMaxA = zScreenMaxA > bounds.top ? bounds.top : zScreenMaxA;
        var maxz = Math.floor(Math.max(zScreenMinA, zScreenMaxA));
        for (var sz = Math.ceil(Math.min(zScreenMinA, zScreenMaxA)); sz <= maxz; sz++) {
            var y = ((-this.camera.z + height) * this.tanH * (1 / sz)) | 0;
            var min = this.mins[y];
            var max = this.maxs[y];
            var xMinScreen = Math.floor(Math.max(min * (1 / y) * this.tanW, bounds.left));
            var xMaxScreen = Math.floor(Math.min(max * (1 / y) * this.tanW, bounds.right));
            for (var xScreen = xMinScreen; xScreen <= xMaxScreen; xScreen++) {
                var x = xScreen / ((1 / y) * this.tanW);
                var world = this.player.convertToWorld(x, y);
                var texx = ((world.x - this.minx) / (this.maxx - this.minx) * texture.width) | 0; 
                var texy = ((world.y - this.miny) / (this.maxy - this.miny) * texture.height) | 0;
                var index = texture.getIndex(texx, texy);
                var texx2 = this.hw3d + xScreen;
                var texy2 = this.hh3d - sz;
                var index2 = texy2 * (this.hw3d * 2) + texx2;
                if (y < sort[index2]) {
                    sort[index2] = y;
                    var darkness = 1 - (x * x + y * y) / (1400 * 1400);
                    darkness = darkness < 0 ? 0 : darkness;
                    imageData[index2] = (texture.imageData[index + 3] << 24) | (texture.imageData[index + 2] * darkness << 16) | (texture.imageData[index + 1] * darkness << 8) | texture.imageData[index] * darkness;
                }
            }
        }
    }
    
    drawWall(line, down, up, bounds, imageData, sort, texture) {
        var x = line.intersectA.x;
        var y = line.intersectA.y;
        var z = line.intersectA.z;
        var prevX = line.intersectB.x;
        var prevY = line.intersectB.y;
        var prevZ = line.intersectB.z;
        var pRatio = 1 / prevY;
        var ratio = 1 / y;
        var sxAUp = prevX * pRatio * this.tanW;
        var szAUp = (prevZ + up) * pRatio * this.tanH;
        var sxBUp = x * ratio * this.tanW;
        var szBUp = (z + up) * ratio * this.tanH;
    
        var sxADown = prevX * pRatio * this.tanW;
        var szADown = (prevZ + down) * pRatio * this.tanH;
        var sxBDown = x * ratio * this.tanW;
        var szBDown = (z + down) * ratio * this.tanH;

        // Texture
        var intersA = line.intersectA;
        var intersB = line.intersectB;
        if (sxAUp < sxBUp) {
            intersA = line.intersectB;
            intersB = line.intersectA;
        }
        var diffX1 = intersB.x - intersA.x;
        var diffY1 = intersB.y - intersA.y;
        var diffX2 = line.localPosition1.x - intersA.x;
        var diffY2 = line.localPosition1.y - intersA.y;
        var dotProj = line.localDiff.x * line.localDiff.x + line.localDiff.y * line.localDiff.y;
        var startPos = diffX1 * diffX2 + diffY1 * diffY2 <= 0 ? line.localPosition1 : line.localPosition2;

        var screenToLocalUp = (prevZ + up) * this.tanH;
        var screenToLocalDown = (prevZ + down) * this.tanH;
        var upSlopeDen = sxBUp - sxAUp;
        var downSlopeDen = sxBDown - sxADown;
        if (Math.abs(upSlopeDen) < this.epsilon) {
            return;
        }
        var upSlope = (szBUp - szAUp) / upSlopeDen;
        var downSlope = (szBDown - szADown) / downSlopeDen;
        var max = Math.max(sxAUp, sxBUp);
        max = Math.floor(Math.min(max, bounds.right));
        var min = Math.min(sxAUp, sxBUp);
        for (var e = Math.floor(Math.max(min, bounds.left)); e <= max; e++) {
            var top = upSlope * e + upSlope * -sxAUp + szAUp;
            var bottom = downSlope * e + downSlope * -sxADown + szADown;
            var newy = top == 0 ? screenToLocalDown / bottom : screenToLocalUp / top;
            var newx = e / (1 / newy * this.tanW);
            var darkness = 1 - (newx * newx + newy * newy) / (1400 * 1400);
            darkness = darkness < 0 ? 0 : darkness;
            var texRatio = Math.abs((newx - startPos.x) * line.localDiff.x + (newy - startPos.y) * line.localDiff.y) / dotProj;
            var top2 = Math.floor(Math.min(bounds.top, top));
            var bottom2 = Math.ceil(Math.max(bounds.bottom, bottom));
            var texx = (texture.width * texRatio) | 0;
            for (var zz = bottom2; zz <= top2; zz++) {
                var texy = ((top - zz) / (top - bottom) * texture.height) | 0;
                var index = texture.getIndex(texx, texy);
                var texx2 = this.hw3d + e;
                var texy2 = this.hh3d - zz;
                var index2 = texy2 * (this.hw3d * 2) + texx2;
                if (newy < sort[index2]) {
                    sort[index2] = newy;
                    imageData[index2] = (texture.imageData[index + 3] << 24) | (texture.imageData[index + 2] * darkness << 16) | (texture.imageData[index + 1] * darkness << 8) | texture.imageData[index] * darkness;
                }
            }
        } 
    }
}