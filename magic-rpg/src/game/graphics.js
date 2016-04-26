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
      let row = _.times(size.width, () => new Cell());
      row.push(new Cell('\n', 'spacer'));
      return row;
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
