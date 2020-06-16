import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import getStyleForProperty from '../process/getStyleForProperty.js'
import {numbers} from '../objects/interpolate.js' 
import trueDimension from '../util/trueDimension.js'
import {onStartBgPos} from './backgroundPositionBase.js'

// const bgPosProp = { property : 'backgroundPosition', defaultValue: [0,0], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Component Functions
function getBgPos(prop){
  return getStyleForProperty(this.element,prop) || defaultValues[prop];
}
function prepareBgPos(prop,value){
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

// All Component Functions
const bgPositionFunctions = {
  prepareStart: getBgPos,
  prepareProperty: prepareBgPos,
  onStart: onStartBgPos
}

// Component Full Object
const BackgroundPosition = {
  component: 'backgroundPositionProp',
  property: 'backgroundPosition',
  defaultValue: [50,50],
  Interpolate: {numbers},
  functions: bgPositionFunctions,
  Util: {trueDimension}
}

export default BackgroundPosition

Components.BackgroundPosition = BackgroundPosition