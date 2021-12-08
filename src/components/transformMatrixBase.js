import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';
import arrays from '../interpolation/arrays';

// Component name
const matrixComponent = 'transformMatrixBase';

// Component special
// this component is restricted to modern browsers only
const CSS3Matrix = typeof (DOMMatrix) !== 'undefined' ? DOMMatrix : null;

// Component Functions
export const onStartTransform = {
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
  transform(tweenProp) {
    if (CSS3Matrix && this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
      KEC[tweenProp] = (elem, a, b, v) => {
        let matrix = new CSS3Matrix();
        const tObject = {};

        Object.keys(b).forEach((p) => {
          tObject[p] = p === 'perspective' ? numbers(a[p], b[p], v) : arrays(a[p], b[p], v);
        });

        // set perspective
        if (tObject.perspective) matrix.m34 = -1 / tObject.perspective;

        // set translate
        matrix = tObject.translate3d
          ? matrix.translate(tObject.translate3d[0], tObject.translate3d[1], tObject.translate3d[2])
          : matrix;

        // set rotation
        matrix = tObject.rotate3d
          ? matrix.rotate(tObject.rotate3d[0], tObject.rotate3d[1], tObject.rotate3d[2])
          : matrix;

        // set skew
        if (tObject.skew) {
          matrix = tObject.skew[0] ? matrix.skewX(tObject.skew[0]) : matrix;
          matrix = tObject.skew[1] ? matrix.skewY(tObject.skew[1]) : matrix;
        }

        // set scale
        matrix = tObject.scale3d
          ? matrix.scale(tObject.scale3d[0], tObject.scale3d[1], tObject.scale3d[2])
          : matrix;

        // set element style
        // eslint-disable-next-line no-param-reassign
        elem.style[tweenProp] = matrix.toString();
      };
    }
  },
  /**
   * onStartTransform.CSS3Matrix
   *
   * Sets the update function for the property.
   * @param {string} prop the property name
   */
  CSS3Matrix(prop) {
    if (CSS3Matrix && this.valuesEnd.transform) {
      if (!KEC[prop]) KEC[prop] = CSS3Matrix;
    }
  },
};

// Component Base Object
export const TransformMatrixBase = {
  component: matrixComponent,
  property: 'transform',
  functions: { onStart: onStartTransform },
  Interpolate: {
    perspective: numbers,
    translate3d: arrays,
    rotate3d: arrays,
    skew: arrays,
    scale3d: arrays,
  },
};

export default TransformMatrixBase;
