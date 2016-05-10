import _ from 'lodash';
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
  N: {name: 'polyester-dealer'},
  C: {name: 'cotton-dealer'},
  S: {name: 'silk-dealer'},
  F: {name: 'control-dealer'},
  P: {name: 'power-dealer'},
  A: {name: 'all-dealer'},
  L: {name: 'lion-dealer'},
  U: {name: 'ur-dealer'},
});

const objects = () => {
  let dealer = (name, resource) => {
    return new Entity(
      {
        'default': Texture.create("!"),
        purchased: Texture.create("!"),
      },
      {
        name: name + ' Dealer',
        resourceName: name.toLowerCase(),
        resource,
        type: 'dealer',
      }
    );
  };
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

    'polyester-dealer': dealer('Polyester', 'polyester'),
    'cotton-dealer': dealer('Cotton', 'cotton'),
    'silk-dealer': dealer('Silk', 'silk'),
    'control-dealer': dealer('Fine Control Powder', 'control'),
    'power-dealer': dealer('Long-lasting Powder', 'power'),
    'all-dealer': dealer('All-Purpose Powder', 'all'),
    'lion-dealer': dealer('Li-Ion batteries', 'lion'),
    'ur-dealer': dealer('Uranium', 'ur'),
  };
};

export default new LevelMap("factory", background, objects);
