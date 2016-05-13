import {Texture, asciiBlock, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './pre-dungeon.map.txt';

const namedLocs = {
  7: {name: 'stitch7'},
  8: {name: 'stitch8'},
  S: {name: 'dungeon-sign'},
};

for (let i = 1; i <= 5; i++) {
  const offset = "A".charCodeAt(0);
  namedLocs[String.fromCharCode(offset + i - 1)] = {name: 'hinter' + i};
}

for (let i = 1; i <= 16; i++) {
  const offset = "a".charCodeAt(0);
  namedLocs[String.fromCharCode(offset + i - 1)] = {name: 'object' + i};
}

const background = Background.create(map, namedLocs);

const objects = () => {
  const hinters = {};
  for (let i = 1; i <= 5; i++) {
    hinters['hinter' + i] = new Entity(
      Texture.create("!"),
      {
        type: 'hinter',
      });
  }
  const objects = {};
  const symbols = [
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
  const sign = {
    'dungeon-sign': new Entity(
      Texture.create(asciiBlock(`
[###]
|   |
`)),
      { name: 'Sign' }
    ),
  };
  return _.merge(hinters, objects, sign);
};

export default new LevelMap('pre-dungeon', background, objects);
