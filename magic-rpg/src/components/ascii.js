import './ascii.css';
import h from 'hyperscript';

export default class AsciiGrid {
  constructor(game) {
    this.game = game;
  }

  render() {
    return h('pre.unselectable', this.game.render());
  }
}
