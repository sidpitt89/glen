class MenuButton {
  constructor(x, y, w, h, text, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.onClick = onClick;

    this.font = "14px monospace";
    this.fontColor = "white";
  }

  handleMouseDown(x, y) {
    if (x >= this.x && x < this.x + this.w
        && y >= this.y && y < this.y + this.h) {
      this.onClick();
    }
  }

  render(r) {
    r.fillStyle = "#AEAE55";
    r.fillRect(this.x, this.y, this.w, this.h);

    r.font = this.font;
    var t = r.measureText(this.text);
    this.textWidth = Math.ceil(t.width) + 2;
    r.fillStyle = this.fontColor;
    r.textAlign = "center";
    r.textBaseAlign = "middle";
    r.fillText(this.text, this.x + (this.w / 2), this.y + (this.h / 2));
  }
}
