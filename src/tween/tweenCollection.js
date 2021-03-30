import KUTE from '../objects/kute.js';
import defaultOptions from '../objects/defaultOptions.js';
import connect from '../objects/connect.js';

// KUTE.js Tween Collection
// ========================

export default class TweenCollection {
  constructor(els, vS, vE, Options) {
    this.tweens = [];

    // set default offset
    if (!('offset' in defaultOptions)) defaultOptions.offset = 0;

    const Ops = Options || {};
    Ops.delay = Ops.delay || defaultOptions.delay;

    // set all options
    const options = [];

    Array.from(els).forEach((el, i) => {
      const TweenConstructor = connect.tween;
      options[i] = Ops || {};
      options[i].delay = i > 0 ? Ops.delay + (Ops.offset || defaultOptions.offset) : Ops.delay;
      if (el instanceof Element) {
        this.tweens.push(new TweenConstructor(el, vS, vE, options[i]));
      } else {
        throw Error(`KUTE.js - ${el} not instanceof [Element]`);
      }
    });

    this.length = this.tweens.length;
    return this;
  }

  start(time) {
    const T = time === undefined ? KUTE.Time() : time;
    this.tweens.map((tween) => tween.start(T));
    return this;
  }

  stop() {
    this.tweens.map((tween) => tween.stop());
    return this;
  }

  pause(time) {
    const T = time === undefined ? KUTE.Time() : time;
    this.tweens.map((tween) => tween.pause(T));
    return this;
  }

  resume(time) {
    const T = time === undefined ? KUTE.Time() : time;
    this.tweens.map((tween) => tween.resume(T));
    return this;
  }

  chain(args) {
    const lastTween = this.tweens[this.length - 1];
    if (args instanceof TweenCollection) {
      lastTween.chain(args.tweens);
    } else if (args instanceof connect.tween) {
      lastTween.chain(args);
    } else {
      throw new TypeError('KUTE.js - invalid chain value');
    }
    return this;
  }

  playing() {
    return this.tweens.some((tw) => tw.playing);
  }

  removeTweens() {
    this.tweens = [];
  }

  getMaxDuration() {
    const durations = [];
    this.tweens.forEach((tw) => {
      durations.push(tw._duration + tw._delay + tw._repeat * tw._repeatDelay);
    });
    return Math.max(durations);
  }
}
