import _ from 'lodash';
import {Texture, Background, asciiBlock} from '../game/assets';
import {Bounds} from '../game/graphics';
import Entity from '../game/entity';

function boxDrawing(cells) {
    let getCell = (y, x) => {
        if (0 <= y && y < cells.length) {
            if (0 <= x && x < cells[y].length) {
                return cells[y][x];
            }
        }
        return null;
    }
    let expected = ['|', '-', '|', '-'];
    let arrayMatch = (mask, a) => {
        for (var i = 0; i < 4; i++) {
            if (mask[i] && expected[i] !== a[i]) {
                return false
            }
        }
        return true;
    }
    let replacement = (surr) => {
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
            if (!r && arrayMatch(mask, surr)) {
                r = repl;
            }
        });
        return r;
    }
    _.each(cells, (row, y) => {
        _.each(row, (cell, x) => {
            if (cell === '+') {
                let surroundings = [
                    getCell(y-1, x),
                    getCell(y,x+1),
                    getCell(y+1, x),
                    getCell(y,x-1)
                ];
                let repl = replacement(surroundings);
                if (repl) {
                    cells[y][x] = repl;
                }
            }
        });
    });
    _.each(cells, (row, y) => {
        _.each(row, (cell, x) => {
            if (cell === '-') {
                cells[y][x] = '─';
            }
        });
    });
}

export const background = Background.create(asciiBlock(`
+--+xxx+--+
|  |xxx|  |
|  +---+  +----------------------------------------+xxxxxxx+--------------------------+
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|         B                |
|                                                  |xxxxxxx|                          |
|                                                  +-------+G                         |
|                                                                                     |
|                                                                                     |
|                                                               E                     |
|                                                  +-------+                          |
|                                                  |xxxxxxx|                          |
|                                        A         |xxxxxxx|        N                 |
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|                          |
|                                                  |xxxxxxx|                          |
+-----+     +--------------------------------------+xxxxxxx+--------------------------+
xxxxxx|     |
xxxxxx|     +-------------------------------------------------------------------------------------------+
xxxxxx|                                                                                                 |
xxxxxx|                                                                                                 |
xxxxxx+------------------------------------------------------------------------------------------       |
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|       |
+-----------------------------------------------+---------+-------+----------+--------+xxxxxxxxx|       |
|                                               |      M  |       |          |        |xxxxxxxxx|       |
|        |   |   |               |   |   |      |  ####   |       |          |        |xxxxxxxxx|       |
|        |P  |   |               |   |   |      |  ####   |       |          |        |xxxxxxxxx|       |
|     ---+---+---+---         ---+---+---+---   |         |       |          |        |xxxxxxxxx|       |
|        |   |   |               |   |   |      |         |       |          |        |xxxxxxxxx|       |
|        |   |   |               |   |   |      +-- ------+       +------- --+        |xxxxxxxxx|       |
|                                                                                     |xxxxxxxxx|       |
|                                                                                     |xxxxxxxxx|       |
|        |   |   |               |   |   |                                            |xxxxxxxxx|       |
|        |   |   |               |   |   |                                            +---------+       |
|     ---+---+---+---         ---+---+---+---                                                           |
|        |   |   |               |   |   |                                                              |
|        |   |   |               |   |   |                                                              |
|                                                                                     +-----------------+
|                                                                                     |
|       +--------------------  ---+                                                   |
|       |                         |                                                   |
|       |  T                      |                                                   |
|       |                         |                                                   |
|       |                         |                                                   |
|       |                         |                                                   |
|       |                         |                                                   |
|       |                         |                                                   |
+-------+-------------------------+---------------------------------------------------+
`), {
  P: {name: 'player', c: ' '},
  T: {name: 'table', c: ' '},
  M: {name: 'manager', c: ' '},
  A: {name: 'bossA', c: ' '},
  B: {name: 'bossB', c: ' '},
  E: {name: 'enemy', c: ' '},
  N: {name: 'news', c: ' '},
  G: {name: 'greeter', c: ' '},
});

boxDrawing(background.cells);

const player = new Entity(
  "Player - level 3 wizard",
  background.loc('player'),
  Texture.create("@")
);

const news = new Entity(
  "News",
  background.loc('news'),
  Texture.create("(news)")
);

const manager = new Entity(
  "Manager",
  background.loc('manager'),
  {
    default: Texture.create("!"),
    seen: Texture.create("M"),
  }
);

const greeter = new Entity(
  "greeter",
  background.loc('greeter'),
  Texture.create("*")
);

const bossA = new Entity(
  "Boss 1",
  background.loc('bossA'),
  Texture.create("A")
);

const bossB = new Entity(
  "Final Boss",
  background.loc('bossB'),
  Texture.create("B")
);

const enemy = new Entity(
  "Generic enemy",
  background.loc('enemy'),
  Texture.create("E")
);

const table = new Entity(
  "Table",
  background.loc('table'),
  Texture.create(asciiBlock(`
/----------/
|##########|
|##########|
|##########|
/----------/
`))
);

export const objects = {
  player,
  news,
  manager,
  greeter,
  bossA,
  bossB,
  enemy,
  table
};

export const viewSize = new Bounds(25, 60);
