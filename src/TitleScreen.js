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
      [84, 360, 120, 5],
      [24, 300, 5, 125],
      [84, 240, 120, 5],
      [144, 270, 5, 65],
      [114, 300, 60, 5], //G
      [168, 300, 5, 125],
      [228, 240, 120, 5], // L
      [372, 360, 120, 5],
      [312, 300, 5, 125],
      [372, 240, 120, 5],
      [372, 300, 120, 5], // E
      [516, 360, 120, 5],
      [456, 300, 5, 125],
      [576, 300, 5, 125], // N

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
