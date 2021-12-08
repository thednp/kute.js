import defaultValues from '../objects/defaultValues';
import getInlineStyle from '../process/getInlineStyle';
import perspective from '../interpolation/perspective';
import translate3d from '../interpolation/translate3d';
import rotate3d from '../interpolation/rotate3d';
import translate from '../interpolation/translate';
import rotate from '../interpolation/rotate';
import scale from '../interpolation/scale';
import skew from '../interpolation/skew';
import { onStartTransform } from './transformFunctionsBase';

// same to svg transform, attr
// the component developed for modern browsers supporting non-prefixed transform

// Component Functions
/**
 * Returns the current property inline style.
 * @param {string} tweenProp the property name
 * @returns {string} inline style for property
 */
function getTransform(tweenProp/* , value */) {
  const currentStyle = getInlineStyle(this.element);
  return currentStyle[tweenProp] ? currentStyle[tweenProp] : defaultValues[tweenProp];
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {Object<string, string | number | (string | number)[]>} obj the property value
 * @returns {KUTE.transformFObject} the property tween object
 */
function prepareTransform(/* prop, */_, obj) {
  const prepAxis = ['X', 'Y', 'Z']; // coordinates
  const transformObject = {};
  const translateArray = []; const rotateArray = []; const skewArray = [];
  const arrayFunctions = ['translate3d', 'translate', 'rotate3d', 'skew'];

  Object.keys(obj).forEach((x) => {
    const pv = typeof obj[x] === 'object' && obj[x].length
      ? obj[x].map((v) => parseInt(v, 10))
      : parseInt(obj[x], 10);

    if (arrayFunctions.includes(x)) {
      const propId = x === 'translate' || x === 'rotate' ? `${x}3d` : x;

      if (x === 'skew') {
        transformObject[propId] = pv.length
          ? [pv[0] || 0, pv[1] || 0]
          : [pv || 0, 0];
      } else if (x === 'translate') {
        transformObject[propId] = pv.length
          ? [pv[0] || 0, pv[1] || 0, pv[2] || 0]
          : [pv || 0, 0, 0];
      } else { // translate3d | rotate3d
        transformObject[propId] = [pv[0] || 0, pv[1] || 0, pv[2] || 0];
      }
    } else if (/[XYZ]/.test(x)) {
      const fn = x.replace(/[XYZ]/, '');
      const fnId = fn === 'skew' ? fn : `${fn}3d`;
      const fnLen = fn === 'skew' ? 2 : 3;
      let fnArray = [];

      if (fn === 'translate') {
        fnArray = translateArray;
      } else if (fn === 'rotate') {
        fnArray = rotateArray;
      } else if (fn === 'skew') {
        fnArray = skewArray;
      }

      for (let fnIndex = 0; fnIndex < fnLen; fnIndex += 1) {
        const fnAxis = prepAxis[fnIndex];
        fnArray[fnIndex] = (`${fn}${fnAxis}` in obj) ? parseInt(obj[`${fn}${fnAxis}`], 10) : 0;
      }
      transformObject[fnId] = fnArray;
    } else if (x === 'rotate') { //  rotate
      transformObject.rotate3d = [0, 0, pv];
    } else { // scale | perspective
      transformObject[x] = x === 'scale' ? parseFloat(obj[x]) : pv;
    }
  });

  return transformObject;
}

/**
 * Prepare tween object in advance for `to()` method.
 * @param {string} tweenProp the property name
 */
function crossCheckTransform(tweenProp) {
  if (this.valuesEnd[tweenProp]) {
    if (this.valuesEnd[tweenProp]) {
      if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective) {
        this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
      }
    }
  }
}

// All Component Functions
const transformFunctions = {
  prepareStart: getTransform,
  prepareProperty: prepareTransform,
  onStart: onStartTransform,
  crossCheck: crossCheckTransform,
};

const supportedTransformProperties = [
  'perspective',
  'translate3d', 'translateX', 'translateY', 'translateZ', 'translate',
  'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'rotate',
  'skewX', 'skewY', 'skew',
  'scale',
];

const defaultTransformValues = {
  perspective: 400,
  translate3d: [0, 0, 0],
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  translate: [0, 0],
  rotate3d: [0, 0, 0],
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  rotate: 0,
  skewX: 0,
  skewY: 0,
  skew: [0, 0],
  scale: 1,
};

// Full Component
const TransformFunctions = {
  component: 'transformFunctions',
  property: 'transform',
  subProperties: supportedTransformProperties,
  defaultValues: defaultTransformValues,
  functions: transformFunctions,
  Interpolate: {
    perspective,
    translate3d,
    rotate3d,
    translate,
    rotate,
    scale,
    skew,
  },
};

export default TransformFunctions;
