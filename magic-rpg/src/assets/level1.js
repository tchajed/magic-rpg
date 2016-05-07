import {Texture, Background, asciiBlock} from '../game/assets';
import {Bounds} from '../game/graphics';
import Entity from '../game/entity';
import office from './maps/level1-office.map.txt';
import village from './maps/level1-village.map.txt';

export const background = Background.stitch(
  Background.create(office, {
    P: {name: 'player'},
    T: {name: 'table'},
    M: {name: 'manager'},
    N: {name: 'news'},
    1: {name: 'stitch'}
  }).boxDrawing(),

  Background.create(village, {
    1: {name: 'stitch'},
  }).boxDrawing(),

  'stitch'
);

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
