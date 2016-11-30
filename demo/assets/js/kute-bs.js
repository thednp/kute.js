/* KUTE.js - The Light Tweening Engine
 * package - Box Shadow Plugin
 * desc - adds support for boxShadow property with an array of values [h-shadow, v-shadow, blur, spread, color, inset]
 * examples
 * var bShadowTween1 = KUTE.to('selector', {boxShadow: '1px 1px 1px #069'}); // accepting string value
 * var bShadowTween2 = KUTE.to('selector', {boxShadow: [1, 1, 1, '#069', 'inset'] }); // accepting array value
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (root,factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kute.js'], factory);
  } else if(typeof module == 'object' && typeof require == 'function') {
    module.exports = factory(require('kute.js'));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    factory(root.KUTE);
  } else {
    throw new Error("Box Shadow Plugin require KUTE.js.");
  }
}(this, function (KUTE) {
  'use strict';
  
  // add a reference to KUTE object
  var g = typeof global !== 'undefined' ? global : window, K = KUTE, 
    // add a reference to KUTE utilities
    prepareStart = K.prepareStart, parseProperty = K.parseProperty,
    property = K.property, getCurrentStyle = K.getCurrentStyle, trueColor = K.truC,
    DOM = K.dom, unit = g.Interpolate.unit, color = g.Interpolate.color, // interpolation functions

    // the preffixed boxShadow property, mostly for legacy browsers
    // maybe the browser is supporting the property with its vendor preffix
    // box-shadow: none|h-shadow v-shadow blur spread color |inset|initial|inherit;
    _boxShadow = property('boxShadow'), // note we're using the KUTE.property() autopreffix utility
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
  prepareStart.boxShadow = function(property,value){
    var cssBoxShadow = getCurrentStyle(this.element,_boxShadow);
    return /^none$|^initial$|^inherit$|^inset$/.test(cssBoxShadow) ? '0px 0px 0px 0px rgb(0,0,0)' : cssBoxShadow;
  }

  // the parseProperty for boxShadow 
  // registers the K.dom['boxShadow'] function 
  // returns an array of 6 values with the following format
  // [horizontal, vertical, blur, spread, color: {r:0,g:0,b:0}, inset]
  parseProperty['boxShadow'] = function(property,value,element){
    if ( !('boxShadow' in DOM) ) {
      
      // the DOM update function for boxShadow registers here
      // we only enqueue it if the boxShadow property is used to tween
      DOM['boxShadow'] = function(element,property,startValue,endValue,progress) {

        // let's start with the numbers | set unit | also determine inset
        var numbers = [], px = 'px', // the unit is always px
          inset = startValue[5] !== 'none' || endValue[5] !== 'none' ? ' inset' : false; 
        for (var i=0; i<4; i++){
          numbers.push( unit( startValue[i], endValue[i], px, progress ) );
        }

        // now we handle the color
        var colorValue = color(startValue[4], endValue[4], progress);          
        
        // the final piece of the puzzle, the DOM update
        element.style[_boxShadow] = inset ? colorValue + numbers.join(' ') + inset : colorValue + numbers.join(' ');
      };
    }
    
    // parseProperty for boxShadow, builds basic structure with ready to tween values
    if (typeof value === 'string'){
      var shadowColor, inset = 'none';
      // make sure to always have the inset last if possible
      inset = /inset/.test(value) ? 'inset' : inset;
      value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g,'') : value;
   
      // also getComputedStyle often returns color first "rgb(0, 0, 0) 15px 15px 6px 0px inset"
      shadowColor = value.match(colRegEx); 
      value = value.replace(shadowColor[0],'').split(' ').concat([shadowColor[0].replace(/\s/g,'')],[inset]);
      
      value = processBoxShadowArray(value);
    } else if (value instanceof Array){
      value = processBoxShadowArray(value);
    }
    return value;
  }
    
  return this;
}));