function GameScene(context, canvas, callback) {
    this.context = context;
    this.canvas = canvas;
    this.callback = callback;
    this.controller = new GameController();
    this.render = new GameRender(this.context, this.canvas, this.controller);
    this.onKeyDownRef = this.onKeyDown.bind(this);
    this.onKeyUpRef = this.onKeyUp.bind(this);
    this.mouseX = 0;
    this.mouseY = 0;
    this.left = this.right = this.up = this.down = false;
    this.showLevelTextTime = 0;
    this.showLevelTextTimeLimit = 3;
    document.onkeydown = this.onKeyDownRef;
    document.onkeyup = this.onKeyUpRef;
    this.onMouseDownRef = this.onMouseDown.bind(this);
    this.onMouseUpRef = this.onMouseUp.bind(this);
    this.onTouchStartRef = this.onTouchStart.bind(this);
    this.onTouchEndRef = this.onTouchEnd.bind(this);
    this.onTouchMoveRef = this.onTouchMove.bind(this);
    this.onMouseMoveRef = this.onMouseMove.bind(this);
    this.canvas.addEventListener("mousemove", this.onMouseMoveRef);
    this.canvas.addEventListener("touchmove", this.onTouchMoveRef);
    this.canvas.addEventListener("mousedown", this.onMouseDownRef);
    this.canvas.addEventListener("mouseup", this.onMouseUpRef);
    this.canvas.addEventListener("touchstart", this.onTouchStartRef);
    this.canvas.addEventListener("touchend", this.onTouchEndRef);
    this.controlButtons = {
        a_button: {x: Config.worldWidth - 180, y: Config.worldHeight - 90, width: 80, height: 80, atlas: Atlas.gui["a_2"]},
        b_button: {x: Config.worldWidth - 90, y: Config.worldHeight - 90, width: 80, height: 80, atlas: Atlas.gui["b_2"]},
        left_button: {x: 10, y: Config.worldHeight - 110, width: 60, height: 60, atlas: Atlas.gui["left_2"]},
        right_button: {x: 100, y: Config.worldHeight - 110, width: 60, height: 60, atlas: Atlas.gui["right_2"]},
        down_button: {x: 55, y: Config.worldHeight - 70, width: 60, height: 60, atlas: Atlas.gui["down_2"]},
        up_button: {x: 55, y: Config.worldHeight - 150, width: 60, height: 60, atlas: Atlas.gui["up_2"]},
    };
    this.looseBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.7) / 2, y: Config.worldHeight / 2 - (Config.worldHeight * 0.2) / 2, width: Config.worldWidth * 0.7, height: Config.worldHeight * 0.2, text: "Ouch!, try again?", font: "60px joystix"};
    this.winBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.7) / 2, y: Config.worldHeight / 2 - (Config.worldHeight * 0.2) / 2, width: Config.worldWidth * 0.7, height: Config.worldHeight * 0.2, text: "Ready for next level!? Touch!", font: "60px joystix"};
    this.lastLevelBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.7) / 2, y: Config.worldHeight / 2 - (Config.worldHeight * 0.2) / 2, width: Config.worldWidth * 0.7, height: Config.worldHeight * 0.2, text: "You got all the gold! Touch!", font: "60px joystix"};
}

GameScene.prototype.onMouseDown = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.onTouchEvent(event.clientX - rect.left, event.clientY - rect.top, true);
};

GameScene.prototype.onMouseUp = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.onTouchEvent(event.clientX - rect.left, event.clientY - rect.top, false);
};

GameScene.prototype.onMouseMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
};

GameScene.prototype.onTouchStart = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    for (var i = 0; i < event.touches.length; i++) {
        this.onTouchEvent(event.touches[i].clientX - rect.left, event.touches[i].clientY - rect.top, true);
    }
};

GameScene.prototype.onTouchEnd = function(event) {
    if (this.showLevelTextTime < this.showLevelTextTimeLimit) return;
    this.left = this.right = this.up = this.down = false;
    var rect = this.canvas.getBoundingClientRect();
    for (var i = 0; i < event.touches.length; i++) {
        this.onTouchEvent(event.touches[i].clientX - rect.left, event.touches[i].clientY - rect.top, false);
    }
    if (!this.left) this.controller.moveLeft(false);
    if (!this.right) this.controller.moveRight(false);
    if (!this.up) this.controller.moveUp(false);
    if (!this.down) this.controller.moveDown(false);
};

GameScene.prototype.onTouchMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.touches[0].clientX - rect.left;
    this.mouseY = event.touches[0].clientY - rect.top;
};

GameScene.prototype.onKeyDown = function(e) {
    if (this.showLevelTextTime < this.showLevelTextTimeLimit) return;
    e = e || window.event;
    if (e.keyCode === 32) this.controller.jump();
    if (e.keyCode === 37) this.controller.moveLeft(true);
    if (e.keyCode === 39) this.controller.moveRight(true);
    if (e.keyCode === 38) this.controller.moveUp(true);
    if (e.keyCode === 40) this.controller.moveDown(true);
    if (e.keyCode === 65) this.controller.shoot();
};

