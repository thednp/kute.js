import defaultValues from '../objects/defaultValues.js';
import getStyleForProperty from '../process/getStyleForProperty.js';
import trueColor from '../util/trueColor.js';
import numbers from '../interpolation/numbers.js';
import colors from '../interpolation/colors.js';
import { onStartColors } from './colorPropertiesBase.js';

// Component Interpolation
// Component Properties
// supported formats
// 'hex', 'rgb', 'rgba' '#fff' 'rgb(0,0,0)' / 'rgba(0,0,0,0)' 'red' (IE9+)
const supportedColors = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'];

const defaultColors = {};
supportedColors.forEach((tweenProp) => {
  defaultColors[tweenProp] = '#000';
});

// Component Functions
const colorsOnStart = {};
supportedColors.forEach((x) => {
  colorsOnStart[x] = onStartColors;
});

function getColor(prop/* , value */) {
  return getStyleForProperty(this.element, prop) || defaultValues[prop];
}
function prepareColor(prop, value) {
  return trueColor(value);
}

// All Component Functions
const colorFunctions = {
  prepareStart: getColor,
  prepareProperty: prepareColor,
  onStart: colorsOnStart,
};

// Component Full
const colorProperties = {
  component: 'colorProperties',
  category: 'colors',
  properties: supportedColors,
  defaultValues: defaultColors,
  Interpolate: { numbers, colors },
  functions: colorFunctions,
  Util: { trueColor },
};

export default colorProperties;
