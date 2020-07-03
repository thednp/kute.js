import selector from '../util/selector.js' 
import defaultOptions from '../objects/defaultOptions.js' 
import Components from '../objects/components.js' 
import coords from '../interpolation/coords.js' 
import {onStartSVGMorph} from './svgMorphBase.js'
 
// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers,coords} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Interpolation
// function function(array1, array2, length, progress)


// Component Util
const INVALID_INPUT = 'Invalid path value'

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

// SVGPATH
// https://github.com/fontello/svgpath/
const paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

const SPECIAL_SPACES = [
  0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
  0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF
];

function isSpace(ch) {
  return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) || // Line terminators
    // White spaces
    (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
    (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0);
}

function isCommand(code) {
  /*eslint-disable no-bitwise*/
  switch (code | 0x20) {
    case 0x6D/* m */:
    case 0x7A/* z */:
    case 0x6C/* l */:
    case 0x68/* h */:
    case 0x76/* v */:
    case 0x63/* c */:
    case 0x73/* s */:
    case 0x71/* q */:
    case 0x74/* t */:
    case 0x61/* a */:
    case 0x72/* r */:
      return true;
  }
  return false;
}


function isArc(code) {
  return (code | 0x20) === 0x61;
}

function isDigit(code) {
  return (code >= 48 && code <= 57);   // 0..9
}

function isDigitStart(code) {
  return (code >= 48 && code <= 57) || /* 0..9 */
          code === 0x2B || /* + */
          code === 0x2D || /* - */
          code === 0x2E;   /* . */
}

function State(path) {
  this.index  = 0;
  this.path   = path;
  this.max    = path.length;
  this.result = [];
  this.param  = 0.0;
  this.err    = '';
  this.segmentStart = 0;
  this.data   = [];
}

