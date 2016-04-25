import _ from 'lodash';

export class Bounds {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

export class Coords {
  constructor(y, x) {
    this.y = y;
    this.x = x;
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
      return _.times(size.width, () => new Cell());
    });
  }

  renderAt(basePos, cells, objectId, selected=false) {
    _.each(cells, (row, dy) => {
      _.each(row, (c, dx) => {
        let y = basePos.y + dy,
        x = basePos.x + dx;
        this.cells[y][x] = new Cell(c, objectId, selected);
      });
    });
  }

  compressed() {
    let accum = null;
    let rendered = [];
    for (let y = 0; y < this.size.height; y++) {
      for (var x = 0; x < this.size.width; x++) {
        var cell = this.cells[y][x];
        // initialize with first cell
        if (x === 0 && y === 0) {
          accum = cell.copy();
          continue;
        }
        if (cell.objectId === accum.objectId) {
          accum.text += cell.text;
        } else {
          rendered.push(accum);
          accum = cell.copy();
        }
      }
    }
    rendered.push(accum);
    return rendered;
  }
}
