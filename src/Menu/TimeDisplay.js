class TimeDisplay extends TextField {
  constructor(x, y, parent, info) {
    super(x, y, "", parent);

    this.countUp = info && info.hasOwnProperty("countUp") ? info.countUp : true;
    this.time = info && info.hasOwnProperty("time") ? info.time : 0;

    this.initialTime = this.time;
    this.running = false;
    this.interval = null;
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

    this.time = Math.round(this.time * 10) / 10;

    this.parent.dirty();
  }

  addZero(n) {
    return (n.indexOf(".") == -1) ? (Number(n)).toFixed(1).toString() : n;
  }

  render(ctx) {
    this.text = "Time: " + this.addZero("" + this.time);

    ctx.font = this.font;
    var t = ctx.measureText(this.text);
    this.textWidth = Math.ceil(t.width) + 2;

    ctx.fillStyle = this.fontColor;
    ctx.textAlign = "center";
    ctx.textBaseAlign = "middle";

    ctx.fillText(this.text, this.x + (this.textWidth / 2 | 0), this.y + (this.textHeight / 2 | 0));
  }




}
