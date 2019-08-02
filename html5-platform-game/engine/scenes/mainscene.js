function MainScene(context, canvas, callback) {
    this.context = context;
    this.canvas = canvas;
    this.callback = callback;
    this.isLoading = true;
    this.isMouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.music = null;
    if (Assets.loaded && Atlas.loaded) {
        this.isLoading = false;
        this.music = Assets.playAudio(Assets.main_music, true);
    } else {
        Assets.loadAll(this.onLoadAssets.bind(this));
    }
    this.onMouseMoveRef = this.onMouseMove.bind(this);
    this.onMouseDownRef = this.onMouseDown.bind(this);
    this.onTouchStartRef = this.onTouchStart.bind(this);
    this.onMouseUpRef = this.onMouseUp.bind(this);
    this.canvas.addEventListener("mousemove", this.onMouseMoveRef);
    this.canvas.addEventListener("mousedown", this.onMouseDownRef);
    this.canvas.addEventListener("touchstart", this.onTouchStartRef);
    this.canvas.addEventListener("mouseup", this.onMouseUpRef);
    this.backgroundX1 = 0;
    this.backgroundX2 = Config.worldWidth;
    this.startIntro = false;
    this.soundTime = 0;
    this.soundTimeLimit = 0.5;
    
    this.texts = [
        {x: Config.worldWidth / 2, y: Config.worldHeight, text: "Once upon a time a man from other galaxy", red: 255, green: 255, blue: 255, size: 50, removed: false},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 40, text: "Had to land on the earth,", red: 255, green: 255, blue: 255, size: 50, removed: false}, 
        {x: Config.worldWidth / 2, y: Config.worldHeight + 80, text: "its ship ran out of fuel,", red: 255, green: 255, blue: 255, size: 50, removed: false}, 
        {x: Config.worldWidth / 2, y: Config.worldHeight + 120, text: "and the main source of it is gold.", red: 255, green: 255, blue: 255, size: 50, removed: false}, 
        {x: Config.worldWidth / 2, y: Config.worldHeight + 160, text: "He discovered several places", red: 255, green: 255, blue: 255, size: 50, removed: false},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 200, text: "where this resource can be found", red: 255, green: 255, blue: 255, size: 50, removed: false},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 240, text: "in form of coins, the problem is that", red: 255, green: 255, blue: 255, size: 50, removed: false},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 280, text: "in order to get them he has to", red: 255, green: 255, blue: 255, size: 50, removed: false},
        {x: Config.worldWidth / 2, y: Config.worldHeight + 320, text: "fight against some evil entities.", red: 255, green: 255, blue: 255, size: 50, removed: false},
    ];
    
    this.soundBtn = {x: Config.worldWidth - Config.worldWidth * 0.1, y: 0, width: Config.worldWidth * 0.1, height: Config.worldHeight * 0.1, text: "sound on", alpha: 1, font: "23px joystix"};
    this.playBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.3 / 2), y: Config.worldHeight / 2 - (Config.worldWidth * 0.3 / 2), width: Config.worldWidth * 0.3, height: Config.worldWidth * 0.1, text: "play game", alpha: 1, font: "70px joystix"};
    this.leaderBoardBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.3 / 2), y: Config.worldHeight - 150 - (Config.worldWidth * 0.1 / 2), width: Config.worldWidth * 0.3, height: Config.worldWidth * 0.1, text: "leaderboard", alpha: 1, font: "50px joystix"};
    this.creditsBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.3 / 2), y: Config.worldHeight - 10 - (Config.worldWidth * 0.1 / 2), width: Config.worldWidth * 0.3, height: Config.worldWidth * 0.1, text: "credits", alpha: 1, font: "50px joystix"};
}

MainScene.prototype.onLoadAssets = function() {
    Atlas.loadAll(this.onLoadAtlas.bind(this));
    this.music = Assets.playAudio(Assets.main_music, true);
};

MainScene.prototype.onLoadAtlas = function() {
    this.isLoading = false;
};

MainScene.prototype.onMouseMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
};

MainScene.prototype.onTouchStart = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.touches[0].clientX - rect.left;
    this.mouseY = event.touches[0].clientY - rect.top;
    this.isMouseDown = true;
};

MainScene.prototype.onMouseDown = function(event) {
    this.isMouseDown = true;
};

MainScene.prototype.onMouseUp = function(event) {
    this.isMouseDown = false;
};

