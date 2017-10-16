class Menu {
  constructor(gameController) {
    this.canvas = gameController.getMenuCanvas();
    this.stateManager = gameController.getStateManager();
    this.controller = gameController;

    this.ctx = this.canvas.getContext("2d");

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.menuItems = [];
    this.dirtyItems = [];

    this.addListeners();
  }

  addListeners() {
    var me = this;
    // this.canvas.addEventListener("mouseenter", this.mouseEnterHandler);
    this.canvas.addEventListener("mousedown", function(event) {
      me.mouseDownHandler(event);
    });
  }

  mouseEnterHandler(event) {

  }

  mouseDownHandler(event) {
    if (this.stateManager.isTitle()) {
      this.controller.notifyMenuClicked();
    }
  }

  createTextField(x, y, text) {
    var tf = new TextField(x, y, text, this);
    this.menuItems.push(tf);

    this.notifyChange(tf);

    return tf;
  }

  notifyChange(tf) {
    this.dirtyItems.push(tf);
  }

  update() {
    // Probably don't need to follow the standard update/render pattern with this.
    // for (var i = 0; i < this.menuItems.length; i++) {
    //   this.menuItems[i].update();
    // }
  }

  render() {
    if (this.dirtyItems.length) {
      this.ctx.fillStyle = "#999999";
      this.ctx.fillRect(0, 0, this.width, this.height);

      while (this.dirtyItems.length) {
        this.dirtyItems.shift().render(this.ctx);
      }
    }
  }
}
