import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';
import colors from '../interpolation/colors';

// Component Interpolation
// rgba1, rgba2, progress

// Component Properties
// supported formats
// 'hex', 'rgb', 'rgba' '#fff' 'rgb(0,0,0)' / 'rgba(0,0,0,0)' 'red' (IE9+)
const supportedColors = [
  'color', 'backgroundColor', 'outlineColor',
  'borderColor',
  'borderTopColor', 'borderRightColor',
  'borderBottomColor', 'borderLeftColor',
];

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartColors(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      // eslint-disable-next-line no-param-reassign
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
