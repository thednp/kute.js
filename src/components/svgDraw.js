import KUTE from '../objects/kute.js'
import {numbers} from '../objects/interpolate.js'
import Components from '../objects/components.js'
import getStyleForProperty from '../process/getStyleForProperty.js'

// const svgDraw = { property : 'draw', defaultValue, Interpolate: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Component Util
const percent = (v, l) => parseFloat(v) / 100 * l

// http://stackoverflow.com/a/30376660
const getRectLength = el => { // returns the length of a Rect
  let w = el.getAttribute('width'),
      h = el.getAttribute('height');
  return (w*2)+(h*2);
}

const getPolyLength = el => {
  // getPolygonLength / getPolylineLength - return the length of the Polygon / Polyline
  const points = el.getAttribute('points').split(' ');

  let len = 0;
  if (points.length > 1) {
    const coord = p => {
      const c = p.split(',');
      if (c.length != 2) { return; } // return undefined
      if (isNaN(c[0]) || isNaN(c[1])) { return; }
      return [parseFloat(c[0]), parseFloat(c[1])];
    };

    const dist = (c1, c2) => {
      if (c1 != undefined && c2 != undefined) {
        return Math.sqrt((c2[0] - c1[0]) ** 2 + (c2[1] - c1[1]) ** 2);
      }
      return 0;
    };

    if (points.length > 2) {
      for (let i=0; i<points.length-1; i++) {
        len += dist(coord(points[i]), coord(points[i+1]));
      }
    }
    len += el.tagName === 'polygon' ? dist(coord(points[0]), coord(points[points.length - 1])) : 0;
  }
  return len;
}

const getLineLength = el => { // return the length of the line
  const x1 = el.getAttribute('x1');
  const x2 = el.getAttribute('x2');
  const y1 = el.getAttribute('y1');
  const y2 = el.getAttribute('y2');
  return Math.sqrt((x2 - x1) ** 2+(y2 - y1) ** 2);
}

const getCircleLength = el => { // return the length of the circle
  const r = el.getAttribute('r');
  return 2 * Math.PI * r;
}

const getEllipseLength = el => { // returns the length of an ellipse
  const rx = el.getAttribute('rx'), ry = el.getAttribute('ry'), len = 2*rx, wid = 2*ry;
  return ((Math.sqrt(.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
}

const getTotalLength = el => { // returns the result of any of the below functions
  if (/rect/.test(el.tagName)) {
    return getRectLength(el);
  } else if (/circle/.test(el.tagName)) {
    return getCircleLength(el);
  } else if (/ellipse/.test(el.tagName)) {
    return getEllipseLength(el);
  } else if (/polygon|polyline/.test(el.tagName)) {
    return getPolyLength(el);
  } else if (/line/.test(el.tagName)) {
    return getLineLength(el);
  }
}

export const getDraw = (e, v) => {
  let length = /path|glyph/.test(e.tagName) ? e.getTotalLength() : getTotalLength(e),
      start, end, d, o;

  if ( v instanceof Object ) {
    return v;
  } else if (typeof v === 'string') {
    v = v.split(/\,|\s/);
    start = /%/.test(v[0]) ? percent(v[0].trim(),length) : parseFloat(v[0]);
    end = /%/.test(v[1]) ? percent(v[1].trim(),length) : parseFloat(v[1]);
  } else if (typeof v === 'undefined') {
    o = parseFloat(getStyleForProperty(e,'stroke-dashoffset'));
    d = getStyleForProperty(e,'stroke-dasharray').split(/\,/);

    start = 0-o;
    end = parseFloat(d[0]) + start || length;
  }
  return { s: start, e: end, l: length };
}

export function resetDraw(elem) {
  elem.style.strokeDashoffset = ``;
  elem.style.strokeDasharray = ``;
}

// Component Functions
export function getDrawValue(){
  return getDraw(this.element);
}
export function prepareDraw(a,o){
  return getDraw(this.element,o);
}
export function onStartDraw(tweenProp){
  if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem,a,b,v) => {
      let pathLength = (a.l*100>>0)/100,
        start = (numbers(a.s,b.s,v)*100>>0)/100,
        end = (numbers(a.e,b.e,v)*100>>0)/100,
        offset = 0 - start,
        dashOne = end+offset;
      
      elem.style.strokeDashoffset = `${offset}px`;
      elem.style.strokeDasharray = `${((dashOne <1 ? 0 : dashOne)*100>>0)/100}px, ${pathLength}px`;
    }
  }
}

// All Component Functions
const svgDrawFunctions = {
  prepareStart: getDrawValue,
  prepareProperty: prepareDraw,
  onStart: onStartDraw
}

// Component Base
export const baseSVGDrawOps = {
  component: 'svgDraw',
  property: 'draw',
  Interpolate: {numbers},
  functions: {onStart:onStartDraw}
}

// Component Full
export const svgDrawOps = {
  component: 'svgDraw',
  property: 'draw',
  defaultValue: '0% 0%',
  Interpolate: {numbers},
  functions: svgDrawFunctions,
  // Export to global for faster execution
  Util: {
    getRectLength,
    getPolyLength,
    getLineLength,
    getCircleLength,
    getEllipseLength,
    getTotalLength,
    getDraw,
    percent
  }
}

Components.SVGDraw = svgDrawOps
