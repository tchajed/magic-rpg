import {Texture, Background, asciiBlock} from '../game/assets';
import {Coords, Bounds} from '../game/graphics';
import Entity from '../game/entity';

export const background = Background.create(asciiBlock(`
+--------------------------------------------------+///////+--------------------------+
|                                                  |///////|                          |
|  P                 I                             |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
|          T                                       |///////|         B                |
|                                                  |///////|                          |
|                                                  +-------+                          |
|                                                                                     |
|                                                                                     |
|                                                                                     |
|                                                  +-------+                          |
|                                                  |///////|                          |
|          M                             A         |///////|        N                 |
|                                                  |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
+--------------------------------------------------+///////+--------------------------+
`), {
  P: {name: 'player', c: ' '},
  I: {name: 'start', c: ' '},
  T: {name: 'table', c: ' '},
  M: {name: 'manager', c: ' '},
  A: {name: 'bossA', c: ' '},
  B: {name: 'bossB', c: ' '},
  N: {name: 'news', c: ' '},
});

const player = new Entity(
  background.loc('player'),
  Texture.create("@")
);

const start = new Entity(
  background.loc('start'),
  Texture.create("(start)")
);

const news = new Entity(
  background.loc('news'),
  Texture.create("(news)")
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
  start,
  news,
  manager,
  bossA,
  bossB,
  table
};

export const viewSize = new Bounds(25, 60);
