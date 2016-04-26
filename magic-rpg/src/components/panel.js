import h from 'virtual-dom/h';

export default class InfoPanel {
  constructor(game) {
    this.game = game;
  }

  render() {
    if (!this.game.selection) {
      return h('div', h('h3', '(no selection)'));
    }
    let o = this.game.objects[this.game.selection];
    return h('div', [
      h('h3', this.game.selection),
      h('p', `Coords(${o.coords.y}, ${o.coords.x})`),
    ]);
  }
}
