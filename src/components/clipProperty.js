import Components from '../objects/components.js'
import getStyleForProperty from '../process/getStyleForProperty.js' 
import trueDimension from '../util/trueDimension.js' 
import numbers from '../interpolation/numbers.js' 
import {onStartClip} from './clipPropertyBase.js'

// Component Functions
function getClip(tweenProp,v){
  const currentClip = getStyleForProperty(this.element,tweenProp), 
        width = getStyleForProperty(this.element,'width'), 
        height = getStyleForProperty(this.element,'height');
  return !/rect/.test(currentClip) ? [0, width, height, 0] : currentClip;
}
function prepareClip(tweenProp,value) {
  if ( value instanceof Array ){
    return [ trueDimension(value[0]), trueDimension(value[1]), trueDimension(value[2]), trueDimension(value[3]) ];
  } else {
    var clipValue = value.replace(/rect|\(|\)/g,'');
    clipValue = /\,/g.test(clipValue) ? clipValue.split(/\,/g) : clipValue.split(/\s/g);
    return [ trueDimension(clipValue[0]),  trueDimension(clipValue[1]), trueDimension(clipValue[2]),  trueDimension(clipValue[3]) ];
  }
}

// All Component Functions
const clipFunctions = {
  prepareStart: getClip,
  prepareProperty: prepareClip,
  onStart: onStartClip
}

// Component Full
 const clipProperty = {
  component: 'clipProperty',
  property: 'clip',
  defaultValue: [0,0,0,0],
  Interpolate: {numbers},
  functions: clipFunctions,
  Util: {trueDimension}
}

export default clipProperty

Components.ClipProperty = clipProperty