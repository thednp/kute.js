import KUTE from '../objects/kute.js'
import getInlineStyle from '../process/getInlineStyle.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import trueProperty from '../util/trueProperty.js'
import {numbers} from '../objects/interpolate.js' 

// Component Const
const transformProperty = trueProperty('transform');
const supportTransform = transformProperty in document.body.style ? 1 : 0;

// Component Functions
function getComponentCurrentValue(tweenProp,value){
  let currentTransform = getInlineStyle(this.element);
  let left = this.element.style.left;
  let top = this.element.style.top;
  let x = supportTransform && currentTransform.translate ? currentTransform.translate[0]
                          : isFinite(left*1) ? left 
                          : defaultValues.move[0];
  let y = supportTransform && currentTransform.translate ? currentTransform.translate[1]
                          : isFinite(top*1) ? top 
                          : defaultValues.move[1];
  return [x,y]
}
function prepareComponentValue(tweenProp,value){
  let x = isFinite(value*1) ? parseInt(value) : parseInt(value[0]) || 0;
  let y = parseInt(value[1]) || 0;

  return [ x, y ]
}

export function onStartComponent(tweenProp,value){
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {

    if (supportTransform){
      KUTE[tweenProp] = (elem, a, b, v) => {
        elem.style[transformProperty] = 'translate('+numbers(a[0],b[0],v)+'px,'+numbers(a[1],b[1],v)+'px)';
      }
    } else {
      KUTE[tweenProp] = (elem, a, b, v) => {
        if (a[0]||b[0]) {
          elem.style.left = numbers(a[0],b[0],v)+'px';
        }
        if (a[1]||b[1]) {
          elem.style.top = numbers(a[1],b[1],v)+'px';
        }
      }
    }
  }
}

// All Component Functions
const componentFunctions = {
  prepareStart: getComponentCurrentValue,
  prepareProperty: prepareComponentValue,
  onStart: onStartComponent
}

// Base Component
export const baseCrossBrowserMove = {
  component: 'baseCrossBrowserMove',
  property: 'move',
  Interpolate: {numbers},
  functions: {onStart:onStartComponent}
}

// Full Component
const crossBrowserMove = {
  component: 'crossBrowserMove',
  property: 'move',
  defaultValue: [0,0],
  Interpolate: {numbers},
  functions: componentFunctions,
  Util: {trueProperty}
}

export default crossBrowserMove

Components.CrossBrowserMove = crossBrowserMove