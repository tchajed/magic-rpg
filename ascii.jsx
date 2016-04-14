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
    constructor(props) {
        super(props);
        var grid = []
        var width = this.props.width;
        var height = this.props.height;
        for (var y = 0; y < height; y++) {
            var row = []
            for (var x = 0; x < width; x++) {
                row.push(new Cell(' '));
            }
            grid.push(row)
        }
        grid[4][4] = new Cell('@', 'character');
        grid[4][8] = new Cell('#', 'goal');
        this.state = { grid: grid };
    }

    render() {
        var cells = [];
        for (var y = 0; y < this.props.height; y++) {
            for (var x = 0; x < this.props.width; x++) {
                var cell = this.state.grid[y][x];
                cells.push(cell);
            }
            if (y != this.props.height - 1) {
                cells.push(new Cell('\n'));
            }
        }
        return <span>
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
        </span>;
    }
}
