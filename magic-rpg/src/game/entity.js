import {Rectangle} from './graphics';

// object with some state
export default class Entity {
  constructor(coords, texture) {
    this.coords = coords;
    this.texture = texture;
    this.bounds = texture.bounds;
  }

  get rect() {
    return new Rectangle(this.coords, this.bounds);
  }
}
