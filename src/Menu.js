class Menu {
  constructor(gameController) {
    this.canvas = gameController.getMenuCanvas();
    this.stateManager = gameController.getStateManager();
    this.controller = gameController;

    this.ctx = this.canvas.getContext("2d");

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.menuItems = [];
    this.buttons = [];

    this._dirty = true;

    this.addListeners();
  }

  addListeners() {
    // this.canvas.addEventListener("mouseenter", this.mouseEnterHandler);
    this.canvas.addEventListener("mousedown", event => this.mouseDownHandler(event));
  }

  mouseEnterHandler(event) {

  }

  mouseDownHandler(event) {
    if (this.stateManager.isTitle()) {
      // TODO: Find better way to get local canvas coordinates.
      var mx = event.pageX - this.canvas.offsetLeft - 8;
      var my = event.pageY - this.canvas.offsetTop;

      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].handleMouseDown(mx, my);
      }
    }
  }

  createButton(x, y, w, h, text, clickHandler) {
    var mb = new MenuButton(x, y, w, h, text, clickHandler);
    this.buttons.push(mb);

    this.dirty();

    return mb;
  }

  removeButton(button) {
    var idx = this.buttons.indexOf(button);
    if (idx >= 0) {
      this.buttons.splice(idx, 1);
      this.dirty();
    }
  }

  createTextField(x, y, text) {
    var tf = new TextField(x, y, text, this);
    this.menuItems.push(tf);

    this.dirty();

    return tf;
  }

  createTimeDisplay(x, y) {
    var td = new TimeDisplay(x, y, this);
    this.menuItems.push(td);

    this.dirty();

    return td;
  }

  dirty() {
    this._dirty = true;
  }

  update() {
    // Probably don't need to follow the standard update/render pattern with this.
    // for (var i = 0; i < this.menuItems.length; i++) {
    //   this.menuItems[i].update();
    // }
  }

  render() {
    if (this._dirty) {
      this.ctx.fillStyle = "#999999";
      this.ctx.fillRect(0, 0, this.width, this.height);

      var i;
      for (i = 0; i < this.menuItems.length; i++) {
        this.menuItems[i].render(this.ctx);
      }

      for (i = 0; i < this.buttons.length; i++) {
        this.buttons[i].render(this.ctx);
      }

      this._dirty = false;
    }
  }
}
