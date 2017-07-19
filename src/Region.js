class Region extends Entity{
  constructor(info) {
    super(info);

    this.cycleTime = 3600;
    this.cycleHalfTime = this.cycleTime / 2;
    this.cycleProgress = 0;

    this.minAlpha = 0.1;
    this.maxAlpha = 0.2;
    this.alphaRange = this.maxAlpha - this.minAlpha;
    this.currentAlpha = this.minAlpha;
    this.dA = 0;
  }

  update(dT) {
    this.cycleProgress += dT;
    if (this.cycleProgress >= this.cycleTime) {
      this.cycleProgress %= this.cycleTime;
    }

    this.dA = (dT / this.cycleHalfTime) * this.alphaRange;
  }

  render(r) {
    super.render(r);
  }

  setEntityUniforms() {
    // Alpha increases during first half and decreases during second.
    // Just in case anything goes wrong, clamp currentAlpha to the defined range
    if (this.cycleProgress < this.cycleHalfTime) {
      // this.currentAlpha = ((this.cycleProgress / this.cycleTime) * this.alphaRange);
      this.currentAlpha += this.dA;
      this.currentAlpha = Math.min(this.maxAlpha, this.currentAlpha);
    }
    else {
      // this.currentAlpha = this.maxAlpha - ((this.cycleProgress / this.cycleTime) * this.alphaRange);
      this.currentAlpha -= this.dA;
      this.currentAlpha = Math.max(this.minAlpha, this.currentAlpha);
    }

    this.uniforms.u_color[3] = this.currentAlpha;
  }
}
