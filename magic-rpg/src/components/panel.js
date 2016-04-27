import h from 'virtual-dom/h';

export default class InfoPanel {
  constructor(game, writing) {
    this.game = game;
    this.writing = writing;
  }

  render() {
    if (this.game.selection === null) {
      return h('div');
    }
    return this.writing.for(this.game.selection);
  }
}