MainScene.prototype.update = function(deltatime) {

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.imageSmoothingEnabled = false;
    
    if (!this.isLoading) {
 
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
        
        if (this.startIntro) {
            
            if (this.playBtn.alpha > 0) {
                this.playBtn.alpha -= 0.5 * deltatime;
            }
            
            if (this.playBtn.alpha <= 0) {
                var flag = false;
                for (var i = 0; i < this.texts.length; i++) {
                    if (this.texts[i].y <= 0 && !this.texts[i].removed) {
                        this.texts[i].removed = true;
                    }
                    if (!this.texts[i].removed) {
                        flag = true;
                        var alpha = this.texts[i].y / Config.worldHeight;
                        this.context.font = this.texts[i].size + "px joystix";
                        this.context.fillStyle = "rgba(" + this.texts[i].red + ", " + this.texts[i].green + ", " + this.texts[i].blue + ", " + alpha + ")";
                        this.context.textAlign = "center";
                        this.context.fillText(this.texts[i].text, this.texts[i].x, this.texts[i].y);
                        this.texts[i].y -= 30 * deltatime;
                    }
                }
                if (!flag) {
                    if (this.music !== null) {
                        this.music.stop();
                    }
                    this.callback("game", null);
                }
            }
        }
        
        if (this.mouseX >= this.soundBtn.x && this.mouseX <= this.soundBtn.x + this.soundBtn.width 
                && this.mouseY >= this.soundBtn.y && this.mouseY <= this.soundBtn.y + this.soundBtn.height) {          
            this.context.font = this.soundBtn.font;
            this.context.fillStyle = "rgba(255, 182, 193, " + this.playBtn.alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.soundBtn.text, this.soundBtn.x + this.soundBtn.width / 2, this.soundBtn.y + this.soundBtn.height / 2);          
        } else  {
            this.context.font = this.soundBtn.font;
            this.context.fillStyle = "rgba(255, 105, 180, " + this.playBtn.alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.soundBtn.text, this.soundBtn.x + this.soundBtn.width / 2, this.soundBtn.y + this.soundBtn.height / 2);
        }
        
        if (this.mouseX >= this.playBtn.x && this.mouseX <= this.playBtn.x + this.playBtn.width 
                && this.mouseY >= this.playBtn.y && this.mouseY <= this.playBtn.y + this.playBtn.height) {          
            this.context.font = this.playBtn.font;
            this.context.fillStyle = "rgba(255, 0, 0, " + this.playBtn.alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.playBtn.text, this.playBtn.x + this.playBtn.width / 2, this.playBtn.y + this.playBtn.height / 2);          
        } else  {
            this.context.font = this.playBtn.font;
            this.context.fillStyle = "rgba(255, 255, 255, " + this.playBtn.alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.playBtn.text, this.playBtn.x + this.playBtn.width / 2, this.playBtn.y + this.playBtn.height / 2);
        }
        
        if (this.mouseX >= this.leaderBoardBtn.x && this.mouseX <= this.leaderBoardBtn.x + this.leaderBoardBtn.width 
                && this.mouseY >= this.leaderBoardBtn.y && this.mouseY <= this.leaderBoardBtn.y + this.leaderBoardBtn.height) {          
            this.context.font = this.leaderBoardBtn.font;
            this.context.fillStyle = "rgba(103, 113, 158, 0.5)";
            this.context.textAlign = "center";
            this.context.fillText(this.leaderBoardBtn.text, this.leaderBoardBtn.x + this.leaderBoardBtn.width / 2, this.leaderBoardBtn.y + this.leaderBoardBtn.height / 2);       
        } else  {
            this.context.font = this.leaderBoardBtn.font;
            this.context.fillStyle = "rgba(103, 113, 158, " + this.playBtn.alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.leaderBoardBtn.text, this.leaderBoardBtn.x + this.leaderBoardBtn.width / 2, this.leaderBoardBtn.y + this.leaderBoardBtn.height / 2);
        }
        
        if (this.mouseX >= this.creditsBtn.x && this.mouseX <= this.creditsBtn.x + this.creditsBtn.width 
                && this.mouseY >= this.creditsBtn.y && this.mouseY <= this.creditsBtn.y + this.creditsBtn.height) {          
            this.context.font = this.creditsBtn.font;
            this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
            this.context.textAlign = "center";
            this.context.fillText(this.creditsBtn.text, this.creditsBtn.x + this.creditsBtn.width / 2, this.creditsBtn.y + this.creditsBtn.height / 2);       
        } else  {
            this.context.font = this.creditsBtn.font;
            this.context.fillStyle = "rgba(255, 0, 0, " + this.playBtn.alpha + ")";
            this.context.textAlign = "center";
            this.context.fillText(this.creditsBtn.text, this.creditsBtn.x + this.creditsBtn.width / 2, this.creditsBtn.y + this.creditsBtn.height / 2);
        }

        this.context.font = "35px joystix";
        this.context.fillStyle = "rgba(255, 255, 0, " + this.playBtn.alpha + ")";
        this.context.textAlign = "center";
        this.context.fillText("get all coins!", Config.worldWidth / 2, Config.worldHeight - 100);
        
        this.soundTime += deltatime;
        if (this.isMouseDown && this.mouseX <= this.soundBtn.x + this.soundBtn.width && this.mouseX >= this.soundBtn.x 
                && this.mouseY >= this.soundBtn.y && this.mouseY <= this.soundBtn.y + this.soundBtn.height) {
            if (this.soundTime > this.soundTimeLimit) {
                this.soundTime = 0;              
                if (this.music !== null) {
                    this.music.stop();
                    this.music = null;
                }
                if (Config.sound) {
                    Config.sound = false;
                    this.soundBtn.text = "sound off";
                } else {
                    Config.sound = true;
                    this.soundBtn.text = "sound on";
                    this.music = Assets.playAudio(Assets.main_music, true);
                }
            }
        }
        
        if (this.isMouseDown && this.mouseX <= this.playBtn.x + this.playBtn.width && this.mouseX >= this.playBtn.x 
                && this.mouseY >= this.playBtn.y && this.mouseY <= this.playBtn.y + this.playBtn.height) {
            this.canvas.removeEventListener("mousemove", this.onMouseMoveRef);
            this.canvas.removeEventListener("mousedown", this.onMouseDownRef);
            this.canvas.removeEventListener("touchstart", this.onTouchStartRef);
            this.canvas.removeEventListener("mouseup", this.onMouseUpRef);
            this.startIntro = true;
            this.mouseX = 0;
            this.mouseY = 0;
        }
        
        if (this.isMouseDown && this.mouseX <= this.leaderBoardBtn.x + this.leaderBoardBtn.width && this.mouseX >= this.leaderBoardBtn.x 
                && this.mouseY >= this.leaderBoardBtn.y && this.mouseY <= this.leaderBoardBtn.y + this.leaderBoardBtn.height) {
            this.canvas.removeEventListener("mousemove", this.onMouseMoveRef);
            this.canvas.removeEventListener("mousedown", this.onMouseDownRef);
            this.canvas.removeEventListener("touchstart", this.onTouchStartRef);
            this.canvas.removeEventListener("mouseup", this.onMouseUpRef);
            this.mouseX = 0;
            this.mouseY = 0;
            if (this.music !== null) {
                this.music.stop();
            }
            this.callback("leaderboard", null);
        } 
        
        if (this.isMouseDown && this.mouseX <= this.creditsBtn.x + this.creditsBtn.width && this.mouseX >= this.creditsBtn.x 
                && this.mouseY >= this.creditsBtn.y && this.mouseY <= this.creditsBtn.y + this.creditsBtn.height) {
            this.canvas.removeEventListener("mousemove", this.onMouseMoveRef);
            this.canvas.removeEventListener("mousedown", this.onMouseDownRef);
            this.canvas.removeEventListener("touchstart", this.onTouchStartRef);
            this.canvas.removeEventListener("mouseup", this.onMouseUpRef);
            this.mouseX = 0;
            this.mouseY = 0;
            if (this.music !== null) {
                this.music.stop();
            }
            this.callback("credits", null);
        } 
    } else {
        this.context.font = "50px joystix";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        if (!Assets.loaded) {
            this.context.fillText("Loading Assets " + parseInt(Assets.getLoadedRatio() * 100) + "%", Config.worldWidth / 2, Config.worldHeight / 2);
        } else if (!Atlas.loaded) {
            this.context.fillText("Loading XML Data " + parseInt(Atlas.getLoadedRatio() * 100) + "%", Config.worldWidth / 2, Config.worldHeight / 2);
        }
    }      
};