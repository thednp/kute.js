import KEC from '../objects/kute';
import coords from '../interpolation/coords';

/* SVGMorph = {
  property: 'path',
  defaultValue: [],
  interpolators: {numbers,coords} },
  functions = { prepareStart, prepareProperty, onStart, crossCheck }
} */

// Component functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartSVGMorph(tweenProp) {
  if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      const path1 = a.polygon; const path2 = b.polygon;
      const len = path2.length;
      elem.setAttribute('d', (v === 1 ? b.original : `M${coords(path1, path2, len, v).join('L')}Z`));
    };
  }
}

// Component Base
const SVGMorphBase = {
  component: 'baseSVGMorph',
  property: 'path',
  Interpolate: coords,
  functions: { onStart: onStartSVGMorph },
};

export default SVGMorphBase;
