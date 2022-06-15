import pathToCurve from 'svg-path-commander/src/convert/pathToCurve';
import pathToString from 'svg-path-commander/src/convert/pathToString';
import normalizePath from 'svg-path-commander/src/process/normalizePath';
import splitPath from 'svg-path-commander/src/process/splitPath';
import roundPath from 'svg-path-commander/src/process/roundPath';
import getTotalLength from 'svg-path-commander/src/util/getTotalLength';
import invalidPathValue from 'svg-path-commander/src/parser/invalidPathValue';
import getPointAtLength from 'svg-path-commander/src/util/getPointAtLength';
import polygonArea from 'svg-path-commander/src/math/polygonArea';
import polygonLength from 'svg-path-commander/src/math/polygonLength';
import epsilon from 'svg-path-commander/src/math/epsilon';
import midPoint from 'svg-path-commander/src/math/midPoint';
import distanceSquareRoot from 'svg-path-commander/src/math/distanceSquareRoot';
import { onStartSVGMorph } from './svgMorphBase';
import coords from '../interpolation/coords';
import defaultOptions from '../objects/defaultOptions';
import selector from '../util/selector';

// Component Util
// original script flubber
// https://github.com/veltman/flubber

/**
 * Returns an existing polygon or false if it's not a polygon.
 * @param {SVGPath.pathArray} pathArray target `pathArray`
 * @returns {KUTE.exactPolygon | false} the resulted polygon
 */
function exactPolygon(pathArray) {
  const polygon = [];
  const pathlen = pathArray.length;
  let segment = [];
  let pathCommand = '';

  if (!pathArray.length || pathArray[0][0] !== 'M') {
    return false;
  }

  for (let i = 0; i < pathlen; i += 1) {
    segment = pathArray[i];
    [pathCommand] = segment;

    if ((pathCommand === 'M' && i) || pathCommand === 'Z') {
      break; // !!
    } else if ('ML'.includes(pathCommand)) {
      polygon.push([segment[1], segment[2]]);
    } else {
      return false;
    }
  }

  return pathlen ? { polygon } : false;
}

/**
 * Returns a new polygon polygon.
 * @param {SVGPath.pathArray} parsed target `pathArray`
 * @param {number} maxLength the maximum segment length
 * @returns {KUTE.exactPolygon} the resulted polygon
 */
function approximatePolygon(parsed, maxLength) {
  const ringPath = splitPath(parsed)[0];
  const normalPath = normalizePath(ringPath);
  const pathLength = getTotalLength(normalPath);
  const polygon = [];
  let numPoints = 3;
  let point;

  if (maxLength && !Number.isNaN(maxLength) && +maxLength > 0) {
    numPoints = Math.max(numPoints, Math.ceil(pathLength / maxLength));
  }

  for (let i = 0; i < numPoints; i += 1) {
    point = getPointAtLength(normalPath, (pathLength * i) / numPoints);
    polygon.push([point.x, point.y]);
  }

  // Make all rings clockwise
  if (polygonArea(polygon) > 0) {
    polygon.reverse();
  }

  return {
    polygon,
    skipBisect: true,
  };
}

/**
 * Parses a path string and returns a polygon array.
 * @param {string} str path string
 * @param {number} maxLength maximum amount of points
 * @returns {KUTE.exactPolygon} the polygon array we need
 */
function pathStringToPolygon(str, maxLength) {
  const parsed = normalizePath(str);
  return exactPolygon(parsed) || approximatePolygon(parsed, maxLength);
}

/**
 * Rotates a polygon to better match its pair.
 * @param {KUTE.polygonMorph} polygon the target polygon
 * @param {KUTE.polygonMorph} vs the reference polygon
 */
function rotatePolygon(polygon, vs) {
  const len = polygon.length;
  let min = Infinity;
  let bestOffset;
  let sumOfSquares = 0;
  let spliced;
  let d;
  let p;

  for (let offset = 0; offset < len; offset += 1) {
    sumOfSquares = 0;

    for (let i = 0; i < vs.length; i += 1) {
      p = vs[i];
      d = distanceSquareRoot(polygon[(offset + i) % len], p);
      sumOfSquares += d * d;
    }

    if (sumOfSquares < min) {
      min = sumOfSquares;
      bestOffset = offset;
    }
  }

  if (bestOffset) {
    spliced = polygon.splice(0, bestOffset);
    polygon.splice(polygon.length, 0, ...spliced);
  }
}

/**
 * Sample additional points for a polygon to better match its pair.
 * @param {KUTE.polygonObject} polygon the target polygon
 * @param {number} numPoints the amount of points needed
 */
function addPoints(polygon, numPoints) {
  const desiredLength = polygon.length + numPoints;
  const step = polygonLength(polygon) / numPoints;

  let i = 0;
  let cursor = 0;
  let insertAt = step / 2;
  let a;
  let b;
  let segment;

  while (polygon.length < desiredLength) {
    a = polygon[i];
    b = polygon[(i + 1) % polygon.length];

    segment = distanceSquareRoot(a, b);

    if (insertAt <= cursor + segment) {
      polygon.splice(i + 1, 0, segment
        ? midPoint(a, b, (insertAt - cursor) / segment)
        : a.slice(0));
      insertAt += step;
    } else {
      cursor += segment;
      i += 1;
    }
  }
}

/**
 * Split segments of a polygon until it reaches a certain
 * amount of points.
 * @param {number[][]} polygon the target polygon
 * @param {number} maxSegmentLength the maximum amount of points
 */
