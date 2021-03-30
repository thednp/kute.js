import getStyleForProperty from '../process/getStyleForProperty.js';
import numbers from '../interpolation/numbers.js';
import { onStartOpacity } from './opacityPropertyBase.js';

/* opacityProperty = {
  property: 'opacity',
  defaultValue: 1,
  interpolators: {numbers},
  functions = { prepareStart, prepareProperty, onStart }
} */

// Component Functions
function getOpacity(tweenProp/* , value */) {
  return getStyleForProperty(this.element, tweenProp);
}

function prepareOpacity(tweenProp, value) {
  return parseFloat(value); // opacity always FLOAT
}

// All Component Functions
const opacityFunctions = {
  prepareStart: getOpacity,
  prepareProperty: prepareOpacity,
  onStart: onStartOpacity,
};

// Full Component
const opacityProperty = {
  component: 'opacityProperty',
  property: 'opacity',
  defaultValue: 1,
  Interpolate: { numbers },
  functions: opacityFunctions,
};

export default opacityProperty;
