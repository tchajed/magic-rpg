import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './level1-boss1.map.txt';

const background = Background.create(map, {
  2: {name: 'stitch2'},
  A: {name: 'boss1'},
}).boxDrawing();

const objects = () => {
  return {
    boss1: new Entity(
      Texture.create("!"),
      {name: 'Boss'}
    ),
  };
};

export default new LevelMap("boss1", background, objects);
