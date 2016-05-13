import _ from 'lodash';
import {EventEmitter} from 'events';
import store from 'store';

const saveKey = 'magic-rpg:save';

export default class StateMachine extends EventEmitter {
  // to be overriden
  defaults() {
    return {};
  }

  constructor() {
    super();
    this._props = {};
    this.reset();

    for (const key of Object.keys(this._props)) {
      Object.defineProperty(this, key, {
        get() {
          return this._props[key];
        },
      });
    }
  }

  persist() {
    store.set(saveKey, this._props);
  }

  restore() {
    _.forOwn(store.get(saveKey), (val, key) => {
      this._props[key] = val;
    });
    return this;
  }

  clear() {
    store.remove(saveKey);
    return this;
  }

  reset() {
    const def = this.defaults();
    for (const key of Object.keys(def)) {
      this._props[key] = def[key];
    }

    this.emit('transition', {
      property: '*',
    });
    return this;
  }

  _resolve(propname) {
    const proppath = propname.split('.');
    const prop = proppath.pop();
    let obj = this._props;
    if (proppath.length === 0 && obj[prop] === undefined) {
      throw new Error(`attempt to access non-existent property ${propname}`);
    }
    proppath.forEach((component, i) => {
      if (obj[component] === undefined) {
        const badpath = proppath.slice(i).join('.');
        throw new Error(`attempt to access non-existent path ${badpath}`);
      }
      obj = obj[component];
    });
    return {obj, prop};
  }

  get(propname) {
    const {obj, prop} = this._resolve(propname);
    return obj[prop];
  }

  modify(propname, f) {
    const {obj, prop} = this._resolve(propname);
    const oldVal = obj[prop];
    const v = f(oldVal);
    if (v === oldVal) {
      // reduce spurious transitions and store operations
      return;
    }
    obj[prop] = v;
    this.persist();
    this.emit('transition', {
      property: propname,
      oldVal,
      newVal: v,
    });
  }

  set(propname, v) {
    this.modify(propname, () => v);
  }

}
