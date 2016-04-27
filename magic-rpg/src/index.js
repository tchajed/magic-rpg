import AsciiGrid from './components/ascii';
import InfoPanel from './components/panel';
import Game from './game/game';
import Mousetrap from 'mousetrap';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import * as level1 from './assets/level1';
import Writing from './assets/level1-writing';

let game = new Game(level1.background,
  {
    'player': level1.player,
    'table': level1.table,
  },
  level1.view
);

let writing = new Writing(game.state);

// This is organized poorly - it doesn't make sense for a View to have a model
// that knows how to render itself.  It would be somewhat nice if View were a
// composable object, with children that re-composed themselves, but this might
// be too difficult, and is largely unnecessary if there are only two or three
// views (grid, selection info, and possibly news separately).
class View {
  constructor(model) {
    this.model = model;
    this.tree = model.render();
    this.rootNode = createElement(this.tree);
  }

  init(container) {
    container.appendChild(this.rootNode);
    this.listen();
  }

  // register update listeners
  listen() {}

  update() {
    let newTree = this.model.render();
    let patches = diff(this.tree, newTree);
    this.rootNode = patch(this.rootNode, patches);
    this.tree = newTree;
  }
}

class GridView extends View {
  listen() {
    this.model.game.on('change', () => {
      this.update();
    });
  }
}

class PanelView extends View {
  get selection() {
    return this.model.game.selection;
  }

  listen() {
    this.model.game.on('change', (ev) => {
      if (ev.type === 'selection' ||
      (ev.type === 'object' && ev.objectId == this.selection)) {
        this.update();
      }
    });
  }
}

new GridView(new AsciiGrid(game)).init(
  document.querySelector("#ascii-grid")
);

new PanelView(new InfoPanel(game, writing)).init(
  document.querySelector('#info-panel')
);

for (let [combo, dy, dx] of [
  [['left', 'a'], 0, -1],
  [['right', 'd'], 0, 1],
  [['up', 'w'], -1, 0],
  [['down', 's'], 1, 0],
]) {
  Mousetrap.bind(combo, game.moveObject.bind(game, 'player', dy, dx));
}

Mousetrap.bind('space', game.action.bind(game));
