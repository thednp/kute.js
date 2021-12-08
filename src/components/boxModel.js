import defaultValues from '../objects/defaultValues';
import getStyleForProperty from '../process/getStyleForProperty';
import trueDimension from '../util/trueDimension';
import numbers from '../interpolation/numbers';
import { boxModelOnStart } from './boxModelBase';

// Component Properties
const boxModelProperties = ['top', 'left', 'width', 'height', 'right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'];

const boxModelValues = {};
boxModelProperties.forEach((x) => { boxModelValues[x] = 0; });

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
 * @param {string} value the property value
 * @returns {number} the property tween object
 */
function prepareBoxModel(tweenProp, value) {
  const boxValue = trueDimension(value); const
    offsetProp = tweenProp === 'height' ? 'offsetHeight' : 'offsetWidth';
  return boxValue.u === '%' ? (boxValue.v * this.element[offsetProp]) / 100 : boxValue.v;
}
const boxPropsOnStart = {};
boxModelProperties.forEach((x) => { boxPropsOnStart[x] = boxModelOnStart; });

// All Component Functions
const boxModelFunctions = {
  prepareStart: getBoxModel,
  prepareProperty: prepareBoxModel,
  onStart: boxPropsOnStart,
};

// Component Full Component
const BoxModel = {
  component: 'boxModelProperties',
  category: 'boxModel',
  properties: boxModelProperties,
  defaultValues: boxModelValues,
  Interpolate: { numbers },
  functions: boxModelFunctions,
};

export default BoxModel;
