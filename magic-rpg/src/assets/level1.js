import {Texture, Background, asciiBlock} from '../game/assets';
import Entity from '../game/entity';

export const background = Background.create(asciiBlock(`
1-----------------------------------------------------+
|                                                     |
|  2                                                  |
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
|                                                     |
|                                                     |
|                                                     |
|                                                     |
+-----------------------------------------------------+
`)).setLocs({
  1: {name: 'initView', c: '+'},
  2: {name: 'playerStart', c: ' '},
});

export const player = new Entity(
  background.loc('playerStart'),
  Texture.create("@@\n@@")
);

export const view = {
  coords: background.loc('initView'),
  size: background.bounds,
};
