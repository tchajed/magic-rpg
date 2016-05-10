import _ from 'lodash';
import {Background} from '../game/assets';
import {Bounds} from '../game/graphics';
import office from './maps/office';
import village from './maps/village';
import boss1 from './maps/boss1';
import factoryRoad from './maps/factory-road';

let levelMaps = [
  office,
  ['stitch1', village],
  ['stitch2', boss1],
  ['stitch3', factoryRoad],
];

function stitchAll(levelMaps) {
  let bg = levelMaps.shift().background;
  for (let [stitch, nextMap] of levelMaps) {
    bg = Background.stitch(bg, nextMap.background, stitch);
  }
  return bg;
}

export const background = stitchAll(levelMaps);

export const objects = _.merge.apply(
  null,
  _.map([office, village, boss1, factoryRoad], (map) => {
    return map.objects(background);
  })
);

export const viewSize = new Bounds(25, 60);
