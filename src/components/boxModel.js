import defaultValues from '../objects/defaultValues.js';
import getStyleForProperty from '../process/getStyleForProperty.js';
import trueDimension from '../util/trueDimension.js';
import numbers from '../interpolation/numbers.js';
import { boxModelOnStart } from './boxModelBase.js';

// Component Properties
const boxModelProperties = ['top', 'left', 'width', 'height', 'right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'];

const boxModelValues = {};
boxModelProperties.forEach((x) => { boxModelValues[x] = 0; });

// Component Functions
function getBoxModel(tweenProp) {
  return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
}
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
const boxModel = {
  component: 'boxModelProperties',
  category: 'boxModel',
  properties: boxModelProperties,
  defaultValues: boxModelValues,
  Interpolate: { numbers },
  functions: boxModelFunctions,
};

export default boxModel;
