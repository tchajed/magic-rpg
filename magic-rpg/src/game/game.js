import h from 'virtual-dom/h';
import _ from 'lodash';
import {EventEmitter} from 'events';
import {ViewPort, Rectangle, Bounds, Coords, RenderBuffer} from './graphics';
import State from './level1-state';
import classNames from 'classnames';

export default class Game extends EventEmitter {
  constructor(bg, objects, viewSize, selection=null) {
    super();
    this.bg = bg;
    this.objects = objects;
    this.viewPort = new ViewPort(null, viewSize);
    this.selection = selection;
    this.state = new State().restore();
    this.state.on('transition', (ev) => {
      if (this.state.isTransitionImportant(ev)) {
        this.state.nextNewsItem();
      }
      if (ev.property === '*') {
        // complete the reset
        this.objects.player.coords = this.bg.loc('player');
        this.centerAround('player');
        this.select(null);
      }
      this.emit('change', {
        type: 'state',
        transition: ev,
      });
    });
    if (this.state.playerCoords) {
      const coords = this.state.get('playerCoords');
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
    const obj = this.objects[objectId];
    const state = this.state.forObject(objectId, obj);
    return this.objects[objectId].in(state);
  }

  // Would objectId collide with anything if it took space rect?
  // Returns a colliding object or null if nothing collides.
  collides(objectId, rect) {
    for (const id of Object.keys(this.objects)) {
      if (id === objectId) {
        continue;
      }
      const other = this.object(id);
      if (other.rect.collides(rect)) {
        return id;
      }
    }

    if (this.bg.collides(rect.coords, rect.bounds)) {
      return 'bg';
    }

    return false;
  }

  isVisible(objectId) {
    const o = this.object(objectId);
    if (o.rect.collides(this.viewPort.rect)) {
      return true;
    }
    return false;
  }

  segments() {
    const viewPort = this.viewPort;
    const buf = new RenderBuffer(viewPort.size);
    const viewOrigin = this.viewPort.translate(new Coords(0, 0));
    buf.renderAt(viewOrigin, this.bg, 'bg');

    _.forOwn(this.objects, (v, id) => {
      if (!this.isVisible(id)) {
        return;
      }
      const o = this.object(id);
      buf.renderAt(
        this.viewPort.translate(o.coords),
        o.texture,
        id,
        classNames(
          {[id]: !!id},
          o.state,
          { selected: id === this.selection }
        )
      );
    });

    return buf.compressed();
  }

  render() {
    const segments = this.segments();
    return h('code.ascii', _.map(segments, (segment) => {
      if (this.isObject(segment.objectId)) {
        return h('span', {
          className: segment.className,
          onclick: () => {
            this.select(segment.objectId);
          },
        }, segment.text);
        } else {
        return h('span', {
          className: segment.className,
        }, segment.text);
      }
    }));
  }

  select(o) {
    if (o !== null) {
      this.assertValidObject(o);
    }
    let newSelection = o;
    if (newSelection === this.selection) {
      if (this.state.toggleSelection) {
        newSelection = null;
      } else {
        return;
      }
    }
    if (this.selection !== null) {
      // interact on de-selection
      this.state.interact(this.selection, this.object(this.selection));
    }
    if (newSelection === 'news') {
      return;
    }
    if (newSelection !== null &&
        this.object(newSelection).bounds.area() === 0) {
      this.select(null);
      return;
    }
    if (newSelection === 'water') {
      this.select('cooler');
      return;
    }
    this.selection = newSelection;
    this.emit('change', {
      type: 'selection',
      objectId: this.selection,
    });
  }

  centerAround(objectId) {
    const o = this.object(objectId);
    const dy = Math.floor((this.viewPort.size.height - o.bounds.height)/2);
    const dx = Math.floor((this.viewPort.size.width - o.bounds.width)/2);
    const origin = new Coords(o.coords.y - dy, o.coords.x - dx);
    this.viewPort.origin = origin;
  }

  moveObject(objectId, dy, dx) {
    this.assertValidObject(objectId);
    const o = this.object(objectId);
    const newCoords = new Coords(o.coords.y + dy, o.coords.x + dx);
    if (this.collides(objectId, new Rectangle(newCoords, o.bounds))) {
      return;
    }
    o.coords = newCoords;
    if (objectId === 'player') {
      this.state.set('playerCoords', o.coords);
      this.state.set('room', this.bg.room(o.coords.y, o.coords.x));
      this.centerAround(objectId);
      if (this.selection !== null &&
          !this.isVisible(this.selection)) {
        this.select(null);
      }
    }
    this.emit('change', {
      type: 'object',
      objectId,
      coords: o.coords,
    });
  }

  action() {
    const player = this.object('player');
    const sphereOfInfluence = new Rectangle(
      new Coords(player.coords.y - 1, player.coords.x - 1),
      new Bounds(player.bounds.height + 2, player.bounds.width + 2)
    );
    const collision = this.collides('player', sphereOfInfluence);
    if (collision && this.isObject(collision)) {
      this.select(collision);
    }
  }
}
