import {EventEmitter} from 'events';
import store from 'store';

export default class StateMachine extends EventEmitter {
  // to be overriden
  defaults() {
    return {};
  }

  get stateKeys() {
    return Object.keys(this.defaults());
  }

  constructor() {
    super();
    this.reset();
  }

  restore() {
    store.forEach((key, val) => {
      this[key] = val;
    });
    return this;
  }

  clear() {
    store.clear();
    return this;
  }

  reset() {
    let def = this.defaults();
    for (let key of this.stateKeys) {
      this[key] = def[key];
    }
    this.emit('transition', {
      property: '*',
    });
    return this;
  }

  _resolve(propname) {
    let proppath = propname.split(".");
    let first = proppath[0];
    let prop = proppath.pop();
    let obj = this;
    if (proppath.length === 0 && obj[prop] === undefined) {
      throw new Error(`attempt to access non-existent property ${propname}`);
    }
    proppath.forEach((component, i) => {
      if (obj[component] === undefined) {
        let badpath = ".".join(propath.slice(i));
        throw new Error(`attempt to access non-existent path ${badpath}`);
      }
      obj = obj[component];
    });
    return {obj, prop, first};
  }

  get(propname) {
    let {obj, prop} = this._resolve(propname);
    return obj[prop];
  }

  modify(propname, f) {
    let {obj, prop, first} = this._resolve(propname);
    let oldVal = obj[prop];
    let v = f(oldVal);
    obj[prop] = v;
    store.set(first, this[first]);
    this.emit('transition', {
      property: propname,
      oldVal: oldVal,
      newVal: v,
    });
  }

  set(propname, v) {
    // reduce spurious transitions and store operations
    if (this.get(propname) === v) {
      return;
    }
    this.modify(propname, () => v);
  }

}
