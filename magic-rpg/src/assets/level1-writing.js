import h from 'virtual-dom/h';
import {asciiBlock} from '../game/assets';

export default class Writing {
  constructor(state) {
    this.state = state;
  }

  player() {
    return h('p', asciiBlock(`

    This is you, the player. You are a wizard in Magical Consulting, LLC (a
    Delaware company).

  `));
  }

  table() {
    return h('p', asciiBlock(`

      This is just a conference table. There's nothing on it and it isn't
      important.

      `));
  }

  for(objectId) {
    if (objectId === 'player') {
      return this.player();
    } else if (objectId === 'table') {
      return this.table();
    }
    return h('div.error', `no text for object ${objectId}`);
  }
}
