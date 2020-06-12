import KUTE from '../objects/kute.js'
import Components from '../objects/components.js'
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

// Component Base Props
const baseBoxProps = ['top','left','width','height']
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

Components.BoxModelProperties = baseBoxModelOps
