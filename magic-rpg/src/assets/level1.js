import {Texture, Background, asciiBlock} from '../game/assets';
import Entity from '../game/entity';

export const background = Background.create(asciiBlock(`
1-----------------------------------------------------+
|                                                     |
|  2                                                  |
|                                                     |
|                                                     |
|                                                     |
|               3                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
+-----------------------------------------------------+
`), {
  1: {name: 'view', c: '+'},
  2: {name: 'player', c: ' '},
  3: {name: 'table', c:' '},
});

export const player = new Entity(
  background.loc('player'),
  Texture.create("@@\n@@")
);

export const table = new Entity(
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

export const view = {
  coords: background.loc('view'),
  size: background.bounds,
};
