import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './boss2.map.txt';

const background = Background.create(map, {
  6: {name: 'stitch6'},
  7: {name: 'stitch7'},
  B: {name: 'boss2'},
  a: {name: 'boss2-lackey1'},
  b: {name: 'boss2-lackey2'},
  c: {name: 'boss2-lackey3'},
  E: {name: 'boss2-exit'},
});

const objects = () => {
  return {
    boss2: new Entity(
      {
        'default': Texture.create("!"),
        'defeated': Texture.create("!"),
      },
      {name: "Second boss"}
    ),
    'boss2-lackey1': new Entity(
      Texture.create("!")
    ),
    'boss2-lackey2': new Entity(
      Texture.create("!")
    ),
    'boss2-lackey3': new Entity(
      Texture.create("!")
    ),
    'boss2-exit': new Entity(
      {
        'default': Texture.create("|"),
        'open': Texture.create(""),
      }
    ),
  };
};

export default new LevelMap('boss2', background, objects);
