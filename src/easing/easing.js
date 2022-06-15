import connect from '../objects/connect';

// Robert Penner's Easing Functions
// updated for ESLint
const Easing = {
  /** @type {KUTE.easingFunction} */
  linear: (t) => t,
  /** @type {KUTE.easingFunction} */
  easingSinusoidalIn: (t) => -Math.cos((t * Math.PI) / 2) + 1,
  /** @type {KUTE.easingFunction} */
  easingSinusoidalOut: (t) => Math.sin((t * Math.PI) / 2),
  /** @type {KUTE.easingFunction} */
  easingSinusoidalInOut: (t) => -0.5 * (Math.cos(Math.PI * t) - 1),
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
  easingQuarticIn: (t) => t * t * t * t,
  /** @type {KUTE.easingFunction} */
  easingQuarticOut: (t0) => { const t = t0 - 1; return 1 - t * t * t * t; },
  /** @type {KUTE.easingFunction} */
  easingQuarticInOut: (t0) => {
    let t = t0;
    if (t < 0.5) return 8 * t * t * t * t;
    t -= 1; return 1 - 8 * t * t * t * t;
  },
  /** @type {KUTE.easingFunction} */
  easingQuinticIn: (t) => t * t * t * t * t,
  /** @type {KUTE.easingFunction} */
  easingQuinticOut: (t0) => { const t = t0 - 1; return 1 + t * t * t * t * t; },
  /** @type {KUTE.easingFunction} */
  easingQuinticInOut: (t0) => {
    let t = t0;
    if (t < 0.5) return 16 * t * t * t * t * t;
    t -= 1; return 1 + 16 * t * t * t * t * t;
  },
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
  easingExponentialIn: (t) => 2 ** (10 * (t - 1)) - 0.001,
  /** @type {KUTE.easingFunction} */
  easingExponentialOut: (t) => 1 - 2 ** (-10 * t),
  /** @type {KUTE.easingFunction} */
  easingExponentialInOut: (t0) => {
    const t = t0 * 2;
    if (t < 1) return 0.5 * (2 ** (10 * (t - 1)));
    return 0.5 * (2 - 2 ** (-10 * (t - 1)));
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
  /** @type {KUTE.easingFunction} */
  easingElasticIn: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;

    return -(2 ** (10 * (t - 1))) * Math.sin((t - 1.1) * 5 * Math.PI);
  },
  /** @type {KUTE.easingFunction} */
  easingElasticOut: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;

    return (2 ** (-10 * t)) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },
  /** @type {KUTE.easingFunction} */
  easingElasticInOut: (t0) => {
    if (t0 === 0) return 0;
    if (t0 === 1) return 1;

    const t = t0 * 2;

    if (t < 1) {
      return -0.5 * (2 ** (10 * (t - 1))) * Math.sin((t - 1.1) * 5 * Math.PI);
    }

    return 0.5 * (2 ** (-10 * (t - 1))) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
  },
  /** @type {KUTE.easingFunction} */
  easingBounceIn: (t) => 1 - Easing.easingBounceOut(1 - t),
  /** @type {KUTE.easingFunction} */
  easingBounceOut: (t0) => {
    let t = t0;
    if (t < (1 / 2.75)) { return 7.5625 * t * t; }
    if (t < (2 / 2.75)) { t -= (1.5 / 2.75); return 7.5625 * t * t + 0.75; }
    if (t < (2.5 / 2.75)) { t -= (2.25 / 2.75); return 7.5625 * t * t + 0.9375; }
    t -= (2.625 / 2.75);
    return 7.5625 * t * t + 0.984375;
  },
  /** @type {KUTE.easingFunction} */
  easingBounceInOut: (t) => {
    if (t < 0.5) return Easing.easingBounceIn(t * 2) * 0.5;
    return Easing.easingBounceOut(t * 2 - 1) * 0.5 + 0.5;
  },
};

/**
 * Returns a valid `easingFunction`.
 *
 * @param {KUTE.easingFunction | string} fn function name or constructor
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

// Tween constructor needs to know who will process easing functions
connect.processEasing = processEasing;

export default Easing;
