function Hero(x, y, width, height, collisionSteps, camera) {
    this.x = x;
    this.y = y;
    this.centerX = Config.worldWidth / 2 - width / 2;
    this.centerY = Config.worldHeight / 2 + height / 2;
    this.width = width;
    this.height = height;
    this.friction = 0.80;
    this.movingLeft = false;
    this.movingRight = false;
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityXOrig = 200;
    this.velocityYOrig = -200;
    this.collisionSteps = collisionSteps;
    this.isJumping = false;
    this.isShooting = false;
    this.isOnLadder = false;
    this.isOnMovingPlatform = false;
    this.isUp = false;
    this.isDown = false;
    this.shootingTime = 0;
    this.shootingTimeLimit = 1 / 3;
    this.damageTime = 0;
    this.damageTimeLimit = 1;
    this.direction = 1;
    this.camera = camera;
    this.isDead = false;
    this.isDamage = false;
    this.blasts = [];
    this.life = 3;
    this.origLife = this.life;
    
    this.idleAnimation = new Animation(10, 1);
    this.runAnimation = new Animation(7, 1);
    this.jumpAnimation = new Animation(10, 1);
    this.jumpShootAnimation = new Animation(5, 1);
    this.runShootAnimation = new Animation(9, 1);
    this.shootAnimation = new Animation(4, 1);
    this.deadAnimation = new Animation(10, 1);
    this.deadAnimation.stopAtSequenceNumber(1, null);
    this.damageAnimation = new Animation(10, 3);
    this.damageAnimation.stopAtSequenceNumber(1, null);
}

Hero.prototype.update = function(deltatime) {
    
    this.damageTime += deltatime;
    
    if (this.isShooting) {
        this.shootingTime += deltatime;
    }
    
    if (this.damageAnimation.isStopped()) {
        this.isDamage = false;
        this.damageAnimation.reset();
    }
    
    if (this.shootingTime >= this.shootingTimeLimit) {
        this.isShooting = false;
    }
    
    if (this.isDead) {
        this.movingLeft = this.movingRight = false;
        this.deadAnimation.update(deltatime);
    } else if (this.isDamage) {
        this.damageAnimation.update(deltatime);
    } else {
        this.idleAnimation.update(deltatime);
        this.runAnimation.update(deltatime);
        this.jumpAnimation.update(deltatime);
        this.jumpShootAnimation.update(deltatime);
        this.runShootAnimation.update(deltatime);
        this.shootAnimation.update(deltatime);
    }
    
    for (var i = 0; i < this.blasts.length; i++) {
        if (this.blasts[i].isDisposable) {
            this.blasts[i] = null;
            this.blasts.splice(i, 1);
        } else {
            this.blasts[i].update(deltatime);
        }
    }
    
    if (this.movingRight || this.movingLeft) {
        this.velocityX = this.velocityXOrig;
    }
    if (this.direction === 1) {
        this.velocityX = Math.abs(this.velocityX);
    }
    if (this.direction === -1) {
        this.velocityX = -Math.abs(this.velocityX);
    } 
    
    if (this.isOnLadder) {
        this.velocityY = 0;
    }
    
    if (this.isOnLadder && this.isDown) {
        this.velocityY = 100;
    }
    
    if (this.isOnLadder && this.isUp) {
        this.velocityY = -100;
    }
    
    if (this.isOnLadder === false && this.isOnMovingPlatform === false) {
        this.velocityY += Config.gravity * deltatime;
    }
};

Hero.prototype.updateXFriction = function(deltatime) {
    var fps = 1 / deltatime;
    var ratio = fps / 60;
    if (ratio > 1) {
        ratio = 1;
    }
    this.friction = 0.80 * ratio;
    this.velocityX *= this.friction;
};

Hero.prototype.updateX = function(deltatime) {
    this.x += (this.velocityX / this.collisionSteps) * deltatime;
};

Hero.prototype.updateY = function(deltatime) {
    this.y += (this.velocityY / this.collisionSteps) * deltatime;
};

Hero.prototype.jump = function() {
    if (this.isDead || this.isOnLadder || this.velocityY > 0) {
        return;
    }
    if (!this.isJumping) {
        Assets.playAudio(Assets.jump_sound, false);
        this.isJumping = true;
        this.velocityY = this.velocityYOrig;
    }
};

Hero.prototype.setJumping = function(bool) {
    if (bool === false) {
        if (this.velocityY >= 0) {
            this.velocityY = 0;
            this.isJumping = bool;
        }
    } else {
        this.isJumping = bool;
    }
};

