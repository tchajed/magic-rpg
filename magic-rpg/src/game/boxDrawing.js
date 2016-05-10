import _ from 'lodash';

function getCell(cells, y, x) {
  if (0 <= y && y < cells.length) {
    if (0 <= x && x < cells[y].length) {
      return cells[y][x];
    }
  }
  return null;
}

function arrayMatch(mask, expected, a) {
  let matchExpected = (e, v) => {
    if (Array.isArray(e)) {
      return e.indexOf(v) !== -1;
    }
    return e === v;
  };
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] && !(matchExpected(expected[i], a[i]))) {
      return false;
    }
  }
  return true;
}

function replacement(surr) {
  let r = null;
  _.each([
    [[true, true, true, true], '┼'],
    [[true, true, true, false], '├'],
    [[true, true, false, true], '┴'],
    [[true, false, true, true], '┤'],
    [[false, true, true, true], '┬'],
    [[true, true, false, false], '└'],
    [[false, true, true, false], '┌'],
    [[true, false, false, true], '┘'],
    [[false, false, true, true], '┐'],
  ], ([mask, repl]) => {
    if (arrayMatch(mask, [
      ['|', '+'],
      ['-', '+'],
      ['|', '+'],
      ['-', '+'],
    ], surr)) {
      r = repl;
      return false;
    }
  });

  return r;
}

export default function boxDrawing(cells) {
  let replacements = [];
    _.each(cells, (row, y) => {
        _.each(row, (cell, x) => {
            if (cell === '+') {
                let surroundings = [
                    getCell(cells, y-1, x),
                    getCell(cells, y, x+1),
                    getCell(cells, y+1, x),
                    getCell(cells, y, x-1),
                ];
                // buffer replacements so we can match on + while computing
                // them
                let repl = replacement(surroundings);
                if (repl) {
                  replacements.push({y, x, repl});
                }
            }
        });
    });
    // replace all +'s
    _.each(replacements, ({y, x, repl}) => {
      cells[y][x] = repl;
    });
    // replace other line-drawing characters
    _.each(cells, (row, y) => {
        _.each(row, (cell, x) => {
            if (cell === '-') {
                cells[y][x] = '─';
            }
        });
    });
}
