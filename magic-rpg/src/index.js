import AsciiGrid from './components/ascii';

let grid = new AsciiGrid("hello");
document.querySelector("#ascii-grid").appendChild(grid.render());
