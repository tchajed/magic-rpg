import h from 'virtual-dom/h';
import template from './text/level1.hbs';

export default class Writing {
  constructor(state) {
    this.state = state;
  }

  for(id, object) {
    return h('div', {
      innerHTML: template({
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
