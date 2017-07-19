class ShooterEmitter extends Emitter {
  constructor(info) {
    super(info);
    this.projectiles = this.particles;
  }

  setParticleUniforms(p) {
    this.particleUniforms.u_color[3] = Math.min(1, (1 - p.age/100));
  }
}
