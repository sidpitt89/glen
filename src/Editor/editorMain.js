(function() {
  "use strict";

  // ------ webgl profiler -------------
  // var spector = new SPECTOR.Spector();
  // spector.displayUI();
  // -----------------------------------
  var editor = new Editor();

  function loop(time) {
    if (time < (editor.lastFrameTimeMs + editor.timestep)) {
      requestAnimationFrame(loop);
      return;
    }

    editor.dT += (time - editor.lastFrameTimeMs);
    editor.lastFrameTimeMs = time;

    var numUpdates = 0;
    var threshold = 150;
    while (editor.dT >= editor.timestep) {
      editor.update(editor.timestep);
      editor.dT -= editor.timestep;
      numUpdates++;
      if (numUpdates > threshold) {
        // Bail on this nonsense.
        console.warn("Too much catch-up.")
        editor.dT = 0;
      }
    }

    editor.render();

    requestAnimationFrame(loop);
  }

  // Start loop!
  loop(0);

})();
