import pathToString from 'svg-path-commander/src/convert/pathToString';
import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';

// Component Functions

/**
 * Sets the property update function.
 * @param {string} tweenProp the `path` property
 */
export function onStartCubicMorph(tweenProp) {
  if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
    KEC[tweenProp] = function updateMorph(elem, a, b, v) {
      const curve = [];
      const path1 = a.curve;
      const path2 = b.curve;
      for (let i = 0, l = path2.length; i < l; i += 1) { // each path command
        curve.push([path1[i][0]]);
        for (let j = 1, l2 = path1[i].length; j < l2; j += 1) { // each command coordinate
          /* eslint-disable-next-line no-bitwise -- impossible to satisfy */
          curve[i].push((numbers(path1[i][j], path2[i][j], v) * 1000 >> 0) / 1000);
        }
      }
      elem.setAttribute('d', v === 1 ? b.original : pathToString(curve));
    };
  }
}

// Component Base
const baseSvgCubicMorph = {
  component: 'baseSVGCubicMorph',
  property: 'path',
  // defaultValue: [],
  Interpolate: { numbers, pathToString },
  functions: { onStart: onStartCubicMorph },
};

export default baseSvgCubicMorph;
