import connect from '../objects/connect.js';

// Robert Penner's Easing Functions
// updated for ESLint
const Easing = {
  linear: (t) => t,
  easingSinusoidalIn: (t) => -Math.cos((t * Math.PI) / 2) + 1,
  easingSinusoidalOut: (t) => Math.sin((t * Math.PI) / 2),
  easingSinusoidalInOut: (t) => -0.5 * (Math.cos(Math.PI * t) - 1),
  easingQuadraticIn: (t) => t * t,
  easingQuadraticOut: (t) => t * (2 - t),
  easingQuadraticInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easingCubicIn: (t) => t * t * t,
  easingCubicOut: (t0) => { const t = t0 - 1; return t * t * t + 1; },
  easingCubicInOut: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easingQuarticIn: (t) => t * t * t * t,
  easingQuarticOut: (t0) => { const t = t0 - 1; return 1 - t * t * t * t; },
  easingQuarticInOut: (t0) => {
    let t = t0;
    if (t < 0.5) return 8 * t * t * t * t;
    t -= 1; return 1 - 8 * t * t * t * t;
  },
  easingQuinticIn: (t) => t * t * t * t * t,
  easingQuinticOut: (t0) => { const t = t0 - 1; return 1 + t * t * t * t * t; },
  easingQuinticInOut: (t0) => {
    let t = t0;
    if (t < 0.5) return 16 * t * t * t * t * t;
    t -= 1; return 1 + 16 * t * t * t * t * t;
  },
  easingCircularIn: (t) => -(Math.sqrt(1 - (t * t)) - 1),
  easingCircularOut: (t0) => { const t = t0 - 1; return Math.sqrt(1 - t * t); },
  easingCircularInOut: (t0) => {
    let t = t0 * 2;
    if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    t -= 2; return 0.5 * (Math.sqrt(1 - t * t) + 1);
  },
  easingExponentialIn: (t) => 2 ** (10 * (t - 1)) - 0.001,
  easingExponentialOut: (t) => 1 - 2 ** (-10 * t),
  easingExponentialInOut: (t0) => {
    const t = t0 * 2;
    if (t < 1) return 0.5 * (2 ** (10 * (t - 1)));
    return 0.5 * (2 - 2 ** (-10 * (t - 1)));
  },
  easingBackIn: (t) => { const s = 1.70158; return t * t * ((s + 1) * t - s); },
  easingBackOut: (t0) => {
    const s = 1.70158;
    const t = t0 - 1;
    return t * t * ((s + 1) * t + s) + 1;
  },
  easingBackInOut: (t0) => {
    const s = 1.70158 * 1.525;
    let t = t0 * 2;
    if (t < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    t -= 2; return 0.5 * (t * t * ((s + 1) * t + s) + 2);
  },
  easingElasticIn: (t0) => {
    let s;
    let k1 = 0.1;
    const k2 = 0.4;
    let t = t0;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (!k1 || k1 < 1) {
      k1 = 1; s = k2 / 4;
    } else {
      s = ((k2 * Math.asin(1 / k1)) / Math.PI) * 2;
    }
    t -= 1;
    return -(k1 * (2 ** (10 * t)) * Math.sin(((t - s) * Math.PI * 2) / k2));
  },
  easingElasticOut: (t) => {
    let s;
    let k1 = 0.1;
    const k2 = 0.4;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (!k1 || k1 < 1) {
      k1 = 1;
      s = k2 / 4;
    } else {
      s = ((k2 * Math.asin(1 / k1)) / Math.PI) * 2;
    }
    return k1 * (2 ** (-10 * t)) * Math.sin(((t - s) * Math.PI * 2) / k2) + 1;
  },
  easingElasticInOut: (t0) => {
    let t = t0;
    let s;
    let k1 = 0.1;
    const k2 = 0.4;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (!k1 || k1 < 1) {
      k1 = 1; s = k2 / 4;
    } else {
      s = k2 * (Math.asin(1 / k1) / Math.PI) * 2;
    }
    t *= 2;
    if (t < 1) {
      return -0.5 * (k1 * (2 ** (10 * (t - 1)))
        * Math.sin(((t - 1 - s) * Math.PI * 2) / k2));
    }
    t -= 1;
    return k1 * (2 ** (-10 * t)) * Math.sin(((t - s) * Math.PI * 2) / k2) * 0.5 + 1;
  },
  easingBounceIn: (t) => 1 - Easing.easingBounceOut(1 - t),
  easingBounceOut: (t0) => {
    let t = t0;
    if (t < (1 / 2.75)) { return 7.5625 * t * t; }
    if (t < (2 / 2.75)) { t -= (1.5 / 2.75); return 7.5625 * t * t + 0.75; }
    if (t < (2.5 / 2.75)) { t -= (2.25 / 2.75); return 7.5625 * t * t + 0.9375; }
    t -= (2.625 / 2.75);
    return 7.5625 * t * t + 0.984375;
  },
  easingBounceInOut: (t) => {
    if (t < 0.5) return Easing.easingBounceIn(t * 2) * 0.5;
    return Easing.easingBounceOut(t * 2 - 1) * 0.5 + 0.5;
  },
};

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
