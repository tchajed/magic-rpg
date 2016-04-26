import AsciiGrid from './components/ascii';
import Game from './game/game';
import Mousetrap from 'mousetrap';
import {Texture, asciiBlock} from './game/assets';
import {Coords} from './game/graphics';
import Entity from './game/entity';
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

let player = new Entity(
  new Coords(2, 2),
  Texture.fromDesc("@@\n@@")
);

let game = new Game(bg, {player}, {
  coords: new Coords(0, 0),
  size: bg.bounds,
});

class GridView {
  constructor(grid) {
    this.grid = grid;
    this.tree = grid.render();
    this.rootNode = createElement(this.tree);
  }

  init(container) {
    container.appendChild(this.rootNode);
    this.grid.game.on('selected', () => {
      this.update();
    });
    this.grid.game.on('objectChange', () => {
      this.update();
    });
  }

  update() {
    let newTree = this.grid.render();
    let patches = diff(this.tree, newTree);
    this.rootNode = patch(this.rootNode, patches);
    this.tree = newTree;
  }
}

new GridView(new AsciiGrid(game)).init(
  document.querySelector("#ascii-grid"));

const movePlayer = (dy, dx) => {
  game.moveObject('player', (coords) => {
    return new Coords(coords.y + dy, coords.x + dx);
  });
};

for (let [combo, dy, dx] of [
  ['left', 0, -1],
  ['right', 0, 1],
  ['up', -1, 0],
  ['down', 1, 0],
]) {
  Mousetrap.bind(combo, movePlayer.bind(null, dy, dx));
}
