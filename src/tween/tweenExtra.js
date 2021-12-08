import connect from '../objects/connect';
import Tween from './tween';

// to do
// * per property easing
// * per property duration
// * per property callback
// * per property delay/offset
// * new update method to work with the above
// * other cool ideas

/**
 * The `KUTE.TweenExtra()` constructor creates a new `Tween` object
 * for a single `HTMLElement` and returns it.
 *
 * This constructor is intended for experiments or testing of new features.
 */
export default class TweenExtra extends Tween {
  /**
   * @param {KUTE.tweenParams} args (*target*, *startValues*, *endValues*, *options*)
   * @returns {TweenExtra} the resulting Tween object
   */
  constructor(...args) {
    super(...args); // import constructor of TweenBase -> Tween

    return this;
  }

  // additional methods
  // set/override property
  // to(property, value) {
  // TO DO
  // this.valuesEnd[property] = value // well that's not all
  // }

  // fromTo(property, value) {
  // TO DO
  // this.valuesEnd[property] = value // well that's not all
  // }

  // getTotalDuration() {
  // to do
  // }

  /**
   * Method to add callbacks on the fly.
   * @param {string} name callback name
   * @param {Function} fn callback function
   * @returns {TweenExtra}
   */
  on(name, fn) {
    if (['start', 'stop', 'update', 'complete', 'pause', 'resume'].indexOf(name) > -1) {
      this[`_on${name.charAt(0).toUpperCase() + name.slice(1)}`] = fn;
    }
    return this;
  }

  /**
   * Method to set options on the fly.
   * * accepting [repeat,yoyo,delay,repeatDelay,easing]
   *
   * @param {string} option the tick time
   * @param {string | number | number[]} value the tick time
   * @returns {TweenExtra}
   */
  option(option, value) {
    this[`_${option}`] = value;
    return this;
  }
}

// Tween Interface
connect.tween = TweenExtra;
