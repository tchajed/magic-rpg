import {EventEmitter} from 'events';

export default class State extends EventEmitter {
  constructor() {
    super();
    this.level = 'level1';
    this.talkedToManager = false;
  }

  get(propname) {
    if (this[propname] === undefined) {
      throw new Error(`attempt to access non-existant state property ${propname}`);
    }
    return this[propname];
  }

  ensure(propname, v) {
    if (this[propname] === undefined) {
      throw new Error(`attempt to set non-existant state property ${propname}`);
    }
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
    this.emit('transition', {
      property: propname,
      oldVal: oldVal,
      newVal: v,
    });
  }
}
