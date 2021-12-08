import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import trueDimension from '../util/trueDimension';
import numbers from '../interpolation/numbers';
import { boxModelOnStart } from './boxModelBase';

// Component Functions
/**
 * Returns the current property computed style.
 * @param {string} tweenProp the property name
 * @returns {string} computed style for property
 */
function getBoxModel(tweenProp) {
  return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
}

/**
 * Returns the property tween object.
 * @param {string} tweenProp the property name
 * @param {string} value the property name
 * @returns {number} the property tween object
 */
function prepareBoxModel(tweenProp, value) {
  const boxValue = trueDimension(value);
  const offsetProp = tweenProp === 'height' ? 'offsetHeight' : 'offsetWidth';
  return boxValue.u === '%' ? (boxValue.v * this.element[offsetProp]) / 100 : boxValue.v;
}

// Component Base Props
const essentialBoxProps = ['top', 'left', 'width', 'height'];
const essentialBoxPropsValues = {
  top: 0, left: 0, width: 0, height: 0,
};

const essentialBoxOnStart = {};
essentialBoxProps.forEach((x) => { essentialBoxOnStart[x] = boxModelOnStart; });

// All Component Functions
const essentialBoxModelFunctions = {
  prepareStart: getBoxModel,
  prepareProperty: prepareBoxModel,
  onStart: essentialBoxOnStart,
};

// Component Essential
const BoxModelEssential = {
  component: 'essentialBoxModel',
  category: 'boxModel',
  properties: essentialBoxProps,
  defaultValues: essentialBoxPropsValues,
  Interpolate: { numbers },
  functions: essentialBoxModelFunctions,
  Util: { trueDimension },
};

export default BoxModelEssential;
