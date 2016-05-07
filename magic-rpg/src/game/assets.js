import _ from 'lodash';
import {Bounds, Coords, Delta} from './graphics';
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

// helper to use string constants as textures - strips everything up till the
// first newline and after the last newline, so that
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

  // Create a new texture based on attaching bg2 to bg1 at a common named
  // location marker such that bg2's named pivot is positioned at bg1's named
  // location. Any overlap is taken from bg2.
  static stitch(bg1, bg2, marker) {
    let loc = bg1.loc(marker);
    let pivot = bg2.loc(marker);
    let translate21 = Delta.of(loc, pivot);
    let bg2UL = translate21.apply(Coords.zero);
    let bg2LR = translate21.apply(new Coords(bg2.bounds.height, bg2.bounds.width));
    let newUL = new Coords(Math.min(0, bg2UL.y), Math.min(0, bg2UL.x));
    let newLR = new Coords(Math.max(bg2LR.y, bg1.bounds.height), Math.max(bg2UL.x, bg1.bounds.width));
    let newSize = new Bounds(newLR.y - newUL.y, newLR.x - newUL.x);
    let translation1 = Delta.of(Coords.zero, newUL);
    let translation2 = translate21.plus(translation1);

    let emptyArray = (bounds, def) => {
      return _.times(bounds.height, () => {
        return _.times(bounds.width, () => def);
      });
    };

    let cells = emptyArray(newSize, 'x');
    let mask = emptyArray(newSize, false);
    let traversable = emptyArray(newSize, false);
    let locs = new Map();

    let copyFrom = (bg, translation) => {
      _.times(bg.bounds.height, (y) => {
        _.times(bg.bounds.width, (x) => {
          let newCoords = translation.apply(new Coords(y, x));
          cells[newCoords.y][newCoords.x] = bg.cells[y][x];
          mask[newCoords.y][newCoords.x] = bg._mask[y][x];
          traversable[newCoords.y][newCoords.x] = bg.traversable[y][x];
        });
      });

      for (let [loc, coords] of bg.metadata.locs.entries()) {
        locs.set(loc, translation.apply(coords));
      }
    };

    copyFrom(bg1, translation1);
    copyFrom(bg2, translation2);

    return new Background(cells, mask, traversable, {locs});
  }
}
