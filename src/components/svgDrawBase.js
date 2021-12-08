import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartDraw(tweenProp) {
  if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      /* eslint-disable no-bitwise -- impossible to satisfy */
      const pathLength = (a.l * 100 >> 0) / 100;
      const start = (numbers(a.s, b.s, v) * 100 >> 0) / 100;
      const end = (numbers(a.e, b.e, v) * 100 >> 0) / 100;
      const offset = 0 - start;
      const dashOne = end + offset;
      // eslint-disable-next-line no-param-reassign -- impossible to satisfy
      elem.style.strokeDashoffset = `${offset}px`;
      // eslint-disable-next-line no-param-reassign -- impossible to satisfy
      elem.style.strokeDasharray = `${((dashOne < 1 ? 0 : dashOne) * 100 >> 0) / 100}px, ${pathLength}px`;
      /* eslint-disable no-bitwise -- impossible to satisfy */
    };
  }
}

// Component Base
const SvgDrawBase = {
  component: 'baseSVGDraw',
  property: 'draw',
  Interpolate: { numbers },
  functions: { onStart: onStartDraw },
};

export default SvgDrawBase;
