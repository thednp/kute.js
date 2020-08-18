import selector from '../util/selector.js' 
import defaultOptions from '../objects/defaultOptions.js' 
import Components from '../objects/components.js' 
import coords from '../interpolation/coords.js' 
import {onStartSVGMorph} from './svgMorphBase.js'

import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'
import splitPath from 'svg-path-commander/src/util/splitPath.js'
import invalidPathValue from 'svg-path-commander/src/util/invalidPathValue.js'
 
// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers,coords} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Interpolation
// function function(array1, array2, length, progress)

// Component Util
function isFiniteNumber(number) {
  return typeof number === "number" && isFinite(number);
}
function distance(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
  );
}

function pointAlong(a, b, pct) {
  return [a[0] + (b[0] - a[0]) * pct, a[1] + (b[1] - a[1]) * pct];
}

function samePoint(a, b) {
  return distance(a, b) < 1e-9;
}

// flubber
// https://github.com/veltman/flubber
function pathStringToRing(str, maxSegmentLength) {
  let parsed = pathToAbsolute(str);
  return exactRing(parsed) || approximateRing(parsed, maxSegmentLength);
}

function exactRing(segments) {
  let ring = [];

  if (!segments.length || segments[0][0] !== "M") {
    return false;
  }

  for (let i = 0; i < segments.length; i++) {
    let [command, x, y] = segments[i];
    if ((command === "M" && i) || command === "Z") {
      break; // !!
    } else if (command === "M" || command === "L") {
      ring.push([x, y]);
    } else if (command === "H") {
      ring.push([x, ring[ring.length - 1][1]]);
    } else if (command === "V") {
      ring.push([ring[ring.length - 1][0], x]);
    } else {
      return false;
    }
  }

  return ring.length ? { ring } : false;
}

