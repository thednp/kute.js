import numbers from '../interpolation/numbers';
import { svgTransformOnStart } from './svgTransformBase';

// Component Util
/**
 * Returns a correct transform origin consistent with the shape bounding box.
 * @param {string} origin transform origin string
 * @param {SVGPathCommander.pathBBox} bbox path bounding box
 * @returns {number}
 */
function parseStringOrigin(origin, bbox) {
  let result;
  const { x, width } = bbox;
  if (/[a-z]/i.test(origin) && !/px/.test(origin)) {
    result = origin.replace(/top|left/, 0)
      .replace(/right|bottom/, 100)
      .replace(/center|middle/, 50);
  } else {
    result = /%/.test(origin) ? (x + (parseFloat(origin) * width) / 100) : parseFloat(origin);
  }
  return result;
}

/**
 * Parse SVG transform string and return an object.
 * @param {string} a transform string
 * @returns {Object<string, (string | number)>}
 */
function parseTransformString(a) {
  const c = {};
  const d = a && /\)/.test(a)
    ? a.substring(0, a.length - 1).split(/\)\s|\)/)
    : 'none';

  if (d instanceof Array) {
    for (let j = 0, jl = d.length; j < jl; j += 1) {
      const [prop, val] = d[j].trim().split('(');
      c[prop] = val;
    }
  }
  return c;
}

/**
 * Returns the SVG transform tween object.
 * @param {string} _ property name
 * @param {Object<string, (string | number)>} v property value object
 * @returns {KUTE.transformSVGObject} the SVG transform tween object
 */
function parseTransformSVG(/* prop */_, v) {
  /** @type {KUTE.transformSVGObject} */
  const svgTransformObject = {};

  // by default the transformOrigin is "50% 50%" of the shape box
  const bb = this.element.getBBox();
  const cx = bb.x + bb.width / 2;
  const cy = bb.y + bb.height / 2;

  let origin = this._transformOrigin;
  let translation;

  if (typeof (origin) !== 'undefined') {
    origin = origin instanceof Array ? origin : origin.split(/\s/);
  } else {
    origin = [cx, cy];
  }

  origin[0] = typeof origin[0] === 'number' ? origin[0] : parseStringOrigin(origin[0], bb);
  origin[1] = typeof origin[1] === 'number' ? origin[1] : parseStringOrigin(origin[1], bb);

  svgTransformObject.origin = origin;

  // populate the valuesStart and / or valuesEnd
  Object.keys(v).forEach((i) => {
    if (i === 'rotate') {
      if (typeof v[i] === 'number') {
        svgTransformObject[i] = v[i];
      } else if (v[i] instanceof Array) {
        [svgTransformObject[i]] = v[i];
      } else {
        svgTransformObject[i] = v[i].split(/\s/)[0] * 1;
      }
    } else if (i === 'translate') {
      if (v[i] instanceof Array) {
        translation = v[i];
      } else if (/,|\s/.test(v[i])) {
        translation = v[i].split(',');
      } else {
        translation = [v[i], 0];
      }
      svgTransformObject[i] = [translation[0] * 1 || 0, translation[1] * 1 || 0];
    } else if (/skew/.test(i)) {
      svgTransformObject[i] = v[i] * 1 || 0;
    } else if (i === 'scale') {
      svgTransformObject[i] = parseFloat(v[i]) || 1;
    }
  });

  return svgTransformObject;
}

// Component Functions
/**
 * Returns the property tween object.
 * @param {string} prop the property name
 * @param {string} value the property value
 * @returns {KUTE.transformSVGObject} the property tween object
 */
function prepareSvgTransform(prop, value) {
  return parseTransformSVG.call(this, prop, value);
}

/**
 * Returns an object with the current transform attribute value.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {string} current transform object
 */
function getStartSvgTransform(/* tweenProp */_, value) {
  const transformObject = {};
  const currentTransform = parseTransformString(this.element.getAttribute('transform'));

  // find a value in current attribute value or add a default value
  Object.keys(value).forEach((j) => {
    const scaleValue = j === 'scale' ? 1 : 0;
    transformObject[j] = j in currentTransform ? currentTransform[j] : scaleValue;
  });

  return transformObject;
}

function svgTransformCrossCheck(prop) {
  if (!this._resetStart) return; // fix since 1.6.1 for fromTo() method

  if (this.valuesEnd[prop]) {
    const valuesStart = this.valuesStart[prop];
    const valuesEnd = this.valuesEnd[prop];
    const currentTransform = parseTransformSVG.call(this, prop,
      parseTransformString(this.element.getAttribute('transform')));

    // populate the valuesStart first
    Object.keys(currentTransform).forEach((tp) => {
      valuesStart[tp] = currentTransform[tp];
    });

    // now try to determine the REAL translation
    const parentSVG = this.element.ownerSVGElement;
    const startMatrix = parentSVG.createSVGTransformFromMatrix(
      parentSVG.createSVGMatrix()
        .translate(-valuesStart.origin[0], -valuesStart.origin[1]) // - origin
        .translate('translate' in valuesStart // the current translate
          ? valuesStart.translate[0] : 0, 'translate' in valuesStart ? valuesStart.translate[1]
          : 0)
        .rotate(valuesStart.rotate || 0)
        .skewX(valuesStart.skewX || 0)
        .skewY(valuesStart.skewY || 0)
        .scale(valuesStart.scale || 1)// the other functions
        .translate(+valuesStart.origin[0], +valuesStart.origin[1]), // + origin
    );
    // finally the translate we're looking for
    valuesStart.translate = [startMatrix.matrix.e, startMatrix.matrix.f];

    // copy existing and unused properties to the valuesEnd
    Object.keys(valuesStart).forEach((s) => {
      if (!(s in valuesEnd) || s === 'origin') {
        valuesEnd[s] = valuesStart[s];
      }
    });
  }
}

// All Component Functions
export const svgTransformFunctions = {
  prepareStart: getStartSvgTransform,
  prepareProperty: prepareSvgTransform,
  onStart: svgTransformOnStart,
  crossCheck: svgTransformCrossCheck,
};

// Component Full
export const svgTransform = {
  component: 'svgTransformProperty',
  property: 'svgTransform',
  // subProperties: ['translate','rotate','skewX','skewY','scale'],
  defaultOptions: { transformOrigin: '50% 50%' },
  defaultValue: {
    translate: 0, rotate: 0, skewX: 0, skewY: 0, scale: 1,
  },
  Interpolate: { numbers },
  functions: svgTransformFunctions,

  // export utils to globals for faster execution
  Util: { parseStringOrigin, parseTransformString, parseTransformSVG },
};

export default svgTransform;
