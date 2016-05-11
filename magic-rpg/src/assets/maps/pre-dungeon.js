import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './pre-dungeon.map.txt';

let namedLocs = {
  7: {name: 'stitch7'},
  8: {name: 'stitch8'},
};

for (let i = 1; i <= 5; i++) {
  let offset = "A".charCodeAt(0);
  namedLocs[String.fromCharCode(offset + i - 1)] = {name: 'hinter' + i};
}

for (let i = 1; i <= 16; i++) {
  let offset = "a".charCodeAt(0);
  namedLocs[String.fromCharCode(offset + i - 1)] = {name: 'object' + i};
}

const background = Background.create(map, namedLocs);

const objects = () => {
  let hinters = {};
  for (let i = 1; i <= 5; i++) {
    hinters['hinter' + i] = new Entity(
      Texture.create("!"),
      {
        type: 'hinter',
      });
  }
  let objects = {};
  let symbols = [
    '#', '$', '.', '.',
    '^', '&', '-', ':',
    '#', '$', 'o', 'o',
    ',', '#', '%', '.',
  ];
  for (let i = 1; i <= 16; i++) {
    objects['object' + i] = new Entity(
      {
        'default': Texture.create(symbols[i - 1]),
        'gone': Texture.create(""),
      },
      {
        type: 'object',
      });
  }
  return _.merge(hinters, objects);
};

export default new LevelMap('pre-dungeon', background, objects);
