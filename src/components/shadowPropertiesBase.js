import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';
import colors from '../interpolation/colors';

// Component Properties
const shadowProps = ['boxShadow', 'textShadow'];

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartShadow(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      // let's start with the numbers | set unit | also determine inset
      const params = [];
      const unit = 'px';
      const sl = tweenProp === 'textShadow' ? 3 : 4;
      const colA = sl === 3 ? a[3] : a[4];
      const colB = sl === 3 ? b[3] : b[4];
      const inset = (a[5] && a[5] !== 'none') || (b[5] && b[5] !== 'none') ? ' inset' : false;

      for (let i = 0; i < sl; i += 1) {
        /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
        params.push(((numbers(a[i], b[i], v) * 1000 >> 0) / 1000) + unit);
      }
      // the final piece of the puzzle, the DOM update
      // eslint-disable-next-line no-param-reassign -- impossible to satisfy
      elem.style[tweenProp] = inset
        ? colors(colA, colB, v) + params.join(' ') + inset
        : colors(colA, colB, v) + params.join(' ');
    };
  }
}
const shadowPropOnStart = {};
shadowProps.forEach((x) => { shadowPropOnStart[x] = onStartShadow; });

// Component Base
const ShadowPropertiesBase = {
  component: 'baseShadow',
  Interpolate: { numbers, colors },
  functions: { onStart: shadowPropOnStart },
};

export default ShadowPropertiesBase;
