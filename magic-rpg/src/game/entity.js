import {Rectangle} from './graphics';
import {Texture} from './assets';

// object with some state
export default class Entity {
  constructor(name, coords, textures) {
    this.name = name;
    this.coords = coords;
    if (textures instanceof Texture) {
      this.textures = {default: textures};
    } else {
      this.textures = textures;
    }
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

  get name() {
    return this.entity.name;
  }

  set name(v) {
    this.entity.name = v;
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
