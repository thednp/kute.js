import KUTE from '../objects/kute.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import getStyleForProperty from '../process/getStyleForProperty.js' 
import trueDimension from '../util/trueDimension.js' 
import {numbers} from '../objects/interpolate.js' 

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

// Component Base Props
const essentialBoxProps = ['top','left','width','height']
const essentialBoxPropsValues = {top:0,left:0,width:0,height:0}
const essentialBoxOnStart = {}
essentialBoxProps.map(x=>essentialBoxOnStart[x] = boxModelOnStart)

// All Component Functions
const essentialBoxModelFunctions = {
  prepareStart: getBoxModel,
  prepareProperty: prepareBoxModel,
  onStart: essentialBoxOnStart
}


// Component Essential
export const essentialBoxModelOps = {
  component: 'boxModelProps',
  category: 'boxModel',
  properties: ['top','left','width','height'],
  defaultValues: essentialBoxPropsValues,
  Interpolate: {numbers},
  functions: essentialBoxModelFunctions,
  Util:{trueDimension}
}

Components.BoxModelEssentialProperties = essentialBoxModelOps
