import _ from 'lodash';
import {Bounds, Coords, Delta} from './graphics';
import boxDrawing from './boxDrawing';

const parseDesc = function(desc) {
    let lines = _.filter(desc.split("\n"), (line) => {
      return line.length > 0;
    });
    if (lines.length === 0) {
      return [[]];
    }
    let width = _.max(_.map(lines, (l) => l.length));
    return _.map(lines, (line) => {
      return _.times(width, (i) => {
        if (i < line.length) {
          return line.charAt(i);
        } else {
          return 'x';
        }
      });
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
  constructor(cells, cellProps, metadata) {
    super(cells);
    this.cellProps = cellProps;
    this.metadata = metadata;
  }

  mask(y, x) {
    if (this.cellProps[y] === undefined ||
        this.cellProps[y][x] === undefined) {
      return false;
    }
    return this.cellProps[y][x].mask;
  }

  traversable(y, x) {
    return this.cellProps[y][x].traversable;
  }

  room(y, x) {
    return this.cellProps[y][x].room;
  }

  static create(desc, labelToNameMapping) {
    let cells = parseDesc(desc);
    let nameToLocs = parseNames(cells, labelToNameMapping);
    let cellProps = _.map(cells, (row) => {
      return _.map(row, (cell) => {
        return {
          mask: cell !== 'x',
          traversable: cell === ' ',
        };
      });
    });
    return new Background(cells, cellProps, {
      locs: nameToLocs,
    });
  }

  setRoom(name) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cellProps[y][x].room = name;
      }
    }
    return this;
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
        let y = coords.y + dy,
          x = coords.x + dx;
        if (!this.mask(y, x) ||
          !this.traversable(y, x)) {
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
    let newUL = new Coords(Math.min(0, bg2UL.y),
                           Math.min(0, bg2UL.x));
    let newLR = new Coords(Math.max(bg2LR.y, bg1.bounds.height),
                           Math.max(bg2LR.x, bg1.bounds.width));
    let newSize = new Bounds(newLR.y - newUL.y, newLR.x - newUL.x);
    let translation1 = Delta.of(Coords.zero, newUL);
    let translation2 = translate21.plus(translation1);

    let emptyArray = (bounds, def) => {
      return _.times(bounds.height, () => {
        return _.times(bounds.width, () => def);
      });
    };

    let cells = emptyArray(newSize, 'x');
    let cellProps = emptyArray(newSize, {
      mask: false,
      traversable: false,
      room: 'none',
    });
    let locs = new Map();

    let copyFrom = (bg, translation) => {
      for (let y = 0; y < bg.bounds.height; y++) {
        for (let x = 0; x < bg.bounds.width; x++) {
          let newCoords = translation.apply(new Coords(y, x));
          if (bg.cellProps[y][x].mask) {
            cells[newCoords.y][newCoords.x] = bg.cells[y][x];
            cellProps[newCoords.y][newCoords.x] = _.clone(bg.cellProps[y][x]);
          }
        }
      }

      bg.metadata.locs.forEach((coords, loc) => {
        locs.set(loc, translation.apply(coords));
      });
    };

    copyFrom(bg1, translation1);
    copyFrom(bg2, translation2);

    return new Background(cells, cellProps, {locs});
  }
}
