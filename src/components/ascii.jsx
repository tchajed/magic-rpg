import React from 'react';
import update from 'react-addons-update';
import classNames from 'classnames';
import {Pos, Bounds, Game, Buffer} from './game.jsx';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

class Cell extends React.Component {
}

class BgCell extends Cell {
  render() {
    return <span>{this.props.text}</span>
  }
}

class FgCell extends Cell {
  static get propTypes() {
    return {
      handleClick: React.PropTypes.func,
      selected: React.PropTypes.bool,
      objectName: React.PropTypes.string,
    }
  }

  render() {
    return <span
      className={classNames({
        [this.props.objectName]: true,
        'selected': this.props.selected,
      })}
      onClick={this.props.handleClick}
      >{this.props.text}
    </span>;
  }
}

class GameObject {
  constructor(texture, name, pos, handleClick) {
    this.texture = texture;
    this.name = name;
    this.pos = pos;
    this.handleClick = handleClick;
  }

  static parseTexture(textureDesc) {
    var lines = textureDesc.split("\n");
    var texture = lines.map((line) => {
      // assert line.length == this.width
      var row = [];
      for (var i = 0; i < line.length; i++) {
        row.push(line.charAt(i));
      }
      return row;
    });
    return texture;
  }

  get height() {
    return this.texture.length;
  }

  get width() {
    return this.texture[0].length;
  }

  get bounds() {
    return new Bounds(this.width, this.height);
  }

  placedAt(newPos) {
    return new GameObject(this.texture,
      this.name,
      newPos,
      this.handleClick
    );
  }

  render(buf, selected) {
    for (var dy = 0; dy < this.height; dy++) {
      for (var dx = 0; dx < this.width; dx++) {
        let pos = this.pos.plus(dy, dx);
        var c = this.texture[dy][dx];
        buf.set(pos,
        () => <FgCell
        key={pos}
        handleClick={() => this.handleClick(this)}
        selected={selected}
        objectName={this.name}
        text={c} />);
      }
    }
  }
}

class ObjectFactory {
  constructor(handleClick) {
    this.handleClick = handleClick;
  }

  create(textureDesc, name, pos) {
    return new GameObject(
      GameObject.parseTexture(textureDesc),
      name, pos, this.handleClick
    );
  }
}

export default class AsciiGrid extends React.Component {
  constructor(props) {
    super(props);
    this.bounds = new Bounds(props.width, props.height);
    this.state = {
      objects: {},
      selected: null,
    };
    this.handleObjectClick = this.handleObjectClick.bind(this);
  }

  /**
   * Replace object at key with f(current o).
   */
  applyToObject(key, f) {
    this.setState((state) => {
      return {
        objects: _.assign(_.clone(state.objects), {
          [key]: f(state.objects[key]),
        })
      }
    });
  }

  updateObject(key, o) {
    this.applyToObject(key, () => o);
  }

  moveObjectTo(key, newPos) {
    this.applyToObject(key, (o) => o.placedAt(newPos));
  }

  handleObjectClick(obj) {
    var newSelection = this.state.selected == obj ? null : obj;
    this.setState({
      selected: newSelection,
    })
  }

  componentDidMount() {
    for (let [combo, delta] of [
      ['left', [0, -1]],
      ['right', [0, 1]],
      ['up', [-1, 0]],
      ['down', [1, 0]],
    ]) {
      Mousetrap.bind(combo, () => {
        this.applyToObject('character', (o) => {
          var after = o.pos.plus.apply(o.pos, delta);
          if (!this.bounds.contains(after, o.bounds)) {
            return o;
          }
          return o.placedAt(after);
        });
      });
    }

    // Mainly for testing, create some objects
    var objs = new ObjectFactory(this.handleObjectClick);
    var y = Math.floor(this.props.height/2);
    var character = objs.create("@@\n@@", 'character', new Pos(y, 3));
    var goal = objs.create("##\n##", 'goal', new Pos(y, 10));
    this.updateObject('character', character);
    this.updateObject('goal', goal);
  }

  render() {
    var buf = new Buffer(
      this.bounds,
      (pos) => {
        return <BgCell key={pos} text={' '}/>
      }
    );

    // TODO: objects should be maintained in a data structure that includes a
    // z-index for some predicability of rendering order.
    Object.keys(this.state.objects).forEach((key) => {
      var o = this.state.objects[key];
      o.render(buf, this.state.selected == o);
    });

    var cells = [];
    buf.force().forEach((row, y) => {
      row.forEach((cell) => cells.push(cell));
      cells.push(<span key={y}>{"\n"}</span>);
    });

    return <code className="ascii">{cells}</code>
  }
}
