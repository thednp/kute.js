import KEC from '../objects/kute';
import units from '../interpolation/units';

/* borderRadius = {
  category: 'borderRadius',
  properties : [..],
  defaultValues: {..},
  interpolation: {units}
} */

// Component Properties
const radiusProps = [
  'borderRadius',
  'borderTopLeftRadius', 'borderTopRightRadius',
  'borderBottomLeftRadius', 'borderBottomRightRadius',
];

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function radiusOnStartFn(tweenProp) {
  if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      // eslint-disable-next-line no-param-reassign -- impossible to satisfy
      elem.style[tweenProp] = units(a.v, b.v, b.u, v);
    };
  }
}
const radiusOnStart = {};
radiusProps.forEach((tweenProp) => {
  radiusOnStart[tweenProp] = radiusOnStartFn;
});

// Base Component
const BorderRadiusBase = {
  component: 'baseBorderRadius',
  category: 'borderRadius',
  Interpolate: { units },
  functions: { onStart: radiusOnStart },
};
export default BorderRadiusBase;
