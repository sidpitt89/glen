class Editor {
  constructor() {
    this.renderer = new Renderer(this);
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
    this.levelInfo = new LevelInfo(this, this.renderer); // TODO: only used in a few places here. all of which can move to GameController.
    this.currentLevel = new Level(); // TODO: Use different level class for editing?
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

    this.renderer.canvas.addEventListener("mouseenter", function(e) {
      me.renderer.canvas.addEventListener("mousemove", callMM);
    });
    this.renderer.canvas.addEventListener("mouseout", function(e) {
      me.renderer.canvas.removeEventListener("mousemove", callMM);
    });
    this.renderer.canvas.addEventListener("mousedown", function(e) {
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
    });

    this.renderer.canvas.addEventListener("mouseup", function(e) {

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
    y = this.renderer.canvas.height - y;

    // TODO: Doesn't do anything for now. Remove if not necessary in the future.
  }

  update(dT) {

  }

  render() {
    this.renderer.startRender();

    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].render(this.renderer);
    }

    this.renderer.renderObjectLists();
    this.renderer.finishRender();
  }

  toggleEditMode() {
    // if (!this.editing) {
    //   this.editing = true;
    //
    //   this.currentLevel = new Level(this.levelInfo.levels[0]);
    //   this.currentLevel.load(this);
    //
    //   document.getElementById("editControls").style.display = "block";
    //   this.addEditListeners();
    // }
    // else {
    //   this.editing = false;
    //   document.getElementById("editControls").style.display = "none";
    // }
  }

  importLevel(levelData) {
    // this.currentLevel = new Level(this.levelInfo.createImportInfo(levelData));
    // this.currentLevel.load(this);
  }
}