function bisect(polygon, maxSegmentLength = Infinity) {
  let a = [];
  let b = [];

  for (let i = 0; i < polygon.length; i += 1) {
    a = polygon[i];
    b = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];

    // Could splice the whole set for a segment instead, but a bit messy
    while (distanceSquareRoot(a, b) > maxSegmentLength) {
      b = midPoint(a, b, 0.5);
      polygon.splice(i + 1, 0, b);
    }
  }
}

/**
 * Checks the validity of a polygon.
 * @param {KUTE.polygonMorph} polygon the target polygon
 * @returns {boolean} the result of the check
 */
function validPolygon(polygon) {
  return Array.isArray(polygon)
    && polygon.every((point) => Array.isArray(point)
      && point.length === 2
      && !Number.isNaN(point[0])
      && !Number.isNaN(point[1]));
}

/**
 * Returns a new polygon and its length from string or another `Array`.
 * @param {KUTE.polygonMorph | string} input the target polygon
 * @param {number} maxSegmentLength the maximum amount of points
 * @returns {KUTE.polygonMorph} normalized polygon
 */
function getPolygon(input, maxSegmentLength) {
  let skipBisect;
  let polygon;

  if (typeof (input) === 'string') {
    const converted = pathStringToPolygon(input, maxSegmentLength);
    ({ polygon, skipBisect } = converted);
  } else if (!Array.isArray(input)) {
    throw Error(`${invalidPathValue}: ${input}`);
  }

  /** @type {KUTE.polygonMorph} */
  const points = [...polygon];

  if (!validPolygon(points)) {
    throw Error(`${invalidPathValue}: ${points}`);
  }

  // TODO skip this test to avoid scale issues?
  // Chosen epsilon (1e-6) is problematic for small coordinate range, we now use 1e-9
  if (points.length > 1 && distanceSquareRoot(points[0], points[points.length - 1]) < epsilon) {
    points.pop();
  }

  if (!skipBisect && maxSegmentLength
    && !Number.isNaN(maxSegmentLength) && (+maxSegmentLength) > 0) {
    bisect(points, maxSegmentLength);
  }

  return points;
}

/**
 * Returns two new polygons ready to tween.
 * @param {string} path1 the first path string
 * @param {string} path2 the second path string
 * @param {number} precision the morphPrecision option value
 * @returns {KUTE.polygonMorph[]} the two polygons
 */
function getInterpolationPoints(path1, path2, precision) {
  const morphPrecision = precision || defaultOptions.morphPrecision;
  const fromRing = getPolygon(path1, morphPrecision);
  const toRing = getPolygon(path2, morphPrecision);
  const diff = fromRing.length - toRing.length;

  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotatePolygon(fromRing, toRing);

  return [roundPath(fromRing), roundPath(toRing)];
}

// Component functions
/**
 * Returns the current `d` attribute value.
 * @returns {string} the `d` attribute value
 */
function getSVGMorph(/* tweenProp */) {
  return this.element.getAttribute('d');
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string | KUTE.polygonObject} value the property value
 * @returns {KUTE.polygonObject} the property tween object
 */
function prepareSVGMorph(/* tweenProp */_, value) {
  const pathObject = {};
  // remove newlines, they brake JSON strings sometimes
  const pathReg = new RegExp('\\n', 'ig');
  let elem = null;

  if (value instanceof SVGPathElement) {
    elem = value;
  } else if (/^\.|^#/.test(value)) {
    elem = selector(value);
  }

  // first make sure we return pre-processed values
  if (typeof (value) === 'object' && value.polygon) {
    return value;
  } if (elem && ['path', 'glyph'].includes(elem.tagName)) {
    pathObject.original = elem.getAttribute('d').replace(pathReg, '');
  // maybe it's a string path already
  } else if (!elem && typeof (value) === 'string') {
    pathObject.original = value.replace(pathReg, '');
  }

  return pathObject;
}

/**
 * Enables the `to()` method by preparing the tween object in advance.
 * @param {string} prop the `path` property name
 */
function crossCheckSVGMorph(prop) {
  if (this.valuesEnd[prop]) {
    const pathArray1 = this.valuesStart[prop].polygon;
    const pathArray2 = this.valuesEnd[prop].polygon;
    // skip already processed paths
    // allow the component to work with pre-processed values
    if (!pathArray1 || !pathArray2 || (pathArray1.length !== pathArray2.length)) {
      const p1 = this.valuesStart[prop].original;
      const p2 = this.valuesEnd[prop].original;
      // process morphPrecision
      const morphPrecision = this._morphPrecision
        ? parseInt(this._morphPrecision, 10)
        : defaultOptions.morphPrecision;

      const [path1, path2] = getInterpolationPoints(p1, p2, morphPrecision);
      this.valuesStart[prop].polygon = path1;
      this.valuesEnd[prop].polygon = path2;
    }
  }
}

// All Component Functions
const svgMorphFunctions = {
  prepareStart: getSVGMorph,
  prepareProperty: prepareSVGMorph,
  onStart: onStartSVGMorph,
  crossCheck: crossCheckSVGMorph,
};

// Component Full
const SVGMorph = {
  component: 'svgMorph',
  property: 'path',
  defaultValue: [],
  Interpolate: coords,
  defaultOptions: { morphPrecision: 10 },
  functions: svgMorphFunctions,
  // Export utils to global for faster execution
  Util: {
    // component
    addPoints,
    bisect,
    getPolygon,
    validPolygon,
    getInterpolationPoints,
    pathStringToPolygon,
    distanceSquareRoot,
    midPoint,
    approximatePolygon,
    rotatePolygon,
    // svg-path-commander
    pathToString,
    pathToCurve,
    getTotalLength,
    getPointAtLength,
    polygonArea,
    roundPath,
  },
};

export default SVGMorph;
