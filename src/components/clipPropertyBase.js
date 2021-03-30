import KUTE from '../objects/kute.js';
import numbers from '../interpolation/numbers.js';

// Component Functions
export function onStartClip(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      let h = 0; const
        cl = [];
      for (h; h < 4; h += 1) {
        const c1 = a[h].v; const c2 = b[h].v; const
          cu = b[h].u || 'px';
        cl[h] = ((numbers(c1, c2, v) * 100 >> 0) / 100) + cu;
      }
      elem.style.clip = `rect(${cl})`;
    };
  }
}

// Component Base
const baseClip = {
  component: 'baseClip',
  property: 'clip',
  // defaultValue: [0,0,0,0],
  Interpolate: { numbers },
  functions: { onStart: onStartClip },
};

export default baseClip;
