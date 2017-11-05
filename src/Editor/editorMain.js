(function() {
  "use strict";

  // ------ webgl profiler -------------
  // var spector = new SPECTOR.Spector();
  // spector.displayUI();
  // -----------------------------------
  var game = new Game();
  var controller = new GameController(game);

  function loop(time) {
    if (time < (game.lastFrameTimeMs + game.timestep)) {
      requestAnimationFrame(loop);
      return;
    }

    // TODO: Consider moving dT and lastFrameTimeMs to GameController,
    // TODO:   as well as running all updates and rendering through GameController.
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

    controller.render();

    requestAnimationFrame(loop);
  }

  // Start loop!
  loop(0);

})();
