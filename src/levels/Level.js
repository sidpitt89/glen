class Level {
  constructor(info) {
    this.name = info.name;

    this.enemyInfo = info.enemyInfo;
    this.interactivesInfo = info.interactivesInfo;
    this.wallInfo = info.wallInfo;
    this.shooterInfo = info.shooterInfo;

    this.enemyInitFunction = info.enemyInitFunction;
    this.interactivesInitFunction = info.interactivesInitFunction;
    this.wallInitFunction = info.wallInitFunction;
    this.shooterInitFunction = info.shooterInitFunction;

    this.wallAddFunction = info.wallAddFunction;
    this.enemyAddFunction = info.enemyAddFunction;

    this.info = info;
  }

  log(action) {
    console.log(`Level: ${this.name} :: ${action}`);
  }

  load(game) {
    this.log("load");

    this.game = game;

    game.entities = [];
    game.enemies = [];
    game.projectileSources = [];
    game.walls = [];

    this.initEnemies(game);
    this.initInteractives(game);
    this.initWalls(game);
    this.initShooter(game);
  }

  initEnemies(game) {
    if (this.enemyInfo && this.enemyInitFunction) {
      this.enemyInitFunction(this.enemyInfo, game);
    }
  }

  initInteractives(game) {
    if (this.interactivesInfo && this.interactivesInitFunction) {
      this.interactivesInitFunction(this.interactivesInfo, game);
    }
  }

  initWalls(game) {
    if (this.wallInfo && this.wallInitFunction) {
      this.wallInitFunction(this.wallInfo, game);
    }
  }

  initShooter(game) {
    if (this.shooterInfo && this.shooterInitFunction) {
      this.shooterInitFunction(this.shooterInfo, game);
    }
  }

  editAddWall(left, right, top, bottom) {
    if (this.wallInfo && this.wallAddFunction) {
      this.wallInfo.x = right - ((right - left) / 2);
      this.wallInfo.y = top - ((top - bottom) / 2);
      this.wallInfo.w = (right - left);
      this.wallInfo.h = (top - bottom);
      this.wallAddFunction(this.wallInfo, this.game);
    }
  }

  editAddEnemy(x, y) {
    this.enemyInfo.x = x;
    this.enemyInfo.y = y;
    this.enemyAddFunction(this.enemyInfo, this.game);
  }

  // This only exports basic placement information
  exportLevel() {
    var info = this.info;
    var levelData = {
      name: info.name,
      enemyLocs: info.enemyInfo.locs,
      walls: info.wallInfo.walls,
    };

    var blob = new Blob([JSON.stringify(levelData, null, 2)], {type : 'application/json'});
    return URL.createObjectURL(blob);
  }
}
