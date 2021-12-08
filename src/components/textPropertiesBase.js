import KEC from '../objects/kute';
import units from '../interpolation/units';

// Component Properties
const textProperties = ['fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing'];
const textOnStart = {};

/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function textPropOnStart(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      // eslint-disable-next-line no-param-reassign -- impossible to satisfy
      elem.style[tweenProp] = units(a.v, b.v, b.u, v);
    };
  }
}

textProperties.forEach((tweenProp) => {
  textOnStart[tweenProp] = textPropOnStart;
});

// Component Base
const TextPropertiesBase = {
  component: 'baseTextProperties',
  category: 'textProps',
  // properties: textProperties,
  // defaultValues: {fontSize:0,lineHeight:0,letterSpacing:0,wordSpacing:0},
  Interpolate: { units },
  functions: { onStart: textOnStart },
};

export default TextPropertiesBase;
