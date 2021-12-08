import getStyleForProperty from '../process/getStyleForProperty';
import numbers from '../interpolation/numbers';
import { onStartDraw } from './svgDrawBase';

// Component Util
/**
 * Convert a `<path>` length percent value to absolute.
 * @param {string} v raw value
 * @param {number} l length value
 * @returns {number} the absolute value
 */
function percent(v, l) {
  return (parseFloat(v) / 100) * l;
}

/**
 * Returns the `<rect>` length.
 * It doesn't compute `rx` and / or `ry` of the element.
 * @see http://stackoverflow.com/a/30376660
 * @param {SVGRectElement} el target element
 * @returns {number} the `<rect>` length
 */
function getRectLength(el) {
  const w = el.getAttribute('width');
  const h = el.getAttribute('height');
  return (w * 2) + (h * 2);
}

/**
 * Returns the `<polyline>` / `<polygon>` length.
 * @param {SVGPolylineElement | SVGPolygonElement} el target element
 * @returns {number} the element length
 */
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

/**
 * Returns the `<line>` length.
 * @param {SVGLineElement} el target element
 * @returns {number} the element length
 */
function getLineLength(el) {
  const x1 = el.getAttribute('x1');
  const x2 = el.getAttribute('x2');
  const y1 = el.getAttribute('y1');
  const y2 = el.getAttribute('y2');
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Returns the `<circle>` length.
 * @param {SVGCircleElement} el target element
 * @returns {number} the element length
 */
function getCircleLength(el) {
  const r = el.getAttribute('r');
  return 2 * Math.PI * r;
}

// returns the length of an ellipse
/**
 * Returns the `<ellipse>` length.
 * @param {SVGEllipseElement} el target element
 * @returns {number} the element length
 */
function getEllipseLength(el) {
  const rx = el.getAttribute('rx');
  const ry = el.getAttribute('ry');
  const len = 2 * rx;
  const wid = 2 * ry;
  return ((Math.sqrt(0.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
}

/**
 * Returns the shape length.
 * @param {SVGPathCommander.shapeTypes} el target element
 * @returns {number} the element length
 */
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

/**
 * Returns the property tween object.
 * @param {SVGPathCommander.shapeTypes} element the target element
 * @param {string | KUTE.drawObject} value the property value
 * @returns {KUTE.drawObject} the property tween object
 */
function getDraw(element, value) {
  const length = /path|glyph/.test(element.tagName)
    ? element.getTotalLength()
    : getTotalLength(element);
  let start;
  let end;
  let dasharray;
  let offset;

  if (value instanceof Object && Object.keys(value).every((v) => ['s', 'e', 'l'].includes(v))) {
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

/**
 * Reset CSS properties associated with the `draw` property.
 * @param {SVGPathCommander.shapeTypes} element target
 */
function resetDraw(elem) {
  /* eslint-disable no-param-reassign -- impossible to satisfy */
  elem.style.strokeDashoffset = '';
  elem.style.strokeDasharray = '';
  /* eslint-disable no-param-reassign -- impossible to satisfy */
}

// Component Functions
/**
 * Returns the property tween object.
 * @returns {KUTE.drawObject} the property tween object
 */
function getDrawValue(/* prop, value */) {
  return getDraw(this.element);
}
/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string | KUTE.drawObject} value the property value
 * @returns {KUTE.drawObject} the property tween object
 */
function prepareDraw(_, value) {
  return getDraw(this.element, value);
}

// All Component Functions
const svgDrawFunctions = {
  prepareStart: getDrawValue,
  prepareProperty: prepareDraw,
  onStart: onStartDraw,
};

// Component Full
const SvgDrawProperty = {
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

export default SvgDrawProperty;
