import _ from 'lodash';
import {Background} from '../game/assets';
import {Bounds} from '../game/graphics';
import office from './maps/office';
import village from './maps/village';

export const background = Background.stitch(
  office.background,
  village.background,
  'stitch'
);

export const objects = _.merge(
  office.objects(background),
  village.objects(background)
);

export const viewSize = new Bounds(25, 60);
