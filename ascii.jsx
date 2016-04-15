import React from 'react';
import update from 'react-addons-update';

class Cell {
    constructor(text, cls, style) {
        this.text = text;
        this.cls = cls || "";
        this.style = style || null;
    }

    isBare() {
        if (this.cls == "" && this.style == null) {
            return true;
        }
        return false;
    }

    getStyle() {
        return this.style || {null};
    }
}

class DrawCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.cell.isBare()) {
            return <span>{this.props.cell.text}</span>;
        }

        return <span className={this.props.cell.cls}
        style={this.props.cell.getStyle()}>
        {this.props.cell.text}
        </span>;
    }
}

class Pos {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    plus(other) {
        return new Pos(this.y + other.y, this.x + other.x);
    }
}

class GameObject {
    constructor(texture, pos) {
        this.texture = texture;
        this.pos = pos;
    }

    static fromText(textureDesc, cls, pos) {
        var lines = textureDesc.split("\n");
        var texture = lines.map((line) => {
            // assert line.length == this.width
            var row = [];
            for (var i = 0; i < line.length; i++) {
                row.push(new Cell(line.charAt(i), cls));
            }
            return row;
        });
        return new GameObject(texture, pos);
    }

    get height() {
        return this.texture.length;
    }

    get width() {
        return this.texture[0].length;
    }

    // returns the locations occupied by the object, organized by row
    area() {
        var locs = new Map();
        for (var dy = 0; dy < this.height; dy++) {
            var yLocs = [];
            for (var dx = 0; dx < this.width; dx++) {
                yLocs.push(this.pos.plus(new Pos(dy, dx)));
            }
            locs.set(this.pos.y + dy, yLocs);
        }
        return locs;
    }

    // shallow copy to an object with new position
    placedAt(pos) {
        return new GameObject(this.texture, pos);
    }

    // returns an update to place the object
    render() {
        var update = {};
        for (var dy = 0; dy < this.height; dy++) {
            var rowUpdate = {};
            for (var dx = 0; dx < this.width; dx++) {
                rowUpdate[this.pos.x + dx] = {
                    "$set": this.texture[dy][dx]
                };
            }
            update[this.pos.y + dy] = rowUpdate;
        }
        return update;
    }
}

export default class AsciiGrid extends React.Component {
    constructor(props) {
        super(props);
        var grid = [];
        for (var y = 0; y < this.props.height; y++) {
            var row = [];
            for (var x = 0; x < this.props.width; x++) {
                row.push(new Cell(' '));
            }
            grid.push(row);
        }
        this.background = grid;
        this.objects = {};
        // one-time initialization to background
        this.state = {grid};
    }

    renderBgAt(locs) {
        var upd = {};
        for (let [y, yLocs] of locs) {
            var yUpdate = {};
            yLocs.forEach((loc) => {
                yUpdate[loc.x] = {
                    "$set": this.background[loc.y][loc.x]
                };
            });
            upd[y] = yUpdate;
        }
        return upd;
    }

    updateObject(key, o) {
        if (this.objects[key]) {
            var locs = this.objects[key].area();
            var bg = this.renderBgAt(locs);
            this.setState((state) => {
                return { grid:
                    update(state.grid, bg)
                };
            });
        }
        this.objects[key] = o;
        this.setState((state) => {
            return { grid:
                update(state.grid, o.render())
            };
        });
    }

    moveObjectTo(key, newPos) {
        this.updateObject(key, this.objects[key].placedAt(newPos));
    }

    componentDidMount() {
        var y = Math.floor(this.props.height/2);
        var character = GameObject.fromText(
            "@", 'character', new Pos(y, 3));
        var goal = GameObject.fromText(
            "#", 'goal', new Pos(y, 8));
        this.updateObject('character', character);
        this.updateObject('goal', goal);
        setTimeout(() => {
            this.moveObjectTo('character', new Pos(y, 4));
        }, 1000);
    }

    render() {
        var cells = [];
        this.state.grid.forEach((row, y, rows) => {
            row.forEach((cell, x) => {
                cells.push(cell);
            });
            if (y != rows.length - 1) {
                cells.push(new Cell('\n'));
            }
        });

        return <code className="ascii">
        {cells.map( (cell, i) => {
            return <DrawCell cell={cell} key={i} />
        })}
        </code>;
    }
}
