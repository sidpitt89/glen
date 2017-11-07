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
    this.enemyControlsElem = document.getElementById("enemyControls");
    this.wallControlsElem = document.getElementById("wallControls");
    this.spawnControlsElem = document.getElementById("spawnControls");
    this.regionControlsElem = document.getElementById("regionControls");
    this.enemyTypeElem = document.getElementById("enemyTypeSelect");
    this.wallTypeElem = document.getElementById("wallTypeSelect");
    this.regionTypeElem = document.getElementById("regionTypeSelect");
    this.spawnRotationElem = document.getElementById("spawnRotation");
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

    this.editMode = null;
    this.toolStateMap = {
      0: "spawn",
      1: "wall",
      2: "enemy",
      3: "region",
      spawn: 0,
      wall: 1,
      enemy: 2,
      region: 3,
    };

    // This is dumb, but I think it's better than using hardcoded strings everywhere or static functions
    this.editModeMap = {
      spawn: "spawn",
      wall: "wall",
      enemy: "enemy",
      region: "region",
    };

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
    this.canvas.addEventListener("mousedown", event => this.onMouseDown(event));

    this.canvas.addEventListener("mouseup", event => {

    });

    this.levelNameElem.addEventListener("change", event => {
      this.levelName = this.levelNameElem.value;
    });

    document.getElementById("spawnMode").addEventListener("click", event => {
      this.switchToolState(this.toolStateMap.spawn);
    });

    document.getElementById("wallMode").addEventListener("click", event => {
      this.switchToolState(this.toolStateMap.wall);
    });
    document.getElementById("enemyMode").addEventListener("click", event => {
      this.switchToolState(this.toolStateMap.enemy);
    });
    document.getElementById("regionMode").addEventListener("click", event => {
      this.switchToolState(this.toolStateMap.region);
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

  onMouseDown(event) {
    if (!this.editMode) {
      return;
    }

    // TODO: don't use hardcoded offsets like this!
    var x = this.cursorX; //event.pageX - 8;
    var y = this.cursorY; //event.pageY - 8;

    // Convert y to proper coordinate system
    // y = this.canvas.height - y;
    var em = this.editModeMap;
    switch (this.editMode) {
      case em.wall:
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
        break;
      case em.enemy:
        this.addEnemy(x, y);
        break;
      case em.spawn:
        this.addSpawn(x, y);
        break;
      case em.region:
        if (!this.regionAnchor) {
          this.regionAnchor = [x, y];
        }
        else {
          var a1 = this.regionAnchor;
          var a2 = [x, y];
          var left = Math.min(a1[0], a2[0]);
          var right = Math.max(a1[0], a2[0]);
          var top = Math.max(a1[1], a2[1]);
          var bottom = Math.min(a1[1], a2[1]);
          this.addRegion(left, right, top, bottom);
          this.regionAnchor = null;
        }
        break;
    }
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

    if (this.regionAnchor != null) {
      this.ctx.fillStyle = "#0077FF";
      this.ctx.fillRect(this.regionAnchor[0] - 3, this.regionAnchor[1] - 3, 6, 6);
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

  switchToolState(ts) {
    this.resetToolState();
    var tsm = this.toolStateMap;
    var emm = this.editModeMap;
    switch (ts) {
      case tsm.spawn:
        this.editMode = emm.spawn;
        this.spawnControlsElem.style.display = "flex";
        break;
      case tsm.wall:
        this.editMode = emm.wall;
        this.wallControlsElem.style.display = "flex";
        break;
      case tsm.enemy:
        this.editMode = emm.enemy;
        this.enemyControlsElem.style.display = "flex";
        break;
      case tsm.region:
        this.editMode = emm.region;
        this.regionControlsElem.style.display = "flex";
        break;
    }
  }

  resetToolState() {
    this.wallAnchor = null;
    this.regionAnchor = null;
    this.editMode = null;

    this.enemyControlsElem.style.display = "none";
    this.wallControlsElem.style.display = "none";
    this.spawnControlsElem.style.display = "none";
    this.regionControlsElem.style.display = "none";
  }

  addEnemy(x, y) {
    var type = parseInt(this.enemyTypeElem.value);
    var e = new EnemyT(x, y, type);
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

  addRegion(left, right, top, bottom) {
    var x = right - ((right - left) / 2);
    var y = top - ((top - bottom) / 2);
    var w = (right - left);
    var h = (top - bottom);
    var region = new RegionT(x, y, w, h, 0);
    this.regions.push(region);
    this.entities.push(region);
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

    var regions = data.entities.regions;
    if (regions != null) {
      for (i = 0; i < regions.length; i++) {
        var r = regions[i];
        var nr = new RegionT(r.x, r.y, r.w, r.h, r.type);
        this.regions.push(nr);
        this.entities.push(nr);
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
      regions: [],
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

    for (i = 0; i < this.regions.length; i++) {
      var r = this.regions[i];
      ed.regions.push({
        x: r.x,
        y: r.y,
        w: r.w,
        h: r.h,
        type: r.type
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
