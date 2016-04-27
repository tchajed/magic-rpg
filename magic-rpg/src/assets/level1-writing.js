import h from 'virtual-dom/h';
import {asciiBlock} from '../game/assets';

// generate unstyled text
const text = (s) => {
  return h('p', asciiBlock(s));
};

export default class Writing {
  constructor(state) {
    this.state = state;
  }

  bossCheck() {
    if (!this.state.get('talkedToManager')) {
        return text(`

          You don't know who I am! Why should I talk to you?

      `);
    }
    return null;
  }

  for(objectId) {
    switch (objectId) {
      case 'player':
      return h('div', [
        h('p', asciiBlock(`

          This is you, the player. You are a wizard in Magical Consulting, LLC (a
            Delaware company).

        `)),
        h('button', {
          onclick: () => {
            this.state.clear();
            this.state.reset();
        }}, 'clear data'),
      ]);
      case 'table':
      return text(`

        This is just a conference table. There's nothing on it and it isn't
        important.

      `);
      case 'manager':
      return text(`

        "Hi, I'm your manager. I don't know why I'm telling you, since you ought
        to know that by now."

      `);
      case 'bossA': {
        let check = this.bossCheck();
        if (check) { return check; }
        return text(`

          I'm the first boss. I guess I'd fight you or something?

        `);
      }
      case 'bossB': {
          let check = this.bossCheck();
          if (check) { return check; }
          return text(`

            I'm the second boss. I guess I'd fight you or something?

          `);
      }
      default:
      return h('div.error', `no text for object ${objectId}`);
    }
  }
}
