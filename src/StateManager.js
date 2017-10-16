class StateManager {
  constructor() {
    this.initStates();
  }

  initStates() {
    this.STATE_TITLE = 0;
    this.STATE_LOADING = 1;
    this.STATE_PLAYING = 2;
    this.STATE_COMPLETE = 3;
    this.STATE_FAIL = 4;
    this.STATE_FINAL = 5;

    this.states = [
      this.STATE_TITLE,
      this.STATE_LOADING,
      this.STATE_PLAYING,
      this.STATE_COMPLETE,
      this.STATE_FAIL,
      this.STATE_FINAL
    ];

    this.csi = 0; // current state index
    this.currentState = this.states[this.csi];
  }

  setState(s) {
    var idx = this.states.indexOf(s);
    if (idx >= 0) {
      this.csi = idx;
      this.currentState = this.states[this.csi];
    }
  }

  isTitle() {
    return this.currentState == this.STATE_TITLE;
  }

  isLoading() {
    return this.currentState == this.STATE_LOADING;
  }

  isPlaying() {
    return this.currentState == this.STATE_PLAYING;
  }

  isComplete() {
    return this.currentState == this.STATE_COMPLETE;
  }

  isFail() {
    return this.currentState == this.STATE_FAIL;
  }
}
