import KUTE from '../objects/kute.js'
import getStyleForProperty from '../process/getStyleForProperty.js'
import Components from '../objects/components.js'
import {numbers} from '../objects/interpolate.js' 

// const opacityProperty = { property : 'opacity', defaultValue: 1, interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Component Functions
export function getOpacity(tweenProp){
  return getStyleForProperty(this.element,tweenProp)
}
export function prepareOpacity(tweenProp,value){
  return parseFloat(value);  // opacity always FLOAT
}
export function onStartOpacity(tweenProp){
  if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) { // opacity could be 0
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = ((numbers(a,b,v) * 1000)>>0)/1000;
    }
  }
}

// All Component Functions
const opacityFunctions = {
  prepareStart: getOpacity,
  prepareProperty: prepareOpacity,
  onStart: onStartOpacity
}

// Base Component
export const baseOpacityOps = {
  component: 'opacityProperty',
  property: 'opacity',
  // defaultValue: 1,
  Interpolate: {numbers},
  functions: {onStart: onStartOpacity}
}

// Full Component
export const opacityOps = {
  component: 'opacityProperty',
  property: 'opacity',
  defaultValue: 1,
  Interpolate: {numbers},
  functions: opacityFunctions
}

Components.OpacityProperty = opacityOps
