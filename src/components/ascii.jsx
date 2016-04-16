import React from 'react';
import update from 'react-addons-update';
import classNames from 'classnames';
import {Pos, Game, Buffer} from './game.jsx';
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
        var pos = this.pos.plus(dy, dx);
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
    this.state = {
      objects: {},
      selected: null,
    };
    this.handleObjectClick = this.handleObjectClick.bind(this);
  }

  updateObject(key, o) {
    this.setState((state) => {
      return {
        objects: _.assign(_.clone(state.objects), {
          [key]: o,
        })
      }
    });
  }

  moveObjectTo(key, newPos) {
    this.setState((state) => {
      var o = state.objects[key];
      var objects = _.clone(state.objects);
      objects[key] = o.placedAt(newPos);
      return {objects};
    });
  }

  handleObjectClick(obj) {
    var newSelection = this.state.selected == obj ? null : obj;
    this.setState({
      selected: newSelection,
    })
  }

  componentDidMount() {
    var objs = new ObjectFactory(this.handleObjectClick);
    var y = Math.floor(this.props.height/2);
    var character = objs.create("@", 'character', new Pos(y, 3));
    var goal = objs.create("#", 'goal', new Pos(y, 8));
    this.updateObject('character', character);
    this.updateObject('goal', goal);
    setTimeout(() => {
      this.moveObjectTo('character', new Pos(y, 4));
    }, 1000);
  }

  render() {
    var buf = new Buffer(this.props.width, this.props.height, (pos) => {
      return <BgCell key={pos} text={' '}/>
    });

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
