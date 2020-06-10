import Util from '../objects/Util.js'

// Robert Penner's Easing Functions
export function linear (t) { return t; }
export function easingSinusoidalIn (t) { return -Math.cos(t * Math.PI / 2) + 1; }
export function easingSinusoidalOut (t) { return Math.sin(t * Math.PI / 2); }
export function easingSinusoidalInOut (t) { return -0.5 * (Math.cos(Math.PI * t) - 1); }
export function easingQuadraticIn (t) { return t*t; }
export function easingQuadraticOut (t) { return t*(2-t); }
export function easingQuadraticInOut (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; }
export function easingCubicIn (t) { return t*t*t; }
export function easingCubicOut (t) { return (--t)*t*t+1; }
export function easingCubicInOut (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }
export function easingQuarticIn (t) { return t*t*t*t; }
export function easingQuarticOut (t) { return 1-(--t)*t*t*t; }
export function easingQuarticInOut (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; }
export function easingQuinticIn (t) { return t*t*t*t*t; }
export function easingQuinticOut (t) { return 1+(--t)*t*t*t*t; }
export function easingQuinticInOut (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; }
export function easingCircularIn (t) { return -(Math.sqrt(1 - (t * t)) - 1); }
export function easingCircularOut (t) { return Math.sqrt(1 - (t = t - 1) * t); }
export function easingCircularInOut (t) {  return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); }
export function easingExponentialIn (t) { return 2 ** (10 * (t - 1)) - 0.001; }
export function easingExponentialOut (t) { return 1 - 2 ** (-10 * t); }
export function easingExponentialInOut (t) { return (t *= 2) < 1 ? 0.5 * (2 ** (10 * (t - 1))) : 0.5 * (2 - 2 ** (-10 * (t - 1))); }
export function easingBackIn (t) { const s = 1.70158; return t * t * ((s + 1) * t - s); }
export function easingBackOut (t) { const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1; }
export function easingBackInOut (t) { const s = 1.70158 * 1.525;  if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2); }
export function easingElasticIn (t) {
  let s;
  let _kea = 0.1;
  const _kep = 0.4;
  if ( t === 0 ) return 0;if ( t === 1 ) return 1;
  if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2;
  return - ( _kea * (2 ** (10 * (t -= 1))) * Math.sin( ( t - s ) * Math.PI * 2 / _kep ) );
}
export function easingElasticOut (t) {
  let s;
  let _kea = 0.1;
  const _kep = 0.4;
  if ( t === 0 ) return 0;if ( t === 1 ) return 1;
  if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2 ;
  return _kea * (2 ** (- 10 * t)) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) + 1;
}
export function easingElasticInOut (t) {
  let s;
  let _kea = 0.1;
  const _kep = 0.4;
  if ( t === 0 ) return 0;if ( t === 1 ) return 1;
  if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2 ;
  if ( ( t *= 2 ) < 1 ) return - 0.5 * ( _kea * (2 ** (10 * (t -= 1))) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) );
  return _kea * (2 ** (-10 * (t -= 1))) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) * 0.5 + 1;
}
export function easingBounceIn (t) { return 1 - easingBounceOut( 1 - t ); }
export function easingBounceInOut (t) { if ( t < 0.5 ) return easingBounceIn( t * 2 ) * 0.5; return easingBounceOut( t * 2 - 1 ) * 0.5 + 0.5;}
export function easingBounceOut (t) {
  if ( t < ( 1 / 2.75 ) ) { return 7.5625 * t * t; }
  else if ( t < ( 2 / 2.75 ) ) { return 7.5625 * ( t -= ( 1.5 / 2.75 ) ) * t + 0.75; }
  else if ( t < ( 2.5 / 2.75 ) ) { return 7.5625 * ( t -= ( 2.25 / 2.75 ) ) * t + 0.9375; }
  else {return 7.5625 * ( t -= ( 2.625 / 2.75 ) ) * t + 0.984375; }
}


const Easing = {
  linear : linear,
  easingSinusoidalIn : easingSinusoidalIn,
  easingSinusoidalOut : easingSinusoidalOut,
  easingSinusoidalInOut : easingSinusoidalInOut,
  easingQuadraticIn : easingQuadraticIn,
  easingQuadraticOut : easingQuadraticOut,
  easingQuadraticInOut : easingQuadraticInOut,
  easingCubicIn : easingCubicIn,
  easingCubicOut : easingCubicOut,
  easingCubicInOut : easingCubicInOut,
  easingQuarticIn : easingQuarticIn,
  easingQuarticOut : easingQuarticOut,
  easingQuarticInOut : easingQuarticInOut,
  easingQuinticIn : easingQuinticIn,
  easingQuinticOut : easingQuinticOut,
  easingQuinticInOut : easingQuinticInOut,
  easingCircularIn : easingCircularIn,
  easingCircularOut : easingCircularOut,
  easingCircularInOut : easingCircularInOut,
  easingExponentialIn : easingExponentialIn,
  easingExponentialOut : easingExponentialOut,
  easingExponentialInOut : easingExponentialInOut,
  easingBackIn : easingBackIn,
  easingBackOut : easingBackOut,
  easingBackInOut : easingBackInOut,
  easingElasticIn : easingElasticIn,
  easingElasticOut : easingElasticOut,
  easingElasticInOut : easingElasticInOut,
  easingBounceIn : easingBounceIn,
  easingBounceOut : easingBounceOut,
  easingBounceInOut : easingBounceInOut
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