HeroBlast.rightCos = Math.cos(0);
HeroBlast.rightSin = Math.sin(0);
HeroBlast.rightUpCos = Math.cos(Math.PI / 180 * 30);
HeroBlast.rightUpSin = Math.sin(Math.PI / 180 * 30);
HeroBlast.upCos = Math.cos(Math.PI / 2);
HeroBlast.upSin = Math.sin(Math.PI / 2);
HeroBlast.leftUpCos = Math.cos(Math.PI / 180 * 150);
HeroBlast.leftUpSin = Math.sin(Math.PI / 180 * 150);
HeroBlast.leftCos = Math.cos(Math.PI);
HeroBlast.leftSin = Math.sin(Math.PI);
HeroBlast.leftDownCos = Math.cos(Math.PI / 180 * 210);
HeroBlast.leftDownSin = Math.sin(Math.PI / 180 * 210);
HeroBlast.downCos = Math.cos(Math.PI / 180 * 270);
HeroBlast.downSin = Math.sin(Math.PI / 180 * 270);
HeroBlast.rightDownCos = Math.cos(Math.PI / 180 * 330);
HeroBlast.rightDownSin = Math.sin(Math.PI / 180 * 330);

function HeroBlast(x, y, camera, direction, left, right, up, down) {
    this.width = 30;
    this.height = 20;
    this.direction = direction;
    this.x = x + (this.direction === -1 ? 0 : this.width);
    this.y = y + this.height / 2;
    this.camera = camera;
    this.cameraOrigY = this.camera.y;
    this.cameraOrigX = this.camera.x;
    this.velocity = 300;
    this.collided = false;
    this.isDisposable = false;
    this.blastAnimation = new Animation(5, 1.5);
    this.blastExplosionAnimation = new Animation(6, 2);
    this.blastExplosionAnimation.stopAtSequenceNumber(1, this.onStopExplosionAnimation.bind(this));
    this.traveledX = 0;
    this.traveledY = 0;
    this.ratioX = HeroBlast.leftCos;
    this.ratioY = HeroBlast.leftSin;
    
    if (right && down) {
        this.ratioX = HeroBlast.leftDownCos;
        this.ratioY = HeroBlast.leftDownSin;
    } else if (right && up) {
        this.ratioX = HeroBlast.leftUpCos;
        this.ratioY = HeroBlast.leftUpSin;
    } else if (left && down) {
        this.ratioX = HeroBlast.rightDownCos;
        this.ratioY = HeroBlast.rightDownSin;
    } else if (left && up) {
        this.ratioX = HeroBlast.rightUpCos;
        this.ratioY = HeroBlast.rightUpSin;
    } else if (right) {
        this.ratioX = HeroBlast.leftCos;
        this.ratioY = HeroBlast.leftSin;
    } else if (left) {
        this.ratioX = HeroBlast.rightCos;
        this.ratioY = HeroBlast.rightSin;
    } else if (up) {
        this.ratioX = HeroBlast.upCos;
        this.ratioY = HeroBlast.upSin;
    } else if (down) {
        this.ratioX = HeroBlast.downCos;
        this.ratioY = HeroBlast.downSin;
    } else {
        if (this.direction === -1) {
            this.ratioX = HeroBlast.rightCos;
            this.ratioY = HeroBlast.rightSin;
        }
    }
}

HeroBlast.prototype.onStopExplosionAnimation = function() {
    this.isDisposable = true;
};

HeroBlast.prototype.update = function(deltatime) {
    
    if (Math.abs(this.traveledX) >= 600) {
        this.collided = true;
    }
    
    if (!this.isDisposable) {
        if (this.collided) {
            this.blastExplosionAnimation.update(deltatime);
        } else {
            this.blastAnimation.update(deltatime);
            this.traveledX += this.velocity * this.ratioX * deltatime;
            this.traveledY += this.velocity * this.ratioY * deltatime; 
        }
    }
};

HeroBlast.prototype.draw = function(context) {
    if (!this.isDisposable) {
        var y = this.y - this.traveledY - (this.camera.y - this.cameraOrigY);
        var x = this.x - this.traveledX - (this.camera.x - this.cameraOrigX);
        if (this.collided) {
            var key = "explo_" + (this.blastExplosionAnimation.getFrame() + 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, x, y, this.width, this.height); 
        } else {
            var key = "spin_" + (this.blastAnimation.getFrame() + 1);
            context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, x, y, this.width, this.height);
        }
    }
};

HeroBlast.prototype.collide = function(entity) {
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = this.width / 2 + entity.width / 2;
    var sizeY = this.height / 2 + entity.height / 2;
    if (diffX < sizeX && diffY < sizeY) {
        if (!this.collided) {
            Assets.playAudio(Assets.explosion_sound, false);
        }
        this.collided = true;
    }
};

HeroBlast.prototype.left = function() {
    return this.x - this.traveledX - (this.camera.x - this.cameraOrigX);
};

HeroBlast.prototype.right = function() {
    return (this.x + this.width) - this.traveledX - (this.camera.x - this.cameraOrigX);
};

HeroBlast.prototype.top = function() {
    return this.y - this.traveledY - (this.camera.y - this.cameraOrigY);
};

HeroBlast.prototype.bottom = function() {
    return (this.y + this.height) - this.traveledY - (this.camera.y - this.cameraOrigY);
};