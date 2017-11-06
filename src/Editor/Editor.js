class Editor {
  static LEVEL_VERSION() {
    return "1.0.0";
  }

  constructor() {
    this.initElems();
    this.ctx = this.canvas.getContext("2d");

    this.dT = 0;
    this.lastFrameTimeMs = 0;

    var maxFps = 60;
    this.timestep = 1000 / maxFps;

    this.initState();
  }

  initElems() {
    this.canvas = document.getElementById("canvas");
    this.levelNameElem = document.getElementById("levelName");
    this.clearLevelElem = document.getElementById("clearLevel");
  }

  initState() {
    this.paused = false;

    this.useGrid = true;
    this.gridW = 10;
    this.gridH = 10;
    this.cursorX = 0;
    this.cursorY = 0;

    this.entities = [];
    this.enemies = [];
    this.projectileSources = [];
    this.walls = [];
    this.regions = [];

    this.levelName = "";
    this.spawn = null;

    this.addListeners();
  }

  addListeners() {
    window.addEventListener("keydown", event => {

    });

    window.addEventListener("keyup", event => {

    });

    var callMM = event => {
      this.onMouseMove(event);
    };

    this.canvas.addEventListener("mouseenter", event => {
      this.canvas.addEventListener("mousemove", callMM);
    });
    this.canvas.addEventListener("mouseout", event => {
      this.canvas.removeEventListener("mousemove", callMM);
    });
    this.canvas.addEventListener("mousedown", event => {
      var x = this.cursorX; //event.pageX - 8;
      var y = this.cursorY; //event.pageY - 8;

      // Convert y to proper coordinate system
      // y = this.canvas.height - y;

      if (this.wallEditMode) {
        if (!this.wallAnchor) {
          this.wallAnchor = [x, y];
        }
        else {
          var a1 = this.wallAnchor;
          var a2 = [x, y];
          var left = Math.min(a1[0], a2[0]);
          var right = Math.max(a1[0], a2[0]);
          var top = Math.max(a1[1], a2[1]);
          var bottom = Math.min(a1[1], a2[1]);
          this.addWall(left, right, top, bottom);
          this.wallAnchor = null;
        }
      }
      else if (this.enemyEditMode) {
        this.addEnemy(x, y);
      }
      else if (this.spawnEditMode) {
        this.addSpawn(x, y);
      }
    });

    this.canvas.addEventListener("mouseup", event => {

    });

    this.levelNameElem.addEventListener("change", event => {
      this.levelName = this.levelNameElem.value;
    });

    document.getElementById("spawnMode").addEventListener("click", event => {
      this.resetToolState();
      this.spawnEditMode = true;
    });

    document.getElementById("wallMode").addEventListener("click", event => {
      this.resetToolState();
      this.wallEditMode = true;
    });
    document.getElementById("enemyMode").addEventListener("click", event => {
      this.resetToolState();
      this.enemyEditMode = true;
    });

    document.getElementById("exportLevel").addEventListener("click", event => {
      event.target.href = this.exportLevel();
      event.target.download = this.levelName;
    }, false);

    document.getElementById("importLevel").addEventListener("change", event => {
      var f = event.target.files[0];
      var fR = new FileReader();
      fR.onload = e => {
        var r = e.target.result;
        var ld = JSON.parse(r);
        this.importLevel(ld);
      };
      fR.readAsText(f);
    }, false);

    this.clearLevelElem.addEventListener("click", event => {
      this.clearLevel();
    })
  }

  onMouseMove(event) {
    // TODO: don't use hardcoded offsets like this!
    var x = event.pageX - 8;
    var y = event.pageY - 8;

    // Convert y to proper coordinate system
    // y = this.canvas.height - y;

    this.cursorX = this.useGrid ? Math.round(x / this.gridW) * this.gridW : x;
    this.cursorY = this.useGrid ? Math.round(y / this.gridH) * this.gridH : y;
  }

  update(dT) {

  }

  render() {
    this.ctx.fillStyle = "#CCCCCC";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.ctx);
    }

    if (this.spawn != null) {
      this.ctx.fillStyle = "#22FF11";
      this.ctx.fillRect(this.spawn.x - 4, this.spawn.y - 4, 8, 8);
    }

    if (this.wallAnchor != null) {
      this.ctx.fillStyle = "#FF7700";
      this.ctx.fillRect(this.wallAnchor[0] - 3, this.wallAnchor[1] - 3, 6, 6);
    }

    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cursorY);
    this.ctx.lineTo(this.canvas.width, this.cursorY);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.cursorX, 0);
    this.ctx.lineTo(this.cursorX, this.canvas.height);
    this.ctx.stroke();

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(this.cursorX - 4, this.cursorY - 4, 8, 8);
  }

  resetToolState() {
    this.wallAnchor = null;
    this.wallEditMode = false;
    this.enemyEditMode = false;
    this.spawnEditMode = false;
  }

  addEnemy(x, y) {
    var e = new EnemyT(x, y, 0);
    this.entities.push(e);
    this.enemies.push(e);
  }

  addWall(left, right, top, bottom) {
    var x = right - ((right - left) / 2);
    var y = top - ((top - bottom) / 2);
    var w = (right - left);
    var h = (top - bottom);
    var wall = new WallT(x, y, w, h, 0);
    this.walls.push(wall);
    this.entities.push(wall);
  }

  addSpawn(x, y) {
    // TODO: Control spawn direction
    this.spawn = {
      x: x,
      y: y,
      direction: 0,
    };
  }

  validateImportData(data) {
    // NOTE: This can be made much more involved if needed.
    if (data == null || data.version == null) {
      return false;
    }

    return true;
  }

  importLevel(data) {
    if (!this.validateImportData(data)) {
      console.log("Cannot import given level.");
      return;
    }
    
    this.clearLevel();

    // NOTE: Behavior may need to vary in the future, based on the provided version.
    this.levelName = data.name;
    this.levelNameElem.value = this.levelName;

    this.spawn = data.spawn;

    var i;
    var enemies = data.entities.enemies;
    if (enemies != null) {
      for (i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        var ne = new EnemyT(e.x, e.y, e.type);
        this.enemies.push(ne);
        this.entities.push(ne);
      }
    }

    var walls = data.entities.walls;
    if (walls != null) {
      for (i = 0; i < walls.length; i++) {
        var w = walls[i];
        var nw = new WallT(w.x, w.y, w.w, w.h, w.type);
        this.walls.push(nw);
        this.entities.push(nw);
      }
    }

  }

  exportLevel() {
    // TODO --- Rethink construction of levels, based on new level format. It's way too complicated right now.

    var levelData = {
      version: Editor.LEVEL_VERSION(),
      name: this.levelName,
      spawn: this.spawn,
      entities: this.getEntityExportData(),
    };

    var blob = new Blob([JSON.stringify(levelData, null, 2)], {type : 'application/json'});
    return URL.createObjectURL(blob);
  }

  getEntityExportData(type) {
    var ed = {
      enemies: [],
      walls: [],
    };

    var i;
    for (i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      ed.enemies.push({
        x: e.x,
        y: e.y,
        type: e.type
      });
    }
    for (i = 0; i < this.walls.length; i++) {
      var w = this.walls[i];
      ed.walls.push({
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        type: w.type
      });
    }

    return ed;
  }

  clearLevel() {
    this.resetToolState();

    this.entities = [];
    this.enemies = [];
    this.projectileSources = [];
    this.walls = [];
    this.regions = [];

    this.spawn = null;

    this.levelName = "";
    this.levelNameElem.value = null;
  }
}
