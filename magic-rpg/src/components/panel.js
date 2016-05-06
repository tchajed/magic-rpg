import './panel.css';

export default class InfoPanel {
  constructor(game, writing) {
    this.game = game;
    this.writing = writing;
  }

  render() {
    let selection = this.game.selection;
    if (selection === null) {
      return this.writing.story();
    }
    return this.writing.for(selection, this.game.object(selection));
  }
}
