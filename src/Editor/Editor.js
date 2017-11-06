class Editor {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.dT = 0;
    this.lastFrameTimeMs = 0;

    var maxFps = 60;
    this.timestep = 1000 / maxFps;

    // These are reset by level load
    this.entities = [];
    this.enemies = [];
    this.projectileSources = [];
    this.walls = [];
    this.regions = [];

    this.initState();
    // this.addListeners();

    this.paused = false;
  }

  initState() {
    this.useGrid = true;
    this.gridW = 10;
    this.gridH = 10;
    this.cursorX = 0;
    this.cursorY = 0;

    this.addListeners();
  }

  addListeners() {
    var me = this;
    window.addEventListener("keydown", function(event) {

    });

    window.addEventListener("keyup", function(event) {

    });

    var callMM = function(event) {
      me.onMouseMove(event);
    };

    this.canvas.addEventListener("mouseenter", function(e) {
      me.canvas.addEventListener("mousemove", callMM);
    });
    this.canvas.addEventListener("mouseout", function(e) {
      me.canvas.removeEventListener("mousemove", callMM);
    });
    this.canvas.addEventListener("mousedown", function(e) {
      var x = me.cursorX; //event.pageX - 8;
      var y = me.cursorY; //event.pageY - 8;

      // Convert y to proper coordinate system
      // y = me.canvas.height - y;

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
          me.addWall(left, right, top, bottom);
          me.wallAnchor = null;
        }
      }
      else if (me.enemyEditMode) {
        me.addEnemy(x, y);
      }
    });

    this.canvas.addEventListener("mouseup", function(e) {

    });

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
      this.href = me.exportLevel();
      this.download = me.levelName;
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

  importLevel(levelData) {
    // this.currentLevel = new Level(this.levelInfo.createImportInfo(levelData));
    // this.currentLevel.load(this);
  }

  exportLevel() {
    // TODO --- Rethink level format and construction of levels. It's way too complicated right now.
  }
}
