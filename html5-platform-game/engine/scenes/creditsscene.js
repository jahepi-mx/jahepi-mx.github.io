function CreditsScene(context, canvas, callback) {
    this.context = context;
    this.canvas = canvas;
    this.callback = callback;
    this.backgroundX1 = 0;
    this.backgroundX2 = Config.worldWidth;
    this.music = Assets.playAudio(Assets.end_music, true);
    this.limitY = Config.worldHeight * 0.7;
    
    var start = Config.worldHeight * .75;
    this.texts = [
        {x: Config.worldWidth / 2, y: start, text: "Game Programming", red: 255, green: 255, blue: 61, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 40, text: "jahepi", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 140, text: "Game Assets", red: 255, green: 255, blue: 61, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 180, text: "Spider, Flying Monster & Beetle", red: 255, green: 255, blue: 61, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 220, text: "Stephen 'Redshrike' Challener", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 260, text: "https://opengameart.org/users/redshrike", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 360, text: "Skeleton & Zombie", red: 255, green: 255, blue: 61, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 400, text: "Artisticdude", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 440, text: "https://opengameart.org/users/artisticdude", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 540, text: "Spaceship", red: 255, green: 255, blue: 61, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 580, text: "shohan4556", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 620, text: "https://opengameart.org/users/shohan4546", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 720, text: "Hero", red: 255, green: 255, blue: 61, size: 50, yOrig: 0, to: -50},
        {x: Config.worldWidth / 2, y: start + 760, text: "http://www.gameart2d.com", red: 255, green: 255, blue: 255, size: 50, yOrig: 0, to: -50},
    ];
    for (var i = 0; i < this.texts.length; i++) {
        this.texts[i].yOrig = this.texts[i].y;
    }
    
    this.mouseX = 0;
    this.mouseY = 0;
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
    this.backBtn = {x: Config.worldWidth / 2 - 180 / 2, y: Config.worldHeight - 30, width: 180, height: 25, text: "Back to Main"};
}

CreditsScene.prototype.onMouseDown = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.onTouchEvent(event.clientX - rect.left, event.clientY - rect.top, true);
};

CreditsScene.prototype.onMouseUp = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.onTouchEvent(event.clientX - rect.left, event.clientY - rect.top, false);
};

CreditsScene.prototype.onMouseMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
};

CreditsScene.prototype.onTouchStart = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    for (var i = 0; i < event.touches.length; i++) {
        this.onTouchEvent(event.touches[i].clientX - rect.left, event.touches[i].clientY - rect.top, true);
    }
};

CreditsScene.prototype.onTouchEnd = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    for (var i = 0; i < event.touches.length; i++) {
        this.onTouchEvent(event.touches[i].clientX - rect.left, event.touches[i].clientY - rect.top, false);
    }
};

CreditsScene.prototype.onTouchMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.touches[0].clientX - rect.left;
    this.mouseY = event.touches[0].clientY - rect.top;
};

CreditsScene.prototype.onTouchEvent = function(x, y, pressed) {
    if (pressed && x <= this.backBtn.x + this.backBtn.width && x >= this.backBtn.x 
            && y >= this.backBtn.y && y <= this.backBtn.y + this.backBtn.height) {
        this.canvas.removeEventListener("mousedown", this.onMouseDownRef);
        this.canvas.removeEventListener("mouseup", this.onMouseUpRef);
        this.canvas.removeEventListener("touchstart", this.onTouchStartRef);
        this.canvas.removeEventListener("touchend", this.onTouchEndRef);
        this.canvas.removeEventListener("touchmove", this.onTouchMoveRef);
        this.canvas.removeEventListener("mousemove", this.onMouseMoveRef);
        if (this.music !== null) {
            this.music.stop();
        }
        this.callback("main", null);
    }
};

CreditsScene.prototype.update = function(deltatime) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.imageSmoothingEnabled = false;
    this.context.drawImage(Assets.tilesAtlas, Atlas.tiles.moonlight_background.x, Atlas.tiles.moonlight_background.y, Atlas.tiles.moonlight_background.width, Atlas.tiles.moonlight_background.height, 0, 0, this.canvas.width, this.canvas.height);
        
    this.context.drawImage(Assets.tilesAtlas, Atlas.tiles.ground_background.x, Atlas.tiles.ground_background.y, Atlas.tiles.ground_background.width, Atlas.tiles.ground_background.height, this.backgroundX1, 0, this.canvas.width + 5, this.canvas.height);
    this.context.drawImage(Assets.tilesAtlas, Atlas.tiles.ground_background.x, Atlas.tiles.ground_background.y, Atlas.tiles.ground_background.width, Atlas.tiles.ground_background.height, this.backgroundX2, 0, this.canvas.width + 5, this.canvas.height);

    this.backgroundX1 -= 50 * deltatime;
    this.backgroundX2 -= 50 * deltatime;
    if (this.backgroundX1 + Config.worldWidth <= 0) {
        this.backgroundX1 = Config.worldWidth;
    }
    if (this.backgroundX2 + Config.worldWidth <= 0) {
        this.backgroundX2 = Config.worldWidth;
    }
    
    for (var i = 0; i < this.texts.length; i++) {
        if (this.texts[i].y <= this.texts[i].to) {
            if (i === this.texts.length - 1) {
                for (var e = 0; e < this.texts.length; e++) {
                    this.texts[e].y = this.texts[e].yOrig;
                }
            }
        }
        if (this.texts[i].y < this.limitY) {
            var alpha = 1.3 - this.texts[i].y / this.limitY;
            this.context.font = this.texts[i].size + "px joystix";
            this.context.fillStyle = "rgba(" + this.texts[i].red + ", " + this.texts[i].green + ", " + this.texts[i].blue + ", " + alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.texts[i].text, this.texts[i].x, this.texts[i].y);
        }
        if (this.texts[i].y >= this.texts[i].to) {
            this.texts[i].y -= 30 * deltatime;
        }
    }
    this.context.fillStyle = "white";
    this.context.font = "45px joystix";
    this.context.fillRect(this.backBtn.x, this.backBtn.y, this.backBtn.width, this.backBtn.height);
    this.context.fillStyle = "rgba(103, 113, 158, 1)";
    this.context.textAlign = "left";
    this.context.fillText(this.backBtn.text, this.backBtn.x + 5, this.backBtn.y + this.backBtn.height - 1); 
};
