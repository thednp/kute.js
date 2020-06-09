import {Util} from '../core/objects.js'

// Robert Penner's Easing Functions
export function linear (t) { return t; }
export function easingQuadraticIn (t) { return t*t; }
export function easingQuadraticOut (t) { return t*(2-t); }
export function easingQuadraticInOut (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; }
export function easingCubicIn (t) { return t*t*t; }
export function easingCubicOut (t) { return (--t)*t*t+1; }
export function easingCubicInOut (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }
export function easingCircularIn (t) { return -(Math.sqrt(1 - (t * t)) - 1); }
export function easingCircularOut (t) { return Math.sqrt(1 - (t = t - 1) * t); }
export function easingCircularInOut (t) {  return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); }
export function easingBackIn (t) { const s = 1.70158; return t * t * ((s + 1) * t - s); }
export function easingBackOut (t) { const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1; }
export function easingBackInOut (t) { const s = 1.70158 * 1.525;  if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2); }

const Easing = {
  linear : linear,
  easingQuadraticIn : easingQuadraticIn,
  easingQuadraticOut : easingQuadraticOut,
  easingQuadraticInOut : easingQuadraticInOut,
  easingCubicIn : easingCubicIn,
  easingCubicOut : easingCubicOut,
  easingCubicInOut : easingCubicInOut,
  easingCircularIn : easingCircularIn,
  easingCircularOut : easingCircularOut,
  easingCircularInOut : easingCircularInOut,
  easingBackIn : easingBackIn,
  easingBackOut : easingBackOut,
  easingBackInOut : easingBackInOut
}

export function processEasing(fn) {
  if ( typeof fn === 'function') {
    return fn;
  } else if ( typeof fn === 'string' ) {
    return Easing[fn]; // regular Robert Penner Easing Functions
  } else {
    return Easing.linear
  }
}

// Tween constructor needs to know who will process easing functions
Util.processEasing = processEasing

export default Easing