class Entity {
  constructor(info) {
    this.info = info;

    // No sensible defaults for these.
    this.programInfo = info.programInfo;
    this.bufferInfo = info.bufferInfo;
    this.uniforms = info.uniforms;

    // Basic positioning / dimensions
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;
    this.w = info.w || 0;
    this.h = info.h || 0;
    this.vX = info.vX || 0;
    this.vY = info.vY || 0;

    // TODO: is this necessary here?
    this.r = info.r || 0;

    // Derived fields
    this.scaleW = this.w / 2; // NOTE: Assumption is that clip space coordinates are defined
    this.scaleH = this.h / 2; // NOTE: with the range [-1, 1] being equal to the width/height

    // Required / No Defaults
    this.game = info.game;

    this.drawObject = null;
  }

  update(dT) {
    // To be overridden
  }

  render(r) {
    // To be overridden, unless you want this basic logic
    this.setEntityUniforms();
    twgl.setBuffersAndAttributes(r.gl, this.programInfo, this.bufferInfo);

    var m = this.uniforms.u_matrix;

    // Convert to screen coordinate space, translate and scale
    r.m4.ortho(0, r.gl.canvas.width, 0, r.gl.canvas.height, -1, 1, m);
    r.m4.translate(m, [this.x, this.y, this.z], m);
    r.m4.scale(m, [this.scaleW, this.scaleH, 1], m);

    twgl.setUniforms(this.programInfo, this.uniforms);
    twgl.drawBufferInfo(r.gl, this.bufferInfo, r.gl.TRIANGLE_STRIP);
  }

  setEntityUniforms() {
    // Called just before an Entity is drawn. Just in case you want to change
    // the uniforms on a per-Entity basis.
    // Example: this.uniforms.u_color[3] = 0.5 + (0.1 * this.health);
  }

  intersects(entity) {
    // Basic check if two rectangles intersect
    // NOTE: (x, y) is assumed as the center of an Entity.
    return (this.x - this.w / 2 <= (entity.x + entity.w / 2) &&
            entity.x - entity.w / 2 <= (this.x + this.w / 2) &&
            this.y + this.h / 2 >= (entity.y - entity.h / 2) &&
            entity.y + entity.h / 2 >= (this.y - this.h / 2));
  }

  // distanceTo(entity) {
  //   return Math.sqrt(Math.pow(this.x - entity.x, 2) + Math.pow(this.y - entity.y, 2));
  // }
}
