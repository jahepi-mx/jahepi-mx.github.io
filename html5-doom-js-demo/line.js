class Line {
    
    constructor(offsetx, offsety, x1, y1, x2, y2, color, player, zBottom, height, floor, ceiling, isWall, draw, connectedSector, textureTop, textureBottom) {
        this.position1 = new Vector(x1, y1);
        this.position2 = new Vector(x2, y2);
        this.localPosition1 = new Vector(0, 0);
        this.localPosition2 = new Vector(0, 0);
        this.localUnit = new Vector(0, 0);
        this.localDiff = new Vector(0, 0);
        this.color = color;
        this.offset = new Vector(offsetx, offsety);
        this.ratio = 0;
        this.player = player;
        this.lenNoSqrt = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        this.len = Math.sqrt(this.lenNoSqrt);
        this.intersectA = null;
        this.intersectB = null;
        this.intersections = new Array(5);
        this.intersectionCount = 0;
        this.height = height;
        this.ceiling = ceiling;
        this.floor = floor;
        this.z = zBottom;
        this.isWall = isWall;
        this.connectedSector = connectedSector;
        this.draw = draw;
        this.textureTop = textureTop;
        this.textureBottom = textureBottom;
    }

    updateState(offsetx, offsety, x1, y1, x2, y2) {
        this.position1.x = x1;
        this.position1.y = y1;
        this.position2.x = x2;
        this.position2.y = y2;
        this.lenNoSqrt = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        this.len = Math.sqrt(this.lenNoSqrt);
        this.offset.x = offsetx;
        this.offset.y = offsety;
    }

    update(dt) {
        this.localPosition1 = this.player.convertToLocal(this.position1.x, this.position1.y, true);
        this.localPosition2 = this.player.convertToLocal(this.position2.x, this.position2.y, true);
        this.localDiff.x = this.localPosition2.x - this.localPosition1.x;
        this.localDiff.y = this.localPosition2.y - this.localPosition1.y;
        this.localUnit.x = this.localDiff.x / this.len;
        this.localUnit.y = this.localDiff.y / this.len;
        this.ratio = this.localUnit.x != 0 ? this.localDiff.x / this.localUnit.x : this.ratio;
        this.ratio = this.localUnit.y != 0 ? this.localDiff.y / this.localUnit.y : this.ratio;
    }

    render(context) {
        context.beginPath();
        context.moveTo(this.offset.x + this.position1.x, this.offset.y - this.position1.y);
        context.lineTo(this.offset.x + this.position2.x, this.offset.y - this.position2.y);
        context.lineWidth = 3;
        context.strokeStyle = this.color;
        context.stroke();
    }

    localRender(context) {
        context.beginPath();
        context.moveTo(this.offset.x + this.localPosition1.x, this.offset.y - this.localPosition1.y);
        context.lineTo(this.offset.x + this.localPosition2.x, this.offset.y - this.localPosition2.y);
        context.lineWidth = 3;
        context.strokeStyle = this.color;
        context.stroke();
    }

    intersectLocalRender(context) {
        context.fillStyle = "white";
        context.fillRect(this.offset.x + this.intersectA.x - 3, this.offset.y - (this.intersectA.y + 3), 6, 6);
        context.fillRect(this.offset.x + this.intersectB.x - 3, this.offset.y - (this.intersectB.y + 3), 6, 6);
    }

    cross() {
        // this.localDiff.x, this.localDiff.y
        // 0 - this.localPosition1.x, 0 - this.localPosition1.y
        return this.localDiff.x * -this.localPosition1.y + this.localDiff.y * this.localPosition1.x;
    }

    intersect(line) {
        var den1 = this.localPosition2.x - this.localPosition1.x;
        var den2 = line.localPosition2.x - line.localPosition1.x;
        if (den1 != 0 || den2 != 0) {
            var x = 0;
            var y = 0;
            if (den1 == 0) {
                var s2 = (line.localPosition2.y - line.localPosition1.y) / den2;
                x = this.localPosition1.x;
                y = s2 * x - s2 * line.localPosition1.x + line.localPosition1.y;
            } else if (den2 == 0) {
                var s1 = (this.localPosition2.y - this.localPosition1.y) / den1;
                x = line.localPosition1.x;
                y = s1 * x - s1 * this.localPosition1.x + this.localPosition1.y;
            } else {
                var s1 = (this.localPosition2.y - this.localPosition1.y) / den1;
                var s2 = (line.localPosition2.y - line.localPosition1.y) / den2;
                x = (-s2 * line.localPosition1.x + line.localPosition1.y + s1 * this.localPosition1.x - this.localPosition1.y) / (s1 - s2);
                y = s1 * x - s1 * this.localPosition1.x + this.localPosition1.y;
            }
            var diff = new Vector(x - line.localPosition1.x, y - line.localPosition1.y);
            var ratio = line.localUnit.x != 0 ? diff.x / line.localUnit.x : 0;
            ratio = line.localUnit.y != 0 ? diff.y / line.localUnit.y : ratio;

            var diff = new Vector(x - this.localPosition1.x, y - this.localPosition1.y);
            var dot = diff.x * this.localUnit.x + diff.y * this.localUnit.y;
            var len = diff.x * diff.x + diff.y * diff.y;
    
            if ((s1 - s2) != 0 && ratio >= 0 && ratio <= line.ratio && dot > 0 && len <= this.lenNoSqrt) {
                return new Vector(x, y);
            }
        }
        return null;
    }

    hasIntersectionPoints() {
        this.intersectionCount = 0;
        this.addIntersection(this.player.fovLeft.intersect(this));
        if (this.localPosition1.y >= 0 && this.localPosition1.y <= this.player.fovTop.localPosition1.y) {
            var len = Math.sqrt(this.localPosition1.x * this.localPosition1.x + this.localPosition1.y * this.localPosition1.y);
            var degrees = Math.acos(this.localPosition1.x / len) * 180 / Math.PI;
            this.addIntersection(degrees >= 90 - this.player.fovDegrees && degrees <= 90 + this.player.fovDegrees ? this.localPosition1 : null);
        }
        this.addIntersection(this.player.fovTop.intersect(this));
        this.addIntersection(this.player.fovRight.intersect(this));
        if (this.localPosition2.y >= 0 && this.localPosition2.y <= this.player.fovTop.localPosition1.y) {
            var len = Math.sqrt(this.localPosition2.x * this.localPosition2.x + this.localPosition2.y * this.localPosition2.y);
            var degrees = Math.acos(this.localPosition2.x / len) * 180 / Math.PI;
            this.addIntersection(degrees >= 90 - this.player.fovDegrees && degrees <= 90 + this.player.fovDegrees ? this.localPosition2 : null);
        }
        if (this.intersectionCount >= 2) {
            this.intersectA = this.intersections[0];
            this.intersectB = this.intersections[this.intersectionCount - 1];
        }
        return this.intersectionCount >= 2;
    }

    addIntersection(pos) {
        if (pos != null) {
            this.intersections[this.intersectionCount++] = pos;
        }
    }

    getBounds(tanW, tanH, left, right, top, bottom) {
        var down = this.floor;
        var up = this.height - this.ceiling;
        var tmp1 = 1 / this.intersectB.y;
        var tmp2 = 1 / this.intersectA.y;
        var sxAUp = this.intersectB.x * tmp1 * tanW;
        var szAUp = (this.intersectB.z + up) * tmp1 * tanH;
        var sxBUp = this.intersectA.x * tmp2 * tanW;
        var szBUp = (this.intersectA.z + up) * tmp2 * tanH;
        var szADown = (this.intersectB.z + down) * tmp1 * tanH;
        var szBDown = (this.intersectA.z + down) * tmp2 * tanH;
        return {
            "left": Math.max(left, Math.min(sxAUp, sxBUp)), 
            "right": Math.min(right, Math.max(sxAUp, sxBUp)), 
            "top": Math.min(top, Math.max(szAUp, szBUp)), 
            "bottom": Math.max(bottom, Math.min(szADown, szBDown))};        
    }
}