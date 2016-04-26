import h from 'virtual-dom/h';
import _ from 'lodash';
import {EventEmitter} from 'events';
import {RenderBuffer, Coords} from './graphics';

export default class Game extends EventEmitter {
  constructor(bg, objects, viewPort, selection=null) {
    super();
    this.bg = bg;
    this.objects = objects;
    this.viewPort = viewPort;
    this.selection = selection;
  }

  segments() {
    let viewPort = this.viewPort;
    let buf = new RenderBuffer(viewPort.size);
    let bgPosition = new Coords(-viewPort.coords.y, -viewPort.coords.x);
    buf.renderAt(bgPosition, this.bg.cells, 'bg');

    for (let id of Object.keys(this.objects)) {
      let o = this.objects[id];
      buf.renderAt(o.coords, o.texture.cells, id, id === this.selection);
    }

    return buf.compressed();
  }

  render() {
    let segments = this.segments();
    return h('code.ascii', _.map(segments, (segment) => {
      if (segment.objectId !== null) {
        let selectedClass = segment.selected ? '.selected' : '';
        return h(`span.${segment.objectId}${selectedClass}`,
          {
            onclick: () => {
              this.select(segment.objectId);
            }
          }, segment.text);
        } else {
        return h(`span.${segment.objectId}`, segment.text);
      }
    }));
  }

  select(o) {
    let newSelection = o;
    if (this.selection === o) {
      newSelection = null;
    }
    this.selection = newSelection;
    this.emit('selected', o);
  }

  moveObject(objectId, update) {
    let o = this.objects[objectId];
    if (o === 'undefined') {
      throw new Error(`invalid objectId ${objectId}`);
    }
    let coords = update(o.coords);
    if (this.bg.conflicts(coords, o.bounds)) {
      return;
    }
    o.coords = coords;
    this.emit('objectChange', {
      objectId,
      coords
    });
  }
}
