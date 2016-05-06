import h from 'virtual-dom/h';
import story from './text/story.hbs';
import interaction from './text/interaction.hbs';

export default class Writing {
  constructor(state) {
    this.state = state;
  }

  story() {
    return h('div', {
      innerHTML: story({
        state: this.state,
      }),
    });
  }

  for(id, object) {
    return h('div', {
      innerHTML: interaction({
        object: id,
        obj: object,
        state: this.state,
      }),
      // delegate events from the generated template
      onclick: (e) => {
        if (e.target.id === "clear-data") {
          this.state.clear();
          this.state.reset();
        }
      },
    });
  }
}
