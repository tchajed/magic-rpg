import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './village.map.txt';

const background = Background.create(map, {
  1: {name: 'stitch1'},
  2: {name: 'stitch2'},
  A: {name: 'villager1'},
  B: {name: 'villager2'},
  C: {name: 'villager3'},
  D: {name: 'villager4'},
  E: {name: 'villager5'},
  F: {name: 'villager6'},
  G: {name: 'villager7'},
  H: {name: 'villager8'},
  I: {name: 'villager9'},
  J: {name: 'villager10'},
  K: {name: 'villager11'},
  L: {name: 'villager12'},
});

const objects = () => {
  const villagers = {};
  const names = [
    'Alice',
    'Bob',
    'Caroline',
    'Darius',
    'Eve',
    'Fjolfrin',
    'Greg',
    'Harriet',
    'Isaac',
    'Juliet',
    'Kal',
    'Loki',
  ];
  for (let i = 1; i <= 12; i++) {
      const o = 'villager' + i;
      // const talkedChar = String.fromCharCode("A".charCodeAt(0) + i - 1);
      villagers[o] = new Entity(
          {
              'default': Texture.create("!"),
              'talked-to': Texture.create("!"),
          },
          {
              name: names[i-1],
              type: 'villager',
          }
      );
  }

  return villagers;
};

export default new LevelMap("village", background, objects);
