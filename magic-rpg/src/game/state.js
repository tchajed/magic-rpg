import {EventEmitter} from 'events';
import store from 'store';

const defaults = () => {
  return {
    level: 'level1',
    talkedToManager: false,
    newsItem: 0,
  };
};

const stateKeys = Object.keys(defaults());

export default class State extends EventEmitter {
  constructor() {
    super();
    let def = defaults();
    for (let key of stateKeys) {
      this[key] = def[key];
    }
  }

  restore() {
    store.forEach((key, val) => {
      this[key] = val;
    });
  }

  clear() {
    store.clear();
  }

  reset() {
    let def = defaults();
    for (let key of stateKeys) {
      this[key] = def[key];
    }
  }

  get(propname) {
    if (this[propname] === undefined) {
      throw new Error(`attempt to access non-existant state property ${propname}`);
    }
    return this[propname];
  }

  ensure(propname, v) {
    if (this[propname] === v) {
      return;
    }
    this.set(propname, v);
  }

  set(propname, v) {
    if (this[propname] === undefined) {
      throw new Error(`attempt to set non-existant state property ${propname}`);
    }
    let oldVal = this[propname];
    this[propname] = v;
    store.set(propname, v);
    this.emit('transition', {
      property: propname,
      oldVal: oldVal,
      newVal: v,
    });
  }
}
