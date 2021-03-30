import KUTE from '../objects/kute.js';
import connect from '../objects/connect.js';
import onStart from '../objects/onStart.js';
import onComplete from '../objects/onComplete.js';
import defaultOptions from '../objects/defaultOptions.js';

import { Tick, Ticker, stop } from '../core/render.js';

import add from '../core/add.js';
import remove from '../core/remove.js';
import queueStart from '../core/queueStart.js';

// single Tween object construct
// TweenBase is meant to be use for pre-processed values
export default class TweenBase {
  constructor(targetElement, startObject, endObject, opsObject) {
    // element animation is applied to
    this.element = targetElement;

    this.playing = false;

    this._startTime = null;
    this._startFired = false;

    this.valuesEnd = endObject; // valuesEnd
    this.valuesStart = startObject; // valuesStart

    // OPTIONS
    const options = opsObject || {};
    // internal option to process inline/computed style at start instead of init
    // used by to() method and expects object : {} / false
    this._resetStart = options.resetStart || 0;
    // you can only set a core easing function as default
    this._easing = typeof (options.easing) === 'function' ? options.easing : connect.processEasing(options.easing);
    this._duration = options.duration || defaultOptions.duration; // duration option | default
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
        if (!KUTE[prop] && prop === this._easing.name) KUTE[prop] = this._easing;
      };
    }

    return this;
  }

  // tween prototype
  // queue tween object to main frame update
  // move functions that use the ticker outside the prototype to be in the same scope with it
  start(time) {
    // now it's a good time to start
    add(this);
    this.playing = true;

    this._startTime = typeof time !== 'undefined' ? time : KUTE.Time();
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

  chain(args) {
    this._chain = [];
    this._chain = args.length ? args : this._chain.concat(args);
    return this;
  }

  stopChainedTweens() {
    if (this._chain && this._chain.length) this._chain.forEach((tw) => tw.stop());
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