GameScene.prototype.onKeyUp = function(e) {
    if (this.showLevelTextTime < this.showLevelTextTimeLimit) return;
    e = e || window.event;
    if (e.keyCode === 37) this.controller.moveLeft(false);
    if (e.keyCode === 39) this.controller.moveRight(false);
    if (e.keyCode === 38) this.controller.moveUp(false);
    if (e.keyCode === 40) this.controller.moveDown(false);
};

GameScene.prototype.onTouchEvent = function(x, y, pressed) {
    if (this.showLevelTextTime < this.showLevelTextTimeLimit) return;
    for (var i in this.controlButtons) {
        var info = this.controlButtons[i];
        var width = info.width;
        var height = info.height;
        var buttonX = info.x;
        var buttonY = info.y;
        if (x <= buttonX + width && x >= buttonX && y >= buttonY && y <= buttonY + height) {
            if (i === "a_button" && pressed) {
                this.controller.jump();
            } else if (i === "b_button" && pressed) {
                this.controller.shoot();
            } else if (i === "left_button") {
                if (!pressed) this.left = true;
                this.controller.moveLeft(pressed);
            } else if (i === "right_button") {
                if (!pressed) this.right = true;
                this.controller.moveRight(pressed);
            } else if (i === "up_button") {
                if (!pressed) this.up = true;
                this.controller.moveUp(pressed);
            } else if (i === "down_button") {
                if (!pressed) this.down = true;
                this.controller.moveDown(pressed);
            }
        }
    }
    if (this.render.isHeroDead() && x <= this.looseBtn.x + this.looseBtn.width && x >= this.looseBtn.x 
            && y >= this.looseBtn.y && y <= this.looseBtn.y + this.looseBtn.height) {
        this.showLevelTextTime = 0;
        this.controller.initLevel();
    }
    if (this.render.isCurrentLevelFinish() && !this.render.isLastLevel() && x <= this.winBtn.x + this.winBtn.width && x >= this.winBtn.x 
            && y >= this.winBtn.y && y <= this.winBtn.y + this.winBtn.height) {
        this.showLevelTextTime = 0;
        this.controller.nextLevel();
    }
    if (this.render.isCurrentLevelFinish() && this.render.isLastLevel() && x <= this.lastLevelBtn.x + this.lastLevelBtn.width && x >= this.lastLevelBtn.x 
            && y >= this.lastLevelBtn.y && y <= this.lastLevelBtn.y + this.lastLevelBtn.height) {
        this.canvas.removeEventListener("mousedown", this.onMouseDownRef);
        this.canvas.removeEventListener("mouseup", this.onMouseUpRef);
        this.canvas.removeEventListener("touchstart", this.onTouchStartRef);
        this.canvas.removeEventListener("touchend", this.onTouchEndRef);
        this.canvas.removeEventListener("touchmove", this.onTouchMoveRef);
        this.canvas.removeEventListener("mousemove", this.onMouseMoveRef);
        document.onkeydown = null;
        document.onkeyup = null;
        this.controller.currentLevel.dispose(true);
        this.callback("ending", this.controller.time);
    }
};

