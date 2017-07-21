class Emitter extends Entity {
  constructor(info) {
    super(info);

    // Required Fields!
    this.particleProgramInfo = info.particleProgramInfo;
    this.particleBufferInfo = info.particleBufferInfo;
    this.particleUniforms = info.particleUniforms;

    // Fields with defaults (albeit nonsensical ones)
    this.pW = info.pW || 0;
    this.pH = info.pH || 0;
    this.pTime = info.pTime || 0;
    this.maxP = info.maxP || 0; // Poorly named -- max number of particles
    this.pWait = info.pWait || 0;
    this.pVx = info.pVx || 0;
    this.pVy = info.pVy || 0;
    this.pVRand = info.pVRand || 0;
    this.active = info.active || true;
    this.pMaxAge = info.pMaxAge || 300;

    this.particles = info.particles || [];
    this.newParticles = [];

    this.rotation = 0;
    this.owner = null;
  }

  update(dT) {
    this.pTime += dT;

    // Check if another particle should be emitted
    if (this.pTime >= this.pWait) {
      this.pTime = this.pTime - this.pWait;

      // Simply delete oldest particles.
      // TODO: Maybe move this out to a function so this behavior can be overridden?
      if (this.particles.length >= this.maxP) {
        this.particles.shift();
      }

      if (this.active) {
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);

        var vx = this.pVx + (this.pVRand * Math.random() * (Math.random() > 0.5 ? -1 : 1));
        var vy = this.pVy + (this.pVRand * Math.random());
        var vxA = c * vx - s * vy;
        var vyA = s * vx + c * vy;
        if (this.owner) {
          var c2 = Math.cos(this.rotation + Math.PI / 4); // TODO: Seems like it should be PI/2, but this is actually correct. Why??
          var s2 = Math.sin(this.rotation + Math.PI / 4);
          var f = 0.01;
          // this.owner.applyForce(-(c * f - s * f), -(s * f + c * f));

          this.owner.applyForce(-(c2 * f - s2 * f), -(s2 * f + c2 * f));
        }
        var newParticle = {
          x: this.x,
          y: this.y,
          z: this.z,
          w: this.pW,
          h: this.pH,
          scaleW: this.pW / 2, // NOTE: see Entity.js scaleW/scaleH for more info
          scaleH: this.pH / 2, // NOTE:  ^^^^^^^
          vX: vxA,
          vY: vyA,
          vZ: 0,
          age: 0,
        };
        this.addParticle(newParticle);
      }
    }

    var p = null;
    var deadParticles = [];
    for (var i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      p.x += p.vX * dT;
      p.y += p.vY * dT;
      // p.z += p.vZ * dT; NOTE: just ignoring z for now.

      p.age += 1;

      if (p.age > this.pMaxAge) {
        deadParticles.push(p);
      }
    }

    for (var j = 0; j < deadParticles.length; j++) {
      this.particles.splice(this.particles.indexOf(deadParticles[j]), 1);
    }
  }

  render(r) {
    twgl.setBuffersAndAttributes(r.gl, this.particleProgramInfo, this.particleBufferInfo);
    for (var i = 0; i < this.particles.length; i++) {
      this.renderParticle(r, this.particles[i]);
    }
  }

  renderParticle(r, p) {
    // if (p.spent) {
    //   return;
    // }
    // var s = p.age / 800; // 0.19;
    // var s = 0.05; // 0.19;
    // r.m4.identity(r.world);
    // r.m4.translate(r.world, [p.x, p.y, p.z], r.world);
    // // m4.rotateY(world, p.r.y, world);
    // r.m4.scale(r.world, [s, s, s], r.world);
    // r.m4.multiply(r.viewProjection, r.world, r.uniforms.u_matrix);

    this.setParticleUniforms(p);
    var m = this.particleUniforms.u_matrix;

    // Convert to screen coordinate space, move, and scale.
    r.m4.ortho(0, r.gl.canvas.width, 0, r.gl.canvas.height, -1, 1, m);
    r.m4.translate(m, [p.x, p.y, p.z], m);
    r.m4.scale(m, [p.scaleW, p.scaleH, 1], m);

    twgl.setUniforms(this.particleProgramInfo, this.particleUniforms);
    twgl.drawBufferInfo(r.gl, this.particleBufferInfo, r.gl.TRIANGLE_STRIP);
  }

  setParticleUniforms(p) {
      // Called just before a particle is drawn. Just in case you want to change
      // the uniforms on a per-particle basis.
      // Example: this.particleUniforms.u_color[3] = Math.min(1, (1 - p.age/100));
  }

  addParticle(p) {
    this.particles.push(p);
  }
}
