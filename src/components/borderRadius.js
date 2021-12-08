import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import trueDimension from '../util/trueDimension';
import units from '../interpolation/units';
import { radiusOnStartFn } from './borderRadiusBase';

// Component Properties
const radiusProps = [
  'borderRadius',
  'borderTopLeftRadius', 'borderTopRightRadius',
  'borderBottomLeftRadius', 'borderBottomRightRadius'];

const radiusValues = {};
radiusProps.forEach((x) => { radiusValues[x] = 0; });

// Component Functions
const radiusOnStart = {};
radiusProps.forEach((tweenProp) => {
  radiusOnStart[tweenProp] = radiusOnStartFn;
});

/**
 * Returns the current property computed style.
 * @param {string} tweenProp the property name
 * @returns {string} the property computed style
 */
export function getRadius(tweenProp) {
  return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
}

/**
 * Returns the property tween object.
 * @param {string} value the property value
 * @returns {{v: number, u: string}} the property tween object
 */
export function prepareRadius(/* tweenProp, */_, value) {
  return trueDimension(value);
}

// All Component Functions
export const radiusFunctions = {
  prepareStart: getRadius,
  prepareProperty: prepareRadius,
  onStart: radiusOnStart,
};

// Full Component
const BorderRadius = {
  component: 'borderRadiusProperties',
  category: 'borderRadius',
  properties: radiusProps,
  defaultValues: radiusValues,
  Interpolate: { units },
  functions: radiusFunctions,
  Util: { trueDimension },
};

export default BorderRadius;
