import h from 'virtual-dom/h';
import template from './text/level1.hbs';
import news from './text/news.yaml';

export default class Writing {
  constructor(state) {
    this.state = state;
  }

  for(objectId) {
    return h('div', {
      innerHTML: template({
        object: objectId,
        state: this.state,
        news,
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
