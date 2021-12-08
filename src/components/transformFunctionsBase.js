import KEC from '../objects/kute';
import perspective from '../interpolation/perspective';
import translate3d from '../interpolation/translate3d';
import rotate3d from '../interpolation/rotate3d';
import translate from '../interpolation/translate';
import rotate from '../interpolation/rotate';
import scale from '../interpolation/scale';
import skew from '../interpolation/skew';

// Component Functions
/**
 * Sets the property update function.
 * * same to svgTransform, htmlAttributes
 * @param {string} tweenProp the property name
 */
export function onStartTransform(tweenProp) {
  if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      // eslint-disable-next-line no-param-reassign
      elem.style[tweenProp] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, 'px', v) : '') // one side might be 0
        + (a.translate3d ? translate3d(a.translate3d, b.translate3d, 'px', v) : '') // array [x,y,z]
        + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, 'deg', v) : '') // array [x,y,z]
        + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
        + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
    };
  }
}

// Base Component
const TransformFunctionsBase = {
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

export default TransformFunctionsBase;
