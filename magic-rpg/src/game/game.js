import h from 'virtual-dom/h';
import _ from 'lodash';
import {EventEmitter} from 'events';
import {RenderBuffer, Coords} from './graphics';

export default class Game extends EventEmitter {
  constructor(bgTexture, objects, viewPort, selection=null) {
    super();
    this.bgTexture = bgTexture;
    this.objects = objects;
    this.viewPort = viewPort;
    this.selection = selection;
  }

  segments() {
    let viewPort = this.viewPort;
    let buf = new RenderBuffer(viewPort.size);
    let bgPosition = new Coords(-viewPort.coords.y, -viewPort.coords.x);
    buf.renderAt(bgPosition, this.bgTexture.cells, 'bg');

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
}
