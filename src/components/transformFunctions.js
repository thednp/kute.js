import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import getInlineStyle from '../process/getInlineStyle.js'
import perspective from '../interpolation/perspective.js'
import translate3d from '../interpolation/translate3d.js'
import rotate3d from '../interpolation/rotate3d.js'
import translate from '../interpolation/translate.js'
import rotate from '../interpolation/rotate.js'
import scale from '../interpolation/scale.js'
import skew from '../interpolation/skew.js'
import {onStartTransform} from './transformFunctionsBase.js'

// const transformFunctions = { property : 'transform', subProperties, defaultValues, Interpolate: {translate,rotate,skew,scale}, functions } // same to svg transform, attr
// the component developed for modern browsers supporting non-prefixed transform

// Component Functions
function getTransform(tweenProperty,value){
  let currentStyle = getInlineStyle(this.element);
  return currentStyle[tweenProperty] ? currentStyle[tweenProperty] : defaultValues[tweenProperty];
}
function prepareTransform(prop,obj){
  let prepAxis = ['X', 'Y', 'Z'], // coordinates
      transformObject = {},
      translateArray = [], rotateArray = [], skewArray = [], 
      arrayFunctions = ['translate3d','translate','rotate3d','skew']

  for (let x in obj) {
    let pv = typeof obj[x] === 'object' && obj[x].length ? obj[x].map(v=>parseInt(v)) : parseInt(obj[x]);

    if (arrayFunctions.includes(x)) {
      let propId = x === 'translate' || x === 'rotate' ? `${x}3d` : x;

      transformObject[propId] = x === 'skew' ? (pv.length ? [pv[0]||0, pv[1]||0] : [pv||0,0] )
                              : x === 'translate' ? (pv.length ? [pv[0]||0, pv[1]||0, pv[2]||0] : [pv||0,0,0] )
                              : [pv[0]||0, pv[1]||0,pv[2]||0] // translate3d | rotate3d

    } else if ( /[XYZ]/.test(x) ) {
      let fn = x.replace(/[XYZ]/,''),
          fnId = fn === 'skew' ? fn : `${fn}3d`,
          fnLen = fn === 'skew' ? 2 : 3,
          fnArray = fn === 'translate' ? translateArray
                  : fn === 'rotate' ? rotateArray
                  : fn === 'skew' ? skewArray : {}
      for (let fnIndex = 0; fnIndex < fnLen; fnIndex++) {
        let fnAxis = prepAxis[fnIndex];
        fnArray[fnIndex] = (`${fn}${fnAxis}` in obj) ? parseInt(obj[`${fn}${fnAxis}`]) : 0; 
      }
      transformObject[fnId] = fnArray;
    } else if (x==='rotate') { //  rotate 
      transformObject['rotate3d'] = [0,0,pv]
    } else { // scale | perspective
      transformObject[x] = x === 'scale' ? parseFloat(obj[x]) : pv
    }
  }
  return transformObject;
}

function crossCheckTransform(tweenProp){
  if (this.valuesEnd[tweenProp]) {  
    if ( this.valuesEnd[tweenProp] ) {
      if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective){
        this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective
      }
    }
  }
}

// All Component Functions
const transformFunctions = {
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

// Full Component
const transformFunctionsComponent = {
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
  }
}

export default transformFunctionsComponent

Components.TransformFunctions = transformFunctionsComponent
