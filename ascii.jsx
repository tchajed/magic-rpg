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
    constructor(texture, cls, pos) {
        var lines = texture.split("\n");
        this.height = lines.length;
        this.width = lines[0].length;
        this.texture = lines.map((line) => {
            // assert line.length == this.width
            var row = [];
            for (var i = 0; i < line.length; i++) {
                row.push(new Cell(line.charAt(i), cls));
            }
            return row;
        });
        this.pos = pos;
    }

    // returns the locations occupied by the object, organized by row
    area() {
        var locs = new Map();
        for (var dy = 0; dy < this.height; dy++) {
            var yLocs = [];
            for (var dx = 0; dx < this.width; dx++) {
                yLocs.push(this.pos.plus(new Pos(dy, dx)));
            }
            locs[this.pos.y + dy] = yLocs;
        }
        return locs;
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

    renderBgAt(locations) {
        var upd = {};
        for ([y, yLocs] of locations) {
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
            this.setState((state) => {
                return { grid:
                    update(state.grid,
                           this.renderBgAt(locs))
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

    componentDidMount() {
        var y = Math.floor(this.props.height/2);
        var character = new GameObject("@", 'character',
                                       new Pos(y, 3));
        var goal = new GameObject("#", 'goal',
                                       new Pos(y, 8));
        this.updateObject('character', character);
        this.updateObject('goal', goal);
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
        {cells.map(function(cell, i) {
            if (cell.isBare()) {
                return cell.text;
            }
            return <span className={cell.cls}
            style={cell.getStyle()}
            key={i}>
            {cell.text}
            </span>;
        })}
        </code>;
    }
}
