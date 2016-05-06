import h from 'virtual-dom/h';
import news from './text/news.yaml';

export default class News {
  constructor(state) {
    this.state = state;
  }

  render() {
    return h('div', [
      h('h2', 'News'),
      h('div', news[this.state.newsItem % news.length]),
    ]);
  }
}
