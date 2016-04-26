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

  static fromDesc(desc) {
    return new Texture(parseDesc(desc));
  }

  static background(desc) {
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

export const asciiBlock = (s) => {
  var first = s.indexOf("\n");
  var last = s.lastIndexOf("\n");
  return s.substring(first+1, last);
};
