import {Background} from '../../game/assets';
import LevelMap from './level-map';
import map from './boss2-road.map.txt';

const background = Background.create(map, {
  5: {name: 'stitch5'},
  6: {name: 'stitch6'},
});

const objects = () => {
  return {};
};

export default new LevelMap('boss2-road', background, objects);
