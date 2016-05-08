import _ from 'lodash';
import StateMachine from './state';

export default class State extends StateMachine {
  defaults() {
    return {
      level: 'level1',
      exp: 0,
      talkedToManager: false,
      newsItem: -1,
      fastMovement: false,
      notesSeen: {},
      villagersTalkedTo: {},
      helpedVillager10: false,
      mailDelivery: 'not-started',
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
      this.modify('newsItem', (i) => i + 1);
    }
    if (obj.props.type === 'note') {
      this.modify('notesSeen', (s) => {
        return _.merge({[o]: true}, s);
      });
    }
    if (obj.props.type === 'villager') {
      if (o === 'villager1' &&
          !this.hasTalkedTo(o)) {
        this.modify('exp', (e) => e + 30);
      }
      if (o === 'villager10' &&
          this.hasTalkedTo(o) &&
         !this.helpedVillager10) {
        this.modify('exp', (e) => e + 30);
        this.ensure('helpedVillager10', true);
      }

      if (o === 'villager3') {
        if (this.mailDelivery == 'not-started') {
          this.set('mailDelivery', 'taken');
        }
        if (this.mailDelivery == 'delivered') {
          this.set('mailDelivery', 'done');
          this.modify('exp', (e) => e + 30);
        }
      }

      if (o === 'villager4') {
        if (this.mailDelivery === 'taken') {
          this.set('mailDelivery', 'delivered');
        }
        if (this.mailDelivery === 'done') {
          this.set('mailDelivery', 'fully-rewarded');
        }
      }

      this.modify('villagersTalkedTo', (s) => {
        return _.assign({}, s, {[o]: true});
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
    } else if (obj.props.type === 'villager') {
      if (this.hasTalkedTo(o)) {
        return 'talked-to';
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
    return this.get('notesSeen')[o] === true;
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

  hasTalkedTo(o) {
    return this.get('villagersTalkedTo')[o] === true;
  }
}
