import parsePathString from 'svg-path-commander/src/process/parsePathString.js';
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js';
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js';
import pathToString from 'svg-path-commander/src/convert/pathToString.js';
import reverseCurve from 'svg-path-commander/src/process/reverseCurve.js';
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js';
import clonePath from 'svg-path-commander/src/process/clonePath.js';
import splitCubic from 'svg-path-commander/src/process/splitCubic.js';
import splitPath from 'svg-path-commander/src/process/splitPath.js';
import getSegCubicLength from 'svg-path-commander/src/util/getSegCubicLength.js';
import distanceSquareRoot from 'svg-path-commander/src/math/distanceSquareRoot.js';
import { onStartCubicMorph } from './svgCubicMorphBase.js';
import numbers from '../interpolation/numbers.js';
import selector from '../util/selector.js';

/* SVGMorph = {
  property: 'path',
  defaultValue: [],
  interpolators: {numbers},
  functions = { prepareStart, prepareProperty, onStart, crossCheck }
} */

// Component Util
function getCurveArray(pathString) {
  return pathToCurve(splitPath(pathToString(pathToAbsolute(pathString)))[0])
    .map((segment, i, pathArray) => {
      const segmentData = i && pathArray[i - 1].slice(-2).concat(segment.slice(1));
      const curveLength = i ? getSegCubicLength.apply(0, segmentData) : 0;

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

function getRotations(a) {
  const segCount = a.length;
  const pointCount = segCount - 1;

  return a.map((f, idx) => a.map((p, i) => {
    let oldSegIdx = idx + i;
    let seg;

    if (i === 0 || (a[oldSegIdx] && a[oldSegIdx][0] === 'M')) {
      seg = a[oldSegIdx];
      return ['M'].concat(seg.slice(-2));
    }
    if (oldSegIdx >= segCount) oldSegIdx -= pointCount;
    return a[oldSegIdx];
  }));
}

function getRotatedCurve(a, b) {
  const segCount = a.length - 1;
  const lineLengths = [];
  let computedIndex = 0;
  let sumLensSqrd = 0;
  const rotations = getRotations(a);

  rotations.forEach((r, i) => {
    a.slice(1).forEach((s, j) => {
      sumLensSqrd += distanceSquareRoot(a[(i + j) % segCount].slice(-2), b[j % segCount].slice(-2));
    });
    lineLengths[i] = sumLensSqrd;
    sumLensSqrd = 0;
  });

  computedIndex = lineLengths.indexOf(Math.min.apply(null, lineLengths));

  return rotations[computedIndex];
}

// Component Functions
function getCubicMorph(/* tweenProp, value */) {
  return this.element.getAttribute('d');
}
function prepareCubicMorph(tweenProp, value) {
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
function crossCheckCubicMorph(tweenProp) {
  if (this.valuesEnd[tweenProp]) {
    const pathCurve1 = this.valuesStart[tweenProp].curve;
    const pathCurve2 = this.valuesEnd[tweenProp].curve;

    if (!pathCurve1 || !pathCurve2
      || (pathCurve1 && pathCurve2 && pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length)) {
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
    splitCubic,
    getCurveArray,
  },
};

export default svgCubicMorph;
