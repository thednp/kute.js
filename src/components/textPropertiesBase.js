import KUTE from '../objects/kute.js';
import units from '../interpolation/units.js';

/* textProperties = {
  category: 'textProperties',
  defaultValues: [],
  interpolators: {units},
  functions = { prepareStart, prepareProperty, onStart:{}
} */

// Component Properties
const textProperties = ['fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing'];
const textOnStart = {};

export function textPropOnStart(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = units(a.v, b.v, b.u, v);
    };
  }
}

textProperties.forEach((tweenProp) => {
  textOnStart[tweenProp] = textPropOnStart;
});

// Component Base
const baseTextProperties = {
  component: 'baseTextProperties',
  category: 'textProps',
  // properties: textProperties,
  // defaultValues: {fontSize:0,lineHeight:0,letterSpacing:0,wordSpacing:0},
  Interpolate: { units },
  functions: { onStart: textOnStart },
};

export default baseTextProperties;
