import {Background} from '../../game/assets';
import LevelMap from './level-map';
import map from './factory-road.map.txt';

const background = Background.create(map, {
  3: {name: 'stitch3'},
  4: {name: 'stitch4'},
});

const objects = () => {
  return {};
};

export default new LevelMap('factory-road', background, objects);
