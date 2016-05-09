import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './level1-boss1.map.txt';

const background = Background.create(map, {
  2: {name: 'stitch2'},
  3: {name: 'stitch3'},
  A: {name: 'boss1'},
  D: {name: 'boss1-door'},
}).boxDrawing();

const objects = () => {
  return {
    boss1: new Entity(
      {
        'default': Texture.create("!"),
        'defeated': Texture.create("!"),
      },
      {name: 'Boss'}
    ),
    'boss1-door': new Entity(
      {
        'default': Texture.create("|\n|"),
        'open': Texture.create(""),
      },
      {name: 'Door'}
    ),
  };
};

export default new LevelMap("boss1", background, objects);
