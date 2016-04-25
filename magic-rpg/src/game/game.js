import h from 'hyperscript';
import _ from 'lodash';
import {RenderBuffer, Coords} from './graphics';

export default class Game {
  constructor(bgTexture, objects, viewPort, selection=null) {
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
        let selectedClass = segments.selected ? '.selected' : ' ';
        return h(`span.${segment.objectId}${selectedClass}`, segment.text);
      } else {
        return h(`span.${segment.objectId}`, segment.text);
      }
    }));
  }
}
