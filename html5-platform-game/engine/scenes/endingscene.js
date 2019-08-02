function EndingScene(context, canvas, callback) {
    this.context = context;
    this.canvas = canvas;
    this.callback = callback;
    this.backgroundX1 = 0;
    this.backgroundX2 = Config.worldWidth;
    this.music = Assets.playAudio(Assets.end_music, true);
    this.animation = new Animation(4, 1);
    this.shipY = Config.worldHeight - 180;
    this.limitY = Config.worldHeight * 0.7;
    this.currTime = 0;
    this.finalTime = 0;
    this.letterColor = "red";
    this.isSaving = false;
    
    this.texts = [
        {x: Config.worldWidth / 2, y: Config.worldHeight, text: "You,ve just completed the game!", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 40, text: "Our little man from other galaxy", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 80, text: "have just got enough gold to departure", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 120, text: "to his home planet", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 160, text: "Thanks for playing and helping him", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 200, text: "to achieve his goal.", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 300, text: "Game Programming", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 340, text: "jahepi", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 440, text: "Game Assets", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 480, text: "Spider, Flying Monster & Beetle", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 520, text: "Stephen 'Redshrike' Challener", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 560, text: "https://opengameart.org/users/redshrike", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 660, text: "Skeleton & Zombie", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 700, text: "Artisticdude", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 740, text: "https://opengameart.org/users/artisticdude", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 840, text: "Spaceship", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 880, text: "shohan4556", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 920, text: "https://opengameart.org/users/shohan4546", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 1020, text: "Hero", red: 255, green: 255, blue: 61, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 1060, text: "http://www.gameart2d.com", red: 255, green: 255, blue: 255, size: 50, removed: false, to: 0, isRemovable: true},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 1300, text: "THE END", red: 0, green: 255, blue: 255, size: 80, removed: false, to: 150, isRemovable: false},
    ];
    
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
    this.creditsButtons = {
        A: {x: 100, y: Config.worldHeight - 10, size: 80, textIndex: 0},
        B: {x: 200, y: Config.worldHeight - 10, size: 80, textIndex: 0},
        C: {x: 300, y: Config.worldHeight - 10, size: 80, textIndex: 0},
    };
    this.instructions1 = "Touch letters to change nickname and save score";
    this.instructions2 = "Your final time is: ";
    this.letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    this.backBtn = {x: 700, y: Config.worldHeight - 30, width: 70, height: 25, text: "Exit"};
    this.saveTimeBtn = {x: 500, y: Config.worldHeight - 30, width: 170, height: 25, text: "Save Score"};
}

EndingScene.prototype.onMouseDown = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.onTouchEvent(event.clientX - rect.left, event.clientY - rect.top, true);
};

EndingScene.prototype.onMouseUp = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.onTouchEvent(event.clientX - rect.left, event.clientY - rect.top, false);
};

EndingScene.prototype.onMouseMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
};

EndingScene.prototype.onTouchStart = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    for (var i = 0; i < event.touches.length; i++) {
        this.onTouchEvent(event.touches[i].clientX - rect.left, event.touches[i].clientY - rect.top, true);
    }
};

EndingScene.prototype.onTouchEnd = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    for (var i = 0; i < event.touches.length; i++) {
        this.onTouchEvent(event.touches[i].clientX - rect.left, event.touches[i].clientY - rect.top, false);
    }
};

EndingScene.prototype.onTouchMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.touches[0].clientX - rect.left;
    this.mouseY = event.touches[0].clientY - rect.top;
};

EndingScene.prototype.onTouchEvent = function(x, y, pressed) {
    for (var i in this.creditsButtons) {
        var info = this.creditsButtons[i];
        var width = info.size;
        var height = info.size;
        var buttonX = info.x - info.size / 2;
        var buttonY = info.y - info.size;
        if (pressed && x <= buttonX + width && x >= buttonX && y >= buttonY && y <= buttonY + height) {
            this.creditsButtons[i].textIndex++;
            this.creditsButtons[i].textIndex = this.creditsButtons[i].textIndex % this.letters.length;
        }
    }
    if (pressed && x <= this.saveTimeBtn.x + this.saveTimeBtn.width && x >= this.saveTimeBtn.x 
            && y >= this.saveTimeBtn.y && y <= this.saveTimeBtn.y + this.saveTimeBtn.height) {
        this.saveScore();
    }
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

EndingScene.prototype.saveScore = function() {
    if (this.isSaving) {
        return;
    }
    this.isSaving = true;
    var nickname = "";
    for (var i in this.creditsButtons) {
        nickname += this.letters[this.creditsButtons[i].textIndex];
    }
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                self.saveTimeBtn.text = "Saved!!!!";
            } else {
                self.isSaving = false;
            }
        }
    };
    xhr.open("POST", Config.serverUrl + "/savePlatform.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("time=" + this.finalTime + "&name=" + nickname);
};

EndingScene.prototype.setFinalTime = function(time) {
    this.finalTime = time;
};

EndingScene.prototype.update = function(deltatime) {
    this.currTime += deltatime;
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
    
    if (this.shipY >= -50) {
        this.animation.update(deltatime);
        var key = "ship" + (this.animation.getFrame() + 1);
        this.context.drawImage(Assets.enemiesAtlas, Atlas.enemies[key].x, Atlas.enemies[key].y, Atlas.enemies[key].width, Atlas.enemies[key].height, Config.worldWidth - 100, this.shipY, Atlas.enemies[key].width * 2, Atlas.enemies[key].height * 2);
        this.shipY -= 10 * deltatime;
    }
    
    for (var i = 0; i < this.texts.length; i++) {
        if (this.texts[i].y <= this.texts[i].to && this.texts[i].isRemovable && !this.texts[i].removed) {
            this.texts[i].removed = true;
        }
        if (!this.texts[i].removed) {
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
    }
    
    this.context.font = "40px joystix";
    this.context.fillStyle = "white";
    this.context.textAlign = "left";
    this.context.fillText(this.instructions1, 10, Config.worldHeight - 100);
    this.context.fillStyle = "yellow";
    var time = this.finalTime;
    var hours = Math.floor(time / 3600);
    time %= 3600;
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    this.context.fillText(this.instructions2 + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds), 10, Config.worldHeight - 70);
    
    this.context.font = "40px joystix";
    this.context.fillStyle = "white";
    this.context.fillRect(this.saveTimeBtn.x, this.saveTimeBtn.y, this.saveTimeBtn.width, this.saveTimeBtn.height);
    this.context.fillStyle = "rgba(103, 113, 158, 1)";
    this.context.textAlign = "left";
    this.context.fillText(this.saveTimeBtn.text, this.saveTimeBtn.x + 15, this.saveTimeBtn.y + this.saveTimeBtn.height - 2);
    
    this.context.fillStyle = "white";
    this.context.fillRect(this.backBtn.x, this.backBtn.y, this.backBtn.width, this.backBtn.height);
    this.context.fillStyle = "rgba(103, 113, 158, 1)";
    this.context.textAlign = "left";
    this.context.fillText(this.backBtn.text, this.backBtn.x + 10, this.backBtn.y + this.backBtn.height - 2); 
    
    if (this.currTime >= 0.2) {
        this.currTime = 0;
        this.letterColor = this.letterColor === "red" ? "white" : "red";
    }
    
    for (var i in this.creditsButtons) {
        var button = this.creditsButtons[i];
        this.context.font = button.size + "px joystix";
        this.context.fillStyle = this.letterColor;
        this.context.textAlign = "center";
        this.context.fillText(this.letters[button.textIndex], button.x, button.y);
    }
};

