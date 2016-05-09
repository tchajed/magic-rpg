import _ from 'lodash';
import {Background} from '../game/assets';
import {Bounds} from '../game/graphics';
import office from './maps/office';
import village from './maps/village';
import boss1 from './maps/boss1';

export const background = Background.stitch(
  office.background,
  Background.stitch(
    village.background,
    boss1.background,
    'stitch2'
  ),
  'stitch'
);

export const objects = _.merge(
  office.objects(background),
  village.objects(background),
  boss1.objects(background)
);

export const viewSize = new Bounds(25, 60);
