import _ from 'lodash';
import StateMachine from './state';

function countTrue(booleans) {
  return _.filter(booleans).length;
}

export default class State extends StateMachine {
  defaults() {
    return {
      level: 'level1',
      exp: 0,
      room: 'office',
      enteredRoom: {},
      talkedToManager: false,
      newsItem: -1,
      fastMovement: false,
      // for debugging, make this available by default
      toggleSelection: true,
      notesSeen: {},
      villagersTalkedTo: {},
      gooseChaseIndex: -1,
      helpedVillager10: false,
      helpedVillager11: false,
      mailDelivery: 'not-started',
      beatBoss1: false,

      // factory

      buyStatus: 'ignorant',
      sourced: {},
      bridgeStatus: 0,
    };
  }

  constructor() {
    super();
    this.on('transition', (ev) => {
      if (ev.property === 'room') {
        this.set(`enteredRoom.${ev.newVal}`, true);
      }
    });
  }

  isTransitionImportant(ev) {
    if (_.isEqual(ev.oldVal, ev.newVal)) {
      return false;
    }
    let checks = {
      exp: true,
      'enteredRoom.village': true,
      talkedToManager: true,
      beatBoss1: true,
      'notesSeen.hint1': true,
      'notesSeen.hint2': true,
      'notesSeen.hint3': true,
      'bridgeStatus': true,
      'buyStatus': (oldVal, newVal) => newVal === 'explained',
    };
    let check = checks[ev.property];
    if (check === undefined) {
      return false;
    }
    if (check === true) {
      return true;
    }
    return check(ev.oldVal, ev.newVal);
  }

  talkedToAnyVillagers() {
    for (let villager of Object.keys(this.villagersTalkedTo)) {
      if (this.villagersTalkedTo[villager]) {
        return true;
      }
    }
    return false;
  }

  get chapter() {
    if (!this.talkedToManager) {
      return 'intro';
    }
    if (this.enteredRoom.village &&
        !this.talkedToAnyVillagers()) {
      return 'chapter1';
    }
    return null;
  }

  nextNewsItem() {
      this.modify('newsItem', (i) => i + 1);
  }

  interact(o, obj) {
    if (o === 'manager') {
      this.set('talkedToManager', true);
    }
    if (o === 'news') {
      this.nextNewsItem();
    }
    if (obj.props.type === 'note') {
      this.set(`notesSeen.${o}`, true);
    }
    if (obj.props.type === 'villager') {
      this.interactVillager(o);
    }
    if (o === 'boss1') {
      let expGain = 0;
      if (this.boss1Leveling == '=') {
        expGain = 50;
      }
      if (this.boss1Leveling == '+') {
        expGain = 20;
      }
      if (expGain > 0 && !this.beatBoss1) {
        this.modify('exp', (e) => e + expGain);
        this.set('beatBoss1', true);
      }
    }
    if (o === 'plant-manager') {
      if (this.buyStatus === 'ignorant') {
        this.set('buyStatus', 'explained');
      } else if (this.buyStatus === 'explained') {
        this.set('buyStatus', 'agreed');
      } else if (this.buyStatus === 'agreed') {
        if (this.doneSourcing) {
          this.set('bridgeStatus', 100);
          return;
        }
        if (this.almostDoneSourcing && this.bridgeStatus < 90) {
          this.set('bridgeStatus', 90);
          return;
        }
        if (this.halfwaySourced && this.bridgeStatus < 50) {
          this.set('bridgeStatus', 50);
          return;
        }
      }
    }
    if (obj.props.type === 'dealer') {
      this.interactDealer(o, obj);
    }
  }

  get permissionToBuy() {
    return this.buyStatus === 'agreed';
  }

  interactVillager(o) {
    if (o === 'villager1' &&
        !this.hasTalkedTo(o)) {
      this.modify('exp', (e) => e + 30);
    }
    if (o === 'villager10' &&
        this.hasTalkedTo(o) &&
        !this.helpedVillager10) {
      this.modify('exp', (e) => e + 30);
      this.set('helpedVillager10', true);
    }

    if (o === 'villager11' &&
        this.hasTalkedTo(o) &&
        !this.helpedVillager11) {
      this.modify('exp', (e) => e + 30);
      this.set('helpedVillager11', true);
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
        this.modify('exp', (e) => e + 30);
      }
    }

    if (this.gooseChaseChain.indexOf(o) !== -1) {
      let oIndex = this.gooseChaseChain.indexOf(o);
      if (oIndex === this.gooseChaseIndex + 1) {
        this.set('gooseChaseIndex', oIndex);
      }
    }

    this.set(`villagersTalkedTo.${o}`, true);
  }

  interactDealer(o, obj) {
    if (!this.permissionToBuy) {
      return;
    }
    this.modify(`sourced.${obj.props.resource}`, (b) => !b);
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
    if (o === 'boss1') {
      if (this.beatBoss1) {
        return 'defeated';
      }
    }
    if (o === 'boss1-door') {
      if (this.beatBoss1) {
        return 'open';
      }
    }
    if (o === 'bridge') {
      if (this.bridgeStatus === 100) {
        return 'done';
      }
      if (this.bridgeStatus >= 90) {
        return 'almost-done';
      }
      if (this.bridgeStatus >= 50) {
        return 'halfway';
      }
    }
    if (obj.props.type === 'dealer') {
      if (this.sourced[obj.props.resource]) {
        return 'purchased';
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

  get gooseChaseChain() {
    return ['villager2',
      'villager12',
      'villager5',
      'villager7',
      'villager9'];
  }

  gooseChaseDoneUpTo(o) {
    let oIndex = this.gooseChaseChain.lastIndexOf(o);
    if (oIndex === -1) {
      throw new Error(`non-goose chase villager ${o} queried`);
    }
    return this.gooseChaseIndex >= oIndex;
  }

  get gooseChaseDone() {
    return this.gooseChaseIndex == this.gooseChaseChain.length - 1;
  }

  get boss1Leveling() {
    if (this.exp < 90) {
      return '-';
    }
    if (this.exp === 90) {
      return '=';
    }
    // this.exp > 90
    return '+';
  }

  get sourceConstraints() {
    let implies = (a, b) => {
      return !a || b;
    };
    let sourced = this.get('sourced');
    return {
      'thread':  sourced.polyester || sourced.cotton || sourced.silk,
      'powder': sourced.control || sourced.power || sourced.all,
      'power': sourced.lion || sourced.ur || sourced.all,
      'silk->uranium': implies(sourced.silk, sourced.uranium),
      '!silk+uranium': !(sourced.silk && sourced.uranium),
      '!polyester': !sourced.polyester,
      'lion->power': implies(sourced.lion, sourced.power),
      'power->silk': implies(sourced.power, sourced.silk),
      'one-power': countTrue([sourced.lion, sourced.ur, sourced.all]) === 1,
    };
  }

  get halfwaySourced() {
    let constraints = this.sourceConstraints;
    if (constraints.thread && constraints.powder && constraints.power) {
      return true;
    }
    return false;
  }

  get almostDoneSourcing() {
    let constraints = this.sourceConstraints;
    let satisfied = _.map(Object.keys(constraints), (name) => constraints[name]);
    // all but 0 or 1 contraints are met
    if (countTrue(satisfied) >= satisfied.length - 1) {
      return true;
    }
  }

  get doneSourcing() {
    let constraints = this.sourceConstraints;
    for (let name of Object.keys(constraints)) {
      if (!constraints[name]) {
        return false;
      }
    }
    return true;
  }
}
