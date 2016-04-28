import {Texture, Background, asciiBlock} from '../game/assets';
import {Bounds} from '../game/graphics';
import Entity from '../game/entity';

export const background = Background.create(asciiBlock(`
+--+///+--+
|P |///|  |
|  +---+  +----------------------------------------+///////+--------------------------+
|                                                  |///////|                          |
|                    I                             |///////|                          |
|                                                  |///////|                          |
|                                                  |///////|                          |
|          T                                       |///////|         B                |
|                                                  |///////|                          |
|                                                  +-------+G                         |
|                                                                                     |
|                                                                                     |
|                                                               E                     |
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
  E: {name: 'enemy', c: ' '},
  N: {name: 'news', c: ' '},
  G: {name: 'greeter', c: ' '},
});

const player = new Entity(
  "Player - level 3 wizard",
  background.loc('player'),
  Texture.create("@")
);

const start = new Entity(
  "Start",
  background.loc('start'),
  Texture.create("(start)")
);

const news = new Entity(
  "News",
  background.loc('news'),
  Texture.create("(news)")
);

const manager = new Entity(
  "Manager",
  background.loc('manager'),
  Texture.create("M")
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
  greeter,
  bossA,
  bossB,
  enemy,
  table
};

export const viewSize = new Bounds(25, 60);
