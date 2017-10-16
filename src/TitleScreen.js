class TitleScreen {
  constructor(game) {
    this.renderer = game.renderer;
    this.lineInfo = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.wallUniforms,
    };

    this.initLines();
  }

  initLines() {
    this.lineData = [
      // x, y, w, h
      [300, 570, 100, 10],
      [250, 520, 10, 100],
      [300, 470, 100, 10],
      [350, 490, 10, 40],
      [330, 510, 60, 10], //G
      [250, 400, 10, 100],
      [300, 350, 100, 10], // L
      [300, 330, 100, 10],
      [250, 280, 10, 100],
      [300, 230, 100, 10],
      [300, 280, 100, 10], // E
      [300, 200, 100, 10],
      [250, 160, 10, 100],
      [350, 155, 10, 90], // N

    ];

    this.lines = [];
    for (var i = 0; i < this.lineData.length; i++) {
      this.lineInfo.x = this.lineData[i][0];
      this.lineInfo.y = this.lineData[i][1];
      this.lineInfo.w = this.lineData[i][2];
      this.lineInfo.h = this.lineData[i][3];

      this.lines.push(new Entity(this.lineInfo));
    }
  }

  update(dT) {

  }

  render(r) {
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].render(r);
    }
  }
}
