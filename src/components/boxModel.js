import KUTE from '../objects/KUTE.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/Components.js'
import getStyleForProperty from '../process/getStyleForProperty.js' 
import trueDimension from '../util/trueDimension.js' 
import {numbers} from '../objects/Interpolate.js' 

// Component Properties
const boxModelProperties = ['top', 'left', 'width', 'height', 'right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 
                          'padding', 'paddingTop','paddingBottom', 'paddingLeft', 'paddingRight', 
                          'margin', 'marginTop','marginBottom', 'marginLeft', 'marginRight', 
                          'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth']
const boxModelValues = {}
boxModelProperties.map(x => boxModelValues[x] = 0);

// Component Functions
export function boxModelOnStart(tweenProp){
  if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = `${v > 0.99 || v < 0.01 ? ((numbers(a,b,v)*10)>>0)/10 : (numbers(a,b,v) ) >> 0}px`;
      // elem.style[tweenProp] = `${(numbers(a,b,v) ) >> 0}px`;
    }
  }
}
export function getBoxModel(tweenProp){
  return getStyleForProperty(this.element,tweenProp) || defaultValues[tweenProp];
}
export function prepareBoxModel(tweenProp,value){
  const boxValue = trueDimension(value), offsetProp = tweenProp === 'height' ? 'offsetHeight' : 'offsetWidth';
  return boxValue.u === '%' ? boxValue.v * this.element[offsetProp] / 100 : boxValue.v;
}
const boxPropsOnStart = {}
boxModelProperties.map(x => boxPropsOnStart[x] = boxModelOnStart );

// All Component Functions
const boxModelFunctions = {
  prepareStart: getBoxModel,
  prepareProperty: prepareBoxModel,
  onStart: boxPropsOnStart
}

// Component Base Props
const baseBoxProps = ['top','left','width','height']
const baseBoxPropsValues = {top:0,left:0,width:0,height:0}
const baseBoxOnStart = {}
baseBoxProps.map(x=>baseBoxOnStart[x] = boxModelOnStart)

// Component Base
export const baseBoxModelOps = {
  component: 'boxModelProps',
  category: 'boxModel',
  properties: baseBoxProps,
  // defaultValues: baseBoxPropsValues,
  Interpolate: {numbers},
  functions: {onStart: baseBoxOnStart}
}

// Component Essential
export const essentialBoxModelOps = {
  component: 'boxModelProps',
  category: 'boxModel',
  properties: ['top','left','width','height'],
  defaultValues: baseBoxPropsValues,
  Interpolate: {numbers},
  functions: boxModelFunctions,
  Util:{trueDimension}
}

// Component Full Component
export const boxModelOps = {
  component: 'boxModelProps',
  category: 'boxModel',
  properties: boxModelProperties,
  defaultValues: boxModelValues,
  Interpolate: {numbers},
  functions: boxModelFunctions
}

Components.BoxModelProperties = boxModelOps
