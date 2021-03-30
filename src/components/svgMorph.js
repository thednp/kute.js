import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js';
import pathToString from 'svg-path-commander/src/convert/pathToString.js';
import normalizePath from 'svg-path-commander/src/process/normalizePath.js';
import splitPath from 'svg-path-commander/src/process/splitPath.js';
import roundPath from 'svg-path-commander/src/process/roundPath.js';
import invalidPathValue from 'svg-path-commander/src/util/invalidPathValue.js';
import getPathLength from 'svg-path-commander/src/util/getPathLength.js';
import getPointAtLength from 'svg-path-commander/src/util/getPointAtLength.js';
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js';
import epsilon from 'svg-path-commander/src/math/epsilon.js';
import midPoint from 'svg-path-commander/src/math/midPoint.js';
import distanceSquareRoot from 'svg-path-commander/src/math/distanceSquareRoot.js';
import { onStartSVGMorph } from './svgMorphBase.js';
import coords from '../interpolation/coords.js';
import defaultOptions from '../objects/defaultOptions.js';
import selector from '../util/selector.js';

/* SVGMorph = {
  property: 'path',
  defaultValue: [],
  interpolators: {numbers,coords},
  functions = { prepareStart, prepareProperty, onStart, crossCheck }
} */

// Component Interpolation
// function function(array1, array2, length, progress)

// Component Util
// original script flubber
// https://github.com/veltman/flubber

function polygonLength(ring) {
  return ring.reduce((length, point, i) => (i
    ? length + distanceSquareRoot(ring[i - 1], point)
    : 0), 0);
}

function exactRing(pathArray) {
  const ring = [];
  const pathlen = pathArray.length;
  let segment = [];
  let pathCommand = '';
  let pathLength = 0;

  if (!pathArray.length || pathArray[0][0] !== 'M') {
    return false;
  }

  for (let i = 0; i < pathlen; i += 1) {
    segment = pathArray[i];
    [pathCommand] = segment;

    if ((pathCommand === 'M' && i) || pathCommand === 'Z') {
      break; // !!
    } else if ('ML'.indexOf(pathCommand) > -1) {
      ring.push([segment[1], segment[2]]);
    } else {
      return false;
    }
  }

  pathLength = polygonLength(ring);

  return pathlen ? { ring, pathLength } : false;
}

function approximateRing(parsed, maxSegmentLength) {
  const ringPath = splitPath(pathToString(parsed))[0];
  const curvePath = pathToCurve(ringPath, 4);
  const pathLength = getPathLength(curvePath);
  const ring = [];
  let numPoints = 3;
  let point;

  if (maxSegmentLength && !Number.isNaN(maxSegmentLength) && +maxSegmentLength > 0) {
    numPoints = Math.max(numPoints, Math.ceil(pathLength / maxSegmentLength));
  }

  for (let i = 0; i < numPoints; i += 1) {
    point = getPointAtLength(curvePath, (pathLength * i) / numPoints);
    ring.push([point.x, point.y]);
  }

  // Make all rings clockwise
  if (!getDrawDirection(curvePath)) {
    ring.reverse();
  }

  return {
    pathLength,
    ring,
    skipBisect: true,
  };
}

function pathStringToRing(str, maxSegmentLength) {
  const parsed = normalizePath(str, 0);
  return exactRing(parsed) || approximateRing(parsed, maxSegmentLength);
}

function rotateRing(ring, vs) {
  const len = ring.length;
  let min = Infinity;
  let bestOffset;
  let sumOfSquares = 0;
  let spliced;
  let d;
  let p;

  for (let offset = 0; offset < len; offset += 1) {
    sumOfSquares = 0;

    // vs.forEach((p, i) => {
    //   const d = distanceSquareRoot(ring[(offset + i) % len], p);
    //   sumOfSquares += d * d;
    // });
    for (let i = 0; i < vs.length; i += 1) {
      p = vs[i];
      d = distanceSquareRoot(ring[(offset + i) % len], p);
      sumOfSquares += d * d;
    }

    if (sumOfSquares < min) {
      min = sumOfSquares;
      bestOffset = offset;
    }
  }

  if (bestOffset) {
    spliced = ring.splice(0, bestOffset);
    ring.splice(ring.length, 0, ...spliced);
  }
}

