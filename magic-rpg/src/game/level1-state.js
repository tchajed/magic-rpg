import _ from 'lodash';
import StateMachine from './state';

function countTrue(booleans) {
  return _.filter(booleans).length;
}

const fetchSolution = (() => {
  let solution = {
    'kitten': {o: 1, h: 4},
    'book' : {o: 6, h: 1},
    'fossil': {o: 5, h: 2},
    'star1': {o: 15, h: 3},
    'coffee': {o: 7, h: 5},
  };
  for (let name of Object.keys(solution)) {
    let {o, h} = solution[name];
    solution[name] = {object: 'object' + o, hinter: 'hinter' + h};
  }

  let forHinter = {};
  for (let name of Object.keys(solution)) {
    let soln = solution[name];
    forHinter[soln.hinter] = soln.object;
  }

  let forObject = {};
  for (let name of Object.keys(solution)) {
    let soln = solution[name];
    forObject[soln.object] = name;
  }

  return {
    forName: solution,
    forHinter: (hinter) => forHinter[hinter],
    forObject: (object) => forObject[object],
  };
})();

export default class State extends StateMachine {
  defaults() {
    return {
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
      talkedToBridgeWorker: false,
      buyStatus: 'ignorant',
      sourced: {},
      bridgeStatus: 0,

      // boss2
      talkedToAnyLackey: false,
      beatBoss2: false,

      // pre-dungeon hinting
      pickedAnyObject: false,
      heldObject: null,
      fetched: {},

      // boss3
      beatBoss3: false,
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
      'enteredRoom.factory': true,
      'enteredRoom.boss2-road': true,
      'enteredRoom.boss2': true,
      'enteredRoom.pre-dungeon': true,
      talkedToManager: true,
      beatBoss1: true,
      'notesSeen.hint1': true,
      'notesSeen.hint2': true,
      'notesSeen.hint3': true,
      'bridgeStatus': true,
      'buyStatus': (oldVal, newVal) => newVal === 'explained',
      beatBoss2: true,
      'fetched.kitten': true,
      'fetched.book': true,
      'fetched.fossil': true,
      'fetched.star1': true,
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

  talkedToFactoryPeople() {
    if (this.buyStatus !== 'ignorant' ||
       this.talkedToBridgeWorker) {
      return true;
    }
    return false;
  }

  talkedToAnyBoss2Crew() {
    return this.talkedToAnyLackey || this.beatBoss2;
  }

  get chapter() {
    if (!this.talkedToManager) {
      return 'intro';
    }
    if (this.enteredRoom.village &&
        !this.talkedToAnyVillagers()) {
      return 'ch1-village';
    }
    if (this.enteredRoom['factory-road'] &&
        !this.talkedToFactoryPeople()) {
      return 'ch2-factory';
    }
    if (this.enteredRoom.boss2 &&
        !this.talkedToAnyBoss2Crew()) {
      return 'ch2.5-boss2';
    }
    if (this.enteredRoom['pre-dungeon'] &&
       !this.pickedAnyObject &&
       !this.enteredRoom.boss3) {
      return 'ch3-pre-dungeon';
    }
    if (this.enteredRoom.boss3 &&
        !this.beatBoss3) {
      return 'ch3.5-boss3';
    }
    if (this.beatBoss3) {
      return 'closing';
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
    if (o === 'bridge-worker') {
      this.set('talkedToBridgeWorker', true);
    }
    if (o === 'plant-manager') {
      this.interactPlantManager();
    }
    if (obj.props.type === 'dealer') {
      this.interactDealer(o, obj);
    }
    if (obj.props.type === 'lackey') {
      this.set('talkedToAnyLackey', true);
    }
    if (o === 'boss2') {
      this.set('beatBoss2', true);
    }
    if (obj.props.type === 'object') {
      this.interactObject(o, obj);
    }
    if (obj.props.type === 'hinter') {
      this.interactHinter(o, obj);
    }
    if (o === 'boss3') {
      this.set('beatBoss3', true);
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

  interactPlantManager() {
    if (this.buyStatus === 'ignorant') {
      this.set('buyStatus', 'explained');
      return;
    }
    if (this.buyStatus === 'explained') {
      this.set('buyStatus', 'agreed');
      return;
    }
    if (this.buyStatus === 'agreed') {
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

  interactObject(o) {
    // set this even if you (try to) pick up the dragon
    this.set('pickedAnyObject', true);
    // dragon
    if (o === 'object11') {
      this.set('heldObject', null);
      return;
    }
    this.set('heldObject', o);
  }

  questIncomplete(hinter) {
    return !(this.holdingRightObject(hinter) || this.solvedQuest(hinter));
  }

  holdingRightObject(hinter) {
    let object = fetchSolution.forHinter(hinter);
    if (this.heldObject === object) {
      return true;
    }
  }

  solvedQuest(hinter) {
    let object = fetchSolution.forHinter(hinter);
    let name = fetchSolution.forObject(object);
    if (this.fetched[name]) {
      return true;
    }
    return false;
  }

  interactHinter(hinter) {
    let object = fetchSolution.forHinter(hinter);
    let name = fetchSolution.forObject(object);

    if (this.fetched[name]) {
      return;
    }

    if (this.heldObject === object) {
      this.set(`fetched.${name}`, true);
      this.set('heldObject', null);
      if (hinter === 'hinter5') {
        this.modify('exp', (e) => e + 5);
      }
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
    if (o === 'boss2') {
      if (this.beatBoss2) {
        return 'defeated';
      }
    }
    if (o === 'boss2-exit') {
      if (this.beatBoss2) {
        return 'open';
      }
    }
    if (obj.props.type === 'object') {
      if (this.heldObject === o) {
        return 'gone';
      }
      if (this.fetched[fetchSolution.forObject(o)]) {
        return 'gone';
      }
    }
    if (o === 'boss3') {
      if (this.beatBoss3) {
        return 'defeated';
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
    let oIndex = this.gooseChaseChain.indexOf(o);
    if (oIndex === -1) {
      throw new Error(`non-goose chase villager ${o} queried`);
    }
    if (oIndex === 0) {
      return this.gooseChaseDone;
    }
    return this.gooseChaseIndex >= oIndex - 1;
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
      'le-one-power': countTrue([sourced.lion, sourced.ur, sourced.all]) <= 1,
      'silk->uranium': implies(sourced.silk, sourced.uranium),
      '!silk+uranium': !(sourced.silk && sourced.uranium),
      '!polyester': !sourced.polyester,
      'lion->power': implies(sourced.lion, sourced.power),
      'power->silk': implies(sourced.power, sourced.silk),
    };
  }

  get missingResources() {
    let constraints = this.sourceConstraints;
    let resources = _.flatMap(['thread', 'powder', 'power'], (resource) => {
      return constraints[resource] ? [] : [resource];
    });
    if (resources.length === 0) {
      return '';
    }
    if (resources.length === 1) {
      return resources[0];
    }
    resources[resources.length-1] = "and " + resources[resources.length-1];
    return resources.join(", ");
  }

  get isMissingResources() {
    let constraints = this.sourceConstraints;
    if (constraints.thread && constraints.powder && constraints.power) {
      return false;
    }
    return true;
  }

  get halfwaySourced() {
    return !this.isMissingResources;
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

  get playerLevel() {
    return this.beatBoss3 ? 4 : 3;
  }
}
