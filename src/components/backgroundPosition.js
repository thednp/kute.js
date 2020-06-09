import KUTE from '../core/globals.js'
import {defaultValues,Components} from '../core/objects.js'
import {getStyleForProperty} from '../core/process.js'
import {numbers} from '../core/interpolate.js' 
import {trueDimension} from '../util/util.js'

// const bgPosProp = { property : 'backgroundPosition', defaultValue: [0,0], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Component Functions
export function getBgPos(prop){
  return getStyleForProperty(this.element,prop) || defaultValues[prop];
}
export function prepareBgPos(prop,value){
  if ( value instanceof Array ){
    const x = trueDimension(value[0]).v, 
          y = trueDimension(value[1]).v;
    return [ x !== NaN ? x : 50, y !== NaN ? y : 50 ];
  } else {
    let posxy = value.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/g,50);
    posxy = posxy.split(/(\,|\s)/g); 
    posxy = posxy.length === 2 ? posxy : [posxy[0],50];
    return [ trueDimension(posxy[0]).v, trueDimension(posxy[1]).v ];
  }
}
export function onStartBgPos(prop){
  if ( this.valuesEnd[prop] && !KUTE[prop]) { // opacity could be 0
    KUTE[prop] = (elem, a, b, v) => {
      elem.style[prop] = `${(numbers(a[0],b[0],v)*100>>0)/100}%  ${((numbers(a[1],b[1],v)*100>>0)/100)}%`;
    }
  }
}

// All Component Functions
export const bgPositionFunctions = {
  prepareStart: getBgPos,
  prepareProperty: prepareBgPos,
  onStart: onStartBgPos
}

// Component Base Object
export const baseBgPosOps = {
  component: 'BgPositionProp',
  property: 'backgroundPosition',
  // defaultValue: [50,50],
  Interpolate: {numbers},
  functions: {onStart: onStartBgPos}
}

// Component Full Object
export const bgPosOps = {
  component: 'BgPositionProp',
  property: 'backgroundPosition',
  defaultValue: [50,50],
  Interpolate: {numbers},
  functions: bgPositionFunctions,
  Util: {trueDimension}
}

Components.BackgroundPositionProperty = bgPosOps