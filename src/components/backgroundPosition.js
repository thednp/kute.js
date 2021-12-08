import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import numbers from '../interpolation/numbers';
import trueDimension from '../util/trueDimension';
import { onStartBgPos } from './backgroundPositionBase';

// Component Functions

/**
 * Returns the property computed style.
 * @param {string} prop the property
 * @returns {string} the property computed style
 */
function getBgPos(prop/* , value */) {
  return getStyleForProperty(this.element, prop) || defaultValues[prop];
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {number[]} the property tween object
 */
function prepareBgPos(/* prop, */_, value) {
  if (value instanceof Array) {
    const x = trueDimension(value[0]).v;
    const y = trueDimension(value[1]).v;
    return [!Number.isNaN(x * 1) ? x : 50, !Number.isNaN(y * 1) ? y : 50];
  }

  let posxy = value.replace(/top|left/g, 0)
    .replace(/right|bottom/g, 100)
    .replace(/center|middle/g, 50);

  posxy = posxy.split(/(,|\s)/g);
  posxy = posxy.length === 2 ? posxy : [posxy[0], 50];
  return [trueDimension(posxy[0]).v, trueDimension(posxy[1]).v];
}

// All Component Functions
const bgPositionFunctions = {
  prepareStart: getBgPos,
  prepareProperty: prepareBgPos,
  onStart: onStartBgPos,
};

// Component Full Object
const BackgroundPosition = {
  component: 'backgroundPositionProp',
  property: 'backgroundPosition',
  defaultValue: [50, 50],
  Interpolate: { numbers },
  functions: bgPositionFunctions,
  Util: { trueDimension },
};

export default BackgroundPosition;
