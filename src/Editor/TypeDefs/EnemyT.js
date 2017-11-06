class EnemyT {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.initInfo();
  }

  initInfo() {
    var info = {
      x: this.x,
      y: this.y
    };
    switch (this.type) {
      case 0:
        info.color = "red";
        info.w = 8;
        info.h = 8;
        break;
      default:
        info.color = "blue";
        info.w = 8;
        info.h = 8;
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