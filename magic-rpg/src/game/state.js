import {EventEmitter} from 'events';
import store from 'store';

const defaults = () => {
  return {
    level: 'level1',
    talkedToManager: false,
    newsItem: 0,
  };
};

export default class State extends EventEmitter {
  constructor() {
    super();
    this.props = defaults();
  }

  restore() {
    store.forEach((key, val) => {
      this.props[key] = val;
    });
  }

  clear() {
    store.clear();
  }

  reset() {
    this.props = defaults();
  }

  get(propname) {
    if (this.props[propname] === undefined) {
      throw new Error(`attempt to access non-existant state property ${propname}`);
    }
    return this.props[propname];
  }

  ensure(propname, v) {
    if (this.props[propname] === undefined) {
      throw new Error(`attempt to set non-existant state property ${propname}`);
    }
    if (this.props[propname] === v) {
      return;
    }
    this.set(propname, v);
  }

  set(propname, v) {
    if (this.props[propname] === undefined) {
      throw new Error(`attempt to set non-existant state property ${propname}`);
    }
    let oldVal = this.props[propname];
    this.props[propname] = v;
    store.set(propname, v);
    this.emit('transition', {
      property: propname,
      oldVal: oldVal,
      newVal: v,
    });
  }
}
