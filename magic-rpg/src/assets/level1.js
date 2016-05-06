import {Texture, Background, asciiBlock} from '../game/assets';
import {Bounds} from '../game/graphics';
import Entity from '../game/entity';

export const background = Background.create(asciiBlock(`
+-----------------------------------------------+---------+-------+----------+--------+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
|                                               |      M  |       |          |        |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
|        |   |   |               |   |   |      |  ####   |       |          |        |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
|        |P  |   |               |   |   |      |  ####   |       |          |        |xxxxxxxxx+------------------------------------------------------------------------------------------+
|     ---+---+---+---         ---+---+---+---   |         |       |          |        |xxxxxxxxx|                                                                                          |
|        |   |   |               |   |   |      |         |       |          |        |xxxxxxxxx|                                                                                          |
|        |   |   |               |   |   |      +-- ------+       +------- --+        |xxxxxxxxx|                                                                                          |
|                                                                                     |xxxxxxxxx|          /--\\                                                                            |
|                                                                                     |xxxxxxxxx|         /####\\                                                                           |
|        |   |   |               |   |   |                                            |xxxxxxxxx|         +----+                                                                           |
|        |   |   |               |   |   |                                            +---------+         |    |                                                                           |
|     ---+---+---+---         ---+---+---+---                                                             |    |                                                                           |
|        |   |   |               |   |   |                                                                +----+                                                                           |
|        |   |   |               |   |   |                                                                                                                                                 |
|                                                                                     +---------+                                                                                          |
|                                                                                     |xxxxxxxxx|                                                                                          |
|       +--------------------  ---+                                                   |xxxxxxxxx|                                                                                          |
|       |                         |                    N                              |xxxxxxxxx|                                                                                          |
|       |  T                      |                                                   |xxxxxxxxx|                                                                                          |
|       |                         |                                                   |xxxxxxxxx|                                                                                          |
|       |                         |                                                   |xxxxxxxxx|                                                                                          |
|       |                         |                                                   |xxxxxxxxx+------------------------------------------------------------------------------------------+
|       |                         |                                                   |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
|       |                         |                                                   |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
+-------+-------------------------+---------------------------------------------------+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`), {
  P: {name: 'player'},
  T: {name: 'table'},
  M: {name: 'manager'},
  N: {name: 'news'},
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
  table
};

export const viewSize = new Bounds(25, 60);
