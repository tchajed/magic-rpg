import h from 'virtual-dom/h';

export default class InfoPanel {
  constructor(game, writing) {
    this.game = game;
    this.writing = writing;
  }

  render() {
    if (this.game.selection === null) {
      // for debugging
      // return h('div', h('h3', '(no selection)'));
      return h('div');
    }
    return h('div', [
      h('h3', this.game.selection),
      this.writing.for(this.game.selection),
    ]);
  }
}
