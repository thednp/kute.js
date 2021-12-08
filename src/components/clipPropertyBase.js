import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartClip(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      let h = 0; const
        cl = [];
      for (h; h < 4; h += 1) {
        const c1 = a[h].v;
        const c2 = b[h].v;
        const cu = b[h].u || 'px';
        // eslint-disable-next-line no-bitwise -- impossible to satisfy
        cl[h] = ((numbers(c1, c2, v) * 100 >> 0) / 100) + cu;
      }
      // eslint-disable-next-line no-param-reassign -- impossible to satisfy
      elem.style.clip = `rect(${cl})`;
    };
  }
}

// Component Base
const ClipPropertyBase = {
  component: 'baseClip',
  property: 'clip',
  // defaultValue: [0,0,0,0],
  Interpolate: { numbers },
  functions: { onStart: onStartClip },
};

export default ClipPropertyBase;
