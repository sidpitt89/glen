class SoundManager {
  constructor() {
    this.soundMap = {};
  }

  addSound(fileName, alias) {
    var sound = new Audio(fileName);
    this.soundMap[alias] = sound;

    return sound;
  }

  play(alias) {
    if (this.soundMap[alias] != undefined) {
      this.soundMap[alias].play();
    }
  }
}
