import KEC from '../objects/kute';
import TweenBase from './tweenBase';
import connect from '../objects/connect';
import add from '../core/add';
import remove from '../core/remove';
import defaultOptions from '../objects/defaultOptions';
import crossCheck from '../objects/crossCheck';
import prepareObject from '../process/prepareObject';
import getStartValues from '../process/getStartValues';
import { Tick, Ticker } from '../core/render';
import queueStart from '../core/queueStart';

/**
 * The `KUTE.Tween()` constructor creates a new `Tween` object
 * for a single `HTMLElement` and returns it.
 *
 * This constructor adds additional functionality and is the default
 * Tween object constructor in KUTE.js.
 */
export default class Tween extends TweenBase {
  /**
   * @param {KUTE.tweenParams} args (*target*, *startValues*, *endValues*, *options*)
   * @returns {Tween} the resulting Tween object
   */
  constructor(...args) {
    super(...args); // this calls the constructor of TweenBase

    // reset interpolation values
    this.valuesStart = {};
    this.valuesEnd = {};

    // const startObject = args[1];
    // const endObject = args[2];
    const [startObject, endObject, options] = args.slice(1);

    // set valuesEnd
    prepareObject.call(this, endObject, 'end');

    // set valuesStart
    if (this._resetStart) {
      this.valuesStart = startObject;
    } else {
      prepareObject.call(this, startObject, 'start');
    }

    // ready for crossCheck
    if (!this._resetStart) {
      Object.keys(crossCheck).forEach((component) => {
        Object.keys(crossCheck[component]).forEach((checkProp) => {
          crossCheck[component][checkProp].call(this, checkProp);
        });
      });
    }

    // set paused state
    /** @type {boolean} */
    this.paused = false;
    /** @type {number?} */
    this._pauseTime = null;

    // additional properties and options
    /** @type {number?} */
    this._repeat = options.repeat || defaultOptions.repeat;
    /** @type {number?} */
    this._repeatDelay = options.repeatDelay || defaultOptions.repeatDelay;
    // we cache the number of repeats to be able to put it back after all cycles finish
    /** @type {number?} */
    this._repeatOption = this._repeat;

    // yoyo needs at least repeat: 1
    /** @type {KUTE.tweenProps} */
    this.valuesRepeat = {}; // valuesRepeat
    /** @type {boolean} */
    this._yoyo = options.yoyo || defaultOptions.yoyo;
    /** @type {boolean} */
    this._reversed = false;

    // don't load extra callbacks
    // this._onPause = options.onPause || defaultOptions.onPause
    // this._onResume = options.onResume || defaultOptions.onResume

    // chained Tweens
    // this._chain = options.chain || defaultOptions.chain;
    return this;
  }

  /**
   * Starts tweening, extended method
   * @param {number?} time the tween start time
   * @returns {Tween} this instance
   */
  start(time) {
    // on start we reprocess the valuesStart for TO() method
    if (this._resetStart) {
      this.valuesStart = this._resetStart;
      getStartValues.call(this);

      // this is where we do the valuesStart and valuesEnd check for fromTo() method
      Object.keys(crossCheck).forEach((component) => {
        Object.keys(crossCheck[component]).forEach((checkProp) => {
          crossCheck[component][checkProp].call(this, checkProp);
        });
      });
    }
    // still not paused
    this.paused = false;

    // set yoyo values
    if (this._yoyo) {
      Object.keys(this.valuesEnd).forEach((endProp) => {
        this.valuesRepeat[endProp] = this.valuesStart[endProp];
      });
    }

    super.start(time);

    return this;
  }

  /**
   * Stops tweening, extended method
   * @returns {Tween} this instance
   */
  stop() {
    super.stop();
    if (!this.paused && this.playing) {
      this.paused = false;
      this.stopChainedTweens();
    }
    return this;
  }

  /**
   * Trigger internal completion callbacks.
   */
  close() {
    super.close();

    if (this._repeatOption > 0) {
      this._repeat = this._repeatOption;
    }
    if (this._yoyo && this._reversed === true) {
      this.reverse();
      this._reversed = false;
    }

    return this;
  }

  /**
   * Resume tweening
   * @returns {Tween} this instance
   */
  resume() {
    if (this.paused && this.playing) {
      this.paused = false;
      if (this._onResume !== undefined) {
        this._onResume.call(this);
      }
      // re-queue execution context
      queueStart.call(this);
      // update time and let it roll
      this._startTime += KEC.Time() - this._pauseTime;
      add(this);
      // restart ticker if stopped
      if (!Tick) Ticker();
    }
    return this;
  }

  /**
   * Pause tweening
   * @returns {Tween} this instance
   */
  pause() {
    if (!this.paused && this.playing) {
      remove(this);
      this.paused = true;
      this._pauseTime = KEC.Time();
      if (this._onPause !== undefined) {
        this._onPause.call(this);
      }
    }
    return this;
  }

  /**
   * Reverses start values with end values
   */
  reverse() {
    Object.keys(this.valuesEnd).forEach((reverseProp) => {
      const tmp = this.valuesRepeat[reverseProp];
      this.valuesRepeat[reverseProp] = this.valuesEnd[reverseProp];
      this.valuesEnd[reverseProp] = tmp;
      this.valuesStart[reverseProp] = this.valuesRepeat[reverseProp];
    });
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
      if (this._repeat > 0) {
        if (Number.isFinite(this._repeat)) this._repeat -= 1;

        // set the right time for delay
        this._startTime = T;
        if (Number.isFinite(this._repeat) && this._yoyo && !this._reversed) {
          this._startTime += this._repeatDelay;
        }

        if (this._yoyo) { // handle yoyo
          this._reversed = !this._reversed;
          this.reverse();
        }

        return true;
      }

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
        this._chain.forEach((tw) => tw.start());
      }

      return false;
    }
    return true;
  }
}

// Update Tween Interface Update
connect.tween = Tween;
