import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function svgTransformOnStart(tweenProp) {
  if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
    KEC[tweenProp] = (l, a, b, v) => {
      let x = 0;
      let y = 0;
      const deg = Math.PI / 180;
      const scale = 'scale' in b ? numbers(a.scale, b.scale, v) : 1;
      const rotate = 'rotate' in b ? numbers(a.rotate, b.rotate, v) : 0;
      const sin = Math.sin(rotate * deg);
      const cos = Math.cos(rotate * deg);
      const skewX = 'skewX' in b ? numbers(a.skewX, b.skewX, v) : 0;
      const skewY = 'skewY' in b ? numbers(a.skewY, b.skewY, v) : 0;
      const complex = rotate || skewX || skewY || scale !== 1 || 0;

      // start normalizing the translation, we start from last to first
      // (from last chained translation)
      // the normalized translation will handle the transformOrigin tween option
      // and makes sure to have a consistent transformation

      // we start with removing transformOrigin from translation
      x -= complex ? b.origin[0] : 0; y -= complex ? b.origin[1] : 0;
      x *= scale; y *= scale; // we now apply the scale
      // now we apply skews
      y += skewY ? x * Math.tan(skewY * deg) : 0; x += skewX ? y * Math.tan(skewX * deg) : 0;
      const cxsy = cos * x - sin * y; // apply rotation as well
      y = rotate ? sin * x + cos * y : y; x = rotate ? cxsy : x;
      // now we apply the actual translation
      x += 'translate' in b ? numbers(a.translate[0], b.translate[0], v) : 0;
      y += 'translate' in b ? numbers(a.translate[1], b.translate[1], v) : 0;
      // normalizing ends with the addition of the transformOrigin to the translation
      x += complex ? b.origin[0] : 0; y += complex ? b.origin[1] : 0;

      // finally we apply the transform attribute value
      /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
      l.setAttribute('transform', (x || y ? (`translate(${(x * 1000 >> 0) / 1000}${y ? (`,${(y * 1000 >> 0) / 1000}`) : ''})`) : '')
                                 + (rotate ? `rotate(${(rotate * 1000 >> 0) / 1000})` : '')
                                 + (skewX ? `skewX(${(skewX * 1000 >> 0) / 1000})` : '')
                                 + (skewY ? `skewY(${(skewY * 1000 >> 0) / 1000})` : '')
                                 + (scale !== 1 ? `scale(${(scale * 1000 >> 0) / 1000})` : ''));
    };
  }
}

// Component Base
const baseSVGTransform = {
  component: 'baseSVGTransform',
  property: 'svgTransform',
  // subProperties: ['translate','rotate','skewX','skewY','scale'],
  // defaultValue: {translate:0, rotate:0, skewX:0, skewY:0, scale:1},
  defaultOptions: { transformOrigin: '50% 50%' },
  Interpolate: { numbers },
  functions: { onStart: svgTransformOnStart },
};

export default baseSVGTransform;
