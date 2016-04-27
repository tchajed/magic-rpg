import h from 'virtual-dom/h';
import text from './text/level1.yaml';

export default class Writing {
  constructor(state) {
    this.state = state;
  }

  evalTest(test) {
    if (typeof test === 'string') {
      return this.state.get(test);
    }
    if (Array.isArray(test)) {
      let result = true;
      for (let disjunction of test) {
        let clause = false;
        if (!Array.isArray(disjunction)) {
          disjunction = [disjunction];
        }
        for (let literal of disjunction) {
          clause = clause || this.evalTest(literal);
        }
        result = result && clause;
      }
      return result;
    }
    throw new Error(`unsupported test ${JSON.stringify(test)}`);
  }

  getText(config) {
    if (typeof config === 'string') {
      return config;
    }
    if (config.test !== undefined) {
      if (this.evalTest(config.test)) {
        return this.getText(config.trueText);
      } else {
        return this.getText(config.falseText);
      }
    }
    if (config.index !== undefined) {
      let index = this.state.get(config.index);
      return this.getText(config.values[index % config.values.length]);
    }
    throw new Error(`unsupported text config ${JSON.stringify(config)}`);
  }

  for(objectId) {
    if (text[objectId] === undefined) {
      return h('p.error', `no text provided for ${objectId}`);
    }
    if (objectId === 'player') {
      return h('div', [
        h('p', this.getText(text.player)),
        h('button', {
          onclick: () => {
            this.state.clear();
            this.state.reset();
          }
        }, 'clear data'),
      ]);
    }
    return this.getText(text[objectId]);
  }
}
