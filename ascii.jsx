import React from 'react';

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

export default class AsciiGrid extends React.Component {
    rows() {
        var nums = [];
        for (var y = 0; y < this.props.height; y++) {
            nums.push(y);
        }
        return nums;
    }

    cols() {
        var nums = [];
        for (var x = 0; x < this.props.width; x++) {
            nums.push(x);
        }
        return nums;
    }

    constructor(props) {
        super(props);
        var grid = this.rows().map(() => {
            return this.cols().map(() => new Cell(' '));
        });

        // TODO: move this setup to a separate "experimentation" file
        var y = Math.floor(this.props.height/2);
        grid[y][3] = new Cell('@', 'character');
        grid[y][8] = new Cell('#', 'goal');
        this.state = { grid: grid };
    }

    render() {
        var cells = [];
        this.rows().forEach((y) => {
            this.cols().forEach((x) => {
                var cell = this.state.grid[y][x];
                cells.push(cell);
            });
            if (y != this.props.height - 1) {
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
