import _ from 'lodash';

export class Bounds {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  contains(coords, size=new Bounds(1, 1)) {
    return (0 <= coords.x && coords.x + size.width <= this.width &&
      0 <= coords.y && coords.y + size.height <= this.height);
  }
}

export class Coords {
  constructor(y, x) {
    this.y = y;
    this.x = x;
  }
}

export class Rectangle {
  constructor(coords, bounds) {
    this.coords = coords;
    this.bounds = bounds;
  }

  collides(rect) {
    // transcribed from
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (this.coords.x < rect.coords.x + rect.bounds.width &&
      this.coords.x + this.bounds.width > rect.coords.x &&
      this.coords.y < rect.coords.y + rect.bounds.height &&
      this.bounds.height + this.coords.y > rect.coords.y) {
      return true;
    }
    return false;
  }
}

export class ViewPort {
  constructor(origin, size) {
    this.rect = new Rectangle(origin, size);
  }

  get origin() {
    return this.rect.coords;
  }

  set origin(coords) {
    this.rect.coords = coords;
  }

  get size() {
    return this.rect.bounds;
  }

  contains(rect) {
    return this.rect.collides(rect);
  }

  containsPoint(coords) {
    this.contains(new Rectangle(coords, new Bounds(1, 1)));
  }

  // translate global coordinates to the local coordinate system
  translate(coords) {
    return new Coords(
      coords.y - this.rect.coords.y,
      coords.x - this.rect.coords.x
    );
  }
}

export class Cell {
  constructor(text, objectId=null, selected=false) {
    this.text = text;
    this.objectId = objectId;
    this.selected = selected;
  }

  toString() {
    return `Cell(${this.text}, ${this.objectId}, ${this.selected})`;
  }

  copy() {
    return new Cell(this.text, this.objectId, this.selected);
  }
}

export class RenderBuffer {
  constructor(size) {
    this.size = size;
    this.cells = _.times(size.height, () => {
      let row = _.times(size.width, () => new Cell(' ', 'empty'));
      row.push(new Cell('\n', 'spacer'));
      return row;
    });
  }

  renderAt(basePos, cells, objectId, selected=false) {
    _.each(cells, (row, dy) => {
      _.each(row, (c, dx) => {
        let y = basePos.y + dy,
        x = basePos.x + dx;
        if (this.size.contains(new Coords(y, x))) {
          this.cells[y][x] = new Cell(c, objectId, selected);
        }
      });
    });
  }

  compressed() {
    let accum = null;
    let rendered = [];
    _.each(this.cells, (row, y) => {
      _.each(row, (cell, x) => {
        // initialize with first cell
        if (x === 0 && y === 0) {
          accum = cell.copy();
          return;
        }
        if (cell.objectId === accum.objectId) {
          accum.text += cell.text;
        } else {
          rendered.push(accum);
          accum = cell.copy();
        }
      });
    });
    rendered.push(accum);
    return rendered;
  }
}
