import _ from 'lodash';
import {Texture, Background, asciiBlock} from '../../game/assets';
import Entity from '../../game/entity';
import map from './level1-office.map.txt';

const background = Background.create(map, {
  P: {name: 'player'},
  T: {name: 'table'},
  M: {name: 'manager'},
  N: {name: 'news'},
  a: {name: 'note1'},
  b: {name: 'note2'},
  c: {name: 'note3'},
  d: {name: 'note4'},
  A: {name: 'hint1'},
  B: {name: 'hint2'},
  C: {name: 'hint3'},
  1: {name: 'stitch'}
}).boxDrawing();

const objects = (background) => {
  let player = new Entity(
    Texture.create("@"),
    {name: "Player - level 3 wizard"}
  ).placeAt(background.loc('player'));

  let objects = {
    manager: new Entity(
      {
        default: Texture.create("!"),
        seen: Texture.create("M"),
      },
      {name: "Manager"}
    ),
    table: new Entity(
      Texture.create(asciiBlock(`
/----------/
|##########|
|##########|
|##########|
/----------/
        `
      )),
      {name: "Table"}
    ),
    note1: new Entity(
      Texture.create("."),
      {type: 'note'}
    ),
    note2: new Entity(
      Texture.create("."),
      {type: 'note'}
    ),
    note3: new Entity(
      Texture.create("."),
      {type: 'note'}
    ),
    note4: new Entity(
      Texture.create("."),
      {type: 'note'}
    ),
    hint1: new Entity(
      Texture.create("."),
      {name: 'Instructions for level 4 promotion',
        type: 'note'}
    ),
    hint2: new Entity(
      Texture.create("."),
      {name: 'Instructions for level 4 promotion',
        type: 'note'}
    ),
    hint3: new Entity(
      Texture.create("."),
      {name: 'Instructions for level 4 promotion',
        type: 'note'}
    ),
  };

  for (let o of Object.keys(objects)) {
    let obj = objects[o];
    obj.placeAt(background.loc(o));
    obj.props.room = 'office';
    if (obj.props.type === 'note') {
      if (o.startsWith('hint')) {
        obj.textures['note-seen'] = Texture.create("*");
      } else {
        obj.textures['note-seen'] = Texture.create(".");
      }
    }
  }

  return _.merge(objects, {player});
};

export default { background, objects };
