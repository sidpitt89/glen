class RedBarrel extends Enemy{
  constructor(info) {
    super(info);
    this.movementBounds = info.movementBounds || [0, 0, 0, 0]; // Left, right, top, bottom

    this.blastSpeed = 4;
    this.blastRadius = 40;
    this.blastDamage = 5;
    this.explosionSource = true;
    this.exploding = false;

    this.startingWidth = this.w;
    this.startingHeight = this.h;
  }

  update(dT) {
    if (!this.exploding && this.health <= 0) {
      this.exploding = true;
    }

    if (this.exploding) {
      if ((this.w - this.startingWidth) / 2 >= this.blastRadius) {
        this.dead = true;
      }
      else {
        this.w += this.blastSpeed;
        this.h += this.blastSpeed;
        this.scaleW = this.w / 2;
        this.scaleH = this.h / 2;
      }
    }
  }

  render(r) {
    super.render(r);
  }

  setEntityUniforms() {
    if (this.exploding) {
      this.drawObject.uniforms.u_color[3] = 1.0;
    }
    else {
      this.drawObject.uniforms.u_color[3] = 0.5 + (0.1 * this.health);
    }
  }

  takeDamage(amt) {
    if (!amt) {
      amt = 1;
    }
    this.health -= amt;
    if (this.health <= 0) {
      this.health = 0;
    }
  }
}
