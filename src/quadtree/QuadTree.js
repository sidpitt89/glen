class QuadTree {
  constructor(bounds, maxDepth, maxChildren) {
    this.root = new QTNode(bounds, 0, maxDepth, children);
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
    this.TLI = 0;
    this.TRI = 1;
    this.BLI = 2;
    this.BRI = 3;
  }

  inBounds(o, nb) {
    return (o.x >= nb.x && (o.x + o.w) <= (nb.x + nb.w) &&
            o.y >= nb.y && (o.y + o.h) <= (nb.y + nb.h));
  }

  insert(o) {
    if (this.nodes.length) {
      var index = this.findIndex(o);
      var node = this.nodes[index];
      if (this.inBounds(o, node.bounds)) {
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

  findIndex(o) {
    var b = this.bounds;
    var left = o.x <= b.x + (b.w / 2);
    var top = o.y <= b.y + (b.h / 2);

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

    this.nodes[this.TLI] = new Node({x : bx , y : by, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
    this.nodes[this.TRI] = new Node({x : bx + bwh, y : by, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
    this.nodes[this.BLI] = new Node({x : bx, y : by + bhh, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
    this.nodes[this.BRI] = new Node({x : bx + bwh, y : by + bhh, w : bwh, h: bhh}, depth, this.maxDepth, this.maxChildren);
  }
  getChildren() {
    return this.children.concat(this.stuckChildren);
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

        // TODO: my y-coordinates are probably reversed here.
        // TODO: also, my (x, y) represents the center of an object, so that probably needs to be addressed as well.
        if (o.x <= this.nodes[this.TRI].bounds.x) {
          if (o.y <= this.nodes[this.BLI].bounds.y) {
            this.holder.push.apply(this.holder, this.nodes[this.TLI].getAllContent());
          }
          if (o.y + o.h > this.nodes[this.BLI].bounds.y) {
            this.holder.push.apply(this.holder, this.nodes[this.BLI].getAllContent());
          }
        }

        if (o.x + o.w > this.nodes[this.TRI].bounds.x) {
          if (o.y <= this.nodes[this.BRI].bounds.y) {
            this.holder.push.apply(this.holder, this.nodes[this.TRI].getAllContent());
          }
          if (o.y + o.h > this.nodes[this.BRI].bounds.y) {
            this.holder.push.apply(this.holder, this.nodes[this.BRI].getAllContent());
          }
        }
      }
    }

    this.holder.push.apply(this.holder, this.stuckChildren);
    this.holder.push.apply(this.holder, this.children);

    return this.holder;
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
