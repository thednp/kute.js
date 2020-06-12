import KUTE from '../objects/kute.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import getStyleForProperty from '../process/getStyleForProperty.js'
import trueDimension from '../util/trueDimension.js'
import {units} from '../objects/interpolate.js' 

// const opacity = { category : 'textProperties', defaultValues: [0,0,0,0], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart:{} }

// Component Properties
const textProperties = ['fontSize','lineHeight','letterSpacing','wordSpacing']
const textOnStart = {}

export function textPropOnStart(tweenProp){
  if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = units(a.v,b.v,b.u,v);
    }
  }
}
textProperties.forEach(tweenProp => {
  textOnStart[tweenProp] = textPropOnStart
})
export function getTextProp(prop) {
  return getStyleForProperty(this.element,prop) || defaultValues[prop];
}
export function prepareTextProp(prop,value) {
  return trueDimension(value);
}

// All Component Functions
const textPropFunctions = {
  prepareStart: getTextProp,
  prepareProperty: prepareTextProp,
  onStart: textOnStart
}

// Component Base
export const baseTextOps = {
  component: 'textProperties',
  category: 'textProps',
  properties: textProperties,
  // defaultValues: {fontSize:0,lineHeight:0,letterSpacing:0,wordSpacing:0},
  Interpolate: {units},
  functions: {onStart:textOnStart}
}

// Component Full
export const textOps = {
  component: 'textProperties',
  category: 'textProps',
  properties: textProperties,
  defaultValues: {fontSize:0,lineHeight:0,letterSpacing:0,wordSpacing:0},
  Interpolate: {units},
  functions: textPropFunctions,
  Util: {trueDimension}
}

Components.TextProperties = textOps
