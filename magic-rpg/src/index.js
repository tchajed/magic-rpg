// TODO: load this from index.html before the rest of the page with some webpack
// configuration
import './styles.css';
import AsciiGrid from './components/ascii';
import InfoPanel from './components/panel';
import Game from './game/game';
import Mousetrap from 'mousetrap';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import * as level1 from './assets/level1';
import Writing from './assets/level1-writing';

let game = new Game(level1.background, level1.objects, level1.viewSize);

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
      (ev.type === 'object' && ev.objectId == this.selection) ||
      ev.type == 'state') {
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

const keys = new Map([
  ['left', {
    shortcuts: ['left', 'a'],
    delta: [0, -1],
  }],
  ['right', {
    shortcuts: ['right', 'd'],
    delta: [0, 1],
  }],
  ['up', {
    shortcuts: ['up', 'w'],
    delta: [-1, 0],
  }],
  ['down', {
    shortcuts: ['down', 's'],
    delta: [1, 0],
  }],
]);

class Movement {
  constructor(cb, interval) {
    this.clock = 0;
    this.cb = cb;
    this.keysDown = {
      left: null,
      right: null,
      up: null,
      down: null,
    };
    // jshint loopfunc: true
    for (let [key, data] of keys) {
      Mousetrap.bind(data.shortcuts, () => {
        this.keysDown[key] = this.clock;
        this.clock++;
      }, 'keydown');
      Mousetrap.bind(data.shortcuts, () => {
        this.keysDown[key] = null;
      }, 'keyup');
    }
    this.interval = setInterval(() => {
      this.handle();
    }, interval);
  }

  handle() {
    let maxKey = null;
    let maxClock = -1;
    for (let key of keys.keys()) {
      if (this.keysDown[key] !== null && this.keysDown[key] > maxClock) {
        maxClock = this.keysDown[key];
        maxKey = key;
      }
    }
    if (maxKey !== null) {
      this.cb(keys.get(maxKey).delta);
    }
  }

  changeInterval(interval) {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.handle();
    }, interval);
  }
}

let fastMovement = false;

let movement = new Movement((delta) => {
  game.moveObject('player', delta[0], delta[1]);
}, 1000/10);

Mousetrap.bind('space', game.action.bind(game));
Mousetrap.bind('b', () => {
  fastMovement = !fastMovement;
  movement.changeInterval(fastMovement ? 1000/25 : 1000/10);
});
