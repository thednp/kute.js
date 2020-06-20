import KUTE from '../objects/kute.js'
import numbers from '../interpolation/numbers.js' 

// const opacityProperty = { property : 'opacity', defaultValue: 1, interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Component Functions
export function onStartOpacity(tweenProp){
  if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) { // opacity could be 0
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = ((numbers(a,b,v) * 1000)>>0)/1000;
    }
  }
}

// Base Component
const baseOpacity = {
  component: 'baseOpacity',
  property: 'opacity',
  // defaultValue: 1,
  Interpolate: {numbers},
  functions: {onStart: onStartOpacity}
}

export default baseOpacity