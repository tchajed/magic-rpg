import h from 'virtual-dom/h';
import news from '../assets/text/news.yaml';
import gen from 'random-seed';

const rand = gen.create(0);
// Fischer-Yates in-place shuffle
function shuffle(a) {
  for (let i = a.length - 1; i >= 1; i--) {
    const j = rand.range(i+1);
    [a[i], a[j]] = [a[j], a[i]];
  }
}
shuffle(news);
rand.done();

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
