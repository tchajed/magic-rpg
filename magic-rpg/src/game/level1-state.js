import StateMachine from './state';

export default class State extends StateMachine {
  defaults() {
    return {
      level: 'level1',
      talkedToManager: false,
      newsItem: -1,
    };
  }

  get chapter() {
    if (!this.talkedToManager) {
      return 'intro';
    }
    return null;
  }

  interact(o /*, obj */) {
    if (o === 'manager') {
      this.ensure('talkedToManager', true);
    }
    if (o === 'news') {
      this.set('newsItem', this.get('newsItem') + 1);
    }
  }

  forObject(o) {
    if (o === 'manager') {
      if (this.talkedToManager) {
        return 'seen';
      }
    }
    return 'default';
  }
}
