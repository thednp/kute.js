import getStyleForProperty from '../process/getStyleForProperty.js';
import numbers from '../interpolation/numbers.js';
import { onStartDraw } from './svgDrawBase.js';

/* svgDraw = {
  property: 'draw',
  defaultValue,
  Interpolate: {numbers} },
  functions = { prepareStart, prepareProperty, onStart }
} */

// Component Util
function percent(v, l) {
  return (parseFloat(v) / 100) * l;
}

// http://stackoverflow.com/a/30376660
// returns the length of a Rect
function getRectLength(el) {
  const w = el.getAttribute('width');
  const h = el.getAttribute('height');
  return (w * 2) + (h * 2);
}

// getPolygonLength / getPolylineLength
// returns the length of the Polygon / Polyline
function getPolyLength(el) {
  const points = el.getAttribute('points').split(' ');

  let len = 0;
  if (points.length > 1) {
    const coord = (p) => {
      const c = p.split(',');
      if (c.length !== 2) { return 0; } // return undefined
      if (Number.isNaN(c[0] * 1) || Number.isNaN(c[1] * 1)) { return 0; }
      return [parseFloat(c[0]), parseFloat(c[1])];
    };

    const dist = (c1, c2) => {
      if (c1 !== undefined && c2 !== undefined) {
        return Math.sqrt((c2[0] - c1[0]) ** 2 + (c2[1] - c1[1]) ** 2);
      }
      return 0;
    };

    if (points.length > 2) {
      for (let i = 0; i < points.length - 1; i += 1) {
        len += dist(coord(points[i]), coord(points[i + 1]));
      }
    }
    len += el.tagName === 'polygon'
      ? dist(coord(points[0]), coord(points[points.length - 1])) : 0;
  }
  return len;
}

// return the length of the line
function getLineLength(el) {
  const x1 = el.getAttribute('x1');
  const x2 = el.getAttribute('x2');
  const y1 = el.getAttribute('y1');
  const y2 = el.getAttribute('y2');
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// return the length of the circle
function getCircleLength(el) {
  const r = el.getAttribute('r');
  return 2 * Math.PI * r;
}

// returns the length of an ellipse
function getEllipseLength(el) {
  const rx = el.getAttribute('rx');
  const ry = el.getAttribute('ry');
  const len = 2 * rx;
  const wid = 2 * ry;
  return ((Math.sqrt(0.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
}

// returns the result of any of the below functions
function getTotalLength(el) {
  if (el.tagName === 'rect') {
    return getRectLength(el);
  } if (el.tagName === 'circle') {
    return getCircleLength(el);
  } if (el.tagName === 'ellipse') {
    return getEllipseLength(el);
  } if (['polygon', 'polyline'].includes(el.tagName)) {
    return getPolyLength(el);
  } if (el.tagName === 'line') {
    return getLineLength(el);
  }
  // ESLint
  return 0;
}

function getDraw(element, value) {
  const length = /path|glyph/.test(element.tagName)
    ? element.getTotalLength()
    : getTotalLength(element);
  let start;
  let end;
  let dasharray;
  let offset;

  if (value instanceof Object) {
    return value;
  } if (typeof value === 'string') {
    const v = value.split(/,|\s/);
    start = /%/.test(v[0]) ? percent(v[0].trim(), length) : parseFloat(v[0]);
    end = /%/.test(v[1]) ? percent(v[1].trim(), length) : parseFloat(v[1]);
  } else if (typeof value === 'undefined') {
    offset = parseFloat(getStyleForProperty(element, 'stroke-dashoffset'));
    dasharray = getStyleForProperty(element, 'stroke-dasharray').split(',');

    start = 0 - offset;
    end = parseFloat(dasharray[0]) + start || length;
  }
  return { s: start, e: end, l: length };
}

function resetDraw(elem) {
  elem.style.strokeDashoffset = '';
  elem.style.strokeDasharray = '';
}

// Component Functions
function getDrawValue(/* prop, value */) {
  return getDraw(this.element);
}
function prepareDraw(a, o) {
  return getDraw(this.element, o);
}

// All Component Functions
const svgDrawFunctions = {
  prepareStart: getDrawValue,
  prepareProperty: prepareDraw,
  onStart: onStartDraw,
};

// Component Full
const svgDraw = {
  component: 'svgDraw',
  property: 'draw',
  defaultValue: '0% 0%',
  Interpolate: { numbers },
  functions: svgDrawFunctions,
  // Export to global for faster execution
  Util: {
    getRectLength,
    getPolyLength,
    getLineLength,
    getCircleLength,
    getEllipseLength,
    getTotalLength,
    resetDraw,
    getDraw,
    percent,
  },
};

export default svgDraw;
