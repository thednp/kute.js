import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import trueDimension from '../util/trueDimension';
import units from '../interpolation/units';
import { textPropOnStart } from './textPropertiesBase';

// Component Properties
const textProps = ['fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing'];
const textOnStart = {};

// Component Functions
textProps.forEach((tweenProp) => {
  textOnStart[tweenProp] = textPropOnStart;
});

/**
 * Returns the current property computed style.
 * @param {string} prop the property name
 * @returns {string} computed style for property
 */
export function getTextProp(prop/* , value */) {
  return getStyleForProperty(this.element, prop) || defaultValues[prop];
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {number} the property tween object
 */
export function prepareTextProp(/* prop */_, value) {
  return trueDimension(value);
}

// All Component Functions
const textPropFunctions = {
  prepareStart: getTextProp,
  prepareProperty: prepareTextProp,
  onStart: textOnStart,
};

// Component Full
const TextProperties = {
  component: 'textProperties',
  category: 'textProperties',
  properties: textProps,
  defaultValues: {
    fontSize: 0, lineHeight: 0, letterSpacing: 0, wordSpacing: 0,
  },
  Interpolate: { units },
  functions: textPropFunctions,
  Util: { trueDimension },
};

export default TextProperties;
