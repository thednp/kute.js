import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

// Component Functions
/**
 * Sets the property update function.
 * @param {string} prop the property name
 */
export function onStartBgPos(prop) {
  if (this.valuesEnd[prop] && !KEC[prop]) {
    KEC[prop] = (elem, a, b, v) => {
      /* eslint-disable -- no-bitwise & no-param-reassign impossible to satisfy */
      elem.style[prop] = `${(numbers(a[0], b[0], v) * 100 >> 0) / 100}%  ${((numbers(a[1], b[1], v) * 100 >> 0) / 100)}%`;
      /* eslint-enable -- no-bitwise & no-param-reassign impossible to satisfy */
    };
  }
}

// Component Base Object
const BackgroundPositionBase = {
  component: 'baseBackgroundPosition',
  property: 'backgroundPosition',
  Interpolate: { numbers },
  functions: { onStart: onStartBgPos },
};
export default BackgroundPositionBase;
