class TimeDisplay {
  constructor(x, y, w, h, parent, info) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.parent = parent;

    this.countUp = info && info.hasOwnProperty("countUp") ? info.countUp : true;
    this.time = info && info.hasOwnProperty("time") ? info.time : 0;

    this.initialTime = this.time;
    this.running = false;
    this.interval = null;

    this.textWidth = 0;
    this.textHeight = 24;
    this.font = "14px monospace";
    this.fontColor = "white";
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.startTime = Date.now();
    this.interval = setInterval(() => this.updateTime(), 100);
  }

  pause() {
    if (!this.running) {
      return;
    }

    this.running = false;
    clearInterval(this.interval);
    this.interval = null;
  }

  updateTime() {
    var now = Date.now();
    var diff = (now - this.startTime) / 1000;

    this.startTime = now;

    if (this.countUp) {
      this.time += diff;
    }
    else {
      this.time -= diff;

      if (this.time <= 0) {
        this.time = 0;
        // TODO: do something... dispatch event and pause?
      }
    }

    this.time = Math.round(this.time * 100) / 100;

    this.parent.notifyChange(this);
  }

  render(ctx) {
    this.text = "Time: " + this.time;

    //TODO : remove this fill unless you really want a different BG color
    ctx.fillStyle = "#999999";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.font = this.font;
    var t = ctx.measureText(this.text);
    this.textWidth = Math.ceil(t.width) + 2;
    
    ctx.fillStyle = this.fontColor;
    ctx.textAlign = "center";
    ctx.textBaseAlign = "middle";

    ctx.fillText(this.text, this.x + (this.textWidth / 2 | 0), this.y + (this.textHeight / 2 | 0));
  }




}
