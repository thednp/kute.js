import KUTE from '../core/globals.js'
import {Components} from '../core/objects.js'
import {trueDimension} from '../util/util.js' 
import {getStyleForProperty} from '../core/process.js' 
import {numbers} from '../core/interpolate.js'

// Component Functions
export function getClip(tweenProp,v){
  const currentClip = getStyleForProperty(this.element,tweenProp), 
        width = getStyleForProperty(this.element,'width'), 
        height = getStyleForProperty(this.element,'height');
  return !/rect/.test(currentClip) ? [0, width, height, 0] : currentClip;
}
export function prepareClip(tweenProp,value) {
  if ( value instanceof Array ){
    return [ trueDimension(value[0]), trueDimension(value[1]), trueDimension(value[2]), trueDimension(value[3]) ];
  } else {
    var clipValue = value.replace(/rect|\(|\)/g,'');
    clipValue = /\,/g.test(clipValue) ? clipValue.split(/\,/g) : clipValue.split(/\s/g);
    return [ trueDimension(clipValue[0]),  trueDimension(clipValue[1]), trueDimension(clipValue[2]),  trueDimension(clipValue[3]) ];
  }
}
export function onStartClip(tweenProp) {
  if ( this.valuesEnd[tweenProp] && !KUTE[tweenProp]) { 
    KUTE[tweenProp] = (elem, a, b, v) => {
      var h = 0, cl = [];
      for (h;h<4;h++){
        var c1 = a[h].v, c2 = b[h].v, cu = b[h].u || 'px';
        cl[h] = ((numbers(c1,c2,v)*100 >> 0)/100) + cu;
      }
      elem.style.clip = `rect(${cl})`;
    }
  }
} 

// All Component Functions
export const clipFunctions = {
  prepareStart: getClip,
  prepareProperty: prepareClip,
  onStart: onStartClip
}

// Component Base
export const baseClipOps = {
  component: 'clipProperty',
  property: 'clip',
  // defaultValue: [0,0,0,0],
  Interpolate: {numbers},
  functions: {onStart:onStartClip}
}

// Component Full
export const clipOps = {
  component: 'clipProperty',
  property: 'clip',
  defaultValue: [0,0,0,0],
  Interpolate: {numbers},
  functions: clipFunctions,
  Util: {trueDimension}
}

Components.ClipProperty = clipOps