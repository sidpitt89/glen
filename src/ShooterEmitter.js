class ShooterEmitter extends Emitter {
  constructor(info) {
    super(info);
    this.projectiles = this.particles;
    this.boosted = false;

    this.boostedUniforms = {
      u_matrix: this.particleUniforms.u_matrix,
      u_color: [1.0, 0.7, 0.7, 1.0],
    };
  }

  setParticleUniforms(p) {
    this.particleUniforms.u_color[3] = Math.min(1, (1 - p.age/100));
    this.boostedUniforms.u_color[3] = Math.min(1, (1 - p.age/100));
  }

  renderParticle(r, p) {
    // Overriding this so individual particles can be colored separately
    this.setParticleUniforms(p);
    var m = this.particleUniforms.u_matrix;

    // Convert to screen coordinate space, move, and scale.
    r.m4.ortho(0, r.gl.canvas.width, 0, r.gl.canvas.height, -1, 1, m);
    r.m4.translate(m, [p.x, p.y, p.z], m);
    r.m4.scale(m, [p.scaleW, p.scaleH, 1], m);

    twgl.setUniforms(this.particleProgramInfo, p.boosted ? this.boostedUniforms : this.particleUniforms);
    twgl.drawBufferInfo(r.gl, this.particleBufferInfo, r.gl.TRIANGLE_STRIP);
  }

  addParticle(p) {
    if (this.boosted) {
      p.boosted = true;
    }
    this.game.soundManager.play("shoot");
    super.addParticle(p);
  }

  boost(region) {
    if (region && !this.boosted) {
      this.boosted = true;

      this.pW += 3;
      this.pH += 3;
      this.pVy += 0.2;
    }
    else if (!region && this.boosted) {
      this.boosted = false;

      this.pW = this.info.pW;
      this.pH = this.info.pH;
      this.pVy = this.info.pVy;
    }
  }
}
