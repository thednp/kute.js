import defaultValues from '../objects/defaultValues';
import numbers from '../interpolation/numbers';
import arrays from '../interpolation/arrays';
import { onStartTransform } from './transformMatrixBase';

// Component name
const matrixComponent = 'transformMatrix';

// Component Functions
/**
 * Returns the current transform object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {KUTE.transformMObject} transform object
 */
function getTransform(/* tweenProp, */_, value) {
  const transformObject = {};
  const currentValue = this.element[matrixComponent];

  if (currentValue) {
    Object.keys(currentValue).forEach((vS) => {
      transformObject[vS] = currentValue[vS];
    });
  } else {
    Object.keys(value).forEach((vE) => {
      transformObject[vE] = vE === 'perspective' ? value[vE] : defaultValues.transform[vE];
    });
  }
  return transformObject;
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {Object<string, string | number | (string | number)[]>} obj the property value
 * @returns {KUTE.transformMObject} the property tween object
 */
function prepareTransform(/* tweenProp, */_, value) {
  if (typeof (value) === 'object' && !value.length) {
    let pv;
    const transformObject = {};
    const translate3dObj = {};
    const rotate3dObj = {};
    const scale3dObj = {};
    const skewObj = {};
    const axis = [{ translate3d: translate3dObj },
      { rotate3d: rotate3dObj },
      { skew: skewObj },
      { scale3d: scale3dObj }];

    Object.keys(value).forEach((prop) => {
      if (/3d/.test(prop) && typeof (value[prop]) === 'object' && value[prop].length) {
        pv = value[prop].map((v) => (prop === 'scale3d' ? parseFloat(v) : parseInt(v, 10)));
        transformObject[prop] = prop === 'scale3d' ? [pv[0] || 1, pv[1] || 1, pv[2] || 1] : [pv[0] || 0, pv[1] || 0, pv[2] || 0];
      } else if (/[XYZ]/.test(prop)) {
        let obj = {};
        if (/translate/.test(prop)) {
          obj = translate3dObj;
        } else if (/rotate/.test(prop)) {
          obj = rotate3dObj;
        } else if (/scale/.test(prop)) {
          obj = scale3dObj;
        } else if (/skew/.test(prop)) {
          obj = skewObj;
        }
        const idx = prop.replace(/translate|rotate|scale|skew/, '').toLowerCase();
        obj[idx] = /scale/.test(prop) ? parseFloat(value[prop]) : parseInt(value[prop], 10);
      } else if (prop === 'skew') {
        pv = value[prop].map((v) => parseInt(v, 10) || 0);
        transformObject[prop] = [pv[0] || 0, pv[1] || 0];
      } else { // perspective
        transformObject[prop] = parseInt(value[prop], 10);
      }
    });

    axis.forEach((o) => {
      const tp = Object.keys(o)[0];
      const tv = o[tp];
      if (Object.keys(tv).length && !transformObject[tp]) {
        if (tp === 'scale3d') {
          transformObject[tp] = [tv.x || 1, tv.y || 1, tv.z || 1];
        } else if (tp === 'skew') {
          transformObject[tp] = [tv.x || 0, tv.y || 0];
        } else { // translate | rotate
          transformObject[tp] = [tv.x || 0, tv.y || 0, tv.z || 0];
        }
      }
    });
    return transformObject;
  } // string | array
  // if ( typeof (value) === 'object' && value.length ) {
  // } else if ( typeof (value) === string && value.includes('matrix')) {
  // decompose matrix to object
  throw Error(`KUTE.js - "${value}" is not valid/supported transform function`);
}

/**
 * Sets the end values for the next `to()` method call.
 * @param {string} tweenProp the property name
 */
function onCompleteTransform(tweenProp) {
  if (this.valuesEnd[tweenProp]) {
    this.element[matrixComponent] = { ...this.valuesEnd[tweenProp] };
  }
}

/**
 * Prepare tween object in advance for `to()` method.
 * @param {string} tweenProp the property name
 */
function crossCheckTransform(tweenProp) {
  if (this.valuesEnd[tweenProp]) {
    if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective) {
      this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
    }
  }
}

// All Component Functions
const matrixFunctions = {
  prepareStart: getTransform,
  prepareProperty: prepareTransform,
  onStart: onStartTransform,
  onComplete: onCompleteTransform,
  crossCheck: crossCheckTransform,
};

// Component Full Object
const matrixTransform = {
  component: matrixComponent,
  property: 'transform',
  /* subProperties: [
    'perspective', 'translate3d', 'translateX', 'translateY', 'translateZ',
    'rotate3d', 'rotateX', 'rotateY', 'rotateZ',
    'skew','skewX','skewY',
    'scale3d', 'scaleX', 'scaleY', 'scaleZ'], */
  defaultValue: {
    perspective: 400,
    translate3d: [0, 0, 0],
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotate3d: [0, 0, 0],
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skew: [0, 0],
    skewX: 0,
    skewY: 0,
    scale3d: [1, 1, 1],
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
  },
  functions: matrixFunctions,
  Interpolate: {
    perspective: numbers,
    translate3d: arrays,
    rotate3d: arrays,
    skew: arrays,
    scale3d: arrays,
  },
};

export default matrixTransform;
