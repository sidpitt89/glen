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
    this.addButtons();
  }

  addListeners() {
    var me = this;
    // this.canvas.addEventListener("mouseenter", this.mouseEnterHandler);
    this.canvas.addEventListener("mousedown", function(event) {
      me.mouseDownHandler(event);
    });
  }

  addButtons() {
    this.buttons = [];
    var me = this;
    var b = new MenuButton(20, 300, 60, 60, "Test", function() {
      me.buttonClickTest();
    });

    this.buttons.push(b);
  }

  mouseEnterHandler(event) {

  }

  buttonClickTest() {
    this.controller.notifyMenuClicked();
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

      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].render(this.ctx);
      }
    }
  }
}
