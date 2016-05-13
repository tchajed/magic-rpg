import _ from 'lodash';
import {Background} from '../game/assets';
import {Bounds} from '../game/graphics';
import office from './maps/office';
import village from './maps/village';
import boss1 from './maps/boss1';
import factoryRoad from './maps/factory-road';
import factory from './maps/factory';
import boss2Road from './maps/boss2-road';
import boss2 from './maps/boss2';
import preDungeon from './maps/pre-dungeon';
import dungeon from './maps/dungeon';
import emptyRoom from './maps/empty-room';
import boss3 from './maps/boss3';

const emptyRooms = _.map(['a', 'b', 'c', 'd', 'e'], (index) => {
  return [emptyRoom(index), 'stitch-' + index];
});

const levelMaps = [
  [office, null],
  [village, 'stitch1'],
  [boss1, 'stitch2'],
  [factoryRoad, 'stitch3'],
  [factory, 'stitch4'],
  [boss2Road, 'stitch5'],
  [boss2, 'stitch6'],
  [preDungeon, 'stitch7'],
  [dungeon, 'stitch8'],
].concat(emptyRooms).concat([
  [boss3, 'stitch9'],
]);

function stitchAll(levelMaps) {
  let bg = levelMaps[0][0].background;
  for (const [nextMap, stitch] of levelMaps.slice(1)) {
    bg = Background.stitch(bg, nextMap.background, stitch);
  }
  return bg;
}

export const background = stitchAll(levelMaps);

export const objects = (() => {
  const maps = _.map(levelMaps, (map) => {
    return map[0];
  });
  return _.merge.apply(
    null,
    _.map(maps, (map) => {
      return map.objects(background);
    }));
})();

export const viewSize = new Bounds(25, 60);
