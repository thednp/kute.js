/* KUTE.js - The Light Tweening Engine
 * package - Box Shadow Plugin
 * desc - adds support for boxShadow property with an array of values [h-shadow, v-shadow, blur, spread, color, inset]
 * examples
 * var bShadowTween1 = KUTE.to('selector', {boxShadow: '1px 1px 1px #069'}); // accepting string value
 * var bShadowTween2 = KUTE.to('selector', {boxShadow: [1, 1, 1, '#069', 'inset'] }); // accepting array value
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    var KUTE = require("./kute.js");   
    module.exports = factory(KUTE);
  } else if ( typeof window.KUTE !== 'undefined' ) {
    factory(KUTE);
  } else {
    throw new Error("Box Shadow Plugin require KUTE.js.");
  }
}( function (KUTE) {
  'use strict';
  
  // filter unsupported browsers
  if (!('boxShadow' in document.body.style)) {return;}
  // add a reference to KUTE object
  var g = window, K = g.KUTE, getComputedStyle = K.gCS,
    trueColor = K.truC, prepareStart = K.prS, parseProperty = K.pp, DOM = g.dom,
    unit = g.Interpolate.unit, color = g.Interpolate.color,

    // the preffixed boxShadow property, mostly for legacy browsers
    // maybe the browser is supporting the property with its vendor preffix
    // box-shadow: none|h-shadow v-shadow blur spread color |inset|initial|inherit;
    _boxShadow = K.property('boxShadow'), // note we're using the KUTE.property() autopreffix utility
    colRegEx = /(\s?(?:#(?:[\da-f]{3}){1,2}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))\s?)/gi, // a full RegEx for color strings
    // utility function to process values accordingly
    // numbers must be integers and color must be rgb object
    processBoxShadowArray = function(shadow){
      var newShadow, i;

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
      return newShadow;
    };

  // for the .to() method, you need to prepareStart the boxShadow property
  // which means you need to read the current computed value
  prepareStart['boxShadow'] = function(element,property,value){
    var cssBoxShadow = getComputedStyle(element,_boxShadow);
    return /^none$|^initial$|^inherit$|^inset$/.test(cssBoxShadow) ? '0px 0px 0px 0px rgb(0,0,0)' : cssBoxShadow;
  }

  // the processProperty for boxShadow 
  // registers the K.dom['boxShadow'] function 
  // returns an array of 6 values with the following format
  // [horizontal, vertical, blur, spread, color: {r:0,g:0,b:0}, inset]
  parseProperty['boxShadow'] = function(property,value,element){
    if ( !('boxShadow' in DOM) ) {
      
      // the DOM update function for boxShadow registers here
      // we only enqueue it if the boxShadow property is used to tween
      DOM['boxShadow'] = function(l,p,a,b,v) {

        // let's start with the numbers | set unit | also determine inset
        var numbers = [], px = 'px', // the unit is always px
          inset = a[5] !== 'none' || b[5] !== 'none' ? ' inset' : false; 
        for (var i=0; i<4; i++){
          numbers.push( unit( a[i], b[i], px, v ) );
        }

        // now we handle the color
        var colorValue = color(a[4],b[4],v);          
        
        // the final piece of the puzzle, the DOM update
        l.style[_boxShadow] = inset ? colorValue + numbers.join(' ') + inset : colorValue + numbers.join(' ');
      };
    }
    
    // parseProperty for boxShadow, builds basic structure with ready to tween values
    if (typeof value === 'string'){
      var currentColor, inset = 'none';
      // make sure to always have the inset last if possible
      inset = /inset/.test(value) ? 'inset' : inset;
      value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g,'') : value;
   
      // also getComputedStyle often returns color first "rgb(0, 0, 0) 15px 15px 6px 0px inset"
      currentColor = value.match(colRegEx); 
      value = value.replace(currentColor[0],'').split(' ').concat([currentColor[0].replace(/\s/g,'')],[inset]);
      
      value = processBoxShadowArray(value);
    } else if (value instanceof Array){
      value = processBoxShadowArray(value);
    }
    return value;
  }
    
  return this;
}));