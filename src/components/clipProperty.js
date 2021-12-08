import getStyleForProperty from '../process/getStyleForProperty';
import trueDimension from '../util/trueDimension';
import numbers from '../interpolation/numbers';
import { onStartClip } from './clipPropertyBase';

// Component Functions
/**
 * Returns the current property computed style.
 * @param {string} tweenProp the property name
 * @returns {string | number[]} computed style for property
 */
function getClip(tweenProp/* , value */) {
  const { element } = this;
  const currentClip = getStyleForProperty(element, tweenProp);
  const width = getStyleForProperty(element, 'width');
  const height = getStyleForProperty(element, 'height');
  return !/rect/.test(currentClip) ? [0, width, height, 0] : currentClip;
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {number[]} the property tween object
 */
function prepareClip(/* tweenProp, */_, value) {
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
const ClipProperty = {
  component: 'clipProperty',
  property: 'clip',
  defaultValue: [0, 0, 0, 0],
  Interpolate: { numbers },
  functions: clipFunctions,
  Util: { trueDimension },
};

export default ClipProperty;