function addPoints(ring, numPoints) {
  const desiredLength = ring.length + numPoints;
  // const step = ring.pathLength / numPoints;
  const step = polygonLength(ring) / numPoints;

  let i = 0;
  let cursor = 0;
  let insertAt = step / 2;
  let a;
  let b;
  let segment;

  while (ring.length < desiredLength) {
    a = ring[i];
    b = ring[(i + 1) % ring.length];

    segment = distanceSquareRoot(a, b);

    if (insertAt <= cursor + segment) {
      ring.splice(i + 1, 0, segment
        ? midPoint(a, b, (insertAt - cursor) / segment)
        : a.slice(0));
      insertAt += step;
    } else {
      cursor += segment;
      i += 1;
    }
  }
}

function bisect(ring, maxSegmentLength = Infinity) {
  let a = [];
  let b = [];

  for (let i = 0; i < ring.length; i += 1) {
    a = ring[i];
    b = i === ring.length - 1 ? ring[0] : ring[i + 1];

    // Could splice the whole set for a segment instead, but a bit messy
    while (distanceSquareRoot(a, b) > maxSegmentLength) {
      b = midPoint(a, b, 0.5);
      ring.splice(i + 1, 0, b);
    }
  }
}

function validRing(ring) {
  return Array.isArray(ring)
    && ring.every((point) => Array.isArray(point)
      && point.length === 2
      && !Number.isNaN(point[0])
      && !Number.isNaN(point[1]));
}

function normalizeRing(input, maxSegmentLength) {
  let skipBisect;
  let pathLength;
  let ring = input;

  if (typeof (ring) === 'string') {
    const converted = pathStringToRing(ring, maxSegmentLength);
    ring = converted.ring;
    skipBisect = converted.skipBisect;
    pathLength = converted.pathLength;
  } else if (!Array.isArray(ring)) {
    throw Error(`${invalidPathValue}: ${ring}`);
  }

  const points = ring.slice(0);
  points.pathLength = pathLength;

  if (!validRing(points)) {
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

function getInterpolationPoints(pathArray1, pathArray2, precision) {
  const morphPrecision = precision || defaultOptions.morphPrecision;
  const fromRing = normalizeRing(pathArray1, morphPrecision);
  const toRing = normalizeRing(pathArray2, morphPrecision);
  const diff = fromRing.length - toRing.length;

  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotateRing(fromRing, toRing);

  return [roundPath(fromRing), roundPath(toRing)];
}

// Component functions
function getSVGMorph(/* tweenProp */) {
  return this.element.getAttribute('d');
}

function prepareSVGMorph(tweenProp, value) {
  const pathObject = {};
  // remove newlines, they brake JSON strings sometimes
  const pathReg = new RegExp('\\n', 'ig');
  let elem = null;

  if (value instanceof SVGElement) {
    elem = value;
  } else if (/^\.|^#/.test(value)) {
    elem = selector(value);
  }

  // first make sure we return pre-processed values
  if (typeof (value) === 'object' && value.pathArray) {
    return value;
  } if (elem && ['path', 'glyph'].includes(elem.tagName)) {
    pathObject.original = elem.getAttribute('d').replace(pathReg, '');
  // maybe it's a string path already
  } else if (!elem && typeof (value) === 'string') {
    pathObject.original = value.replace(pathReg, '');
  }

  return pathObject;
}
function crossCheckSVGMorph(prop) {
  if (this.valuesEnd[prop]) {
    const pathArray1 = this.valuesStart[prop].pathArray;
    const pathArray2 = this.valuesEnd[prop].pathArray;
    // skip already processed paths
    // allow the component to work with pre-processed values
    if (!pathArray1 || !pathArray2
      || (pathArray1 && pathArray2 && pathArray1.length !== pathArray2.length)) {
      const p1 = this.valuesStart[prop].original;
      const p2 = this.valuesEnd[prop].original;
      // process morphPrecision
      const morphPrecision = this._morphPrecision
        ? parseInt(this._morphPrecision, 10)
        : defaultOptions.morphPrecision;

      const [path1, path2] = getInterpolationPoints(p1, p2, morphPrecision);
      this.valuesStart[prop].pathArray = path1;
      this.valuesEnd[prop].pathArray = path2;
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
const svgMorph = {
  component: 'svgMorph',
  property: 'path',
  defaultValue: [],
  Interpolate: coords,
  defaultOptions: { morphPrecision: 10, morphIndex: 0 },
  functions: svgMorphFunctions,
  // Export utils to global for faster execution
  Util: {
    addPoints,
    bisect,
    normalizeRing,
    validRing, // component
    getInterpolationPoints,
    pathStringToRing,
    distanceSquareRoot,
    midPoint,
    approximateRing,
    rotateRing,
    pathToString,
    pathToCurve, // svg-path-commander
    getPathLength,
    getPointAtLength,
    getDrawDirection,
    roundPath,
  },
};

export default svgMorph;
