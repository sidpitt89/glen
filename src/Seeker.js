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
    this.lastSeenLocation = null;
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

    if (!this.canSee(px, py)) {
      if (this.lastSeenLocation != null) {
        px = this.lastSeenLocation.x;
        py = this.lastSeenLocation.y;
      }
      else {
        this.vX = 0;
        this.vY = 0;
        return;
      }
    }

    this.lastSeenLocation = {x: px, y:py};
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

  canSee(tX, tY) {
    var can = true;
    var walls = this.game.walls;
    var p1 = {x: this.x, y: this.y};
    var p2 = {x: tX, y: tY};
    var p3;
    var p4;
    for (var i = 0; i < walls.length; i++) {
        p3 = {x: walls[i].x, y: walls[i].y + walls[i].h/2};
        p4 = {x: walls[i].x, y: walls[i].y - walls[i].h/2};
        can = can && !this.intersect(p1, p2, p3, p4);
    }

    return can;
  }

  // Line Segment Intersection Algorithm --- Move out to util class at some point
  // http://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
  /*
  def ccw(A,B,C):
    return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x)

  def intersect(A,B,C,D):
      return ccw(A,C,D) != ccw(B,C,D) and ccw(A,B,C) != ccw(A,B,D)
  */
  ccw(a, b, c) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  }

  intersect(a, b, c, d) {
    return (this.ccw(a, c, d) != this.ccw(b, c, d)) && (this.ccw(a, b, c) != this.ccw(a, b, d));
  }
}
