import support3DTransform from 'shorter-js/src/boolean/support3DTransform.js';
import KUTE from '../objects/kute.js';
import perspective from '../interpolation/perspective.js';
import translate3d from '../interpolation/translate3d.js';
import rotate3d from '../interpolation/rotate3d.js';
import translate from '../interpolation/translate.js';
import rotate from '../interpolation/rotate.js';
import scale from '../interpolation/scale.js';
import skew from '../interpolation/skew.js';

import supportTransform from '../util/supportLegacyTransform.js';
import transformProperty from '../util/transformProperty.js';

/* baseLegacyTransform = {
  property: 'transform',
  subProperties,
  defaultValues,
  Interpolate: {translate,rotate,skew,scale},
  functions } */

// same to svg transform, attr
// the component that handles all browsers IE9+

// Component Functions
export function onStartLegacyTransform(tweenProp) {
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
    if (support3DTransform) {
      KUTE[tweenProp] = (elem, a, b, v) => {
        elem.style[transformProperty] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, 'px', v) : '') // one side might be 0
          + (a.translate3d ? translate3d(a.translate3d, b.translate3d, 'px', v) : '') // array [x,y,z]
          + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, 'deg', v) : '') // array [x,y,z]
          + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
          + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
      };
    } else if (supportTransform) {
      KUTE[tweenProp] = (elem, a, b, v) => {
        elem.style[transformProperty] = (a.translate ? translate(a.translate, b.translate, 'px', v) : '') // array [x,y]
          + ((a.rotate || b.rotate) ? rotate(a.rotate, b.rotate, 'deg', v) : '') // one side might be 0
          + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
          + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
      };
    }
  }
}

// Base Component
const BaseLegacyTransform = {
  component: 'baseLegacyTransform',
  property: 'transform',
  functions: { onStart: onStartLegacyTransform },
  Interpolate: {
    perspective,
    translate3d,
    rotate3d,
    translate,
    rotate,
    scale,
    skew,
  },
  Util: { transformProperty },
};

export default BaseLegacyTransform;
