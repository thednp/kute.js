import support3DTransform from '@thednp/shorty/src/boolean/support3DTransform';
import KEC from '../objects/kute';
import perspective from '../interpolation/perspective';
import translate3d from '../interpolation/translate3d';
import rotate3d from '../interpolation/rotate3d';
import translate from '../interpolation/translate';
import rotate from '../interpolation/rotate';
import scale from '../interpolation/scale';
import skew from '../interpolation/skew';

import supportTransform from '../util/supportLegacyTransform';
import transformProperty from '../util/transformProperty';

// same as svgTransform, htmlAttributes
// the component that handles all browsers IE9+

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartLegacyTransform(tweenProp) {
  if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
    if (support3DTransform) {
      KEC[tweenProp] = (elem, a, b, v) => {
      // eslint-disable-next-line no-param-reassign
        elem.style[transformProperty] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, 'px', v) : '') // one side might be 0
          + (a.translate3d ? translate3d(a.translate3d, b.translate3d, 'px', v) : '') // array [x,y,z]
          + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, 'deg', v) : '') // array [x,y,z]
          + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
          + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
      };
    } else if (supportTransform) {
      KEC[tweenProp] = (elem, a, b, v) => {
        // eslint-disable-next-line no-param-reassign
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
