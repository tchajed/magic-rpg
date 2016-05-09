export default class LevelMap {
  constructor(name, background, objects) {
    this.name = name;
    this.background = background.setRoom(name);
    this._objects = objects();
  }

  objects(background) {
    let objs = _.cloneDeep(this._objects);
    for (let o of Object.keys(objs)) {
      objs[o].placeAt(background.loc(o));
      objs[o].props.room = this.name;
    }
    return objs;
  }
}
