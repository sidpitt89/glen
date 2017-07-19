(function() {
  "use strict";

  class Game {
    constructor() {
      this.renderer = new Renderer(this);
      this.dT = 0;
      this.lastFrameTimeMs = 0;

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
      // This is a hacky little way to allow WASD to move the shooter.
      // Once it stops flying off-screen, it shouldn't be necessary.
      this.shooter.x += this.shooterMovementX;
      this.shooter.y += this.shooterMovementY;

      // TODO: Get all this game-specific code out of here!
      this.shooter.shooting = this.shooterShooting;

      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].update(dT);
      }

      var removedProjectiles = [];
      var removedEnemies = [];

      // TODO: There's a bug with explosions occasionally removing the shooter.
      // TODO: Also all this logic should go somewhere else. ???
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
    }

    render(dT) {
      this.renderer.startRender();

      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].render(this.renderer);
      }

      this.renderer.finishRender();
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

    var numUpdates = 0;
    var threshold = 150;
    while (game.dT >= game.timestep) {
      game.update(game.timestep);
      game.dT -= game.timestep;
      numUpdates++;
      if (numUpdates > threshold) {
        // Bail on this nonsense.
        console.warn("Too much catch-up.")
        game.dT = 0;
      }
    }
    game.render(game.dT);

    requestAnimationFrame(loop);
  }

  // Start loop!
  loop(0);

})();
