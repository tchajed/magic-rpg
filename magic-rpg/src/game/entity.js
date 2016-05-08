import {Rectangle} from './graphics';
import {Texture} from './assets';

// object with some state
export default class Entity {
  constructor(textures, props={}) {
    if (textures instanceof Texture) {
      this.textures = {default: textures};
    } else {
      this.textures = textures;
    }
    this.props = props;
    this.coords = null;
  }

  placeAt(coords) {
    this.coords = coords;
    return this;
  }

  in(state) {
    return new StateEntity(this, state);
  }
}

// delegate for an entity, which exposes a single texture picked via a state name at construction time.
class StateEntity {
  constructor(entity, state) {
    this.entity = entity;
    this.state = state;
  }

  get props() {
    return this.entity.props;
  }

  get coords() {
    return this.entity.coords;
  }

  set coords(v) {
    this.entity.coords = v;
  }

  get texture() {
    return this.entity.textures[this.state];
  }

  get bounds() {
    return this.texture.bounds;
  }

  get rect() {
    return new Rectangle(this.coords, this.bounds);
  }
}
