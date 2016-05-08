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
}).boxDrawing();

const objects = (background) => {
  let objects = {
    villager1: new Entity(
      Texture.create("!"),
      {name: "Villager"}
    ),
    villager2: new Entity(
      Texture.create("!"),
      {name: "Villager"}
    ),
    villager3: new Entity(
      Texture.create("!"),
      {name: "Villager"}
    ),
  };

  for (let o of Object.keys(objects)) {
    objects[o].placeAt(background.loc(o));
    objects[o].props.room = 'village';
  }

  return objects;
};

export default {background, objects};
