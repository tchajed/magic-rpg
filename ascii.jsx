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

var AsciiGrid = React.createClass({
    getInitialState: function() {
            var grid = []
            var width = this.props.width;
            var height = this.props.height;
            for (var y = 0; y < height; y++) {
                var row = []
                for (var x = 0; x < width; x++) {
                    row.push(new Cell('#'));
                }
                grid.push(row)
            }
            return { grid: grid };
    },

    render: function() {
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
                    console.log(cell);
                    if (cell.isBare()) {
                        return cell.text;
                    }
                    console.warn("why here?");
                    return (<span class={cell.cls}
                            style={cell.getStyle()} key={i}>
                    {cell.text}
                    </span>);
                })};
                </span>;
    },
});

module.exports = AsciiGrid;
