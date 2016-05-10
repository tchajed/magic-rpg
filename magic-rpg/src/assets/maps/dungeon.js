import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './dungeon.map.txt';

const background = Background.create(map, {
  7: {name: 'stitch7'},
  8: {name: 'stitch8'},
  a: {name: 'stitch-a'},
  b: {name: 'stitch-b'},
  c: {name: 'stitch-c'},
  d: {name: 'stitch-d'},
  e: {name: 'stitch-e'},
});

const objects = () => {
  return {};
};

export default new LevelMap('dungeon', background, objects);
