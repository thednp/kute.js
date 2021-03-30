import KUTE from '../objects/kute.js';
import numbers from '../interpolation/numbers.js';
import colors from '../interpolation/colors.js';

// Component Properties
const shadowProps = ['boxShadow', 'textShadow'];

// Component Functions
export function onStartShadow(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      // let's start with the numbers | set unit | also determine inset
      const params = [];
      const unit = 'px';
      const sl = tweenProp === 'textShadow' ? 3 : 4;
      const colA = sl === 3 ? a[3] : a[4];
      const colB = sl === 3 ? b[3] : b[4];
      const inset = (a[5] && a[5] !== 'none') || (b[5] && b[5] !== 'none') ? ' inset' : false;

      for (let i = 0; i < sl; i += 1) {
        params.push(((numbers(a[i], b[i], v) * 1000 >> 0) / 1000) + unit);
      }
      // the final piece of the puzzle, the DOM update
      elem.style[tweenProp] = inset
        ? colors(colA, colB, v) + params.join(' ') + inset
        : colors(colA, colB, v) + params.join(' ');
    };
  }
}
const shadowPropOnStart = {};
shadowProps.forEach((x) => { shadowPropOnStart[x] = onStartShadow; });

// Component Base
const baseShadow = {
  component: 'baseShadow',
  // properties: shadowProps,
  // defaultValues: {
  //   boxShadow :'0px 0px 0px 0px rgb(0,0,0)',
  //   textShadow: '0px 0px 0px 0px rgb(0,0,0)'
  // },
  Interpolate: { numbers, colors },
  functions: { onStart: shadowPropOnStart },
};

export default baseShadow;
