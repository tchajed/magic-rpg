import {Texture, Background, asciiBlock} from '../game/assets';
import {Bounds} from '../game/graphics';
import Entity from '../game/entity';

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
  P: {name: 'player'},
  T: {name: 'table'},
  M: {name: 'manager'},
  A: {name: 'bossA'},
  B: {name: 'bossB'},
  E: {name: 'enemy'},
  N: {name: 'news'},
  G: {name: 'greeter'},
}).boxDrawing();

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
