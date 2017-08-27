class GameController {
  constructor(game) {
    this.game = game;
    this.game.setController(this);

    this.initMenu();

    this.levelInfo = new LevelInfo(this.game, this.game.renderer);
    this.addEventListeners();

    this.currentLevel = new Level(this.levelInfo.levels[1]);
    this.game.loadLevel(this.currentLevel);
  }

  initMenu() {
    this.menu = new Menu(this.game);
    this.enemyCountField = this.menu.createTextField(5, 5, "Enemies Remaining: ");
  }

  addEventListeners() {
    var me = this;
    // TODO -- Move keyboard event handlers out here

    // TODO -- This is just for testing quadtree stuff. remove after testing.
    this.qtOn = false;
    document.getElementById("qtToggle").addEventListener("click", function(e) {
      me.toggleQt();
    });
  }

  toggleQt() {
    this.qtOn = !this.qtOn;
    this.game.toggleQt(this.qtOn);
  }

  notifyEnemyCountChange(count) {
    this.enemyCountField.updateText(`Enemies Remaining: ${count}`);
  }

  notifyLevelComplete(detail) {
    console.log("level completed with detail: ", detail);
    console.log("restarting...");
    this.currentLevel = new Level(this.levelInfo.levels[1]);
    this.game.loadLevel(this.currentLevel);
  }

  notifyLevelIncomplete(detail) {

  }
}
