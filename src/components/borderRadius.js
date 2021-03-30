import defaultValues from '../objects/defaultValues.js';
import getStyleForProperty from '../process/getStyleForProperty.js';
import trueDimension from '../util/trueDimension.js';
import units from '../interpolation/units.js';
import { radiusOnStartFn } from './borderRadiusBase.js';

/* borderRadius = {
  category: 'borderRadius',
  properties : [..],
  defaultValues: {..},
  interpolation: {units}
} */

// Component Properties
const radiusProps = ['borderRadius',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];

const radiusValues = {};
radiusProps.forEach((x) => { radiusValues[x] = 0; });

// Component Functions
const radiusOnStart = {};
radiusProps.forEach((tweenProp) => {
  radiusOnStart[tweenProp] = radiusOnStartFn;
});

export function getRadius(tweenProp) {
  return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
}

export function prepareRadius(tweenProp, value) {
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
