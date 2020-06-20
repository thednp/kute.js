import connect from '../objects/connect.js'

// Robert Penner's Easing Functions
const Easing = {
  linear : (t) => t,
  easingSinusoidalIn : (t) => -Math.cos(t * Math.PI / 2) + 1,
  easingSinusoidalOut : (t) => Math.sin(t * Math.PI / 2),
  easingSinusoidalInOut : (t) => -0.5 * (Math.cos(Math.PI * t) - 1),
  easingQuadraticIn : (t) => t*t,
  easingQuadraticOut : (t) => t*(2-t),
  easingQuadraticInOut : (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  easingCubicIn : (t) => t*t*t,
  easingCubicOut : (t) => (--t)*t*t+1,
  easingCubicInOut : (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  easingQuarticIn : (t) => t*t*t*t,
  easingQuarticOut : (t) => 1-(--t)*t*t*t,
  easingQuarticInOut : (t) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  easingQuinticIn : (t) => t*t*t*t*t,
  easingQuinticOut : (t) => 1+(--t)*t*t*t*t,
  easingQuinticInOut : (t) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
  easingCircularIn : (t) => -(Math.sqrt(1 - (t * t)) - 1),
  easingCircularOut : (t) => Math.sqrt(1 - (t = t - 1) * t),
  easingCircularInOut : (t) => ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
  easingExponentialIn : (t) => 2 ** (10 * (t - 1)) - 0.001,
  easingExponentialOut : (t) => 1 - 2 ** (-10 * t),
  easingExponentialInOut : (t) => (t *= 2) < 1 ? 0.5 * (2 ** (10 * (t - 1))) : 0.5 * (2 - 2 ** (-10 * (t - 1))),
  easingBackIn : (t) => { const s = 1.70158; return t * t * ((s + 1) * t - s) },
  easingBackOut : (t) => { const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1 },
  easingBackInOut : (t) => { 
    const s = 1.70158 * 1.525;  
    if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s))
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
  },
  easingElasticIn : (t) => {
    let s, _kea = 0.1, _kep = 0.4
    if ( t === 0 ) return 0;if ( t === 1 ) return 1
    if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2
    return - ( _kea * (2 ** (10 * (t -= 1))) * Math.sin( ( t - s ) * Math.PI * 2 / _kep ) )
  },
  easingElasticOut : (t) => {
    let s, _kea = 0.1, _kep = 0.4
    if ( t === 0 ) return 0;if ( t === 1 ) return 1
    if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2 
    return _kea * (2 ** (- 10 * t)) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) + 1
  },
  easingElasticInOut : (t) => {
    let s, _kea = 0.1, _kep = 0.4
    if ( t === 0 ) return 0;if ( t === 1 ) return 1
    if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2
    if ( ( t *= 2 ) < 1 ) return - 0.5 * ( _kea * (2 ** (10 * (t -= 1))) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) )
    return _kea * (2 ** (-10 * (t -= 1))) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) * 0.5 + 1
  },
  easingBounceIn : (t) => { return 1 - Easing.easingBounceOut( 1 - t ) },
  easingBounceOut : (t) => {
    if ( t < ( 1 / 2.75 ) ) { return 7.5625 * t * t; }
    else if ( t < ( 2 / 2.75 ) ) { return 7.5625 * ( t -= ( 1.5 / 2.75 ) ) * t + 0.75; }
    else if ( t < ( 2.5 / 2.75 ) ) { return 7.5625 * ( t -= ( 2.25 / 2.75 ) ) * t + 0.9375; }
    else {return 7.5625 * ( t -= ( 2.625 / 2.75 ) ) * t + 0.984375; }
  },
  easingBounceInOut : (t) => { 
    if ( t < 0.5 ) return Easing.easingBounceIn( t * 2 ) * 0.5; 
    return Easing.easingBounceOut( t * 2 - 1 ) * 0.5 + 0.5
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

// Tween constructor needs to know who will process easing functions
connect.processEasing = processEasing

export default Easing