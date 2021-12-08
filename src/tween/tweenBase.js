import KEC from '../objects/kute';
import connect from '../objects/connect';
import onStart from '../objects/onStart';
import onComplete from '../objects/onComplete';
import defaultOptions from '../objects/defaultOptions';

import { Tick, Ticker, stop } from '../core/render';

import add from '../core/add';
import remove from '../core/remove';
import queueStart from '../core/queueStart';

/**
 * The `TweenBase` constructor creates a new `Tween` object
 * for a single `HTMLElement` and returns it.
 *
 * `TweenBase` is meant to be used with pre-processed values.
 */
export default class TweenBase {
  /**
   * @param {Element} targetElement the target element
   * @param {KUTE.tweenProps} startObject the start values
   * @param {KUTE.tweenProps} endObject the end values
   * @param {KUTE.tweenOptions} opsObject the end values
   * @returns {TweenBase} the resulting Tween object
   */
  constructor(targetElement, startObject, endObject, opsObject) {
    // element animation is applied to
    this.element = targetElement;

    /** @type {boolean} */
    this.playing = false;
    /** @type {number?} */
    this._startTime = null;
    /** @type {boolean} */
    this._startFired = false;

    // type is set via KUTE.tweenProps
    this.valuesEnd = endObject;
    this.valuesStart = startObject;

    // OPTIONS
    const options = opsObject || {};
    // internal option to process inline/computed style at start instead of init
    // used by to() method and expects object : {} / false
    this._resetStart = options.resetStart || 0;
    // you can only set a core easing function as default
    /** @type {KUTE.easingOption} */
    this._easing = typeof (options.easing) === 'function' ? options.easing : connect.processEasing(options.easing);
    /** @type {number} */
    this._duration = options.duration || defaultOptions.duration; // duration option | default
    /** @type {number} */
    this._delay = options.delay || defaultOptions.delay; // delay option | default

    // set other options
    Object.keys(options).forEach((op) => {
      const internalOption = `_${op}`;
      if (!(internalOption in this)) this[internalOption] = options[op];
    });

    // callbacks should not be set as undefined
    // this._onStart = options.onStart
    // this._onUpdate = options.onUpdate
    // this._onStop = options.onStop
    // this._onComplete = options.onComplete

    // queue the easing
    const easingFnName = this._easing.name;
    if (!onStart[easingFnName]) {
      onStart[easingFnName] = function easingFn(prop) {
        if (!KEC[prop] && prop === this._easing.name) KEC[prop] = this._easing;
      };
    }

    return this;
  }

  /**
   * Starts tweening
   * @param {number?} time the tween start time
   * @returns {TweenBase} this instance
   */
  start(time) {
    // now it's a good time to start
    add(this);
    this.playing = true;

    this._startTime = typeof time !== 'undefined' ? time : KEC.Time();
    this._startTime += this._delay;

    if (!this._startFired) {
      if (this._onStart) {
        this._onStart.call(this);
      }

      queueStart.call(this);

      this._startFired = true;
    }

    if (!Tick) Ticker();
    return this;
  }

  /**
   * Stops tweening
   * @returns {TweenBase} this instance
   */
  stop() {
    if (this.playing) {
      remove(this);
      this.playing = false;

      if (this._onStop) {
        this._onStop.call(this);
      }
      this.close();
    }
    return this;
  }

  /**
   * Trigger internal completion callbacks.
   */
  close() {
    // scroll|transformMatrix need this
    Object.keys(onComplete).forEach((component) => {
      Object.keys(onComplete[component]).forEach((toClose) => {
        onComplete[component][toClose].call(this, toClose);
      });
    });
    // when all animations are finished, stop ticking after ~3 frames
    this._startFired = false;
    stop.call(this);
  }

  /**
   * Schedule another tween instance to start once this one completes.
   * @param {KUTE.chainOption} args the tween animation start time
   * @returns {TweenBase} this instance
   */
  chain(args) {
    this._chain = [];
    this._chain = args.length ? args : this._chain.concat(args);
    return this;
  }

  /**
   * Stop tweening the chained tween instances.
   */
  stopChainedTweens() {
    if (this._chain && this._chain.length) this._chain.forEach((tw) => tw.stop());
  }

  /**
   * Update the tween on each tick.
   * @param {number} time the tick time
   * @returns {boolean} this instance
   */
  update(time) {
    const T = time !== undefined ? time : KEC.Time();

    let elapsed;

    if (T < this._startTime && this.playing) { return true; }

    elapsed = (T - this._startTime) / this._duration;
    elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

    // calculate progress
    const progress = this._easing(elapsed);

    // render the update
    Object.keys(this.valuesEnd).forEach((tweenProp) => {
      KEC[tweenProp](this.element,
        this.valuesStart[tweenProp],
        this.valuesEnd[tweenProp],
        progress);
    });

    // fire the updateCallback
    if (this._onUpdate) {
      this._onUpdate.call(this);
    }

    if (elapsed === 1) {
      // fire the complete callback
      if (this._onComplete) {
        this._onComplete.call(this);
      }

      // now we're sure no animation is running
      this.playing = false;

      // stop ticking when finished
      this.close();

      // start animating chained tweens
      if (this._chain !== undefined && this._chain.length) {
        this._chain.map((tw) => tw.start());
      }

      return false;
    }

    return true;
  }
}

// Update Tween Interface
connect.tween = TweenBase;
