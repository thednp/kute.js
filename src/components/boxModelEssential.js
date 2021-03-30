import defaultValues from '../objects/defaultValues.js';
import getStyleForProperty from '../process/getStyleForProperty.js';
import trueDimension from '../util/trueDimension.js';
import numbers from '../interpolation/numbers.js';
import { boxModelOnStart } from './boxModelBase.js';

// Component Functions
function getBoxModel(tweenProp) {
  return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
}
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
const essentialBoxModel = {
  component: 'essentialBoxModel',
  category: 'boxModel',
  properties: essentialBoxProps,
  defaultValues: essentialBoxPropsValues,
  Interpolate: { numbers },
  functions: essentialBoxModelFunctions,
  Util: { trueDimension },
};

export default essentialBoxModel;
