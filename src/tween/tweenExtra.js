import connect from '../objects/connect.js';
import Tween from './tween.js';

// to do
// * per property easing
// * per property duration
// * per property callback
// * per property delay/offset
// * new update method to work with the above
// * other cool ideas

export default class TweenExtra extends Tween {
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

  // set callbacks
  on(name, fn) {
    if (['start', 'stop', 'update', 'complete', 'pause', 'resume'].indexOf(name) > -1) {
      this[`_on${name.charAt(0).toUpperCase() + name.slice(1)}`] = fn;
    }
  }

  // set options accepting [repeat,yoyo,delay,repeatDelay,easing]
  option(o, v) {
    this[`_${o}`] = v;
  }
}

// Tween Interface
connect.tween = TweenExtra;
