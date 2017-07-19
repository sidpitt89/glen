class Shooter extends Entity {
  constructor(info) {
    super(info);

    this.shooting = false;
    this.emitter = new ShooterEmitter(info.emitterInfo);
    this.emitter.owner = this;

    this.rotation = 0;

    this.game.registerProjectileSource(this.emitter);

    // testing physics stuff
    this.momentumX = 0;
    this.momentumY = 0;
    this.forceX = 0;
    this.forceY = 0;
    this.mass = 1;
    this.drag = 0.01;
  }

  update(dT) {
    this.emitter.active = this.shooting;

    var oldX = this.x;
    var oldY = this.y;

    this.x += this.vX;
    this.y += this.vY;

    var walls = this.game.walls;
    for (var i = 0; i < walls.length; i++) {
      if (this.intersects(walls[i])) {
          this.x = oldX;
          this.y = oldY;
          this.vX = 0;
          this.vY = 0;
          break;
      }
    }

    if (Math.abs(this.vX)) {
      var ddirx = this.vX < 0 ? -1 : 1;
      if (!this.active) {
        ddirx *= 0.1;
      }
      this.vX -= (this.drag * ddirx);
      if (ddirx < 0 && this.vX > 0) {
        this.vX = 0;
      }
      else if (ddirx > 0 && this.vX < 0) {
        this.vX = 0;
      }
    }
    if (Math.abs(this.vY)) {
      var ddiry = this.vY < 0 ? -1 : 1;
      if (!this.active) {
        ddiry *= 0.1;
      }
      this.vY -= (this.drag * ddiry);
      if (ddiry < 0 && this.vY > 0) {
        this.vY = 0;
      }
      else if (ddiry > 0 && this.vY < 0) {
        this.vY = 0;
      }
    }

    // sync up emitter position
    this.emitter.x = this.x;
    this.emitter.y = this.y;
    this.emitter.z = this.z;
    this.emitter.update(dT);
  }

  render(r) {
    this.emitter.render(r);

    this.setEntityUniforms();
    twgl.setBuffersAndAttributes(r.gl, this.programInfo, this.bufferInfo);

    var m = this.uniforms.u_matrix;

    // Convert to screen coordinate space, translate and scale
    r.m4.ortho(0, r.gl.canvas.width, 0, r.gl.canvas.height, -1, 1, m);
    r.m4.translate(m, [this.x, this.y, this.z], m);
    r.m4.rotateZ(m, this.rotation, m);
    r.m4.scale(m, [this.scaleW, this.scaleH, 1], m);

    twgl.setUniforms(this.programInfo, this.uniforms);
    twgl.drawBufferInfo(r.gl, this.bufferInfo, r.gl.TRIANGLE_STRIP);
  }

  updateAim(x, y) {
    // Change rotation to point at (x, y)
    var yDif = y - this.y;
    var xDif = x - this.x;

    this.rotation = Math.atan2(yDif, xDif) - (Math.PI / 2);
    this.emitter.rotation = this.rotation;
  }

  applyForce(x, y) {
    // Delta Momentum = Force * Delta Time :::> assume dT is some magic number for now
    // this.momentumX += (f * x);
    // this.momentumY += (f * y);
    this.vX += x;
    this.vY += y;
  }
}
