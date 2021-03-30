import KUTE from '../objects/kute.js';
import TweenBase from './tweenBase.js';
import connect from '../objects/connect.js';
import add from '../core/add.js';
import remove from '../core/remove.js';
import defaultOptions from '../objects/defaultOptions.js';
import crossCheck from '../objects/crossCheck.js';
import prepareObject from '../process/prepareObject.js';
import getStartValues from '../process/getStartValues.js';
import { Tick, Ticker } from '../core/render.js';
import queueStart from '../core/queueStart.js';

defaultOptions.repeat = 0;
defaultOptions.repeatDelay = 0;
defaultOptions.yoyo = false;
defaultOptions.resetStart = false;

// no need to set defaults for callbacks
// defaultOptions.onPause = undefined
// defaultOptions.onResume = undefined

// the constructor that supports to, allTo methods
export default class Tween extends TweenBase {
  constructor(...args) {
    super(...args); // this calls the constructor of TweenBase

    // reset interpolation values
    this.valuesStart = {};
    this.valuesEnd = {};

    const startObject = args[1];
    const endObject = args[2];

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
    this.paused = false;
    this._pauseTime = null;

    // additional properties and options
    const options = args[3];

    this._repeat = options.repeat || defaultOptions.repeat;
    this._repeatDelay = options.repeatDelay || defaultOptions.repeatDelay;
    // we cache the number of repeats to be able to put it back after all cycles finish
    this._repeatOption = this._repeat;

    // yoyo needs at least repeat: 1
    this.valuesRepeat = {}; // valuesRepeat
    this._yoyo = options.yoyo || defaultOptions.yoyo;
    this._reversed = false;

    // don't load extra callbacks
    // this._onPause = options.onPause || defaultOptions.onPause
    // this._onResume = options.onResume || defaultOptions.onResume

    // chained Tweens
    // this._chain = options.chain || defaultOptions.chain;
    return this;
  }

  // additions to start method
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

  // updates to super methods
  stop() {
    super.stop();
    if (!this.paused && this.playing) {
      this.paused = false;
      this.stopChainedTweens();
    }
    return this;
  }

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

  // additions to prototype
  resume() {
    if (this.paused && this.playing) {
      this.paused = false;
      if (this._onResume !== undefined) {
        this._onResume.call(this);
      }
      // re-queue execution context
      queueStart.call(this);
      // update time and let it roll
      this._startTime += KUTE.Time() - this._pauseTime;
      add(this);
      // restart ticker if stopped
      if (!Tick) Ticker();
    }
    return this;
  }

  pause() {
    if (!this.paused && this.playing) {
      remove(this);
      this.paused = true;
      this._pauseTime = KUTE.Time();
      if (this._onPause !== undefined) {
        this._onPause.call(this);
      }
    }
    return this;
  }

  reverse() {
    // if (this._yoyo) {
    Object.keys(this.valuesEnd).forEach((reverseProp) => {
      const tmp = this.valuesRepeat[reverseProp];
      this.valuesRepeat[reverseProp] = this.valuesEnd[reverseProp];
      this.valuesEnd[reverseProp] = tmp;
      this.valuesStart[reverseProp] = this.valuesRepeat[reverseProp];
    });
    // }
  }

  update(time) {
    const T = time !== undefined ? time : KUTE.Time();

    let elapsed;

    if (T < this._startTime && this.playing) { return true; }

    elapsed = (T - this._startTime) / this._duration;
    elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

    // calculate progress
    const progress = this._easing(elapsed);

    // render the update
    Object.keys(this.valuesEnd).forEach((tweenProp) => {
      KUTE[tweenProp](this.element,
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
