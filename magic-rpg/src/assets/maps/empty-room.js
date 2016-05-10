import {Background} from '../../game/assets';
import LevelMap from './level-map';
import map from './empty-room.map.txt';

export default function emptyRoom(index) {
  const background = Background.create(map, {
    e: {name: 'stitch-' + index},
  });

  const objects = () => {
    return {};
  };

  return new LevelMap('empty-' + index, background, objects);
}
