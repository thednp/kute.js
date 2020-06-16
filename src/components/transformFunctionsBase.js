import KUTE from '../objects/kute.js'

// const transformFunctions = { property : 'transform', subProperties, defaultValues, Interpolate: {translate,rotate,skew,scale}, functions } // same to svg transform, attr

// Component Interpolate functions
export function perspective(a, b, u, v) {
  return `perspective(${((a + (b - a) * v) * 1000 >> 0 ) / 1000}${u})`
}
export function translate3d(a, b, u, v) {
  let translateArray = [];
  for (let ax=0; ax<3; ax++){
    translateArray[ax] = ( a[ax]||b[ax] ? ( (a[ax] + ( b[ax] - a[ax] ) * v ) * 1000 >> 0 ) / 1000 : 0 ) + u;
  }
  return `translate3d(${translateArray.join(',')})`;
}
export function rotate3d(a, b, u, v) {
  let rotateStr = ''
  rotateStr += a[0]||b[0] ? `rotateX(${((a[0] + (b[0] - a[0]) * v) * 1000 >> 0 ) / 1000}${u})` : ''
  rotateStr += a[1]||b[1] ? `rotateY(${((a[1] + (b[1] - a[1]) * v) * 1000 >> 0 ) / 1000}${u})` : ''
  rotateStr += a[2]||b[2] ? `rotateZ(${((a[2] + (b[2] - a[2]) * v) * 1000 >> 0 ) / 1000}${u})` : ''
  return rotateStr
}
export function translate(a, b, u, v) {
  let translateArray = []; 
  translateArray[0] = ( a[0]===b[0] ? b[0] : ( (a[0] + ( b[0] - a[0] ) * v ) * 1000 >> 0 ) / 1000 ) + u
  translateArray[1] = a[1]||b[1] ? (( a[1]===b[1] ? b[1] : ( (a[1] + ( b[1] - a[1] ) * v ) * 1000 >> 0 ) / 1000 ) + u) : '0' 
  return `translate(${translateArray.join(',')})`;
}
export function rotate(a, b, u, v) {
  return `rotate(${((a + (b - a) * v) * 1000 >> 0 ) / 1000}${u})`
}
export function skew(a, b, u, v) {
  let skewArray = []; 
  skewArray[0] = ( a[0]===b[0] ? b[0] : ( (a[0] + ( b[0] - a[0] ) * v ) * 1000 >> 0 ) / 1000 ) + u
  skewArray[1] = a[1]||b[1] ? (( a[1]===b[1] ? b[1] : ( (a[1] + ( b[1] - a[1] ) * v ) * 1000 >> 0 ) / 1000 ) + u) : '0' 
  return `skew(${skewArray.join(',')})`;
}
export function skewX(a, b, u, v) {
  return `skewX(${((a + (b - a) * v) * 1000 >> 0 ) / 1000}${u})`
}
export function skewY(a, b, u, v) {
  return `skewY(${((a + (b - a) * v) * 1000 >> 0 ) / 1000}${u})`
}
export function scale (a, b, v) {
  return `scale(${((a + (b - a) * v) * 1000 >> 0 ) / 1000})`;
}

// Component Functions
export function onStartTransform(tweenProp){
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = 
          (a.perspective||b.perspective ? perspective(a.perspective,b.perspective,'px',v) : '') // one side might be 0
        + (a.translate3d ? translate3d(a.translate3d,b.translate3d,'px',v):'') // array [x,y,z]
        + (a.translate ? translate(a.translate,b.translate,'px',v):'') // array [x,y]
        + (a.rotate3d ? rotate3d(a.rotate3d,b.rotate3d,'deg',v):'') // array [x,y,z]
        + (a.rotate||b.rotate ? rotate(a.rotate,b.rotate,'deg',v):'') // one side might be 0
        + (a.skew ? skew(a.skew,b.skew,'deg',v):'') // array [x,y]
        + (a.scale||b.scale ? scale(a.scale,b.scale,v):'') // one side might be 0
    }
  }
}

// Base Component
const BaseTransform = {
  component: 'baseTransform',
  property: 'transform',
  functions: {onStart: onStartTransform},
  Interpolate: { 
    perspective: perspective,
    translate3d: translate3d, 
    rotate3d: rotate3d,
    translate: translate, rotate: rotate, scale: scale, skew: skew
  }
}

export default BaseTransform