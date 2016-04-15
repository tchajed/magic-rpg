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
        this.state = {grid};
    }

    componentDidMount() {
        var y = Math.floor(this.props.height/2);
        this.setState({grid: update(
            this.state.grid,
            { [y]: {
                3: {"$set": new Cell('@', 'character')},
                8: {"$set": new Cell('#', 'goal')},
            } }
        )});
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
