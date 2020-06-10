import KUTE from '../objects/KUTE.js'
import getStyleForProperty from '../process/getStyleForProperty.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/Components.js'
import trueColor from '../util/trueColor.js'
import {numbers} from '../objects/Interpolate.js' 
import {colors} from './colorProperties.js' 

// const filterEffects = { property : 'filter', subProperties: {}, defaultValue: {}, interpolators: {} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Interpolation
export function dropShadow(a,b,v){
  let params = [], unit = 'px'

  for (let i=0; i<3; i++){
    params[i] = ((numbers(a[i],b[i],v) * 100 >>0) /100) + unit
  }
  return `drop-shadow(${params.concat( colors(a[3],b[3],v) ).join(' ') })`
}

function replaceDashNamespace(str){
  return str.replace('-r','R').replace('-s','S')
}

function parseDropShadow (shadow){
  let newShadow

  if (shadow.length === 3) { // [h-shadow, v-shadow, color]
    newShadow = [shadow[0], shadow[1], 0, shadow[2] ];
  } else if (shadow.length === 4) { // ideal [<offset-x>, <offset-y>, <blur-radius>, <color>]
    newShadow = [shadow[0], shadow[1], shadow[2], shadow[3]];
  }

  // make sure the values are ready to tween
  for (let i=0;i<3;i++){
    newShadow[i] = parseFloat(newShadow[i]);  
  }
  // also the color must be a rgb object
  newShadow[3] = trueColor(newShadow[3]);
  return newShadow;
}

