import KEC from '../objects/kute';
import defaultOptions from '../objects/defaultOptions';
import connect from '../objects/connect';

/**
 * The static method creates a new `Tween` object for each `HTMLElement`
 * from and `Array`, `HTMLCollection` or `NodeList`.
 */
export default class TweenCollection {
  /**
   *
   * @param {Element[] | HTMLCollection | NodeList} els target elements
   * @param {KUTE.tweenProps} vS the start values
   * @param {KUTE.tweenProps} vE the end values
   * @param {KUTE.tweenOptions} Options tween options
   * @returns {TweenCollection} the Tween object collection
   */
  constructor(els, vS, vE, Options) {
    const TweenConstructor = connect.tween;
    /** @type {KUTE.twCollection[]} */
    this.tweens = [];

    const Ops = Options || {};
    /** @type {number?} */
    Ops.delay = Ops.delay || defaultOptions.delay;

    // set all options
    const options = [];

    Array.from(els).forEach((el, i) => {
      options[i] = Ops || {};
      options[i].delay = i > 0 ? Ops.delay + (Ops.offset || defaultOptions.offset) : Ops.delay;
      if (el instanceof Element) {
        this.tweens.push(new TweenConstructor(el, vS, vE, options[i]));
      } else {
        throw Error(`KUTE - ${el} is not instanceof Element`);
      }
    });

    /** @type {number?} */
    this.length = this.tweens.length;
    return this;
  }

  /**
   * Starts tweening, all targets
   * @param {number?} time the tween start time
   * @returns {TweenCollection} this instance
   */
  start(time) {
    const T = time === undefined ? KEC.Time() : time;
    this.tweens.map((tween) => tween.start(T));
    return this;
  }

  /**
   * Stops tweening, all targets and their chains
   * @returns {TweenCollection} this instance
   */
  stop() {
    this.tweens.map((tween) => tween.stop());
    return this;
  }

  /**
   * Pause tweening, all targets
   * @returns {TweenCollection} this instance
   */
  pause() {
    this.tweens.map((tween) => tween.pause());
    return this;
  }

  /**
   * Resume tweening, all targets
   * @returns {TweenCollection} this instance
   */
  resume() {
    this.tweens.map((tween) => tween.resume());
    return this;
  }

  /**
   * Schedule another tween or collection to start after
   * this one is complete.
   * @param {number?} args the tween start time
   * @returns {TweenCollection} this instance
   */
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

  /**
   * Check if any tween instance is playing
   * @param {number?} time the tween start time
   * @returns {TweenCollection} this instance
   */
  playing() {
    return this.tweens.some((tw) => tw.playing);
  }

  /**
   * Remove all tweens in the collection
   */
  removeTweens() {
    this.tweens = [];
  }

  /**
   * Returns the maximum animation duration
   * @returns {number} this instance
   */
  getMaxDuration() {
    const durations = [];
    this.tweens.forEach((tw) => {
      durations.push(tw._duration + tw._delay + tw._repeat * tw._repeatDelay);
    });
    return Math.max(durations);
  }
}