Hero.prototype.shoot = function() {
    if (this.isDead) {
        return;
    }
    if (!this.isShooting) {
        Assets.playAudio(Assets.hero_laser_sound, false);
        this.shootingTime = 0;
        this.isShooting = true;
        this.blasts.push(new HeroBlast(this.centerX, this.centerY, this.camera, this.direction, this.movingLeft, this.movingRight, this.isUp, this.isDown));
    }
};

Hero.prototype.left = function() {
    return this.centerX;
};

Hero.prototype.right = function() {
    return this.centerX + this.width;
};

Hero.prototype.top = function() {
    return this.centerY;
};

Hero.prototype.bottom = function() {
    return this.centerY + this.height;
};

Hero.prototype.moveUp = function(bool) {
    this.isUp = bool;
};

Hero.prototype.moveDown = function(bool) {
    this.isDown = bool;
};

Hero.prototype.moveRight = function(bool) {
    if (this.isDead) {
        return;
    }
    if (bool) {
        this.direction = 1;
        this.velocityX = this.velocityXOrig;
    }
    this.movingRight = bool;
};

Hero.prototype.moveLeft = function(bool) {
    if (this.isDead) {
        return;
    }
    if (bool) {
        this.direction = -1;
        this.velocityX = this.velocityXOrig;
    }
    this.movingLeft = bool;
};

Hero.prototype.die = function() {
    this.isDead = true;
}

Hero.prototype.getLifeRatio = function() {
    return this.life / this.origLife;
};

Hero.prototype.collide = function(entity) {
    if (this.isDead) return;
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = (this.width / 2 + entity.width / 2) * 0.7;
    var sizeY = (this.height / 2 + entity.height / 2) * 0.7;
    if (diffX < sizeX && diffY < sizeY && this.damageTime > this.damageTimeLimit) {
        this.damageTime = 0;
        this.life -= entity.damagePoints;
        if (this.life <= 0) {
            this.life = 0;
            this.die();
        } else {
            this.isDamage = true;
        }
    }
};

Hero.prototype.draw = function(context) {
    if (Config.debug) {
        context.fillStyle = "blue";
        context.fillRect(this.centerX, this.centerY, this.width, this.height);
    } else {
        var key = "";
        if (this.isDead) {
            key = "dead" + ((this.deadAnimation.stopped ? this.deadAnimation.lastFrame() : this.deadAnimation.getFrame()) + 1);
        } else if (this.isDamage) {
            key = "dead" + ((this.damageAnimation.stopped ? this.damageAnimation.lastFrame() : this.damageAnimation.getFrame()) + 1);
        } else if (this.isJumping && this.isShooting) {
            key = "jump_shoot" + (this.jumpShootAnimation.getFrame() + 1);
        } else if (this.isJumping) {
            key = "jump" + (this.jumpAnimation.getFrame() + 1);
        } else if (!this.movingLeft && !this.movingRight && !this.isJumping && this.isShooting) {
            key = "shoot" + (this.shootAnimation.getFrame() + 1);
        } else if (!this.movingLeft && !this.movingRight && !this.isJumping) {
            key = "idle" + (this.idleAnimation.getFrame() + 1);
        } else if((this.movingLeft || this.movingRight) && this.isShooting) {
            key = "run_shoot" + (this.runShootAnimation.getFrame() + 1);
        } else if (this.movingLeft || this.movingRight) {
            key = "run" + (this.runAnimation.getFrame() + 1);
        }
        
        if (key !== "") {
            if (this.direction === -1) {
                context.save();
                context.scale(this.direction, 1);
                context.drawImage(Assets.heroAtlas, Atlas.hero[key].x, Atlas.hero[key].y, Atlas.hero[key].width, Atlas.hero[key].height, - this.centerX - this.width, this.centerY, this.width, this.height);
                context.restore();
            } else {
                context.drawImage(Assets.heroAtlas, Atlas.hero[key].x, Atlas.hero[key].y, Atlas.hero[key].width, Atlas.hero[key].height, this.centerX, this.centerY, this.width, this.height);
            }
        }
        
        for (var i = 0; i < this.blasts.length; i++) {
            this.blasts[i].draw(context);
        }
    }    
};

Hero.prototype.resetState = function() {
    this.isDead = false;
    this.isJumping = false;
    this.isOnLadder = false;
    this.isDown = false;
    this.isUp = false;
    this.isShooting = false;
    this.deadAnimation.reset();
    this.damageAnimation.reset();
    this.direction = 1;
    this.velocityX = 0;
    this.velocityY = 0;
    this.life = this.origLife;
    this.blasts = [];
    this.isDamage = false;
    this.isOnMovingPlatform = false;
    this.movingRight = false;
    this.movingLeft = false;
};