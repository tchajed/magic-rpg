import AsciiGrid from './components/ascii';
import Game from './game/game';
import {Texture, asciiBlock} from './game/assets';
import {Coords} from './game/graphics';
import createElement from 'virtual-dom/create-element';

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

let grid = new AsciiGrid(game);

const replaceContents = (node, replacement) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  node.appendChild(replacement);
  return node;
};

const updateGrid = () => {
  let rendered = createElement(grid.render());
  replaceContents(document.querySelector("#ascii-grid"), rendered);
};

updateGrid();

game.on('selected', () => {
  updateGrid();
});
