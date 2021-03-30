import defaultValues from '../objects/defaultValues.js';
import onStart from '../objects/onStart.js';
import trueColor from '../util/trueColor.js';
import trueDimension from '../util/trueDimension.js';
import numbers from '../interpolation/numbers.js';
import colors from '../interpolation/colors.js';
import { attributes, onStartAttr } from './htmlAttributesBase.js';

// Component Name
const ComponentName = 'htmlAttributes';

// Component Properties
const svgColors = ['fill', 'stroke', 'stop-color'];

// Component Util
function replaceUppercase(a) { return a.replace(/[A-Z]/g, '-$&').toLowerCase(); }

// Component Functions
export function getAttr(tweenProp, value) {
  const attrStartValues = {};
  Object.keys(value).forEach((attr) => {
    // get the value for 'fill-opacity' not fillOpacity, also 'width' not the internal 'width_px'
    const attribute = replaceUppercase(attr).replace(/_+[a-z]+/, '');
    const currentValue = this.element.getAttribute(attribute);
    attrStartValues[attribute] = svgColors.includes(attribute)
      ? (currentValue || 'rgba(0,0,0,0)')
      : (currentValue || (/opacity/i.test(attr) ? 1 : 0));
  });

  return attrStartValues;
}

export function prepareAttr(tweenProp, attrObj) { // attr (string),attrObj (object)
  const attributesObject = {};

  Object.keys(attrObj).forEach((p) => {
    const prop = replaceUppercase(p);
    const regex = /(%|[a-z]+)$/;
    const currentValue = this.element.getAttribute(prop.replace(/_+[a-z]+/, ''));

    if (!svgColors.includes(prop)) {
      // attributes set with unit suffixes
      if (currentValue !== null && regex.test(currentValue)) {
        const unit = trueDimension(currentValue).u || trueDimension(attrObj[p]).u;
        const suffix = /%/.test(unit) ? '_percent' : `_${unit}`;

        // most "unknown" attributes cannot register into onStart, so we manually add them
        onStart[ComponentName][prop + suffix] = (tp) => {
          if (this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes)) {
            attributes[tp] = (elem, oneAttr, a, b, v) => {
              const _p = oneAttr.replace(suffix, '');
              elem.setAttribute(_p, ((numbers(a.v, b.v, v) * 1000 >> 0) / 1000) + b.u);
            };
          }
        };
        attributesObject[prop + suffix] = trueDimension(attrObj[p]);
      } else if (!regex.test(attrObj[p]) || currentValue === null
        || (currentValue !== null && !regex.test(currentValue))) {
        // most "unknown" attributes cannot register into onStart, so we manually add them
        onStart[ComponentName][prop] = (tp) => {
          if (this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes)) {
            attributes[tp] = (elem, oneAttr, a, b, v) => {
              elem.setAttribute(oneAttr, (numbers(a, b, v) * 1000 >> 0) / 1000);
            };
          }
        };
        attributesObject[prop] = parseFloat(attrObj[p]);
      }
    } else { // colors
      // most "unknown" attributes cannot register into onStart, so we manually add them
      onStart[ComponentName][prop] = (tp) => {
        if (this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes)) {
          attributes[tp] = (elem, oneAttr, a, b, v) => {
            elem.setAttribute(oneAttr, colors(a, b, v));
          };
        }
      };
      attributesObject[prop] = trueColor(attrObj[p]) || defaultValues.htmlAttributes[p];
    }
  });

  return attributesObject;
}

// All Component Functions
const attrFunctions = {
  prepareStart: getAttr,
  prepareProperty: prepareAttr,
  onStart: onStartAttr,
};

// Component Full
const htmlAttributes = {
  component: ComponentName,
  property: 'attr',
  // the Animation class will need some values to validate this Object attribute
  subProperties: ['fill', 'stroke', 'stop-color', 'fill-opacity', 'stroke-opacity'],
  defaultValue: {
    fill: 'rgb(0,0,0)',
    stroke: 'rgb(0,0,0)',
    'stop-color': 'rgb(0,0,0)',
    opacity: 1,
    'stroke-opacity': 1,
    'fill-opacity': 1, // same here
  },
  Interpolate: { numbers, colors },
  functions: attrFunctions,
  // export to global for faster execution
  Util: { replaceUppercase, trueColor, trueDimension },
};

export default htmlAttributes;
