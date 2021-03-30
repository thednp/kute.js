import KUTE from '../objects/kute.js';
import numbers from '../interpolation/numbers.js';

// Component Functions
export function boxModelOnStart(tweenProp) {
  if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = `${v > 0.99 || v < 0.01
        ? ((numbers(a, b, v) * 10) >> 0) / 10
        : (numbers(a, b, v)) >> 0}px`;
    };
  }
}

// Component Base Props
const baseBoxProps = ['top', 'left', 'width', 'height'];
const baseBoxOnStart = {};
baseBoxProps.forEach((x) => { baseBoxOnStart[x] = boxModelOnStart; });

// Component Base
const baseBoxModel = {
  component: 'baseBoxModel',
  category: 'boxModel',
  properties: baseBoxProps,
  Interpolate: { numbers },
  functions: { onStart: baseBoxOnStart },
};

export default baseBoxModel;
