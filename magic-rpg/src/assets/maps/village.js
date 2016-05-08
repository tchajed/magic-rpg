import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import map from './level1-village.map.txt';

// TODO: can abstract this away to a Map class (need different name, though)
// that automatically does the boxDrawing, adds placements, has a name (for
// eventually keeping track of current room).

const background = Background.create(map, {
  1: {name: 'stitch'},
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

const objects = (background) => {
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

  for (let o of Object.keys(objects)) {
    objects[o].placeAt(background.loc(o));
    objects[o].props.room = 'village';
  }

  return objects;
};

export default {background, objects};
