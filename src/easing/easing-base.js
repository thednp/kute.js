import connect from '../objects/connect';

// Select Robert Penner's Easing Functions
// updated for ESLint
const Easing = {
  /** @type {KUTE.easingFunction} */
  linear: (t) => t,
  /** @type {KUTE.easingFunction} */
  easingQuadraticIn: (t) => t * t,
  /** @type {KUTE.easingFunction} */
  easingQuadraticOut: (t) => t * (2 - t),
  /** @type {KUTE.easingFunction} */
  easingQuadraticInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  /** @type {KUTE.easingFunction} */
  easingCubicIn: (t) => t * t * t,
  /** @type {KUTE.easingFunction} */
  easingCubicOut: (t0) => { const t = t0 - 1; return t * t * t + 1; },
  /** @type {KUTE.easingFunction} */
  easingCubicInOut: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  /** @type {KUTE.easingFunction} */
  easingCircularIn: (t) => -(Math.sqrt(1 - (t * t)) - 1),
  /** @type {KUTE.easingFunction} */
  easingCircularOut: (t0) => { const t = t0 - 1; return Math.sqrt(1 - t * t); },
  /** @type {KUTE.easingFunction} */
  easingCircularInOut: (t0) => {
    let t = t0 * 2;
    if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    t -= 2; return 0.5 * (Math.sqrt(1 - t * t) + 1);
  },
  /** @type {KUTE.easingFunction} */
  easingBackIn: (t) => { const s = 1.70158; return t * t * ((s + 1) * t - s); },
  /** @type {KUTE.easingFunction} */
  easingBackOut: (t0) => {
    const s = 1.70158;
    const t = t0 - 1;
    return t * t * ((s + 1) * t + s) + 1;
  },
  /** @type {KUTE.easingFunction} */
  easingBackInOut: (t0) => {
    const s = 1.70158 * 1.525;
    let t = t0 * 2;
    if (t < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    t -= 2; return 0.5 * (t * t * ((s + 1) * t + s) + 2);
  },
};

/**
 * Returns a valid `easingFunction`.
 *
 * @param {KUTE.easingFunction | string} fn function name or constructor name
 * @returns {KUTE.easingFunction} a valid easing function
 */
function processEasing(fn) {
  if (typeof fn === 'function') {
    return fn;
  } if (typeof Easing[fn] === 'function') {
    return Easing[fn]; // regular Robert Penner Easing Functions
  }
  return Easing.linear;
}

connect.processEasing = processEasing;

export default Easing;
