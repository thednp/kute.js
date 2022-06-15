import parsePathString from 'svg-path-commander/src/parser/parsePathString';
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute';
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve';
import pathToString from 'svg-path-commander/src/convert/pathToString';
import reverseCurve from 'svg-path-commander/src/process/reverseCurve';
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection';
import clonePath from 'svg-path-commander/src/process/clonePath';
import splitCubic from 'svg-path-commander/src/process/splitCubic';
import splitPath from 'svg-path-commander/src/process/splitPath';
import fixPath from 'svg-path-commander/src/process/fixPath';
import segmentCubicFactory from 'svg-path-commander/src/util/segmentCubicFactory';
import distanceSquareRoot from 'svg-path-commander/src/math/distanceSquareRoot';

import { onStartCubicMorph } from './svgCubicMorphBase';
import numbers from '../interpolation/numbers';
import selector from '../util/selector';

// Component Util
/**
 * Returns first `pathArray` from multi-paths path.
 * @param {SVGPath.pathArray | string} source the source `pathArray` or string
 * @returns {KUTE.curveSpecs[]} an `Array` with a custom tuple for `equalizeSegments`
 */
function getCurveArray(source) {
  return pathToCurve(splitPath(pathToAbsolute(source))[0])
    .map((segment, i, pathArray) => {
      const segmentData = i && [...pathArray[i - 1].slice(-2), ...segment.slice(1)];
      const curveLength = i ? segmentCubicFactory(...segmentData).length : 0;

      let subsegs;
      if (i) {
        // must be [segment,segment]
        subsegs = curveLength ? splitCubic(segmentData) : [segment, segment];
      } else {
        subsegs = [segment];
      }

      return {
        s: segment,
        ss: subsegs,
        l: curveLength,
      };
    });
}

/**
 * Returns two `curveArray` with same amount of segments.
 * @param {SVGPath.curveArray} path1 the first `curveArray`
 * @param {SVGPath.curveArray} path2 the second `curveArray`
 * @param {number} TL the maximum `curveArray` length
 * @returns {SVGPath.curveArray[]} equalized segments
 */
function equalizeSegments(path1, path2, TL) {
  const c1 = getCurveArray(path1);
  const c2 = getCurveArray(path2);
  const L1 = c1.length;
  const L2 = c2.length;
  const l1 = c1.filter((x) => x.l).length;
  const l2 = c2.filter((x) => x.l).length;
  const m1 = c1.filter((x) => x.l).reduce((a, { l }) => a + l, 0) / l1 || 0;
  const m2 = c2.filter((x) => x.l).reduce((a, { l }) => a + l, 0) / l2 || 0;
  const tl = TL || Math.max(L1, L2);
  const mm = [m1, m2];
  const dif = [tl - L1, tl - L2];
  let canSplit = 0;
  const result = [c1, c2]
    .map((x, i) => (x.l === tl
      ? x.map((y) => y.s)
      : x.map((y, j) => {
        canSplit = j && dif[i] && y.l >= mm[i];
        dif[i] -= canSplit ? 1 : 0;
        return canSplit ? y.ss : [y.s];
      }).flat()));

  return result[0].length === result[1].length
    ? result
    : equalizeSegments(result[0], result[1], tl);
}

/**
 * Returns all possible path rotations for `curveArray`.
 * @param {SVGPath.curveArray} a the source `curveArray`
 * @returns {SVGPath.curveArray[]} all rotations for source
 */
function getRotations(a) {
  const segCount = a.length;
  const pointCount = segCount - 1;

  return a.map((_, idx) => a.map((__, i) => {
    let oldSegIdx = idx + i;
    let seg;

    if (i === 0 || (a[oldSegIdx] && a[oldSegIdx][0] === 'M')) {
      seg = a[oldSegIdx];
      return ['M', ...seg.slice(-2)];
    }
    if (oldSegIdx >= segCount) oldSegIdx -= pointCount;
    return a[oldSegIdx];
  }));
}

