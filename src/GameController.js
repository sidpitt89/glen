class GameController {
  constructor(game) {
    this.game = game;
    this.game.setController(this);

    this.levelInfo = new LevelInfo(this.game, this.game.renderer);
    this.addEventListeners();

    this.currentLevel = new Level(this.levelInfo.levels[1]);
    this.game.loadLevel(this.currentLevel);
  }

  addEventListeners() {
    var me = this;
    // TODO
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
