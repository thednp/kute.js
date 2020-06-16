import KUTE from '../objects/kute.js'
import {numbers} from '../objects/interpolate.js' 

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

// Component Base
export const baseColors = {
  component: 'baseColors',
  category: 'colors',
  // properties: supportedColors,
  // defaultValues: defaultColors,
  Interpolate: {numbers,colors},
  functions: {onStart:colorsOnStart}
}

export default baseColors