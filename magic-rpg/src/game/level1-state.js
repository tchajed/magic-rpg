import _ from 'lodash';
import StateMachine from './state';

export default class State extends StateMachine {
  defaults() {
    return {
      level: 'level1',
      talkedToManager: false,
      newsItem: -1,
      fastMovement: false,
      notesSeen: {},
    };
  }

  get chapter() {
    if (!this.talkedToManager) {
      return 'intro';
    }
    return null;
  }

  interact(o, obj) {
    if (o === 'manager') {
      this.ensure('talkedToManager', true);
    }
    if (o === 'news') {
      this.set('newsItem', this.get('newsItem') + 1);
    }
    if (obj.props.type === 'note') {
      this.modify('notesSeen', (s) => {
        return _.merge({[o]: true}, s);
      });
    }
  }

  forObject(o, obj) {
    if (o === 'manager') {
      if (this.talkedToManager) {
        return 'seen';
      }
    }
    if (obj.props.type === 'note') {
      if (this.hasSeenNote(o)) {
        return 'note-seen';
      }
    }
    if (o === 'door') {
      if (this.talkedToManager && this.hasSeenAllHints) {
        return 'open';
      }
    }
    return 'default';
  }

  hasSeenNote(o) {
    return this.get('notesSeen')[o] !== undefined;
  }

  get hasSeenExploreHint() {
    return this.hasSeenNote('hint1');
  }

  get hasSeenTrainHint() {
    return this.hasSeenNote('hint2');
  }

  get hasSeenAfterHint() {
    return this.hasSeenNote('hint3');
  }

  get hasSeenAllHints() {
    return (this.hasSeenExploreHint &&
            this.hasSeenTrainHint &&
              this.hasSeenAfterHint);
  }
}