// Component Util
function parseFilterString(currentStyle){
  let result = {}
  let fnReg = /(([a-z].*?)\(.*?\))(?=\s([a-z].*?)\(.*?\)|\s*$)/g
  let matches = currentStyle.match(fnReg);
  const fnArray = currentStyle !== 'none' ? matches : 'none'

  if (fnArray instanceof Array) {
    for (let j=0, jl = fnArray.length; j<jl; j++){
      let p = fnArray[j].trim().split(/\((.+)/);
      let pp = replaceDashNamespace(p[0]);
      if ( pp === 'dropShadow' ) {
        let shadowColor = p[1].match(/(([a-z].*?)\(.*?\))(?=\s(.*?))/)[0]
        let params = p[1].replace(shadowColor,'').split(/\s/).map(parseFloat)
        result[pp] = params.filter((el)=>!isNaN(el)).concat(shadowColor);
      } else {
        result[pp] = p[1].replace(/\'|\"|\)/g,'');
      }
    }
  }
  return result
}

// Component Functions
export function getFilter(tweenProp,value) {
  let currentStyle = getStyleForProperty(this.element,tweenProp),
      filterObject = parseFilterString(currentStyle), fnp

  for (let fn in value){
    fnp = replaceDashNamespace(fn)
    if ( !filterObject[fnp] ){
      filterObject[fnp] = defaultValues[tweenProp][fn]
    }
  }
  return filterObject;
}
export function prepareFilter(tweenProp,value) {
  let filterObject = {}, fnp

  // {opacity: [0-100%], blur: [0-Nem], saturate: [0-N%], invert: 0, grayscale: [0-100%], brightness: [0-N%], contrast: [0-N%], sepia: [0-N%], 'hueRotate': [0-Ndeg], 'dropShadow': [0,0,0,(r:0,g:0,b:0)], url:''},
  // {opacity: 100,      blur: 0,       saturate: 100,    invert: 0, grayscale: 0,        brightness: 100,    contrast: 100,    sepia: 0,      'hueRotate':0,         'dropShadow': 0,                     url:''},

  for (let fn in value){
    fnp = replaceDashNamespace(fn)
    if ( /hue/.test(fn) ) {
      filterObject[fnp] = parseFloat(value[fn])      
    } else if ( /drop/.test(fn)  ) {
      filterObject[fnp] = parseDropShadow(value[fn])
    } else if ( fn === 'url' ) {
      filterObject[fn] = value[fn]
    // } else if ( /blur|opacity|grayscale|sepia/.test(fn) ) {
    } else {
      filterObject[fn] = parseFloat(value[fn])
    }
  }

  return filterObject;
}
export function onStartFilter(tweenProp) {
  if ( this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      a.dropShadow||b.dropShadow && console.log(dropShadow(a.dropShadow,b.dropShadow,v))
      elem.style[tweenProp] = (b.url                      ? `url(${b.url})` : '')
                            + (a.opacity||b.opacity       ? `opacity(${((numbers(a.opacity,b.opacity,v) * 100)>>0)/100}%)` : '')
                            + (a.blur||b.blur             ? `blur(${((numbers(a.blur,b.blur,v) * 100)>>0)/100}em)` : '')
                            + (a.saturate||b.saturate     ? `saturate(${((numbers(a.saturate,b.saturate,v) * 100)>>0)/100}%)` : '')
                            + (a.invert||b.invert         ? `invert(${((numbers(a.invert,b.invert,v) * 100)>>0)/100}%)` : '')
                            + (a.grayscale||b.grayscale   ? `grayscale(${((numbers(a.grayscale,b.grayscale,v) * 100)>>0)/100}%)` : '')
                            + (a.hueRotate||b.hueRotate   ? `hue-rotate(${((numbers(a.hueRotate,b.hueRotate,v) * 100)>>0)/100 }deg)` : '')
                            + (a.sepia||b.sepia           ? `sepia(${((numbers(a.sepia,b.sepia,v) * 100)>>0)/100 }%)` : '')
                            + (a.brightness||b.brightness ? `brightness(${((numbers(a.brightness,b.brightness,v) * 100)>>0)/100 }%)` : '')
                            + (a.contrast||b.contrast     ? `contrast(${((numbers(a.contrast,b.contrast,v) * 100)>>0)/100 }%)` : '')
                            + (a.dropShadow||b.dropShadow ? dropShadow(a.dropShadow,b.dropShadow,v) : '')
    }
  }
}
export function crossCheckFilter(tweenProp){
  if ( this.valuesEnd[tweenProp] ) { 
    for (const fn in this.valuesStart[tweenProp]){
      if (!this.valuesEnd[tweenProp][fn]){
        this.valuesEnd[tweenProp][fn] = this.valuesStart[tweenProp][fn]
      }
    }
  }
}

// All Component Functions
export const filterFunctions = {
  prepareStart: getFilter,
  prepareProperty: prepareFilter,
  onStart: onStartFilter,
  crossCheck: crossCheckFilter
}

// Base Component
export const baseFilterOps = {
  component: 'filterEffects',
  property: 'filter',
  // subProperties: ['blur', 'brightness','contrast','dropShadow','hueRotate','grayscale','invert','opacity','saturate','sepia','url'], // opacity function interfere with opacityProperty
  // defaultValue: {opacity: 100, blur: 0, saturate: 100, grayscale: 0, brightness: 100, contrast: 100, sepia: 0, invert: 0, hueRotate:0, dropShadow: [0,0,0,{r:0,g:0,b:0}], url:''},
  Interpolate: {
    opacity: numbers,
    blur: numbers,
    saturate: numbers,
    grayscale: numbers,
    brightness: numbers,
    contrast: numbers,
    sepia: numbers,
    invert: numbers,
    hueRotate: numbers,
    dropShadow: {numbers,colors,dropShadow}
  },
  functions: {onStart:onStartFilter}
}

// Full Component
export const filterOps = {
  component: 'filterEffects',
  property: 'filter',
  // subProperties: ['blur', 'brightness','contrast','dropShadow','hueRotate','grayscale','invert','opacity','saturate','sepia','url'], // opacity function interfere with opacityProperty
  defaultValue: {opacity: 100, blur: 0, saturate: 100, grayscale: 0, brightness: 100, contrast: 100, sepia: 0, invert: 0, hueRotate:0, dropShadow: [0,0,0,{r:0,g:0,b:0}], url:''},
  Interpolate: {
    opacity: numbers,
    blur: numbers,
    saturate: numbers,
    grayscale: numbers,
    brightness: numbers,
    contrast: numbers,
    sepia: numbers,
    invert: numbers,
    hueRotate: numbers,
    dropShadow: {numbers,colors,dropShadow}
  },
  functions: filterFunctions,
  Util: {parseDropShadow,parseFilterString,replaceDashNamespace,trueColor}
}

Components.FilterEffects = filterOps
