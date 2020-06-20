import defaultValues from '../objects/defaultValues.js' 
import Components from '../objects/components.js' 
import getStyleForProperty from '../process/getStyleForProperty.js' 
import trueColor from '../util/trueColor.js' 
import numbers from '../interpolation/numbers.js' 
import colors from '../interpolation/colors.js' 
import {onStartShadow} from './shadowPropertiesBase.js'

// Component Properties
const shadowProps = ['boxShadow','textShadow']

// Component Util

// box-shadow: none | h-shadow v-shadow blur spread color inset|initial|inherit
// text-shadow: none | offset-x offset-y blur-radius color |initial|inherit
// utility function to process values accordingly
// numbers must be floats and color must be rgb object
function processShadowArray (shadow,tweenProp){
  let newShadow, i;

  if (shadow.length === 3) { // [h-shadow, v-shadow, color]
    newShadow = [shadow[0], shadow[1], 0, 0, shadow[2], 'none'];
  } else if (shadow.length === 4) { // [h-shadow, v-shadow, color, inset] | [h-shadow, v-shadow, blur, color]
    newShadow = /inset|none/.test(shadow[3]) ? [shadow[0], shadow[1], 0, 0, shadow[2], shadow[3]] : [shadow[0], shadow[1], shadow[2], 0, shadow[3], 'none'];
  } else if (shadow.length === 5) { // [h-shadow, v-shadow, blur, color, inset] | [h-shadow, v-shadow, blur, spread, color]
    newShadow = /inset|none/.test(shadow[4]) ? [shadow[0], shadow[1], shadow[2], 0, shadow[3], shadow[4]] : [shadow[0], shadow[1], shadow[2], shadow[3], shadow[4], 'none'];           
  } else if (shadow.length === 6) { // ideal [h-shadow, v-shadow, blur, spread, color, inset]
    newShadow = shadow; 
  }

  // make sure the values are ready to tween
  for (i=0;i<4;i++){
    newShadow[i] = parseFloat(newShadow[i]);  
  }
  // also the color must be a rgb object
  newShadow[4] = trueColor(newShadow[4]);
  
  // return tweenProp === 'boxShadow' ? newShadow : [newShadow[0],newShadow[1],newShadow[2],newShadow[4]];
  newShadow = tweenProp === 'boxShadow' ? newShadow : newShadow.filter((x,i)=>[0,1,2,4].indexOf(i)>-1);
  return newShadow;
}

// Component Functions
export function getShadow(tweenProp,value){
  let cssShadow = getStyleForProperty(this.element,tweenProp);
  return /^none$|^initial$|^inherit$|^inset$/.test(cssShadow) ? defaultValues[tweenProp] : cssShadow; // '0px 0px 0px 0px rgb(0,0,0)'
}
export function prepareShadow(tweenProp,value) {
  // [horizontal, vertical, blur, spread, color: {r:0,g:0,b:0}, inset]
  // parseProperty for boxShadow, builds basic structure with ready to tween values
  if (typeof value === 'string'){
    let currentColor, inset = 'none';
    // a full RegEx for color strings
    const colRegEx = /(\s?(?:#(?:[\da-f]{3}){1,2}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))\s?)/gi 

    // make sure to always have the inset last if possible
    inset = /inset/.test(value) ? 'inset' : inset;
    value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g,'') : value;
 
    // also getComputedStyle often returns color first "rgb(0, 0, 0) 15px 15px 6px 0px inset"
    currentColor = value.match(colRegEx); 
    value = value.replace(currentColor[0],'').split(' ').concat([currentColor[0].replace(/\s/g,'')],[inset]);
    
    value = processShadowArray(value,tweenProp);
  } else if (value instanceof Array){
    value = processShadowArray(value,tweenProp);
  }
  return value;
}

const shadowPropOnStart = {}
shadowProps.map(x=>shadowPropOnStart[x]=onStartShadow)

// All Component Functions
const shadowFunctions = {
  prepareStart: getShadow,
  prepareProperty: prepareShadow,
  onStart: shadowPropOnStart
}

// Component Full
const shadowProperties = {
  component: 'shadowProperties',
  properties: shadowProps,
  defaultValues: {boxShadow :'0px 0px 0px 0px rgb(0,0,0)', textShadow: '0px 0px 0px rgb(0,0,0)'},
  Interpolate: {numbers,colors},
  functions: shadowFunctions,
  Util: { processShadowArray, trueColor }
}

export default shadowProperties

Components.ShadowProperties = shadowProperties
