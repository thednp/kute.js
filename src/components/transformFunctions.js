import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import getInlineStyle from '../process/getInlineStyle.js'
import {onStartTransform, perspective,translate3d, rotate3d, translate, rotate, scale, skew} from './transformFunctionsBase.js'

// const transformFunctions = { property : 'transform', subProperties, defaultValues, Interpolate: {translate,rotate,skew,scale}, functions } // same to svg transform, attr

// Component Functions
function getTransform(tweenProperty,value){
  const currentStyle = getInlineStyle(this.element);
  return currentStyle[tweenProperty] ? currentStyle[tweenProperty] : defaultValues[tweenProperty];
}
function prepareTransform(prop,obj){
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
