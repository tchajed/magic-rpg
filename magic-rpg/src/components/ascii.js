import './ascii.css';
import h from 'virtual-dom/h';

export default class AsciiGrid {
  constructor(game) {
    this.game = game;
  }

  render() {
    return h('pre.unselectable', this.game.render());
  }
}
