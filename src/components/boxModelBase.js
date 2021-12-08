import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

// Component Functions
/**
 * Sets the update function for the property.
 * @param {string} tweenProp the property name
 */
export function boxModelOnStart(tweenProp) {
  if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      /* eslint-disable no-param-reassign -- impossible to satisfy */
      /* eslint-disable no-bitwise -- impossible to satisfy */
      elem.style[tweenProp] = `${v > 0.99 || v < 0.01
        ? ((numbers(a, b, v) * 10) >> 0) / 10
        : (numbers(a, b, v)) >> 0}px`;
      /* eslint-enable no-bitwise */
      /* eslint-enable no-param-reassign */
    };
  }
}

// Component Base Props
const baseBoxProps = ['top', 'left', 'width', 'height'];
const baseBoxOnStart = {};
baseBoxProps.forEach((x) => { baseBoxOnStart[x] = boxModelOnStart; });

// Component Base
const BoxModelBase = {
  component: 'baseBoxModel',
  category: 'boxModel',
  properties: baseBoxProps,
  Interpolate: { numbers },
  functions: { onStart: baseBoxOnStart },
};

export default BoxModelBase;
