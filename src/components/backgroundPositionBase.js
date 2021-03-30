import KUTE from '../objects/kute.js';
import numbers from '../interpolation/numbers.js';

/* bgPosProp = {
  property: 'backgroundPosition',
  defaultValue: [0,0],
  interpolators: {numbers},
  functions = { prepareStart, prepareProperty, onStart }
} */

// Component Functions
export function onStartBgPos(prop) {
  if (this.valuesEnd[prop] && !KUTE[prop]) {
    KUTE[prop] = (elem, a, b, v) => {
      elem.style[prop] = `${(numbers(a[0], b[0], v) * 100 >> 0) / 100}%  ${((numbers(a[1], b[1], v) * 100 >> 0) / 100)}%`;
    };
  }
}

// Component Base Object
const baseBgPosOps = {
  component: 'baseBackgroundPosition',
  property: 'backgroundPosition',
  Interpolate: { numbers },
  functions: { onStart: onStartBgPos },
};
export default baseBgPosOps;
