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
  constructor(width, height, def) {
    this.width = width;
    this.height = height;
    var buf = [];
    for (var y = 0; y < height; y++) {
      var row = [];
      for (var x = 0; x < width; x++) {
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
    this.buf[p.y][p.x] = v;
  }

  force() {
    return this.buf.map((row, y) => {
      return row.map((f, x) => f(new Pos(y, x)));
    });
  }
}
