import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import trueColor from '../util/trueColor';
import numbers from '../interpolation/numbers';
import colors from '../interpolation/colors';
import { onStartColors } from './colorPropertiesBase';

// Component Properties
// supported formats
// 'hex', 'rgb', 'rgba' '#fff' 'rgb(0,0,0)' / 'rgba(0,0,0,0)' 'red' (IE9+)
const supportedColors = [
  'color', 'backgroundColor', 'outlineColor',
  'borderColor', 'borderTopColor', 'borderRightColor',
  'borderBottomColor', 'borderLeftColor',
];

const defaultColors = {};
supportedColors.forEach((tweenProp) => {
  defaultColors[tweenProp] = '#000';
});

// Component Functions
const colorsOnStart = {};
supportedColors.forEach((x) => {
  colorsOnStart[x] = onStartColors;
});

/**
 * Returns the current property computed style.
 * @param {string} prop the property name
 * @returns {string} property computed style
 */
function getColor(prop/* , value */) {
  return getStyleForProperty(this.element, prop) || defaultValues[prop];
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {KUTE.colorObject} the property tween object
 */
function prepareColor(/* prop, */_, value) {
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
