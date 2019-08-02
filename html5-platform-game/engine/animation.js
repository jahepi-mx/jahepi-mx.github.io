function Animation(frames, numberOfSequencesPerSec) {
    this.time = 0;
    this.count = 0;
    this.frames = frames;
    this.stopped = false;
    this.numberOfSequencesPerSec = numberOfSequencesPerSec;
    this.sequences = 0;
    this.stopAtSequence = -1;
    this.stopAtSequenceCallback = null;
}

Animation.prototype.update = function(deltatime) {
    if (!this.stopped) {
        var fps = 1 / deltatime;
        var ratio = fps / this.numberOfSequencesPerSec;
        this.time += deltatime;
        if (this.time >= (ratio / this.frames) / fps) {
            this.count++;
            this.count %= this.frames;
            if (this.count === 0) {
                this.sequences++;
            }
            this.time = 0;
        }
    }
    if (this.sequences === this.stopAtSequence) {
        this.stopped = true;
        this.sequences = 0;
        if (this.stopAtSequenceCallback !== null) {
            this.stopAtSequenceCallback();
        }
    }
};

Animation.prototype.stopAtSequenceNumber = function(n, callback) {
    this.stopAtSequence = n; 
    this.stopAtSequenceCallback = callback;
};

Animation.prototype.getFrame = function() {
    return this.count;
};

Animation.prototype.stop = function() {
    this.stopped = true;
};

Animation.prototype.isStopped = function() {
    return this.stopped;
};

Animation.prototype.lastFrame = function() {
    return this.frames - 1;
};

Animation.prototype.getNumberOfSequences = function() {
    return this.sequences;
};

Animation.prototype.reset = function() {
    this.count = 0;
    this.stopped = false;
    this.sequences = 0;
    this.time = 0;
};