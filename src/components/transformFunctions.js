import KUTE from '../objects/kute.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import getInlineStyle from '../process/getInlineStyle.js'

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
export function getTransform(tweenProperty,value){
  const currentStyle = getInlineStyle(this.element);
  return currentStyle[tweenProperty] ? currentStyle[tweenProperty] : defaultValues[tweenProperty];
}
export function prepareTransform(prop,obj){
  let prepAxis = ['X', 'Y', 'Z'], // coordinates
      translateArray = [], rotateArray = [], skewArray = [], 
      transformObject = {},
      arrayFunctions = ['translate3d','translate','rotate3d','skew']

  for (const x in obj) {

    if (arrayFunctions.includes(x)) {
    const pv = typeof(obj[x]) === 'object' ? obj[x].map(v=>parseInt(v)) : [parseInt(obj[x]),0]

    transformObject[x] = x === 'skew' || x === 'translate' ? [pv[0]||0, pv[1]||0]
                       : [pv[0]||0, pv[1]||0,pv[2]||0] // translate3d | rotate3d

    } else if ( /[XYZ]/.test(x) ) {
      const fn = x.replace(/[XYZ]/,'');
      const fnId = fn === 'skew' ? fn : `${fn}3d`;
      const fnArray = fn === 'translate' ? translateArray
                    : fn === 'rotate' ? rotateArray
                    : fn === 'skew' ? skewArray : {}
      for (let fnIndex = 0; fnIndex < 3; fnIndex++) {
        const fnAxis = prepAxis[fnIndex];
        fnArray[fnIndex] = (`${fn}${fnAxis}` in obj) ? parseInt(obj[`${fn}${fnAxis}`]) : 0; 
      }
      transformObject[fnId] = fnArray;
    } else { // scale | rotate | perspective
      transformObject[x] = x === 'scale' ? parseFloat(obj[x]) : parseInt(obj[x])
    }
  }
  return transformObject;
}
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
export function crossCheckTransform(tweenProp){
  if (this.valuesEnd[tweenProp]) {  
    if ( this.valuesEnd[tweenProp] ) {
      if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective){
        this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective
      }
    }
  }
}

// All Component Functions
export const transformFunctions = {
  prepareStart: getTransform,
  prepareProperty: prepareTransform,
  onStart: onStartTransform,
  crossCheck: crossCheckTransform
}

const supportedTransformProperties = [
  'perspective', 
  'translate3d', 'translateX', 'translateY', 'translateZ', 'translate', 
  'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'rotate', 
  'skewX', 'skewY', 'skew',
  'scale'
]

const defaultTransformValues = {
  perspective: 400,
  translate3d : [0,0,0], translateX : 0, translateY : 0, translateZ : 0, translate : [0,0],
  rotate3d: [0,0,0], rotateX : 0, rotateY : 0, rotateZ : 0, rotate : 0,
  skewX : 0, skewY : 0, skew: [0,0],
  scale : 1
}

// Base Component
export const baseTransformOps = {
  component: 'transformFunctions',
  property: 'transform',
  subProperties: supportedTransformProperties,
  // defaultValues: defaultTransformValues,
  functions: {onStart: onStartTransform},
  Interpolate: { 
    perspective: perspective,
    translate3d: translate3d, 
    rotate3d: rotate3d,
    translate: translate, rotate: rotate, scale: scale, skew: skew
  },
}

// Full Component
export const transformOps = {
  component: 'transformFunctions',
  property: 'transform',
  subProperties: supportedTransformProperties,
  defaultValues: defaultTransformValues,
  functions: transformFunctions,
  Interpolate: { 
    perspective: perspective,
    translate3d: translate3d, 
    rotate3d: rotate3d,
    translate: translate, rotate: rotate, scale: scale, skew: skew
  },
}

Components.TransformFunctions = transformOps
