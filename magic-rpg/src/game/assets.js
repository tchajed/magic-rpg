import _ from 'lodash';
import {Bounds} from './graphics';

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

export class Background extends Texture {
  constructor(cells, mask) {
    super(cells);
    this.mask = mask;
  }

  static create(desc) {
    let cells = parseDesc(desc);
    let mask = _.map(cells, (row) => {
      return _.map(row, (cell) => cell === ' ');
    });
    return new Background(cells, mask);
  }

  conflicts(coords, size) {
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
