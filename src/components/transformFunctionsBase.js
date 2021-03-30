import KUTE from '../objects/kute.js';
import perspective from '../interpolation/perspective.js';
import translate3d from '../interpolation/translate3d.js';
import rotate3d from '../interpolation/rotate3d.js';
import translate from '../interpolation/translate.js';
import rotate from '../interpolation/rotate.js';
import scale from '../interpolation/scale.js';
import skew from '../interpolation/skew.js';

/* transformFunctions = {
  property: 'transform',
  subProperties,
  defaultValues,
  Interpolate: {translate,rotate,skew,scale},
  functions } */

// same to svg transform, attr

// Component Functions
export function onStartTransform(tweenProp) {
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, 'px', v) : '') // one side might be 0
        + (a.translate3d ? translate3d(a.translate3d, b.translate3d, 'px', v) : '') // array [x,y,z]
        + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, 'deg', v) : '') // array [x,y,z]
        + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
        + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
    };
  }
}

// Base Component
const BaseTransform = {
  component: 'baseTransform',
  property: 'transform',
  functions: { onStart: onStartTransform },
  Interpolate: {
    perspective,
    translate3d,
    rotate3d,
    translate,
    rotate,
    scale,
    skew,
  },
};

export default BaseTransform;
