class LevelInfo {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;

    this.levels = [];
    this.init();
  }

  init() {
    this.levels.push(this.getLevelEditInfo());
    this.levels.push(this.getLevelOneInfo());
  }

  // NOTE: Outdated
  createImportInfo(data) {
    var lei = this.getLevelEditInfo();
    lei.name = data.name;
    lei.enemyInfo.locs = data.enemyLocs;
    lei.wallInfo.walls = data.walls;

    lei.enemyInitFunction = function (info, game) {
      for (var i = 0; i < info.locs.length; i++) {
        info.x = info.locs[i][0];
        info.y = info.locs[i][1];
        var enemy = new Enemy(info);
        game.entities.push(enemy);
        game.enemies.push(enemy);
      }
    };
    lei.wallInitFunction = function (info, game) {
      for (var i = 0; i < info.walls.length; i++) {
        info.x = info.walls[i][0];
        info.y = info.walls[i][1];
        info.w = info.walls[i][2];
        info.h = info.walls[i][3];
        var wall = new Wall(info);
        game.entities.push(wall);
        game.walls.push(wall);
      }
    };

    return lei;
  }

  // NOTE: testing out the new level format (BLF 1.0.0) with this function
  createInfo(data) {
    var li = this.getDefaultLevelInfo();
    li.uli = data;
    li.name = data.name;

    li.enemyInitFunction = function (info, game, uli) {
      var enems = uli.entities.enemies;
      for (var i = 0; i < enems.length; i++) {
        if (enems[i].type != 0) {
          // TODO: Use some sort of factory class to remove the need for separate init functions for every enemy type
          // TODO: Also, use constants for enemy types
          continue;
        }
        info.x = enems[i].x;
        info.y = enems[i].y;
        info.type = enems[i].type;
        var enemy = new Enemy(info);
        game.enemies.push(enemy);
        game.entities.push(enemy);
      }
    };

    li.seekerInitFunction = function (info, game, uli) {
      var enems = uli.entities.enemies;
      for (var i = 0; i < enems.length; i++) {
        if (enems[i].type != 1) {
          // TODO: Use some sort of factory class to remove the need for separate init functions for every enemy type
          continue;
        }
        info.x = enems[i].x;
        info.y = enems[i].y;
        info.type = enems[i].type;
        var enemy = new Seeker(info);
        game.enemies.push(enemy);
        game.entities.push(enemy);
      }
    };

    li.interactivesInitFunction = function (info, game, uli) {
      var enems = uli.entities.enemies;
      for (var i = 0; i < enems.length; i++) {
        if (enems[i].type != 2) {
          // TODO: Use some sort of factory class to remove the need for separate init functions for every enemy type
          continue;
        }
        info.x = enems[i].x;
        info.y = enems[i].y;
        info.type = enems[i].type;
        var enemy = new RedBarrel(info);
        game.enemies.push(enemy);
        game.entities.push(enemy);
      }
    };

    li.wallInitFunction = function (info, game, uli) {
      var walls = uli.entities.walls;
      for (var i = 0; i < walls.length; i++) {
        info.x = walls[i].x;
        info.y = walls[i].y;
        info.w = walls[i].w;
        info.h = walls[i].h;
        info.type = walls[i].type; // TODO: Use type to determine which constructor to use (i.e. Wall, Glass, etc.)
        var wall = new Wall(info);
        game.entities.push(wall);
        game.walls.push(wall);
      }
    };

    li.regionInitFunction = function (info, game, uli) {
      var regions = uli.entities.regions;
      for (var i = 0; i < regions.length; i++) {
        info.x = regions[i].x;
        info.y = regions[i].y;
        info.w = regions[i].w;
        info.h = regions[i].h;
        info.type = regions[i].type; // TODO: Use type to determine which constructor to use (i.e. Wall, Glass, etc.)
        var region = new Region(info);
        game.entities.push(region);
        game.regions.push(region);
      }
    };

    li.shooterInitFunction = function (info, game, uli) {
      if (uli.spawn != null) {
        info.x = uli.spawn.x;
        info.y = uli.spawn.y;
      }

      var shooter = new Shooter(info);
      game.entities.push(shooter);
      game.shooter = shooter;
    };

    return li;
  }

  getDefaultLevelInfo() {
    return this.getLevelEditInfo(); // TODO: make this better OR just rename getLevelEditInfo to getDefaultLevelInfo
  }

  getLevelEditInfo() {
    var info = {};

    info.name = "Edit";

    var shooterInfo = {
      x: 200,
      y: 100,
      z: 0,
      w: 20,
      h: 20,
      game: this.game,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.shooterBufferInfo,
      uniforms: this.renderer.shooterUniforms,
    };

    var enemyInfo = {
      x: 30,
      y: 500,
      z: 0,
      w: 12,
      h: 12,
      vX: 2,
      game: this.game,
      health: 5,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.enemyBufferInfo,
      uniforms: this.renderer.enemyUniforms,
      movementBounds: [0, this.renderer.gl.canvas.width, this.renderer.gl.canvas.height, 0],
      locs: [
        // [x, y]
      ],
    };

    var seekerInfo = {
      x: 120,
      y: 400,
      z: 0,
      r: {
        x: 0, y: 0, z: 0, rZ: 0.001,
      },
      w: 12,
      h: 12,
      vX: 0.5,
      game: this.game,
      health: 5,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.enemyBufferInfo,
      uniforms: this.renderer.enemyUniforms,
    };

    var barrelInfo = {
      x: 300,
      y: 400,
      z: 0,
      w: 20,
      h: 20,
      vX: 0,
      game: this.game,
      health: 5,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.barrelUniforms,
      movementBounds: [0, this.renderer.gl.canvas.width, this.renderer.gl.canvas.height, 0],
      locs: [
        // [x, y]
      ],
    };

    var wallInfo = {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      game: this.game,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.wallUniforms,
      walls: [
        // [x, y, w, h]
      ],
    };

    var regionInfo = {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      game: this.game,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.regionUniforms,
      regions: [
        // x, y, w, h TODO: region type?
      ],
    };

    var shooterEmitterInfo = {
      x: 0,
      y: 0,
      z: 0,
      pW: 5,
      pH: 5,
      maxP: 300,
      pWait: 20,
      pVx: 0.000,
      pVy: 0.4,
      pVRand: 0.05,
      game: this.game,
      programInfo: null,
      bufferInfo: null,
      uniforms: null,
      particleProgramInfo: this.renderer.programInfoBasic,
      particleBufferInfo: this.renderer.squareBufferInfo,
      particleUniforms: this.renderer.bulletUniforms,
    };

    shooterInfo.emitterInfo = shooterEmitterInfo;

    info.enemyInfo = enemyInfo;
    info.seekerInfo = seekerInfo;
    info.interactivesInfo = barrelInfo;
    info.wallInfo = wallInfo;
    info.shooterInfo = shooterInfo;
    info.regionInfo = regionInfo;

    info.enemyInitFunction = function (info, game) {

    };

    info.enemyAddFunction = function (info, game) {
      var enemy = new Enemy(info);
      info.locs.push([info.x, info.y]);
      game.enemies.push(enemy);
      game.entities.push(enemy);
    }

    info.interactivesInitFunction = function (info, game) {

    };

    info.wallInitFunction = function (info, game) {

    };

    info.regionInitFunction = function (info, game) {

    };

    info.wallAddFunction = function (info, game) {
      var wall = new Wall(info);
      info.walls.push([info.x, info.y, info.w, info.h]);
      game.entities.push(wall);
      game.walls.push(wall);
    };

    info.shooterInitFunction = function (info, game) {
      var shooter = new Shooter(info);
      game.entities.push(shooter);
      game.shooter = shooter;
    };

    return info;
  }

  getLevelOneInfo() {
    var info = {};

    info.name = "One";

    var shooterInfo = {
      x: 200,
      y: 100,
      z: 0,
      r: {
        x: 0, y: 0, z: 0, rZ: 0.001,
      },
      w: 20,
      h: 20,
      game: this.game,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.shooterBufferInfo,
      uniforms: this.renderer.shooterUniforms,
    };

    var enemyInfo = {
      x: 30,
      y: 500,
      z: 0,
      r: {
        x: 0, y: 0, z: 0, rZ: 0.001,
      },
      w: 12,
      h: 12,
      vX: 2,
      game: this.game,
      health: 5,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.enemyBufferInfo,
      uniforms: this.renderer.enemyUniforms,
      movementBounds: [0, this.renderer.gl.canvas.width, this.renderer.gl.canvas.height, 0],
    };

    var seekerInfo = {
      x: 120,
      y: 400,
      z: 0,
      r: {
        x: 0, y: 0, z: 0, rZ: 0.001,
      },
      w: 12,
      h: 12,
      vX: 0.5,
      game: this.game,
      health: 5,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.enemyBufferInfo,
      uniforms: this.renderer.enemyUniforms,
    };

    var barrelInfo = {
      x: 300,
      y: 400,
      z: 0,
      r: {
        x: 0, y: 0, z: 0, rZ: 0.001,
      },
      w: 20,
      h: 20,
      vX: 0,
      game: this.game,
      health: 5,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.barrelUniforms,
      movementBounds: [0, this.renderer.gl.canvas.width, this.renderer.gl.canvas.height, 0],
    };

    var wallInfo = {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      game: this.game,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.wallUniforms,
      walls: [
        // x, y, w, h
        [100, 200, 20, 200],
        [400, 200, 20, 200],
      ],
    };

    var regionInfo = {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      game: this.game,
      programInfo: this.renderer.programInfoBasic,
      bufferInfo: this.renderer.squareBufferInfo,
      uniforms: this.renderer.regionUniforms,
      regions: [
        // x, y, w, h TODO: region type?
        [200, 100, 40, 40],
      ],
    };

    var shooterEmitterInfo = {
      x: 0,
      y: 0,
      z: 0,
      pW: 5,
      pH: 5,
      r: {
        x: 0, y: 0, z: 0, rZ: 0.001,
      },
      maxP: 300,
      pWait: 20,
      pVx: 0.000,
      pVy: 0.4,
      pVRand: 0.05,
      game: this.game,
      programInfo: null,
      bufferInfo: null,
      uniforms: null,
      particleProgramInfo: this.renderer.programInfoBasic,
      particleBufferInfo: this.renderer.squareBufferInfo,
      particleUniforms: this.renderer.bulletUniforms,
    };

    shooterInfo.emitterInfo = shooterEmitterInfo;

    info.enemyInfo = enemyInfo;
    info.interactivesInfo = barrelInfo;
    info.wallInfo = wallInfo;
    info.regionInfo = regionInfo;
    info.shooterInfo = shooterInfo;
    info.seekerInfo = seekerInfo;

    info.enemyInitFunction = function (info, game) {
      var ey = 500;
      for (var ej = 0; ej < 12; ej++) {
        info.y = ey;
        for (var ei = 0; ei < 40; ei++) {
          info.x = 14 + (ei * 14);
          var enemy = new Enemy(info);
          game.entities.push(enemy);
          game.enemies.push(enemy);
        }
        ey -= 30;
      }
    };

    info.seekerInitFunction = function (info, game) {
      var ey = 500;
      for (var ej = 0; ej < 12; ej++) {
        info.y = ey;
        for (var ei = 0; ei < 1; ei++) {
          info.x = 14 + (ei * 14);
          var enemy = new Seeker(info);
          game.entities.push(enemy);
          game.enemies.push(enemy);
        }
        ey -= 30;
      }
    };

    info.interactivesInitFunction = function (info, game) {
      for (var bj = 0; bj < 10; bj++) {
        info.x = 50 + (bj * 20) + Math.random() * 50;
        info.y = 100 + (bj * 20) + Math.random() * 100;
        var redBarrel = new RedBarrel(info);
        game.entities.push(redBarrel);
        game.enemies.push(redBarrel);
      }
    };

    info.wallInitFunction = function (info, game) {
      for (var i = 0; i < info.walls.length; i++) {
        var d = info.walls[i];
        info.x = d[0];
        info.y = d[1];
        info.w = d[2];
        info.h = d[3];
        var wall = new Wall(info);
        game.entities.push(wall);
        game.walls.push(wall);
      }
    };

    info.regionInitFunction = function (info, game) {
      for (var i = 0; i < info.regions.length; i++) {
        var d = info.regions[i];
        info.x = d[0];
        info.y = d[1];
        info.w = d[2];
        info.h = d[3];
        var region = new Region(info);
        game.entities.push(region);
        game.regions.push(region);
      }
    };

    info.shooterInitFunction = function (info, game) {
      var shooter = new Shooter(info);
      game.entities.push(shooter);
      game.shooter = shooter;
    };

    return info;
  }
}
