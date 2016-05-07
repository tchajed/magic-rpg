import {Texture, Background, asciiBlock} from '../../game/assets';
import Entity from '../../game/entity';
import map from './level1-office.map.txt';

const background = Background.create(map, {
  P: {name: 'player'},
  T: {name: 'table'},
  M: {name: 'manager'},
  N: {name: 'news'},
  1: {name: 'stitch'}
}).boxDrawing();

const objects = (background) => {
  return {
    player: new Entity(
      "Player - level 3 wizard",
      background.loc('player'),
      Texture.create("@")
    ),
    news: new Entity(
      "News",
      background.loc('news'),
      Texture.create("(news)")
    ),
    manager: new Entity(
      "Manager",
      background.loc('manager'),
      {
        default: Texture.create("!"),
        seen: Texture.create("M"),
      }
    ),
    table: new Entity(
      "Table",
      background.loc('table'),
      Texture.create(asciiBlock(`
        /----------/
        |##########|
        |##########|
        |##########|
        /----------/
        `
      ))
    ),
  };
};

export default { background, objects };
