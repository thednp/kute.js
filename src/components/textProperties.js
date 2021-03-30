import defaultValues from '../objects/defaultValues.js';
import getStyleForProperty from '../process/getStyleForProperty.js';
import trueDimension from '../util/trueDimension.js';
import units from '../interpolation/units.js';
import { textPropOnStart } from './textPropertiesBase.js';

/* textProperties = {
  category: 'textProperties',
  defaultValues: [],
  interpolators: {units}
  functions = { prepareStart, prepareProperty, onStart }
} */

// Component Properties
const textProps = ['fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing'];
const textOnStart = {};

// Component Functions
textProps.forEach((tweenProp) => {
  textOnStart[tweenProp] = textPropOnStart;
});

export function getTextProp(prop/* , value */) {
  return getStyleForProperty(this.element, prop) || defaultValues[prop];
}

export function prepareTextProp(prop, value) {
  return trueDimension(value);
}

// All Component Functions
const textPropFunctions = {
  prepareStart: getTextProp,
  prepareProperty: prepareTextProp,
  onStart: textOnStart,
};

// Component Full
const textProperties = {
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

export default textProperties;