/**
 * Returns the `curveArray` rotation for the best morphing animation.
 * @param {SVGPath.curveArray} a the target `curveArray`
 * @param {SVGPath.curveArray} b the reference `curveArray`
 * @returns {SVGPath.curveArray} the best `a` rotation
 */
function getRotatedCurve(a, b) {
  const segCount = a.length - 1;
  const lineLengths = [];
  let computedIndex = 0;
  let sumLensSqrd = 0;
  const rotations = getRotations(a);

  rotations.forEach((_, i) => {
    a.slice(1).forEach((__, j) => {
      sumLensSqrd += distanceSquareRoot(a[(i + j) % segCount].slice(-2), b[j % segCount].slice(-2));
    });
    lineLengths[i] = sumLensSqrd;
    sumLensSqrd = 0;
  });

  computedIndex = lineLengths.indexOf(Math.min.apply(null, lineLengths));

  return rotations[computedIndex];
}

// Component Functions
/**
 * Returns the current `d` attribute value.
 * @returns {string}
 */
function getCubicMorph(/* tweenProp, value */) {
  return this.element.getAttribute('d');
}

/**
 * Returns the property tween object.
 * @see KUTE.curveObject
 *
 * @param {string} _ is the `path` property name, not needed
 * @param {string | KUTE.curveObject} value the `path` property value
 * @returns {KUTE.curveObject}
 */
function prepareCubicMorph(/* tweenProp, */_, value) {
  // get path d attribute or create a path from string value
  const pathObject = {};
  // remove newlines, they break some JSON strings
  const pathReg = new RegExp('\\n', 'ig');

  let el = null;
  if (value instanceof SVGElement) {
    el = value;
  } else if (/^\.|^#/.test(value)) {
    el = selector(value);
  }

  // make sure to return pre-processed values
  if (typeof (value) === 'object' && value.curve) {
    return value;
  } if (el && /path|glyph/.test(el.tagName)) {
    pathObject.original = el.getAttribute('d').replace(pathReg, '');
  // maybe it's a string path already
  } else if (!el && typeof (value) === 'string') {
    pathObject.original = value.replace(pathReg, '');
  }
  return pathObject;
}

/**
 * Enables the `to()` method by preparing the tween object in advance.
 * @param {string} tweenProp is `path` tween property, but it's not needed
 */
function crossCheckCubicMorph(tweenProp/** , value */) {
  if (this.valuesEnd[tweenProp]) {
    const pathCurve1 = this.valuesStart[tweenProp].curve;
    const pathCurve2 = this.valuesEnd[tweenProp].curve;

    if (!pathCurve1 || !pathCurve2
      || (pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length)) {
      const path1 = this.valuesStart[tweenProp].original;
      const path2 = this.valuesEnd[tweenProp].original;
      const curves = equalizeSegments(path1, path2);
      const curve0 = getDrawDirection(curves[0]) !== getDrawDirection(curves[1])
        ? reverseCurve(curves[0])
        : clonePath(curves[0]);

      this.valuesStart[tweenProp].curve = curve0;
      this.valuesEnd[tweenProp].curve = getRotatedCurve(curves[1], curve0);
    }
  }
}

// All Component Functions
const svgCubicMorphFunctions = {
  prepareStart: getCubicMorph,
  prepareProperty: prepareCubicMorph,
  onStart: onStartCubicMorph,
  crossCheck: crossCheckCubicMorph,
};

// Component Full
const svgCubicMorph = {
  component: 'svgCubicMorph',
  property: 'path',
  defaultValue: [],
  Interpolate: { numbers, pathToString },
  functions: svgCubicMorphFunctions,
  // export utils to global for faster execution
  Util: {
    pathToCurve,
    pathToAbsolute,
    pathToString,
    parsePathString,
    getRotatedCurve,
    getRotations,
    equalizeSegments,
    reverseCurve,
    clonePath,
    getDrawDirection,
    segmentCubicFactory,
    splitCubic,
    splitPath,
    fixPath,
    getCurveArray,
  },
};

export default svgCubicMorph;
