import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';
import colors from '../interpolation/colors';

// Component Name
const ComponentName = 'baseHTMLAttributes';

// Component Special
const attributes = {};
export { attributes };

export const onStartAttr = {
  /**
   * onStartAttr.attr
   *
   * Sets the sub-property update function.
   * @param {string} tweenProp the property name
   */
  attr(tweenProp) {
    if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
      KEC[tweenProp] = (elem, vS, vE, v) => {
        Object.keys(vE).forEach((oneAttr) => {
          KEC.attributes[oneAttr](elem, oneAttr, vS[oneAttr], vE[oneAttr], v);
        });
      };
    }
  },
  /**
   * onStartAttr.attributes
   *
   * Sets the update function for the property.
   * @param {string} tweenProp the property name
   */
  attributes(tweenProp) {
    if (!KEC[tweenProp] && this.valuesEnd.attr) {
      KEC[tweenProp] = attributes;
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
