import h from 'virtual-dom/h';
import _ from 'lodash';
import {EventEmitter} from 'events';
import {ViewPort, Rectangle, Bounds, Coords, RenderBuffer} from './graphics';
import State from './level1-state';
import store from 'store';

export default class Game extends EventEmitter {
  constructor(bg, objects, viewSize, selection=null) {
    super();
    this.bg = bg;
    this.objects = objects;
    this.viewPort = new ViewPort(null, viewSize);
    this.selection = selection;
    this.state = new State().restore();
    this.state.on('transition', (ev) => {
      this.emit('change', {
        type: 'state',
        transition: ev,
      });
    });
    if (store.get('playerCoords')) {
      let coords = store.get('playerCoords');
      this.objects.player.coords = new Coords(coords.y, coords.x);
    }
    this.centerAround('player');
  }

  isObject(objectId) {
    return this.objects[objectId] !== undefined;
  }

  assertValidObject(objectId) {
    if (!this.isObject(objectId)) {
      throw new Error(`invalid objectId ${objectId}`);
    }
  }

  object(objectId) {
    return this.objects[objectId].in(this.state.forObject(objectId));
  }

  // Would objectId collide with anything if it took space rect?
  // Returns a colliding object or null if nothing collides.
  collides(objectId, rect) {
    for (let id of Object.keys(this.objects)) {
      if (id === objectId) {
        continue;
      }
      let other = this.object(id);
      if (other.rect.collides(rect)) {
        return id;
      }
    }

    if (this.bg.collides(rect.coords, rect.bounds)) {
      return 'bg';
    }

    return false;
  }

  segments() {
    let viewPort = this.viewPort;
    let buf = new RenderBuffer(viewPort.size);
    let viewOrigin = this.viewPort.translate(new Coords(0, 0));
    buf.renderAt(viewOrigin, this.bg, 'bg');

    for (let id of Object.keys(this.objects)) {
      let o = this.object(id);
      buf.renderAt(
        this.viewPort.translate(o.coords),
        o.texture,
        id,
        id === this.selection
      );
    }

    return buf.compressed();
  }

  render() {
    let segments = this.segments();
    return h('code.ascii', _.map(segments, (segment) => {
      if (this.isObject(segment.objectId)) {
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
    this.assertValidObject(o);
    let newSelection = o;
    if (this.selection === o) {
      newSelection = null;
    } else {
      this.state.interact(o, this.object(o));
    }
    if (newSelection === 'news') {
      return;
    }
    this.selection = newSelection;
    this.emit('change', {
      type: 'selection',
      objectId: this.selection,
    });
  }

  centerAround(objectId) {
    let o = this.object(objectId);
    let dy = Math.floor((this.viewPort.size.height - o.bounds.height)/2);
    let dx = Math.floor((this.viewPort.size.width - o.bounds.width)/2);
    let origin = new Coords(o.coords.y - dy, o.coords.x - dx);
    this.viewPort.origin = origin;
  }

  moveObject(objectId, dy, dx) {
    this.assertValidObject(objectId);
    let o = this.object(objectId);
    let newCoords = new Coords(o.coords.y + dy, o.coords.x + dx);
    if (this.collides(objectId, new Rectangle(newCoords, o.bounds))) {
      return;
    }
    o.coords = newCoords;
    if (objectId === 'player') {
      store.set('playerCoords', o.coords);
      this.centerAround(objectId);
    }
    this.emit('change', {
      type: 'object',
      objectId,
      coords: o.coords,
    });
  }

  action() {
    let player = this.object('player');
    let sphereOfInfluence = new Rectangle(
      new Coords(player.coords.y - 1, player.coords.x - 1),
      new Bounds(player.bounds.height + 2, player.bounds.width + 2)
    );
    let collision = this.collides('player', sphereOfInfluence);
    if (collision && this.isObject(collision)) {
      this.select(collision);
    }
  }
}