function skipSpaces(state) {
  while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
    state.index++;
  }
}
function scanFlag(state) {
  let ch = state.path.charCodeAt(state.index);

  if (ch === 0x30/* 0 */) {
    state.param = 0;
    state.index++;
    return;
  }

  if (ch === 0x31/* 1 */) {
    state.param = 1;
    state.index++;
    return;
  }

  // state.err = 'SvgPath: arc flag can be 0 or 1 only (at pos ' + state.index + ')';
  state.err = `KUTE.js - ${INVALID_INPUT}`;
}
function scanParam(state) {
  let start = state.index,
      index = start,
      max = state.max,
      zeroFirst = false,
      hasCeiling = false,
      hasDecimal = false,
      hasDot = false,
      ch;

  if (index >= max) {
    // state.err = 'SvgPath: missed param (at pos ' + index + ')';.
    state.err = `KUTE.js - ${INVALID_INPUT}`;

    return;
  }
  ch = state.path.charCodeAt(index);

  if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
    index++;
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  // This logic is shamelessly borrowed from Esprima
  // https://github.com/ariya/esprimas
  //
  if (!isDigit(ch) && ch !== 0x2E/* . */) {
    // state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
    state.err = `KUTE.js - ${INVALID_INPUT}`;

    return;
  }

  if (ch !== 0x2E/* . */) {
    zeroFirst = (ch === 0x30/* 0 */);
    index++;

    ch = (index < max) ? state.path.charCodeAt(index) : 0;

    if (zeroFirst && index < max) {
      // decimal number starts with '0' such as '09' is illegal.
      if (ch && isDigit(ch)) {
        // state.err = 'SvgPath: numbers started with `0` such as `09` are illegal (at pos ' + start + ')';
        state.err = `KUTE.js - ${INVALID_INPUT}`;

        return;
      }
    }

    while (index < max && isDigit(state.path.charCodeAt(index))) {
      index++;
      hasCeiling = true;
    }
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  if (ch === 0x2E/* . */) {
    hasDot = true;
    index++;
    while (isDigit(state.path.charCodeAt(index))) {
      index++;
      hasDecimal = true;
    }
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  if (ch === 0x65/* e */ || ch === 0x45/* E */) {
    if (hasDot && !hasCeiling && !hasDecimal) {
      // state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      state.err = `KUTE.js - ${INVALID_INPUT}`;

      return;
    }

    index++;

    ch = (index < max) ? state.path.charCodeAt(index) : 0;
    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index++;
    }
    if (index < max && isDigit(state.path.charCodeAt(index))) {
      while (index < max && isDigit(state.path.charCodeAt(index))) {
        index++;
      }
    } else {
      // state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      state.err = `KUTE.js - ${INVALID_INPUT}`;

      return;
    }
  }

  state.index = index;
  state.param = parseFloat(state.path.slice(start, index)) + 0.0;
}
function finalizeSegment(state) {
  let cmd, cmdLC;

  // Process duplicated commands (without comand name)

  // This logic is shamelessly borrowed from Raphael
  // https://github.com/DmitryBaranovskiy/raphael/
  //
  cmd   = state.path[state.segmentStart];
  cmdLC = cmd.toLowerCase();

  let params = state.data;

  if (cmdLC === 'm' && params.length > 2) {
    state.result.push([ cmd, params[0], params[1] ]);
    params = params.slice(2);
    cmdLC = 'l';
    cmd = (cmd === 'm') ? 'l' : 'L';
  }

  if (cmdLC === 'r') {
    state.result.push([ cmd ].concat(params));
  } else {

    while (params.length >= paramCounts[cmdLC]) {
      state.result.push([ cmd ].concat(params.splice(0, paramCounts[cmdLC])));
      if (!paramCounts[cmdLC]) {
        break;
      }
    }
  }
}

function scanSegment(state) {
  let max = state.max, cmdCode, is_arc, comma_found, need_params, i;

  state.segmentStart = state.index;
  cmdCode = state.path.charCodeAt(state.index);
  is_arc = isArc(cmdCode);

  if (!isCommand(cmdCode)) {
    // state.err = 'SvgPath: bad command ' + state.path[state.index] + ' (at pos ' + state.index + ')';
    state.err = `KUTE.js - ${INVALID_INPUT}`;

    return;
  }

  need_params = paramCounts[state.path[state.index].toLowerCase()];

  state.index++;
  skipSpaces(state);

  state.data = [];

  if (!need_params) {
    // Z
    finalizeSegment(state);
    return;
  }

  comma_found = false;

  for (;;) {
    for (i = need_params; i > 0; i--) {
      if (is_arc && (i === 3 || i === 4)) scanFlag(state);
      else scanParam(state);

      if (state.err.length) {
        return;
      }
      state.data.push(state.param);

      skipSpaces(state);
      comma_found = false;

      if (state.index < max && state.path.charCodeAt(state.index) === 0x2C/* , */) {
        state.index++;
        skipSpaces(state);
        comma_found = true;
      }
    }

    // after ',' param is mandatory
    if (comma_found) {
      continue;
    }

    if (state.index >= state.max) {
      break;
    }

    // Stop on next segment
    if (!isDigitStart(state.path.charCodeAt(state.index))) {
      break;
    }
  }

  finalizeSegment(state);
}

// Returns array of segments
function pathParse(svgPath) {
  let state = new State(svgPath), max = state.max;

  skipSpaces(state);

  while (state.index < max && !state.err.length) {
    scanSegment(state);
  }

  if (state.err.length) {
    state.result = [];

  } else if (state.result.length) {

    if ('mM'.indexOf(state.result[0][0]) < 0) {
      // state.err = 'SvgPath: string should start with `M` or `m`';
      state.err = `KUTE.js - ${INVALID_INPUT}`;

      state.result = [];
    } else {
      state.result[0][0] = 'M';
    }
  }

  return {
    err: state.err,
    segments: state.result
  };
}

class SvgPath {
  constructor(path){
    if (!(this instanceof SvgPath)) { return new SvgPath(path); }
  
    let pstate = pathParse(path);
  
    // Array of path segments.
    // Each segment is array [command, param1, param2, ...]
    this.segments = pstate.segments;
  
    // Error message on parse error.
    this.err      = pstate.err;
  }
  // Apply iterator function to all segments. If function returns result,
  // current segment will be replaced to array of returned segments.
  // If empty array is returned, current regment will be deleted.
  //
  iterate(iterator) {
    let segments = this.segments,
        replacements = {},
        needReplace = false,
        lastX = 0,
        lastY = 0,
        countourStartX = 0,
        countourStartY = 0,
        newSegments;

    segments.map( (s,index) => {

      let res = iterator(s, index, lastX, lastY);

      if (Array.isArray(res)) {
        replacements[index] = res;
        needReplace = true;
      }

      let isRelative = (s[0] === s[0].toLowerCase());

      // calculate absolute X and Y
      switch (s[0]) {
        case 'm':
        case 'M':
          lastX = s[1] + (isRelative ? lastX : 0);
          lastY = s[2] + (isRelative ? lastY : 0);
          countourStartX = lastX;
          countourStartY = lastY;
          return;

        case 'h':
        case 'H':
          lastX = s[1] + (isRelative ? lastX : 0);
          return;

        case 'v':
        case 'V':
          lastY = s[1] + (isRelative ? lastY : 0);
          return;

        case 'z':
        case 'Z':
          // That make sence for multiple contours
          lastX = countourStartX;
          lastY = countourStartY;
          return;

        default:
          lastX = s[s.length - 2] + (isRelative ? lastX : 0);
          lastY = s[s.length - 1] + (isRelative ? lastY : 0);
      }
    });

    // Replace segments if iterator return results

    if (!needReplace) { return this; }

    newSegments = [];

    segments.map((s,i)=>{
      if (typeof replacements[i] !== 'undefined') {
        replacements[i].map((r)=>{
          newSegments.push(r);
        })
      } else {
        newSegments.push(s);
      }
    })

    this.segments = newSegments;
    return this;
  }

  // Converts segments from relative to absolute
  abs() {
    this.iterate(function (s, index, x, y) {
      let name = s[0],
          nameUC = name.toUpperCase(),
          i;

      // Skip absolute commands
      if (name === nameUC) { return; }

      s[0] = nameUC;

      switch (name) {
        case 'v':
          // v has shifted coords parity
          s[1] += y;
          return;

        case 'a':
          // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
          // touch x, y only
          s[6] += x;
          s[7] += y;
          return;

        default:
          for (i = 1; i < s.length; i++) {
            s[i] += i % 2 ? x : y; // odd values are X, even - Y
          }
      }
    }, true);

    return this;
  }
  // Convert processed SVG Path back to string
  //
  toString () {
    let elements = [], skipCmd, cmd;

    this.segments.map( (s,i) => {
      // remove repeating commands names
      cmd = s[0];
      skipCmd = i > 0 && cmd !== 'm' && cmd !== 'M' && cmd === this.segments[i - 1][0];
      elements = elements.concat(skipCmd ? s.slice(1) : s);
    })

    return elements.join(' ')
      // Optimizations: remove spaces around commands & before `-`
      //
      // We could also remove leading zeros for `0.5`-like values,
      // but their count is too small to spend time for.
      .replace(/ ?([achlmqrstvz]) ?/gi, '$1')
      .replace(/ \-/g, '-')
      // workaround for FontForge SVG importing bug
      .replace(/zm/g, 'z m');
  }
}
// flubber
// https://github.com/veltman/flubber
function split(parsed) {
  return parsed
    .toString()
    .split("M")
    .map((d, i) => {
      d = d.trim();
      return i && d ? "M" + d : d;
    })
    .filter(d => d);
}

function pathStringToRing(str, maxSegmentLength) {
  let parsed = new SvgPath(str).abs();

  return exactRing(parsed) || approximateRing(parsed, maxSegmentLength);
}

function exactRing(parsed) {
  let segments = parsed.segments || [],
    ring = [];

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
  let ringPath = split(parsed)[0], ring = [], len, testPath, numPoints = 3;

  if (!ringPath) {
    throw new TypeError(INVALID_INPUT);
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
    throw new TypeError(INVALID_INPUT);
  }

  points = ring.slice(0);

  if (!validRing(points)) {
    throw new TypeError(INVALID_INPUT);
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
    INVALID_INPUT,isFiniteNumber,distance,pointAlong,samePoint,paramCounts,SPECIAL_SPACES,isSpace,isCommand,isArc,isDigit,
    isDigitStart,State,skipSpaces,scanFlag,scanParam,finalizeSegment,scanSegment,pathParse,SvgPath,split,pathStringToRing,
    exactRing,approximateRing,measure,rotateRing,polygonLength,polygonArea,addPoints,bisect,normalizeRing,validRing,getInterpolationPoints}
}

export default svgMorph

Components.SVGMorph = svgMorph
