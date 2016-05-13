export default class LevelMap {
  constructor(name, background, objects) {
    this.name = name;
    this.background = background.boxDrawing().setRoom(name);
    this._objects = objects();
  }

  objects(background) {
    const objs = _.cloneDeep(this._objects);
    for (const o of Object.keys(objs)) {
      objs[o].placeAt(background.loc(o));
      objs[o].props.room = this.name;
    }
    return objs;
  }
}
