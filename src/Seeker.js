class Seeker extends Entity{
  constructor(info) {
    super(info);

    this.health = info.health || 5;
    this.dead = false;
    this.explosionSource = false;
    this.rZ = 0.0;
    this.rVz = Math.random() * 0.2;

    this.oVx = this.vX || 0.5;
    this.oVy = this.vY || 0.5;

    this.umtWait = 5;
    this.waitCount = 0;
    // this.movementBounds = info.movementBounds || [0, 0, 0, 0]; // Left, right, top, bottom
  }

  update(dT) {
    if (this.waitCount++ > this.umtWait) {
      this.waitCount = 0;
      this.updateMovementTarget();
    }
    this.rZ += this.rVz;
    this.x += this.vX;
    this.y += this.vY;

    // var walls = this.game.walls;
    // var hitWall = false;
    // for (var i = 0; i < walls.length; i++) {
    //   if (this.intersects(walls[i])) {
    //     this.x -= this.vX;
    //     if (this.x <= walls[i].x) {
    //       this.x = walls[i].x - (walls[i].w / 2) - (this.w / 2) - 1;
    //     }
    //     else {
    //       this.x = walls[i].x + (walls[i].w/2) +  (this.w / 2) + 1;
    //     }
    //
    //     this.vX *= -1;
    //     hitWall = true;
    //     break;
    //   }
    // }
    // if (hitWall) {
    //   return;
    // }
    // if (this.x >= this.movementBounds[1] || this.x <= this.movementBounds[0]) {
    //   this.vX *= -1;
    // }
  }

  render(r) {
    this.setEntityUniforms();
    twgl.setBuffersAndAttributes(r.gl, this.programInfo, this.bufferInfo);

    var m = this.uniforms.u_matrix;

    // Convert to screen coordinate space, translate and scale
    r.m4.ortho(0, r.gl.canvas.width, 0, r.gl.canvas.height, -1, 1, m);
    r.m4.translate(m, [this.x, this.y, this.z], m);
    r.m4.rotateZ(m, this.rZ, m);
    r.m4.scale(m, [this.scaleW, this.scaleH, 1], m);

    twgl.setUniforms(this.programInfo, this.uniforms);
    twgl.drawBufferInfo(r.gl, this.bufferInfo, r.gl.TRIANGLE_STRIP);
  }

  updateMovementTarget() {
    var px = this.game.shooter.x;
    var py = this.game.shooter.y;

    var t = Math.atan2(py - this.y, px - this.x);
    this.vX = this.oVx * Math.cos(t);
    this.vY = this.oVy * Math.sin(t);
  }

  setEntityUniforms() {
    this.uniforms.u_color[3] = 0.5 + (0.1 * this.health);
  }

  takeDamage(amt) {
    if (!amt) {
      amt = 1;
    }
    this.health -= amt;
    if (this.health <= 0) {
      this.health = 0;
      this.dead = true;
    }
  }
}
