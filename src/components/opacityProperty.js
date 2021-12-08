import getStyleForProperty from '../process/getStyleForProperty';
import numbers from '../interpolation/numbers';
import { onStartOpacity } from './opacityPropertyBase';

// Component Functions
/**
 * Returns the current property computed style.
 * @param {string} tweenProp the property name
 * @returns {string} computed style for property
 */
function getOpacity(tweenProp/* , value */) {
  return getStyleForProperty(this.element, tweenProp);
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {number} the property tween object
 */
function prepareOpacity(/* tweenProp, */_, value) {
  return parseFloat(value); // opacity always FLOAT
}

// All Component Functions
const opacityFunctions = {
  prepareStart: getOpacity,
  prepareProperty: prepareOpacity,
  onStart: onStartOpacity,
};

// Full Component
const OpacityProperty = {
  component: 'opacityProperty',
  property: 'opacity',
  defaultValue: 1,
  Interpolate: { numbers },
  functions: opacityFunctions,
};

export default OpacityProperty;
