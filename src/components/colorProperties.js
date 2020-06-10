import KUTE from '../objects/KUTE.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/Components.js'
import getStyleForProperty from '../process/getStyleForProperty.js' 
import trueColor from '../util/trueColor.js' 
import {numbers} from '../objects/Interpolate.js' 

// Component Interpolation
// rgba1, rgba2, progress
export function colors(a, b, v) {
  let _c = {},
      c,
      ep = ')',
      cm =',',
      rgb = 'rgb(',
      rgba = 'rgba(';

  for (c in b) { _c[c] = c !== 'a' ? (numbers(a[c],b[c],v)>>0 || 0) : (a[c] && b[c]) ? (numbers(a[c],b[c],v) * 100 >> 0 )/100 : null; }
  return !_c.a ? rgb + _c.r + cm + _c.g + cm + _c.b + ep : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
}

// Component Properties
// supported formats
// 'hex', 'rgb', 'rgba' '#fff' 'rgb(0,0,0)' / 'rgba(0,0,0,0)' 'red' (IE9+)
const supportedColors = ['color', 'backgroundColor','borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor']
const defaultColors = {}

supportedColors.forEach(tweenProp => {
  defaultColors[tweenProp] = '#000'
});

// Component Functions
export function onStartColors(tweenProp){
  if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = colors(a,b,v);
    }
  }
}
const colorsOnStart = {}
supportedColors.map(x => colorsOnStart[x] = onStartColors)

export function getColor(prop,value) {
  return getStyleForProperty(this.element,prop) || defaultValues[prop];
}
export function prepareColor(prop,value) {
  return trueColor(value);
}

// All Component Functions
export const colorsFunctions = {
  prepareStart: getColor,
  prepareProperty: prepareColor,
  onStart: colorsOnStart
}

// Component Base
export const baseColorsOps = {
  component: 'colorProps',
  category: 'colors',
  properties: supportedColors,
  // defaultValues: defaultColors,
  Interpolate: {numbers,colors},
  functions: {onStart:onStartColors}
}

// Component Full
export const colorsOps = {
  component: 'colorProps',
  category: 'colors',
  properties: supportedColors,
  defaultValues: defaultColors,
  Interpolate: {numbers,colors},
  functions: colorsFunctions,
  Util: {trueColor}
}

Components.ColorProperties = colorsOps
