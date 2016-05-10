import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './level1-village.map.txt';

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
}).boxDrawing();

const objects = () => {
  let villagers = {};
  for (let i = 1; i <= 12; i++) {
      let o = 'villager' + i;
      let talkedChar = String.fromCharCode("A".charCodeAt(0) + i - 1);
      villagers[o] = new Entity(
          {
              'default': Texture.create("!"),
              'talked-to': Texture.create(talkedChar),
          },
          {
              name: 'Villager',
              type: 'villager',
          }
      );
  }
  let objects = villagers;

  return objects;
};

export default new LevelMap("village", background, objects);
