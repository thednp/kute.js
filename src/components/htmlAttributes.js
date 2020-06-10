import KUTE from '../objects/KUTE.js'
import defaultValues from '../objects/defaultValues.js'
import onStart from '../objects/onStart.js'
import Components from '../objects/Components.js'
import {numbers} from '../objects/Interpolate.js' 
import trueColor from '../util/trueColor.js' 
import trueDimension from '../util/trueDimension.js' 
import {colors} from './colorProperties.js'

// Component Name
let ComponentName = 'htmlAttributes'

// Component Properties
const svgColors = ['fill','stroke','stop-color'];

// Component Special
let attributes = {};

// Component Util
function replaceUppercase (a) { return a.replace(/[A-Z]/g, "-$&").toLowerCase(); }

// Component Functions
export function getAttr(tweenProp,value){
  const attrStartValues = {};
  for (const attr in value){
    const attribute = replaceUppercase(attr).replace(/_+[a-z]+/,''); // get the value for 'fill-opacity' not fillOpacity, also 'width' not the internal 'width_px'
    const currentValue = this.element.getAttribute(attribute);
    attrStartValues[attribute] = svgColors.includes(attribute) ? (currentValue || 'rgba(0,0,0,0)') : (currentValue || (/opacity/i.test(attr) ? 1 : 0));
  }
  return attrStartValues;
}
export function prepareAttr(tweenProp,attrObj){ // attr (string),attrObj (object)
  const attributesObject = {};
  for ( const p in attrObj ) {
    const prop = replaceUppercase(p);
    const regex = /(%|[a-z]+)$/;
    const currentValue = this.element.getAttribute(prop.replace(/_+[a-z]+/,''));
    if ( !svgColors.includes(prop)) {
      if ( currentValue !== null && regex.test(currentValue) ) { // attributes set with unit suffixes
        const unit = trueDimension(currentValue).u || trueDimension(attrObj[p]).u;
        const suffix = /%/.test(unit) ? '_percent' : `_${unit}`;
        onStart[ComponentName][prop+suffix] = function(tp) { // most "unknown" attributes cannot register into onStart, so we manually add them
          if ( this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes) ) {
            attributes[tp] = (elem, p, a, b, v) => {
              const _p = p.replace(suffix,'');
              elem.setAttribute(_p, ( (numbers(a.v,b.v,v)*1000>>0)/1000) + b.u );
            }
          }
        }
        attributesObject[prop+suffix] = trueDimension(attrObj[p]);
      } else if ( !regex.test(attrObj[p]) || currentValue === null || currentValue !== null && !regex.test(currentValue) ) {
        onStart[ComponentName][prop] = function(tp) { // most "unknown" attributes cannot register into onStart, so we manually add them
          if ( this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes) ) {
            attributes[tp] = (elem, oneAttr, a, b, v) => {
              elem.setAttribute(oneAttr, (numbers(a,b,v) * 1000 >> 0) / 1000 );
            }
          }
        }
        attributesObject[prop] = parseFloat(attrObj[p]);
      }
    } else { // colors
      onStart[ComponentName][prop] = function(tp) { // most "unknown" attributes cannot register into onStart, so we manually add them
        if ( this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes) ) {
          attributes[tp] = (elem, oneAttr, a, b, v) => {
            elem.setAttribute(oneAttr, colors(a,b,v));
          }
        }
      }  
      attributesObject[prop] = trueColor(attrObj[p]) || defaultValues.htmlAttributes[p];
    }
  }
  return attributesObject;
}
export const onStartAttr = {
  attr : function(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = (elem, vS, vE, v) => {
        for ( const oneAttr in vE ){
          KUTE.attributes[oneAttr](elem,oneAttr,vS[oneAttr],vE[oneAttr],v);
        }
      }
    }
  },
  attributes : function(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd.attr) {
      KUTE[tweenProp] = attributes
    }
  }
}

// All Component Functions 
export const attrFunctions = {
  prepareStart: getAttr,
  prepareProperty: prepareAttr,
  onStart: onStartAttr
}

// Component Base
export const baseAttrOps = {
  component: ComponentName,
  property: 'attr',
  subProperties: ['fill','stroke','stop-color','fill-opacity','stroke-opacity'], // the Animation class will need some values to validate this Object attribute
  // defaultValue: {fill : 'rgb(0,0,0)', stroke: 'rgb(0,0,0)', 'stop-color': 'rgb(0,0,0)', opacity: 1, 'stroke-opacity': 1,'fill-opacity': 1}, // same here
  Interpolate: { numbers,colors },
  functions: {onStart:onStartAttr}
}

// Component Full
export const attrOps = {
  component: ComponentName,
  property: 'attr',
  subProperties: ['fill','stroke','stop-color','fill-opacity','stroke-opacity'], // the Animation class will need some values to validate this Object attribute
  defaultValue: {fill : 'rgb(0,0,0)', stroke: 'rgb(0,0,0)', 'stop-color': 'rgb(0,0,0)', opacity: 1, 'stroke-opacity': 1,'fill-opacity': 1}, // same here
  Interpolate: { numbers,colors },
  functions: attrFunctions,
  // export to global for faster execution
  Util: { replaceUppercase, trueColor, trueDimension }
}

Components.HTMLAttributes = attrOps