GameScene.prototype.update = function(deltatime) {
    
    if (this.showLevelTextTime < this.showLevelTextTimeLimit) {
        this.showLevelTextTime += deltatime;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = "50px joystix";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(this.controller.currentLevel.levelName, Config.worldWidth / 2, Config.worldHeight / 2);
    } else {
        this.render.update(deltatime);
        
        if (this.controller.currentLevel.isCheckpoint) {
            this.context.font = "40px joystix";
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 10;
            this.context.strokeText("Checkpoint reached", Config.worldWidth / 2, 50);
            this.context.fillStyle = 'blue';
            this.context.fillText("Checkpoint reached", Config.worldWidth / 2, 50);
        }
        
        this.context.fillStyle = 'white';
        this.context.font = "60px joystix";
        this.context.fillText(this.controller.currentLevel.currentNumberOfCoins + "/" + this.controller.currentLevel.totalNumberOfCoins, 150, 50);
        this.context.drawImage(Assets.tilesAtlas, Atlas.tiles["coin_01"].x, Atlas.tiles["coin_01"].y, Atlas.tiles["coin_01"].width, Atlas.tiles["coin_01"].height, 10, 10, 60, 60);
        this.context.fillStyle = 'green';
        this.context.font = "25px joystix";
        this.context.fillText("fps: " + Math.floor(1 / deltatime), Config.worldWidth - 50, 15);

        // Time
        var time = this.controller.time;
        var hours = Math.floor(time / 3600);
        time %= 3600;
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60);
        this.context.fillStyle = 'white';
        this.context.font = "40px joystix";
        this.context.fillText("Time " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds), Config.worldWidth - 200, 20);
        
        
        this.context.beginPath();
        this.context.moveTo(Config.worldWidth - 30, 50);
        this.context.arc(Config.worldWidth - 30, 50, 25, 0, (2 * Math.PI) * this.controller.hero.getLifeRatio());
        this.context.lineTo(Config.worldWidth - 30, 50);
        this.context.fillStyle = 'red';
        this.context.fill();

        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 4;
        this.context.arc(Config.worldWidth - 30, 50, 25, 0, (2 * Math.PI));
        this.context.stroke();
    }
    
    if (this.render.isHeroDead()) {
    
        if (this.mouseX >= this.looseBtn.x && this.mouseX <= this.looseBtn.x + this.looseBtn.width 
                && this.mouseY >= this.looseBtn.y && this.mouseY <= this.looseBtn.y + this.looseBtn.height) {
            this.context.font = this.looseBtn.font;
            this.context.strokeStyle = 'red';
            this.context.lineWidth = 20;
            this.context.strokeText(this.looseBtn.text, this.looseBtn.x + this.looseBtn.width / 2, this.looseBtn.y + this.looseBtn.height / 2);
            this.context.fillStyle = "white";
            this.context.fillText(this.looseBtn.text, this.looseBtn.x + this.looseBtn.width / 2, this.looseBtn.y + this.looseBtn.height / 2); 
        } else  {
            this.context.font = this.looseBtn.font;
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 20;
            this.context.strokeText(this.looseBtn.text, this.looseBtn.x + this.looseBtn.width / 2, this.looseBtn.y + this.looseBtn.height / 2);
            this.context.fillStyle = "red";
            this.context.fillText(this.looseBtn.text, this.looseBtn.x + this.looseBtn.width / 2, this.looseBtn.y + this.looseBtn.height / 2);
        }
        
    } else if (this.render.isCurrentLevelFinish()) {

        if (this.render.isLastLevel()) {
            
            if (this.mouseX >= this.lastLevelBtn.x && this.mouseX <= this.lastLevelBtn.x + this.lastLevelBtn.width
                    && this.mouseY >= this.lastLevelBtn.y && this.mouseY <= this.lastLevelBtn.y + this.lastLevelBtn.height) {
                this.context.font = this.lastLevelBtn.font;
                this.context.strokeStyle = '#00E500';
                this.context.lineWidth = 20;
                this.context.strokeText(this.lastLevelBtn.text, this.lastLevelBtn.x + this.lastLevelBtn.width / 2, this.lastLevelBtn.y + this.lastLevelBtn.height / 2);
                this.context.fillStyle = "white";
                this.context.fillText(this.lastLevelBtn.text, this.lastLevelBtn.x + this.lastLevelBtn.width / 2, this.lastLevelBtn.y + this.lastLevelBtn.height / 2); 
            } else  {
                this.context.font = this.lastLevelBtn.font;
                this.context.strokeStyle = 'white';
                this.context.lineWidth = 20;
                this.context.strokeText(this.lastLevelBtn.text, this.lastLevelBtn.x + this.lastLevelBtn.width / 2, this.lastLevelBtn.y + this.lastLevelBtn.height / 2);
                this.context.fillStyle = '#00E500';
                this.context.fillText(this.lastLevelBtn.text, this.lastLevelBtn.x + this.lastLevelBtn.width / 2, this.lastLevelBtn.y + this.lastLevelBtn.height / 2);
            }
            
        } else {
        
            if (this.mouseX >= this.winBtn.x && this.mouseX <= this.winBtn.x + this.winBtn.width
                    && this.mouseY >= this.winBtn.y && this.mouseY <= this.winBtn.y + this.winBtn.height) {
                this.context.font = this.winBtn.font;
                this.context.strokeStyle = '#00E500';
                this.context.lineWidth = 20;
                this.context.strokeText(this.winBtn.text, this.winBtn.x + this.winBtn.width / 2, this.winBtn.y + this.winBtn.height / 2);
                this.context.fillStyle = "white";
                this.context.fillText(this.winBtn.text, this.winBtn.x + this.winBtn.width / 2, this.winBtn.y + this.winBtn.height / 2); 
            } else  {
                this.context.font = this.winBtn.font;
                this.context.strokeStyle = 'white';
                this.context.lineWidth = 20;
                this.context.strokeText(this.winBtn.text, this.winBtn.x + this.winBtn.width / 2, this.winBtn.y + this.winBtn.height / 2);
                this.context.fillStyle = '#00E500';
                this.context.fillText(this.winBtn.text, this.winBtn.x + this.winBtn.width / 2, this.winBtn.y + this.winBtn.height / 2);
            }
        }
    } else {
        if (this.showLevelTextTime > this.showLevelTextTimeLimit) {
            for (var i in this.controlButtons) {
                var info = this.controlButtons[i];
                this.context.drawImage(Assets.guiAtlas, info.atlas.x, info.atlas.y, info.atlas.width, info.atlas.height, info.x, info.y, info.width, info.height);
            }
        }
    }
};