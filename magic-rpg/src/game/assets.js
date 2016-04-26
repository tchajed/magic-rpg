import _ from 'lodash';
import {Bounds, Coords} from './graphics';

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
        cells[y][x] = info.c;
      }
    });
  });
  return nameToLocs;
};

export class Background extends Texture {
  constructor(cells, mask, metadata) {
    super(cells);
    this.mask = mask;
    this.metadata = metadata;
  }

  static create(desc, labelToNameMapping) {
    let cells = parseDesc(desc);
    let nameToLocs = parseNames(cells, labelToNameMapping);
    let mask = _.map(cells, (row) => {
      return _.map(row, (cell) => cell === ' ');
    });
    return new Background(cells, mask, {
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
        if (!this.mask[coords.y + dy][coords.x + dx]) {
          return true;
        }
      }
    }
    return false;
  }
}
