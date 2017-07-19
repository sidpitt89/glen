class Renderer {
  constructor(parent) {
    this.parent = parent;
    twgl.setAttributePrefix("a_"); // Not sure if this is super important..
    this.m4 = twgl.m4;
    this.canvas = document.getElementById("canvas");
    this.gl = twgl.getWebGLContext(this.canvas, {
      alpha: false,
      premultipliedAlpha: false,
    });
    // Turn on blending!
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    this.programInfoBasic = twgl.createProgramInfo(this.gl, ["vs", "fs"]);

    // TODO: Right now only one shader is used, so I'm just calling this here
    // one time. but
    this.gl.useProgram(this.programInfoBasic.program);

    this.u_matrix = this.m4.identity();

    this.arrays = {
      position: [
        -1, -1, -1,
        -1,  1, -1,
        -1,  1,  1,
        -1, -1,  1,
         1, -1,  1,
         1,  1,  1,
      ],
      indices: {
        numComponents: 2,
        data: [
          0, 1, 1, 2, 2, 3, 3, 0,
          4, 5, 5, 2, 2, 3, 3, 4,
          4, 0, 5, 1,
        ],
      },
    };
    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.arrays);

    this.boxArrays = {
      position: [
        -1, -1, -1,
         1, -1, -1,
        -1,  1, -1,
         1,  1, -1,
        -1, -1,  1,
         1, -1,  1,
        -1,  1,  1,
         1,  1,  1,
      ],
      indices: {
        numComponents: 2,
        data: [
          0, 1, 1, 3, 3, 2, 2, 0,
          4, 5, 5, 7, 7, 6, 6, 4,
          0, 4, 1, 5, 2, 6, 3, 7,
        ],
      },
    };
    this.boxBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.boxArrays);

    // Basic square
    this.squareArrays = {
      position: [
        -1,  1, 1,
        -1, -1, 1,
         1,  1, 1,
         1, -1, 1,
      ],
      indices: {
        numComponents: 1,
        data: [
          0, 1, 2, 3,
        ],
      },
    };
    this.squareBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.squareArrays);

    // this.shooterArrays = {
    //   position: [
    //     -1,  1, 1,
    //     -1, -1, 1,
    //      1,  1, 1,
    //      1, -1, 1,
    //   ],
    //   indices: {
    //     numComponents: 1,
    //     data: [
    //       0, 1, 2, 3,
    //     ],
    //   },
    // };
    // this.shooterBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.shooterArrays);

    // Hexagon/pentagon hybrid
    this.shooterArrays = {
      position: [
          -1, .33,  1,
        -.33,   1,  1,
         .33,   1,  1,
          1,  .33,  1,
          1, -.33,  1,
          0,   -1,  1,
         -1, -.33,  1,
      ],
      indices: {
        numComponents: 1,
        data: [
          6, 0, 5, 1, 4, 2, 3,
        ],
      },
    };
    this.shooterBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.shooterArrays);

    // Just another square for now.
    this.enemyArrays = {
      position: [
        -1,  1, 1,
        -1, -1, 1,
         1,  1, 1,
         1, -1, 1,
      ],
      indices: {
        numComponents: 1,
        data: [
          0, 1, 2, 3,
        ],
      },
    };
    this.enemyBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.enemyArrays);

    this.uniforms = {
      u_matrix: this.m4.identity(),
      u_color: [0.7, 0.7, 1, 0.6],
    };

    this.shooterUniforms = {
      u_matrix: this.m4.identity(),
      u_color: [0.5, 0.5, 1, 1.0],
    };

    this.bulletUniforms = {
      u_matrix: this.m4.identity(),
      u_color: [0.7, 0.7, 1, 0.6],
    };

    this.enemyUniforms = {
      u_matrix: this.m4.identity(),
      u_color: [0.9, 0.5, 0.7, 1.0],
    };
    this.barrelUniforms = {
      u_matrix: this.m4.identity(),
      u_color: [1, 0.5, 0.5, 1.0],
    };
    this.wallUniforms = {
      u_matrix: this.m4.identity(),
      u_color: [1, 1, 0.5, 1.0],
    };
    this.regionUniforms = {
      u_matrix: this.m4.identity(),
      u_color: [0.5, 1, 0.5, 0.1],
    }

    // TODO: evaluate if these are necessary, now that the focus is primarily on
    // TODO: two-dimensional creations.
    this.camera = this.m4.identity();
    this.view = this.m4.identity();
    this.world = this.m4.identity();
    this.local = this.m4.identity();
    this.projection = this.m4.identity();
    this.viewProjection = this.m4.identity();
    this.eye = [0, 0, 10];
    this.target = [0, 0, 0];
    this.up = [0, 1, 0];

    // Background color -- Does this affect anything beyond that?
    this.clearColor = [0.2, 0.4, 0.8, 1];
  }

  /**
    Called before anything else is rendered.
  **/
  startRender() {
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // this.gl.useProgram(this.programInfo.program);

    // TODO: Evaluate if this is useful anywhere.
    this.m4.ortho(0, this.gl.canvas.width, 0, this.gl.canvas.height, -1, 1, this.world);

    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    // var maxFieldOfViewX = 50 * Math.PI / 180;
    // var fieldOfViewY = 30 * Math.PI / 180;
    //
    // // Compute the field of view for X
    // var fieldOfViewX = 2 * Math.atan(Math.tan(fieldOfViewY * 0.5) * aspect);
    //
    // // If it's too wide then use our maxFieldOfViewX to compute a fieldOfViewY
    // if (fieldOfViewX > maxFieldOfViewX) {
    //   fieldOfViewY = 2 * Math.atan(Math.tan(maxFieldOfViewX * 0.5) * 1 / aspect);
    // }
    //
    // this.m4.perspective(fieldOfViewY, aspect, 0.1, 40, this.projection);
    // this.m4.lookAt(this.eye, this.target, this.up, this.camera);
    // this.m4.inverse(this.camera, this.view);
    // // if (rotating) {
    // //   this.m4.rotateZ(view, currentRotation, view);
    // // }
    // // this.m4.rotateZ(this.view, this.parent.currentRotation, this.view);
    // this.m4.multiply(this.projection, this.view, this.viewProjection);
  }

  /**
    Called after everything else is rendered.
  **/
  finishRender() {
    // Not sure if this will be needed ever, but it's good to have around
  }
}
