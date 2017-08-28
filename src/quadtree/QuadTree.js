class QuadTree {
  constructor(bounds, maxDepth, maxChildren) {
    this.root = new QTNode(bounds, 0, maxDepth, maxChildren);
  }

  insert(item, isArray) {
    if (isArray) {
      for (var i = 0; i < item.length; i++) {
        this.root.insert(item[i]);
      }
    }
    else {
      this.root.insert(item);
    }
  }

  clear() {
    this.root.clear();
  }

  retrieve(item) {
    return this.root.retrieve(item);
  }

  retrieveInBounds(bounds) {
    var treeResult = this.root.retrieveInBounds(bounds);
    var filteredResult = [];

    for (var i = 0; i < treeResult.length; i++) {
      var node = treeResult[i];

      if (this.areBoundsOverlapping(node, bounds)) {
        filteredResult.push(node);
      }
    }

    return filteredResult;
  }

  areBoundsOverlapping(ba, bb) {
    // return !(b1.x > (b2.x + b2.w) || b2.x > (b1.x + b1.w) || b1.y > (b2.y + b2.h) || b2.y > (b1.y + b1.h));
    var b1 = this.offsetBounds(ba);
    var b2 = this.offsetBounds(bb);
    return (b1.x <= (b2.x + b2.w) && b2.x <= (b1.x + b1.w) && b1.y <= (b2.y + b2.h) && b2.y <= (b1.y + b1.h));
  }

  offsetBounds(b) {
    // Convert (x, y)-as-center bounds to (x, y)-as-corner bounds
    return {
      x : b.x - (b.w / 2),
      y : b.y - (b.h / 2),
      w : b.w,
      h : b.h
    };
  }

  render() {
    // if (this.rendered) {
    //   return;
    // }

    if (!this.canvas) {
      this.canvas = document.getElementById("qtTestCanvas");
      this.ctx = this.canvas.getContext("2d");
    }

    this.ctx.clearRect(0, 0, this.root.bounds.w, this.root.bounds.h);
    this.ctx.lineWidth = "2";
    this.ctx.strokeStyle = "#000000";
    this.ctx.beginPath();
    this.root.render(this.ctx);
    this.ctx.stroke();

    this.rendered = true;
  }
}

class QTNode {
  constructor(bounds, depth, maxDepth, maxChildren) {
    this.bounds = bounds;
    this.children = [];
    this.nodes = [];
    this.stuckChildren = [];

    this.maxChildren = maxChildren || 4;
    this.maxDepth = maxDepth || 4;
    this.depth = depth || 0;

    this.holder = [];

    // Node indices
    this.BLI = 0;
    this.BRI = 1;
    this.TLI = 2;
    this.TRI = 3;
  }

  render(ctx) {
    ctx.rect(this.bounds.x, 600 - this.bounds.y, this.bounds.w, -this.bounds.h);
    if (this.nodes.length) {
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].render(ctx);
      }
    }
  }

  offsetBounds(b) {
    // Convert (x, y)-as-center bounds to (x, y)-as-corner bounds
    return {
      x : b.x - (b.w / 2),
      y : b.y - (b.h / 2),
      w : b.w,
      h : b.h
    };
  }

  inBounds(o, nb) {
    return (o.x >= nb.x && (o.x + o.w) <= (nb.x + nb.w) &&
            o.y >= nb.y && (o.y + o.h) <= (nb.y + nb.h));
  }

  insert(o) {
    if (this.nodes.length) {
      var index = this.findIndex(o);
      var node = this.nodes[index];
      if (this.inBounds(this.offsetBounds(o), node.bounds)) {
        node.insert(o);
      }
      else {
        this.stuckChildren.push(o);
      }
      return;
    }

    this.children.push(o);
    var length = this.children.length;

    if (!(this.depth >= this.maxDepth) && length > this.maxChildren) {
      this.subdivide();

      for (var i = 0; i < length; i++) {
        this.insert(this.children.shift());
      }
    }
  }

  findIndex(obj) {
    var b = this.bounds;
    var o = this.offsetBounds(obj);
    var left = o.x <= b.x + (b.w / 2);
    var top = o.y >= b.y + (b.h / 2);

    var i = this.TLI;
    if (left) {
      if (!top) {
        i = this.BLI;
      }
    }
    else {
      if (top) {
        i = this.TRI;
      }
      else {
        i = this.BRI;
      }
    }

    return i;
  }

  subdivide() {
    var depth = this.depth + 1;
    var bx = this.bounds.x;
    var by = this.bounds.y;
    var bwh = this.bounds.w / 2;
    var bhh = this.bounds.h / 2;

    this.nodes[this.BLI] = new QTNode({x : bx , y : by, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
    this.nodes[this.BRI] = new QTNode({x : bx + bwh, y : by, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
    this.nodes[this.TLI] = new QTNode({x : bx, y : by + bhh, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
    this.nodes[this.TRI] = new QTNode({x : bx + bwh, y : by + bhh, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
  }
  getChildren() {
    return this.children.concat(this.stuckChildren);
  }

  inRange(x, l, u) {
    return (x >= l && x <= u);
  }

  areBoundsOverlapping(b1, b2) {
    return (b1.x <= (b2.x + b2.w) && b2.x <= (b1.x + b1.w) && b1.y <= (b2.y + b2.h) && b2.y <= (b1.y + b1.h));
  }

  retrieve(o) {
    this.holder = [];

    if (this.nodes.length) {
      var index = this.findIndex(o);
      var node = this.nodes[index];

      if (this.inBounds(o, node.bounds)) {
        this.holder.push.apply(this.holder, node.retrieve(o));
      }
      else {
        //Part of the item overlaps multiple child nodes.
        //For each of the overlapping nodes, return all containing objects.

        var ob = this.offsetBounds(o);
        if (this.areBoundsOverlapping(ob, this.nodes[this.TRI].bounds)) {
          this.holder.push.apply(this.holder, this.nodes[this.TRI].getAllContent());
        }
        if (this.areBoundsOverlapping(ob, this.nodes[this.TLI].bounds)) {
          this.holder.push.apply(this.holder, this.nodes[this.TLI].getAllContent());
        }
        if (this.areBoundsOverlapping(ob, this.nodes[this.BRI].bounds)) {
          this.holder.push.apply(this.holder, this.nodes[this.BRI].getAllContent());
        }
        if (this.areBoundsOverlapping(ob, this.nodes[this.BLI].bounds)) {
          this.holder.push.apply(this.holder, this.nodes[this.BLI].getAllContent());
        }

      }
    }

    this.holder.push.apply(this.holder, this.stuckChildren);
    this.holder.push.apply(this.holder, this.children);

    return this.holder;
  }

  retrieveInBounds(bounds) {
    var result = [];
    var ob = this.offsetBounds(bounds);
    if (this.areBoundsOverlapping(ob, this.bounds)) {
      result = result.concat(this.stuckChildren);

      if (this.children.length) {
        result = result.concat(this.children);
      }
      else if (this.nodes.length) {
        for (var i = 0; i < this.nodes.length; i++) {
          result = result.concat(this.nodes[i].retrieveInBounds(bounds));
        }
      }
    }

    return result;
  }

  getAllContent() {
    var c = [];
    if (this.nodes.length) {
      for (var i = 0; i < this.nodes.length; i++) {
        c.push.apply(c, this.nodes[i].getAllContent);
      }
    }
    c.push.apply(c, this.getChildren());
    return c;
  }

  clear() {
    this.stuckChildren = [];
    this.children = [];

    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }

    this.nodes = [];
  }
}
