import {Background} from '../../game/assets';
import map from './level1-village.map.txt';

const background = Background.create(map, {
  1: {name: 'stitch'},
}).boxDrawing();

const objects = (background) => {
  return {};
};

export default {background, objects};
