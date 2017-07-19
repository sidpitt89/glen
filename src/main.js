(function() {
  "use strict";

  class Game {
    constructor() {
      this.renderer = new Renderer(this);
      this.dT = 0;
      this.lastFrameTimeMs = 0;

      // things that aren't really necessary
      this.rotating = false;
      this.rotationAmount = (2 * Math.PI) / 360;
      this.currentRotation = 0;

      // end unnecessary things

      // input states
      this.shooterMovement = 0;
      this.shooterMovementX = 0;
      this.shooterMovementY = 0;
      this.shooterMoveDistance = 2;

      var maxFps = 60;
      this.timestep = 1000 / maxFps;

      // These are reset by level load
      this.entities = [];
      this.enemies = [];
      this.projectileSources = [];
      this.walls = [];

      this.initState();
      this.addListeners();
    }

    initState() {
      this.levelInfo = new LevelInfo(this, this.renderer);
      this.currentLevel = new Level(this.levelInfo.levels[1]);
      this.currentLevel.load(this);
      // this.entities = [];
      // this.enemies = [];
      // this.projectileSources = [];
      // this.walls = [];
      // var shooterInfo = {
      //   x: 200,
      //   y: 100,
      //   z: 0,
      //   r: {
      //     x: 0, y: 0, z: 0, rZ: 0.001,
      //   },
      //   w: 20,
      //   h: 20,
      //   game: this,
      //   programInfo: this.renderer.programInfoBasic,
      //   bufferInfo: this.renderer.shooterBufferInfo,
      //   uniforms: this.renderer.shooterUniforms,
      // };
      // var enemyInfo = {
      //   x: 30,
      //   y: 500,
      //   z: 0,
      //   r: {
      //     x: 0, y: 0, z: 0, rZ: 0.001,
      //   },
      //   w: 12,
      //   h: 12,
      //   vX: 2,
      //   game: this,
      //   health: 5,
      //   programInfo: this.renderer.programInfoBasic,
      //   bufferInfo: this.renderer.enemyBufferInfo,
      //   uniforms: this.renderer.enemyUniforms,
      //   movementBounds: [0, this.renderer.gl.canvas.width, this.renderer.gl.canvas.height, 0],
      // };
      // var barrelInfo = {
      //   x: 300,
      //   y: 400,
      //   z: 0,
      //   r: {
      //     x: 0, y: 0, z: 0, rZ: 0.001,
      //   },
      //   w: 20,
      //   h: 20,
      //   vX: 0,
      //   game: this,
      //   health: 5,
      //   programInfo: this.renderer.programInfoBasic,
      //   bufferInfo: this.renderer.squareBufferInfo,
      //   uniforms: this.renderer.barrelUniforms,
      //   movementBounds: [0, this.renderer.gl.canvas.width, this.renderer.gl.canvas.height, 0],
      // };
      // var wallInfo = {
      //   x: 100,
      //   y: 200,
      //   z: 0,
      //   w: 20,
      //   h: 200,
      //   vX: 0,
      //   game: this,
      //   programInfo: this.renderer.programInfoBasic,
      //   bufferInfo: this.renderer.squareBufferInfo,
      //   uniforms: this.renderer.wallUniforms,
      // };
      //
      // var shooterEmitterInfo = {
      //   x: 0,
      //   y: 0,
      //   z: 0,
      //   pW: 5,
      //   pH: 5,
      //   r: {
      //     x: 0, y: 0, z: 0, rZ: 0.001,
      //   },
      //   maxP: 300,
      //   pWait: 20,
      //   pVx: 0.000,
      //   pVy: 0.4,
      //   pVRand: 0.05,
      //   game: this,
      //   programInfo: null,
      //   bufferInfo: null,
      //   uniforms: null,
      //   particleProgramInfo: this.renderer.programInfoBasic,
      //   particleBufferInfo: this.renderer.squareBufferInfo,
      //   particleUniforms: this.renderer.bulletUniforms,
      // };
      //
      // shooterInfo.emitterInfo = shooterEmitterInfo;
      //
      // var shooter = new Shooter(shooterInfo);
      // this.entities.push(shooter);
      // this.shooter = shooter;
      //
      // var ey = 500;
      // for (var ej = 0; ej < 12; ej++) {
      //   enemyInfo.y = ey;
      //   for (var ei = 0; ei < 40; ei++) {
      //     enemyInfo.x = 14 + (ei * 14);
      //     var enemy = new Enemy(enemyInfo);
      //     this.entities.push(enemy);
      //     this.enemies.push(enemy);
      //   }
      //   ey -= 30;
      // }
      //
      // var redBarrel = new RedBarrel(barrelInfo);
      // this.entities.push(redBarrel);
      // this.enemies.push(redBarrel);
      //
      // for (var bj = 0; bj < 10; bj++) {
      //   barrelInfo.x = 50 + (bj * 20) + Math.random() * 50;
      //   barrelInfo.y = 100 + (bj * 20) + Math.random() * 100;
      //   var redBarrel = new RedBarrel(barrelInfo);
      //   this.entities.push(redBarrel);
      //   this.enemies.push(redBarrel);
      // }
      //
      // var wall = new Wall(wallInfo);
      // this.entities.push(wall);
      // this.walls.push(wall);
    }

    addListeners() {
      var me = this;
      window.addEventListener("keydown", function(event) {
        if (event.keyCode === 65) {
          me.shooterMovementX = me.shooterMoveDistance * -1;
        }
        else if (event.keyCode === 68) {
          me.shooterMovementX = me.shooterMoveDistance;
        }
        else if (event.keyCode === 87) {
          me.shooterMovementY = me.shooterMoveDistance;
        }
        else if (event.keyCode === 83) {
          me.shooterMovementY = me.shooterMoveDistance * -1;
        }
        else if (event.keyCode === 32) {
          me.shooterShooting = true;
        }
        else if (event.keyCode === 69) {
          me.toggleEditMode();
        }
      });

      window.addEventListener("keyup", function(event) {
        if (event.keyCode === 65 && me.shooterMovementX < 0) {
          me.shooterMovementX = 0;
        }
        else if (event.keyCode === 68 && me.shooterMovementX > 0) {
          me.shooterMovementX = 0;
        }
        else if (event.keyCode === 87 && me.shooterMovementY > 0) {
          me.shooterMovementY = 0;
        }
        else if (event.keyCode === 83 && me.shooterMovementY < 0) {
          me.shooterMovementY = 0;
        }
        else if (event.keyCode === 32) {
          me.shooterShooting = false;
        }
      });

      var callMM = function(event) {
        me.onMouseMove(event);
      };

      this.renderer.canvas.addEventListener("mouseenter", function(e) {
        me.renderer.canvas.addEventListener("mousemove", callMM);
      });
      this.renderer.canvas.addEventListener("mouseout", function(e) {
        me.renderer.canvas.removeEventListener("mousemove", callMM);
      });
      this.renderer.canvas.addEventListener("mousedown", function(e) {
        // TODO: move edit logic out?
        if (me.editing) {
          // TODO: don't use hardcoded offsets like this!
          var x = event.pageX - 8;
          var y = event.pageY - 8;

          // Convert y to proper coordinate system
          y = me.renderer.canvas.height - y;

          if (me.wallEditMode) {
            if (!me.wallAnchor) {
              me.wallAnchor = [x, y];
            }
            else {
              var a1 = me.wallAnchor;
              var a2 = [x, y];
              var left = Math.min(a1[0], a2[0]);
              var right = Math.max(a1[0], a2[0]);
              var top = Math.max(a1[1], a2[1]);
              var bottom = Math.min(a1[1], a2[1]);
              me.currentLevel.editAddWall(left, right, top, bottom);
              me.wallAnchor = null;
            }
          }
          else if (me.enemyEditMode) {
            me.currentLevel.editAddEnemy(x, y);
          }
        }
        else {
          me.shooterShooting = true;
        }
      });
      this.renderer.canvas.addEventListener("mouseup", function(e) {
        me.shooterShooting = false;
      });
    }

    onMouseMove(event) {
      // TODO: don't use hardcoded offsets like this!
      var x = event.pageX - 8;
      var y = event.pageY - 8;

      // Convert y to proper coordinate system
      y = this.renderer.canvas.height - y;

      this.shooter.updateAim(x, y);
    }

    update(dT) {
      // if (rotating) {
      //   currentRotation += rotationAmount;
      //   currentRotation = currentRotation % (2 * Math.PI);
      // }
      //
      this.shooter.x += this.shooterMovementX;
      this.shooter.y += this.shooterMovementY;
      this.shooter.shooting = this.shooterShooting;
      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].update(dT);
      }

      var removedProjectiles = [];
      var removedEnemies = [];

      for (var p = 0; p < this.projectileSources.length; p++) {
        var ps = this.projectileSources[p];
        for (var pp = 0; pp < ps.projectiles.length; pp++) {
          var proj = ps.projectiles[pp];
          for (var w = 0; w < this.walls.length; w++) {
            if (this.walls[w].intersects(proj)) {
              proj.spent = true;
              removedProjectiles.push(proj);
              break;
            }
          }
        }
      }
      for (var i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];
        if (e.removed) {
          continue;
        }
        for (var j = 0; j < this.projectileSources.length; j++) {
          var ps = this.projectileSources[j];
          var projectiles = ps.projectiles;
          for (var k = 0; k < projectiles.length; k++) {
            var p = projectiles[k];
            if (p.spent) {
              continue;
            }

            if (e.intersects(p)) {
              p.spent = true;
              removedProjectiles.push(p);

              e.takeDamage();
              if (e.dead) {
                e.removed = true;
                removedEnemies.push(e);
              }
              break;
            }
          }
        }
        if (e.explosionSource && e.exploding) {
          if (e.dead) {
            removedEnemies.push(e);
          }
          else {
            for (var m = 0; m < this.enemies.length; m++) {
              var en = this.enemies[m];
              if (en.removed || (en.explosionSource && en.exploding)) {
                continue;
              }
              if (e.intersects(en)) {
                en.takeDamage(e.blastDamage);
                if (en.dead) {
                  en.removed = true;
                  removedEnemies.push(en);
                }
              }
            }
          }
        }
      }

      for (var bi = 0; bi < removedProjectiles.length; bi++) {
        for (var psi = 0; psi < this.projectileSources.length; psi++) {
          var sauce = this.projectileSources[psi].projectiles;
          var io = sauce.indexOf(removedProjectiles[bi]);
          if (io != 0) {
            sauce.splice(io, 1);
            break;
          }
        }
      }
      for (var ei = 0; ei < removedEnemies.length; ei++) {
        this.enemies.splice(this.enemies.indexOf(removedEnemies[ei]), 1);
        this.entities.splice(this.entities.indexOf(removedEnemies[ei]), 1);
      }
      // for (var j = 0; j < this.projectileSources.length; j++) {
      //   var ps = this.projectileSources[j];
      //   var projectiles = ps.projectiles;
      //   for (var i = 0; i < projectiles.length; i++) {
      //     var p = projectiles[i];
      //     if (p.spent) {
      //       continue;
      //     }
      //
      //     for (var j = 0; j < this.enemies.length; j++) {
      //       var e = this.enemies[j];
      //       if (e.removed) {
      //         continue;
      //       }
      //       if (e.intersects(p)) {
      //         p.spent = true;
      //         removedProjectiles.push(p);
      //
      //         e.takeDamage();
      //         if (e.dead) {
      //           e.removed = true;
      //           removedEnemies.push(e);
      //         }
      //         break;
      //       }
      //     }
      //   }
      //
      //   for (var bi = 0; bi < removedProjectiles.length; bi++) {
      //     projectiles.splice(projectiles.indexOf(removedProjectiles[bi]), 1);
      //   }
      //   for (var ei = 0; ei < removedEnemies.length; ei++) {
      //     this.enemies.splice(this.enemies.indexOf(removedEnemies[ei]), 1);
      //     this.entities.splice(this.entities.indexOf(removedEnemies[ei]), 1);
      //   }
      // }
      //
      // strands.forEach(function(strand) {
      //   strand.update(dT);
      // });
    }

    render(dT) {
      // var time = dT * 0.001;
      //
      //
      // var fadeTime = time;
      // var fade = Math.min(1, fadeTime / 6);

      this.renderer.startRender();

      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].render(this.renderer);
      }

      this.renderer.finishRender();

      // twgl.setUniforms(programInfo, uniforms);
      // gl.useProgram(programInfo.program);
      // strands.forEach(function(strand) {
      //   strand.render();
      // });
    }

    registerProjectileSource(ps) {
      this.projectileSources.push(ps);
    }

    toggleEditMode() {
      if (!this.editing) {
        this.editing = true;

        this.currentLevel = new Level(this.levelInfo.levels[0]);
        this.currentLevel.load(this);

        document.getElementById("editControls").style.display = "block";
        this.addEditListeners();
      }
      else {
        this.editing = false;
        document.getElementById("editControls").style.display = "none";
      }
    }

    importLevel(levelData) {
      this.currentLevel = new Level(this.levelInfo.createImportInfo(levelData));
      this.currentLevel.load(this);
    }

    addEditListeners() {
      if (this.editListenersAdded) {
        return;
      }
      var me = this;
      document.getElementById("wallMode").addEventListener("click", function(e) {
        me.wallAnchor = null;
        me.enemyEditMode = true;
        me.wallEditMode = true;
      });
      document.getElementById("enemyMode").addEventListener("click", function(e) {
        me.wallAnchor = null;
        me.wallEditMode = false;
        me.enemyEditMode = true;
      });

      document.getElementById("exportLevel").addEventListener("click", function(e) {
        this.href = me.currentLevel.exportLevel();
        this.download = me.currentLevel.name;
      }, false);

      document.getElementById("importLevel").addEventListener("change", function(e) {
        var f = this.files[0];
        var fR = new FileReader();
        fR.onload = function(e) {
          var r = e.target.result;
          var ld = JSON.parse(r);
          me.importLevel(ld);
        };
        fR.readAsText(f);
      }, false);

      this.editListenersAdded = true;
    }
  }

  var game = new Game();

  function loop(time) {
    if (time < (game.lastFrameTimeMs + game.timestep)) {
      requestAnimationFrame(loop);
      return;
    }
    game.dT += (time - game.lastFrameTimeMs);
    game.lastFrameTimeMs = time;
    while (game.dT >= game.timestep) {
      game.update(game.timestep);
      game.dT -= game.timestep;
    }
    game.render(game.dT);

    requestAnimationFrame(loop);
  }

  // Start loop!
  loop(0);

})();
