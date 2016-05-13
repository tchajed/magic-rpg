import {Texture, Background} from '../../game/assets';
import Entity from '../../game/entity';
import LevelMap from './level-map';
import map from './boss3.map.txt';

const background = Background.create(map, {
  9: {name: 'stitch9'},
  B: {name: 'boss3'},
});

const objects = () => {
  return {
    boss3: new Entity(
      {
        'default': Texture.create('!'),
        'defeated': Texture.create('!'),
      },
      {name: 'Final boss'}
    ),
  };
};

export default new LevelMap('boss3', background, objects);
