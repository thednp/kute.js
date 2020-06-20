import connect from '../objects/connect.js'

// Select Robert Penner's Easing Functions
const Easing = {
  linear : (t) => t,
  easingQuadraticIn : (t) => t*t,
  easingQuadraticOut : (t) => t*(2-t),
  easingQuadraticInOut : (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  easingCubicIn : (t) => t*t*t,
  easingCubicOut : (t) => (--t)*t*t+1,
  easingCubicInOut : (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  easingCircularIn : (t) => -(Math.sqrt(1 - (t * t)) - 1),
  easingCircularOut : (t) => Math.sqrt(1 - (t = t - 1) * t),
  easingCircularInOut : (t) => ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
  easingBackIn : (t) => { const s = 1.70158; return t * t * ((s + 1) * t - s) },
  easingBackOut : (t) => { const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1 },
  easingBackInOut : (t) => { 
    const s = 1.70158 * 1.525;  
    if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s))
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
  }
}

function processEasing(fn) {
  if ( typeof fn === 'function') {
    return fn;
  } else if ( typeof Easing[fn] === 'function' ) {
    return Easing[fn]; // regular Robert Penner Easing Functions
  } else {
    return Easing.linear
  }
}

connect.processEasing = processEasing

export default Easing