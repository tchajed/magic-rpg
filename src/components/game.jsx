export class Bounds {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  contains(pos, size) {
    if (size === undefined) {
      size = {width: 1, height: 1};
    }
    if (0 <= pos.x && 0 <= pos.y &&
      pos.x <= this.width - size.width &&
      pos.y <= this.height - size.height
    ) {
      return true
    }
    return false;
  }
}

// TODO: make this a factory and avoid using new to construct them
export class Pos {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    plus(dy, dx) {
        return new Pos(this.y + dy, this.x + dx);
    }

    toString() {
      return `Pos(${this.y}, ${this.x})`;
    }
}

/**
 * A lazy 2D graphics buffer
 */
export class Buffer {
  constructor(bounds, def) {
    this.bounds = bounds;
    var buf = [];
    for (var y = 0; y < bounds.height; y++) {
      var row = [];
      for (var x = 0; x < bounds.width; x++) {
        row.push(def);
      }
      buf.push(row);
    }
    this.buf = buf;
  }

  /**
   * destructively set the value at a position
   */
  set(p, v) {
    if (this.bounds.contains(p)) {
      this.buf[p.y][p.x] = v;
    }
  }

  force() {
    return this.buf.map((row, y) => {
      return row.map((f, x) => f(new Pos(y, x)));
    });
  }
}
