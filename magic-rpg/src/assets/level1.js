import {Texture, Background, asciiBlock} from '../game/assets';
import {Bounds} from '../game/graphics';
import Entity from '../game/entity';
import map from './maps/level1.map.txt';

export const background = Background.create(map, {
  P: {name: 'player'},
  T: {name: 'table'},
  M: {name: 'manager'},
  N: {name: 'news'},
}).boxDrawing();

export const objects = {
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

export const viewSize = new Bounds(25, 60);
