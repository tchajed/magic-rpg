import AsciiGrid from './components/ascii';
import Game from './game/game';
import {Texture, asciiBlock} from './game/assets';
import {Coords} from './game/graphics';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

let bg = Texture.background(asciiBlock(`
+-----------------------------------------------------+
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                                                     |
+-----------------------------------------------------+
`));

let player = {
  coords: new Coords(2, 2),
  texture: Texture.fromDesc("@@\n@@"),
};

let game = new Game(bg, {player}, {
  coords: new Coords(0, 0),
  size: bg.bounds,
});

class GridView {
  constructor(grid, container) {
    this.grid = grid;
    this.tree = grid.render();
    this.rootNode = createElement(this.tree);
    container.appendChild(this.rootNode);
  }

  update() {
    let newTree = this.grid.render();
    let patches = diff(this.tree, newTree);
    this.rootNode = patch(this.rootNode, patches);
    this.tree = newTree;
  }
}

let view = new GridView(
  new AsciiGrid(game),
  document.querySelector("#ascii-grid"));

game.on('selected', () => {
  view.update();
});
