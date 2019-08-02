function LeaderBoardScene(context, canvas, callback) {
    this.context = context;
    this.canvas = canvas;
    this.callback = callback;
    this.isMouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isLoading = true;
    this.errorLoading = false;
    this.music = Assets.playAudio(Assets.main_music, true);
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
    
    this.backBtn = {x: Config.worldWidth / 2 - (Config.worldWidth * 0.3 / 2), y: Config.worldHeight - 5 - (Config.worldWidth * 0.1 / 2), width: Config.worldWidth * 0.3, height: Config.worldWidth * 0.1, text: "Back to Main", alpha: 1};
    this.leaderBoardData = [];
    this.loadJSON();
}

LeaderBoardScene.prototype.onMouseMove = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
};

LeaderBoardScene.prototype.onTouchStart = function(event) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.touches[0].clientX - rect.left;
    this.mouseY = event.touches[0].clientY - rect.top;
    this.isMouseDown = true;
};

LeaderBoardScene.prototype.onMouseDown = function(event) {
    this.isMouseDown = true;
};

LeaderBoardScene.prototype.onMouseUp = function(event) {
    this.isMouseDown = false;
};

LeaderBoardScene.prototype.update = function(deltatime) {

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
    
    this.context.font = "40px joystix";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    if (this.isLoading) {
        this.context.fillText("Loading Leaderboard data...", Config.worldWidth / 2, Config.worldHeight / 2);
    } else {
        if (this.errorLoading) {
            this.context.fillText("Could not retrieve leaderboard data.", Config.worldWidth / 2, Config.worldHeight / 2);
        } else {
            if (this.leaderBoardData.length > 0) {
                
                this.context.font = "60px joystix";
                this.context.fillText("TOP 10 TIMES", Config.worldWidth / 2, 40);
                var yStart = 80;
                for (var i = 0; i < this.leaderBoardData.length; i++) {
                    this.context.font = "50px joystix";
                    this.context.fillStyle = 'red';
                    this.context.textAlign = "left";
                    this.context.fillText(this.leaderBoardData[i].name, 270, yStart);
                    
                    var time = this.leaderBoardData[i].time;
                    var hours = Math.floor(time / 3600);
                    time %= 3600;
                    var minutes = Math.floor(time / 60);
                    var seconds = Math.floor(time % 60);
                    this.context.fillStyle = 'white';
                    this.context.font = "50px joystix";
                    this.context.fillText((hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds), Config.worldWidth - 400, yStart);
                    yStart += 35;
                }                
            } else {
                this.context.fillText("No data found.", Config.worldWidth / 2, Config.worldHeight / 2);
            }
        }
    }
    
    this.context.font = "50px joystix";
    this.context.fillStyle = "rgba(103, 113, 158, " + this.backBtn.alpha + ")";
    this.context.textAlign = "center";
    this.context.fillText(this.backBtn.text, this.backBtn.x + this.backBtn.width / 2, this.backBtn.y + this.backBtn.height / 2);

    if (this.isMouseDown && this.mouseX <= this.backBtn.x + this.backBtn.width && this.mouseX >= this.backBtn.x 
            && this.mouseY >= this.backBtn.y && this.mouseY <= this.backBtn.y + this.backBtn.height) {
        this.canvas.removeEventListener("mousemove", this.onMouseMoveRef);
        this.canvas.removeEventListener("mousedown", this.onMouseDownRef);
        this.canvas.removeEventListener("touchstart", this.onTouchStartRef);
        this.canvas.removeEventListener("mouseup", this.onMouseUpRef);
        this.mouseX = 0;
        this.mouseY = 0;
        if (this.music !== null) {
            this.music.stop();
        }
        this.callback("main", null);
    } else {
        this.isMouseDown = false;
    }          
};

LeaderBoardScene.prototype.loadJSON = function() {
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onreadystatechange = function() {
        self.isLoading = false;
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var object = JSON.parse(xhr.responseText);
                self.leaderBoardData = object.times; 
            } else {
                self.errorLoading = true;
            }
        }
    };
    xhr.open("GET", Config.serverUrl + "/getPlatform.php", true);
    xhr.send();
};