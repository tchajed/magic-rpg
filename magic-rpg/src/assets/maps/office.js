import _ from 'lodash';
import {Texture, Background, asciiBlock} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './office.map.txt';

const background = Background.create(map, {
  P: {name: 'player'},
  T: {name: 'table'},
  M: {name: 'manager'},
  W: {name: 'water'},
  S: {name: 'cooler'},
  a: {name: 'note1'},
  b: {name: 'note2'},
  c: {name: 'note3'},
  d: {name: 'note4'},
  A: {name: 'hint1'},
  B: {name: 'hint2'},
  C: {name: 'hint3'},
  D: {name: 'door'},
  1: {name: 'stitch1'}
});

const objects = () => {
  let player = new Entity(
    Texture.create("@"),
    {name: "Player"}
  );

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
    door: new Entity(
      {
          default: Texture.create("|\n|\n|"),
              open: Texture.create(""),
      },
      {name: 'Door'}
    ),
    'water': new Entity(
      Texture.create(asciiBlock(`
 _ 
( )
`))
    ),
    'cooler': new Entity(
      Texture.create(asciiBlock(`
+-+
| |
+-+
`)).boxDrawing()
    ),
  };

  for (let o of Object.keys(objects)) {
    let obj = objects[o];
    if (obj.props.type === 'note') {
      obj.textures['note-seen'] = Texture.create(".");
    }
  }

  return _.merge(objects, {player});
};

export default new LevelMap("office", background, objects);
