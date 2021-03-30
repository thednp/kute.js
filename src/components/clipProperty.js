import getStyleForProperty from '../process/getStyleForProperty.js';
import trueDimension from '../util/trueDimension.js';
import numbers from '../interpolation/numbers.js';
import { onStartClip } from './clipPropertyBase.js';

// Component Functions
function getClip(tweenProp/* , value */) {
  const currentClip = getStyleForProperty(this.element, tweenProp);
  const width = getStyleForProperty(this.element, 'width');
  const height = getStyleForProperty(this.element, 'height');
  return !/rect/.test(currentClip) ? [0, width, height, 0] : currentClip;
}
function prepareClip(tweenProp, value) {
  if (value instanceof Array) {
    return value.map((x) => trueDimension(x));
  }
  let clipValue = value.replace(/rect|\(|\)/g, '');
  clipValue = /,/g.test(clipValue) ? clipValue.split(',') : clipValue.split(/\s/);
  return clipValue.map((x) => trueDimension(x));
}

// All Component Functions
const clipFunctions = {
  prepareStart: getClip,
  prepareProperty: prepareClip,
  onStart: onStartClip,
};

// Component Full
const clipProperty = {
  component: 'clipProperty',
  property: 'clip',
  defaultValue: [0, 0, 0, 0],
  Interpolate: { numbers },
  functions: clipFunctions,
  Util: { trueDimension },
};

export default clipProperty;
