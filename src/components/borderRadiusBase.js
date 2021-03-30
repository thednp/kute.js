import KUTE from '../objects/kute.js';
import units from '../interpolation/units.js';

/* borderRadius = {
  category: 'borderRadius',
  properties : [..],
  defaultValues: {..},
  interpolation: {units}
} */

// Component Properties
const radiusProps = ['borderRadius',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];

// Component Functions
export function radiusOnStartFn(tweenProp) {
  if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = units(a.v, b.v, b.u, v);
    };
  }
}
const radiusOnStart = {};
radiusProps.forEach((tweenProp) => {
  radiusOnStart[tweenProp] = radiusOnStartFn;
});

// Base Component
const baseBorderRadius = {
  component: 'baseBorderRadius',
  category: 'borderRadius',
  Interpolate: { units },
  functions: { onStart: radiusOnStart },
};
export default baseBorderRadius;
