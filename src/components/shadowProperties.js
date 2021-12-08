import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import trueColor from '../util/trueColor';
import numbers from '../interpolation/numbers';
import colors from '../interpolation/colors';
import { onStartShadow } from './shadowPropertiesBase';

// Component Properties
const shadowProps = ['boxShadow', 'textShadow'];

// Component Util

/**
 * Return the box-shadow / text-shadow tween object.
 * * box-shadow: none | h-shadow v-shadow blur spread color inset|initial|inherit
 * * text-shadow: none | offset-x offset-y blur-radius color |initial|inherit
 * * numbers must be floats and color must be rgb object
 *
 * @param {(number | string)[]} shadow an `Array` with shadow parameters
 * @param {string} tweenProp the property name
 * @returns {KUTE.shadowObject} the property tween object
 */
function processShadowArray(shadow, tweenProp) {
  let newShadow;

  // [h-shadow, v-shadow, color]
  if (shadow.length === 3) {
    newShadow = [shadow[0], shadow[1], 0, 0, shadow[2], 'none'];
  // [h-shadow, v-shadow, color, inset] | [h-shadow, v-shadow, blur, color]
  } else if (shadow.length === 4) {
    newShadow = /inset|none/.test(shadow[3])
      ? [shadow[0], shadow[1], 0, 0, shadow[2], shadow[3]]
      : [shadow[0], shadow[1], shadow[2], 0, shadow[3], 'none'];
  // [h-shadow, v-shadow, blur, color, inset] | [h-shadow, v-shadow, blur, spread, color]
  } else if (shadow.length === 5) {
    newShadow = /inset|none/.test(shadow[4])
      ? [shadow[0], shadow[1], shadow[2], 0, shadow[3], shadow[4]]
      : [shadow[0], shadow[1], shadow[2], shadow[3], shadow[4], 'none'];
  // ideal [h-shadow, v-shadow, blur, spread, color, inset]
  } else if (shadow.length === 6) {
    newShadow = shadow;
  }

  // make sure the values are ready to tween
  for (let i = 0; i < 4; i += 1) {
    newShadow[i] = parseFloat(newShadow[i]);
  }

  // also the color must be a rgb object
  newShadow[4] = trueColor(newShadow[4]);

  newShadow = tweenProp === 'boxShadow'
    ? newShadow
    : newShadow.filter((_, i) => [0, 1, 2, 4].includes(i));

  return newShadow;
}

// Component Functions
/**
 * Returns the current property computed style.
 * @param {string} tweenProp the property name
 * @returns {string} computed style for property
 */
export function getShadow(tweenProp/* , value */) {
  const cssShadow = getStyleForProperty(this.element, tweenProp);
  // '0px 0px 0px 0px rgb(0,0,0)'
  return /^none$|^initial$|^inherit$|^inset$/.test(cssShadow)
    ? defaultValues[tweenProp]
    : cssShadow;
}

/**
 * Returns the property tween object.
 * @param {string} tweenProp the property name
 * @param {string} propValue the property value
 * @returns {KUTE.shadowObject} the property tween object
 */
export function prepareShadow(tweenProp, propValue) {
  // [horizontal, vertical, blur, spread, color: {r:0,g:0,b:0}, inset]
  // parseProperty for boxShadow, builds basic structure with ready to tween values
  let value = propValue;
  if (typeof value === 'string') {
    let inset = 'none';
    // a full RegEx for color strings
    const colRegEx = /(\s?(?:#(?:[\da-f]{3}){1,2}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))\s?)/gi;
    const currentColor = value.match(colRegEx);

    // make sure to always have the inset last if possible
    inset = /inset/.test(value) ? 'inset' : inset;
    value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g, '') : value;

    // also getComputedStyle often returns color first "rgb(0, 0, 0) 15px 15px 6px 0px inset"
    value = value.replace(currentColor[0], '').split(' ').concat([currentColor[0].replace(/\s/g, '')], [inset]);

    value = processShadowArray(value, tweenProp);
  } else if (value instanceof Array) {
    value = processShadowArray(value, tweenProp);
  }

  return value;
}

const shadowPropOnStart = {};
shadowProps.forEach((x) => { shadowPropOnStart[x] = onStartShadow; });

// All Component Functions
const shadowFunctions = {
  prepareStart: getShadow,
  prepareProperty: prepareShadow,
  onStart: shadowPropOnStart,
};

// Component Full
const ShadowProperties = {
  component: 'shadowProperties',
  properties: shadowProps,
  defaultValues: {
    boxShadow: '0px 0px 0px 0px rgb(0,0,0)',
    textShadow: '0px 0px 0px rgb(0,0,0)',
  },
  Interpolate: { numbers, colors },
  functions: shadowFunctions,
  Util: { processShadowArray, trueColor },
};

export default ShadowProperties;
