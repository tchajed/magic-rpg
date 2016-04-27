import {Texture, Background, asciiBlock} from '../game/assets';
import {Coords, Bounds} from '../game/graphics';
import Entity from '../game/entity';

export const background = Background.create(asciiBlock(`
+--------------------------------------------------+///////+--------------------------+
|                                                  |///////|                          |
|  1                                               |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
|          2                                       |///////|         5                |
|                                                  |///////|                          |
|                                                  +-------+                          |
|                                                                                     |
|                                                                                     |
|                                                                                     |
|                                                  +-------+                          |
|                                                  |///////|                          |
|          3                             4         |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
+--------------------------------------------------+///////+--------------------------+
`), {
  1: {name: 'player', c: ' '},
  2: {name: 'table', c:' '},
  3: {name: 'manager', c:' '},
  4: {name: 'bossA', c: ' '},
  5: {name: 'bossB', c: ' '},
});

const player = new Entity(
  background.loc('player'),
  Texture.create("@@\n@@")
);

const manager = new Entity(
  background.loc('manager'),
  Texture.create("M")
);

const bossA = new Entity(
  background.loc('bossA'),
  Texture.create("A")
);

const bossB = new Entity(
  background.loc('bossB'),
  Texture.create("B")
);

const table = new Entity(
  background.loc('table'),
  Texture.create(asciiBlock(`
/-----/
|#####|
|#####|
|#####|
|#####|
/-----/
`))
);

export const objects = {
  player,
  manager,
  bossA,
  bossB,
  table
};

export const viewSize = new Bounds(25, 60);
