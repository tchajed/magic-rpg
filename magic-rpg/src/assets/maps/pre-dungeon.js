import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './pre-dungeon.map.txt';

const background = Background.create(map, {
  7: {name: 'stitch7'},
  8: {name: 'stitch8'},
  A: {name: 'hinter1'},
  B: {name: 'hinter2'},
  C: {name: 'hinter3'},
  D: {name: 'hinter4'},
  E: {name: 'hinter5'},
  F: {name: 'hinter6'},
});

const objects = () => {
  let hinters = {};
  for (let i = 1; i <= 6; i++) {
    hinters['hinter' + i] = new Entity(
      Texture.create("!"),
      {
        type: 'hinter',
      });
  }
  return hinters;
};

export default new LevelMap('pre-dungeon', background, objects);
