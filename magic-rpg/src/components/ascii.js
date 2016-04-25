import h from 'hyperscript';
import './ascii.css';

export default class AsciiGrid {
  constructor(text) {
    this.text = text;
  }

  render() {
    return h('code.ascii', this.text);
  }
}
