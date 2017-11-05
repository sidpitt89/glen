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
    // this.levelInfo = new LevelInfo(this, this.renderer); // TODO: only used in a few places here. all of which can move to GameController.
    // this.currentLevel = new Level(); // TODO: Use different level class for editing?
    //TODO: init state
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
      // TODO: don't use hardcoded offsets like this!
      var x = event.pageX - 8;
      var y = event.pageY - 8;

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
  }

  onMouseMove(event) {
    // TODO: don't use hardcoded offsets like this!
    var x = event.pageX - 8;
    var y = event.pageY - 8;

    // Convert y to proper coordinate system
    y = this.canvas.height - y;

    // TODO: Doesn't do anything for now. Remove if not necessary in the future.
  }

  update(dT) {

  }

  render() {
    this.ctx.fillStyle = "#CCCCCC";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.ctx);
    }
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
}
