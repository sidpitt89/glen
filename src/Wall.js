class Wall extends Entity{
  constructor(info) {
    super(info);
  }

  update(dT) {

  }

  render(r) {
    r.setProgram(this.programInfo);
    super.render(r);
    r.resetProgram();
  }
}
