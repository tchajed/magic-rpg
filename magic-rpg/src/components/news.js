import h from 'virtual-dom/h';
import news from '../assets/text/news.yaml';

export default class News {
  constructor(state) {
    this.state = state;
  }

  render() {
    if (this.state.newsItem >= 0) {
      return h('div', [
        h('h2', 'News'),
        h('div', news[this.state.newsItem % news.length]),
      ]);
    } else {
      return h('div');
    }
  }
}
