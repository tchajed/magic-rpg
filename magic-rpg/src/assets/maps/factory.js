import {Texture, asciiBlock, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './factory.map.txt';

const background = Background.create(map, {
  4: {name: 'stitch4'},
  5: {name: 'stitch5'},
  I: {name: 'plant-manager'},
  B: {name: 'bridge'},
  W: {name: 'bridge-worker'},
}).boxDrawing();

const objects = () => {
  return {
    'plant-manager': new Entity(
      Texture.create("!"),
      {name: 'Plant manager'}
    ),
    'bridge-worker': new Entity(
      Texture.create("!"),
      {name: 'Bridge construction worker'}
    ),
    'bridge': new Entity(
      {
        'default': Texture.create(asciiBlock(`
###############
###############
###############
`)),
        'halfway': Texture.create(asciiBlock(`
#######
#######
#######
`)),
        'almost-done': Texture.create(asciiBlock(`
#
#
#
`)),
        'done': Texture.create(""),
      },
      {name: 'Bridge'}
    ),
  };
};

export default new LevelMap("factory", background, objects);
