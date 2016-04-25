import AsciiGrid from './components/ascii';
import Game from './game/game';
import {Texture, asciiBlock} from './game/assets';
import {Coords} from './game/graphics';

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
document.querySelector("#ascii-grid").appendChild(grid.render());