function approximateRing(parsed, maxSegmentLength) {
  let ringPath = splitPath(pathToString(parsed))[0], 
      ring = [], len, testPath, numPoints = 3;

  if (!ringPath) {
    throw (invalidPathValue);
  }

  testPath = measure(ringPath);
  len = testPath.getTotalLength();

  if (
    maxSegmentLength &&
    isFiniteNumber(maxSegmentLength) &&
    maxSegmentLength > 0
  ) {
    numPoints = Math.max(numPoints, Math.ceil(len / maxSegmentLength));
  }

  for (let i = 0; i < numPoints; i++) {
    let p = testPath.getPointAtLength((len * i) / numPoints);
    ring.push([p.x, p.y]);
  }

  return {
    ring,
    skipBisect: true
  };
}
function measure(d) {
  try {
    let path = document.createElementNS('http://www.w3.org/2000/svg',"path");
    path.setAttributeNS(null, "d", d);
    return path;
  } catch (e) {}
  // not a browser
  return false;
}
function rotateRing(ring, vs) {
  let len = ring.length, min = Infinity, bestOffset, sumOfSquares, spliced;

  for (let offset = 0; offset < len; offset++) {
    sumOfSquares = 0;

    vs.forEach(function(p, i) {
      let d = distance(ring[(offset + i) % len], p);
      sumOfSquares += d * d;
    });

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
function polygonLength(polygon) {
  let i = -1, n = polygon.length, b = polygon[n - 1], 
      xa, ya, xb = b[0], yb = b[1], perimeter = 0;

  while (++i < n) {
    xa = xb;
    ya = yb;
    b = polygon[i];
    xb = b[0];
    yb = b[1];
    xa -= xb;
    ya -= yb;
    perimeter += Math.sqrt(xa * xa + ya * ya);
  }

  return perimeter;
}
function polygonArea(polygon) {
  let i = -1, n = polygon.length, a, b = polygon[n - 1], area = 0;

  while (++i < n) {
    a = b;
    b = polygon[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
}
function addPoints(ring, numPoints) {
  const desiredLength = ring.length + numPoints,
        step = polygonLength(ring) / numPoints;

  let i = 0, cursor = 0, insertAt = step / 2;

  while (ring.length < desiredLength) {
    let a = ring[i], b = ring[(i + 1) % ring.length], segment = distance(a, b);

    if (insertAt <= cursor + segment) {
      ring.splice( i + 1, 0, segment ? pointAlong(a, b, (insertAt - cursor) / segment) : a.slice(0) );
      insertAt += step;
      continue;
    }

    cursor += segment;
    i++;
  }
}
function bisect(ring, maxSegmentLength = Infinity) {
  for (let i = 0; i < ring.length; i++) {
    let a = ring[i], b = i === ring.length - 1 ? ring[0] : ring[i + 1];

    // Could splice the whole set for a segment instead, but a bit messy
    while (distance(a, b) > maxSegmentLength) {
      b = pointAlong(a, b, 0.5);
      ring.splice(i + 1, 0, b);
    }
  }
}

function normalizeRing(ring, maxSegmentLength) {
  let points, area, skipBisect;

  if (typeof ring === "string") {
    let converted = pathStringToRing(ring, maxSegmentLength);
    ring = converted.ring;
    skipBisect = converted.skipBisect;
  } else if (!Array.isArray(ring)) {
    throw (invalidPathValue);
  }

  points = ring.slice(0);

  if (!validRing(points)) {
    throw (invalidPathValue);
  }

  // TODO skip this test to avoid scale issues?
  // Chosen epsilon (1e-6) is problematic for small coordinate range
  if (points.length > 1 && samePoint(points[0], points[points.length - 1])) {
    points.pop();
  }

  area = polygonArea(points);

  // Make all rings clockwise
  if (area > 0) {
    points.reverse();
  }

  if (
    !skipBisect &&
    maxSegmentLength &&
    isFiniteNumber(maxSegmentLength) &&
    maxSegmentLength > 0
  ) {
    bisect(points, maxSegmentLength);
  }

  return points;
}
function validRing(ring) {
  return ring.every(function(point) {
    return (
      Array.isArray(point) &&
      point.length >= 2 &&
      isFiniteNumber(point[0]) &&
      isFiniteNumber(point[1])
    );
  });
}

function getInterpolationPoints(fromShape, toShape, morphPrecision) {
  morphPrecision = morphPrecision || defaultOptions.morphPrecision
  let fromRing = normalizeRing(fromShape, morphPrecision),
      toRing = normalizeRing(toShape, morphPrecision),
      diff = fromRing.length - toRing.length;

  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotateRing(fromRing, toRing);
  return [fromRing,toRing]
}


// Component functions
function getSVGMorph(tweenProp){
  return this.element.getAttribute('d');
}
function prepareSVGMorph(tweenProp,value){
  const pathObject = {}, elem = value instanceof Element ? value : /^\.|^\#/.test(value) ? selector(value) : null,
        pathReg = new RegExp('\\n','ig'); // remove newlines, they brake JSON strings sometimes

  // first make sure we return pre-processed values
  if ( typeof(value) === 'object' && value.pathArray ) {
    return value;
  } else if ( elem && /path|glyph/.test(elem.tagName) ) {
    pathObject.original = elem.getAttribute('d').replace(pathReg,'');
  } else if ( !elem && /[a-z][^a-z]*/ig.test(value) ) { // maybe it's a string path already
    pathObject.original = value.replace(pathReg,'');
  }
  return pathObject;
}
function crossCheckSVGMorph(prop){
  if ( this.valuesEnd[prop]){
    let pathArray1 = this.valuesStart[prop].pathArray,
        pathArray2 = this.valuesEnd[prop].pathArray
    // skip already processed paths
    // allow the component to work with pre-processed values
    if ( !pathArray1 || !pathArray2 || pathArray1 && pathArray2 && pathArray1.length !== pathArray2.length ) {
      let p1 = this.valuesStart[prop].original,
          p2 = this.valuesEnd[prop].original,
          // process morphPrecision
          morphPrecision = this._morphPrecision ? parseInt(this._morphPrecision) : defaultOptions.morphPrecision,
          paths = getInterpolationPoints(p1,p2,morphPrecision);

      this.valuesStart[prop].pathArray = paths[0];
      this.valuesEnd[prop].pathArray = paths[1];
    }
  }
}

// All Component Functions
const svgMorphFunctions = {
  prepareStart: getSVGMorph,
  prepareProperty: prepareSVGMorph,
  onStart: onStartSVGMorph,
  crossCheck: crossCheckSVGMorph
}


// Component Full
const svgMorph = {
  component: 'svgMorph',
  property: 'path',
  defaultValue: [],
  Interpolate: coords,
  defaultOptions: {morphPrecision : 10, morphIndex:0},
  functions: svgMorphFunctions,
  // Export utils to global for faster execution
  Util: {
    isFiniteNumber,distance,pointAlong,samePoint,
    pathToAbsolute,pathToString,pathStringToRing,
    exactRing,approximateRing,measure,rotateRing,polygonLength,polygonArea,
    addPoints,bisect,normalizeRing,validRing,getInterpolationPoints
  }
}

export default svgMorph

Components.SVGMorph = svgMorph
