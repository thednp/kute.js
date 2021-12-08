import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

/* opacityProperty = {
  property: 'opacity',
  defaultValue: 1,
  interpolators: {numbers},
  functions = { prepareStart, prepareProperty, onStart }
} */

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartOpacity(tweenProp/* , value */) {
  // opacity could be 0 sometimes, we need to check regardless
  if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      /* eslint-disable */
      elem.style[tweenProp] = ((numbers(a, b, v) * 1000) >> 0) / 1000;
      /* eslint-enable */
    };
  }
}

// Base Component
const OpacityPropertyBase = {
  component: 'baseOpacity',
  property: 'opacity',
  // defaultValue: 1,
  Interpolate: { numbers },
  functions: { onStart: onStartOpacity },
};

export default OpacityPropertyBase;
