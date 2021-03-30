import KUTE from '../objects/kute.js';
import numbers from '../interpolation/numbers.js';
import colors from '../interpolation/colors.js';

// Component Interpolation
// rgba1, rgba2, progress

// Component Properties
// supported formats
// 'hex', 'rgb', 'rgba' '#fff' 'rgb(0,0,0)' / 'rgba(0,0,0,0)' 'red' (IE9+)
const supportedColors = ['color', 'backgroundColor', 'borderColor',
  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'];

// Component Functions
export function onStartColors(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = colors(a, b, v);
    };
  }
}

const colorsOnStart = {};
supportedColors.forEach((x) => { colorsOnStart[x] = onStartColors; });

// Component Base
export const baseColors = {
  component: 'baseColors',
  category: 'colors',
  // properties: supportedColors,
  // defaultValues: defaultColors,
  Interpolate: { numbers, colors },
  functions: { onStart: colorsOnStart },
};

export default baseColors;
