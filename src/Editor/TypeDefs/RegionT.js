class RegionT {
  constructor(x, y, w, h, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.initInfo();
  }

  initInfo() {
    var info = {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h
    };
    switch (this.type) {
      case 0:
        info.color = "#77FF77";
        break;
      default:
        info.color = "blue";
    }

    this.info = info;
  }

  update() {

  }

  render(ctx) {
    var i = this.info;
    ctx.fillStyle = i.color;
    ctx.fillRect(i.x - i.w / 2, i.y - i.h / 2, i.w, i.h);
  }
}
