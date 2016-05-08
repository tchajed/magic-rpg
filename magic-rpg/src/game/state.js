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
    return this;
  }

  get(propname) {
    if (this[propname] === undefined) {
      throw new Error(`attempt to access non-existent state property ${propname}`);
    }
    return this[propname];
  }

  ensure(propname, v) {
    if (this[propname] === v) {
      return;
    }
    this.set(propname, v);
    return this;
  }

  modify(propname, f) {
    if (this[propname] === undefined) {
      throw new Error(`attempt to set non-existent state property ${propname}`);
    }
    let oldVal = this[propname];
    let v = f(oldVal);
    this[propname] = v;
    store.set(propname, v);
    this.emit('transition', {
      property: propname,
      oldVal: oldVal,
      newVal: v,
    });
  }

  set(propname, v) {
    this.modify(propname, () => v);
  }

}
