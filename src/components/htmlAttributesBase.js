import KUTE from '../objects/kute.js';
import numbers from '../interpolation/numbers.js';
import colors from '../interpolation/colors.js';

// Component Name
const ComponentName = 'baseHTMLAttributes';

// Component Special
const attributes = {};
export { attributes };

export const onStartAttr = {
  attr(tweenProp) {
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = (elem, vS, vE, v) => {
        Object.keys(vE).forEach((oneAttr) => {
          KUTE.attributes[oneAttr](elem, oneAttr, vS[oneAttr], vE[oneAttr], v);
        });
      };
    }
  },
  attributes(tweenProp) {
    if (!KUTE[tweenProp] && this.valuesEnd.attr) {
      KUTE[tweenProp] = attributes;
    }
  },
};

// Component Base
const baseAttributes = {
  component: ComponentName,
  property: 'attr',
  // the Animation class will need some values to validate this Object attribute
  // subProperties: ['fill','stroke','stop-color','fill-opacity','stroke-opacity'],
  // defaultValue:
  //   fill : 'rgb(0,0,0)',
  //   stroke: 'rgb(0,0,0)',
  //   'stop-color': 'rgb(0,0,0)',
  //   opacity: 1,
  //   'stroke-opacity': 1,
  //   'fill-opacity': 1 // same here
  // },
  Interpolate: { numbers, colors },
  functions: { onStart: onStartAttr },
};

export default baseAttributes;
