import _ from 'lodash';
import {Bounds, Coords} from './graphics';
import boxDrawing from './boxDrawing';

const parseDesc = function(desc) {
    let lines = desc.split("\n");
    return _.map(lines, (line) => {
      let row = _.times(line.length, (i) => line.charAt(i));
      return row;
    });
};

export class Texture {
  constructor(cells) {
    this.cells = cells;
  }

  // destructively turn corner cells into box drawing symbols
  boxDrawing() {
    boxDrawing(this.cells);
    return this;
  }

  static create(desc) {
    return new Texture(parseDesc(desc));
  }

  get height() {
    return this.cells.length;
  }

  get width() {
    return this.cells[0].length;
  }

  get bounds() {
    return new Bounds(this.height, this.width);
  }

  // takes y, x
  mask() {
    return true;
  }
}

// helper to use string constants as textures - strips everything up till the first newline and after the last newline, so that
//    foo = `
//    12
//    34
//    `
// works as expected. Note that no de-indentation is performed.
export const asciiBlock = (s) => {
  var first = s.indexOf("\n");
  var last = s.lastIndexOf("\n");
  return s.substring(first+1, last);
};

const parseNames = (cells, labelToNameMapping) => {
  let nameToLocs = new Map();
  _.each(cells, (row, y) => {
    _.each(row, (cell, x) => {
      let info = labelToNameMapping[cell];
      if (info !== undefined) {
        if (nameToLocs.has(info.name)) {
          throw new Error(`duplicate shortcut ${cell} seen at (${y}, ${x})`);
        }
        nameToLocs.set(info.name, new Coords(y, x));
        cells[y][x] = info.c || ' ';
      }
    });
  });
  return nameToLocs;
};

export class Background extends Texture {
  constructor(cells, mask, traversable, metadata) {
    super(cells);
    this._mask = mask;
    this.traversable = traversable;
    this.metadata = metadata;
  }

  mask(y, x) {
    return this._mask[y][x];
  }

  static create(desc, labelToNameMapping) {
    let cells = parseDesc(desc);
    let nameToLocs = parseNames(cells, labelToNameMapping);
    let mask = _.map(cells, (row) => {
      return _.map(row, (cell) => cell !== 'x');
    });
    let traversable = _.map(cells, (row) => {
      return _.map(row, (cell) => cell === ' ');
    });
    return new Background(cells, mask, traversable, {
      locs: nameToLocs,
    });
  }

  loc(name) {
    if (!this.metadata.locs.has(name)) {
      throw new Error(`invalid named location ${name}`);
    }
    return this.metadata.locs.get(name);
  }

  collides(coords, size) {
    for (var dy = 0; dy < size.height; dy++) {
      for (var dx = 0; dx < size.width; dx++) {
        if (!this.mask(coords.y + dy, coords.x + dx) ||
          !this.traversable[coords.y + dy][coords.x + dx]) {
          return true;
        }
      }
    }
    return false;
  }
}
