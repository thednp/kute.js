import connect from '../objects/connect.js';

// Select Robert Penner's Easing Functions
// updated for ESLint
const Easing = {
  linear: (t) => t,
  easingQuadraticIn: (t) => t * t,
  easingQuadraticOut: (t) => t * (2 - t),
  easingQuadraticInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easingCubicIn: (t) => t * t * t,
  easingCubicOut: (t0) => { const t = t0 - 1; return t * t * t + 1; },
  easingCubicInOut: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easingCircularIn: (t) => -(Math.sqrt(1 - (t * t)) - 1),
  easingCircularOut: (t0) => { const t = t0 - 1; return Math.sqrt(1 - t * t); },
  easingCircularInOut: (t0) => {
    let t = t0 * 2;
    if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    t -= 2; return 0.5 * (Math.sqrt(1 - t * t) + 1);
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
};

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
