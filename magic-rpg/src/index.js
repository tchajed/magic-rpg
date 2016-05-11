import './styles.css';
import AsciiGrid from './components/ascii';
import InfoPanel from './components/panel';
import Game from './game/game';
import Mousetrap from 'mousetrap';
import createElement from 'virtual-dom/create-element';
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import * as level1 from './assets/level1';
import Writing from './assets/level1-writing';
import News from './assets/news';


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

  init(selector) {
    let component = document.querySelector(selector);
    component.appendChild(this.rootNode);
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

class NewsView extends View {
  listen() {
    this.model.state.on('transition', ({property}) => {
      if (property === 'newsItem' || property === '*') {
        this.update();
      }
    });
  }
}

let game = new Game(level1.background, level1.objects, level1.viewSize);

// header
new View(
  {render: () => h('h1', 'Magic RPG')}
).init("#header");

new GridView(
  new AsciiGrid(game))
  .init("#ascii-grid");

new PanelView(
  new InfoPanel(game, new Writing(game.state)))
  .init("#info-panel");

new NewsView(
  new News(game.state))
  .init("#news-panel");

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
        return false;
      }, 'keydown');
      Mousetrap.bind(data.shortcuts, () => {
        this.keysDown[key] = null;
        return false;
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

let interval = (fastMovement) => {
  return fastMovement ? 1000/25 : 1000/10;
};

let movement = new Movement((delta) => {
  game.moveObject('player', delta[0], delta[1]);
}, interval(game.state.get('fastMovement')));

Mousetrap.bind('space', () => {
  game.action();
  return false;
});
Mousetrap.bind(['shift+space', 'escape'], () => {
  game.select(null);
  return false;
});
Mousetrap.bind('b', () => {
  game.state.set('fastMovement', !game.state.get('fastMovement'));
  movement.changeInterval(interval(game.state.get('fastMovement')));
});

let infoPanel = document.querySelector("#info-panel");
Mousetrap.bind('j', () => {
  infoPanel.scrollTop += 20;
  return false;
});
Mousetrap.bind('k', () => {
  infoPanel.scrollTop -= 20;
  return false;
});
