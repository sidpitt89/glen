class TextField {
  constructor(x, y, text, parent) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.needsUpdate = true;
    this.textWidth = 0;
    this.textHeight = 24;

    this.parent = parent;

    this.font = "14px monospace";
    this.fontColor = "white";
  }

  updateText(text) {
    this.text = text;
    this.needsUpdate = true;

    this.parent.dirty();
  }

  update(ctx) {
    if (!this.needsUpdate) {
      return;
    }

    ctx.font = this.font;
    var t = ctx.measureText(this.text);
    this.textWidth = Math.ceil(t.width) + 2;

    this.needsUpdate = false;
  }

  render(ctx) {
    if (this.needsUpdate) {
      this.update(ctx);
    }

    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.textAlign = "center";
    ctx.textBaseAlign = "middle";
    ctx.fillText(this.text, this.x + (this.textWidth / 2 | 0), this.y + (this.textHeight / 2 | 0));
  }
}
