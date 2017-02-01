/* KUTE.js - The Light Tweening Engine
 * package - KUTE.js Text Plugin
 * desc - adds the tween numbers incremental and cool string writing/scrambling
 * by dnp_theme & @dalisoft
 * Licensed under MIT-License
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./kute.js'], factory);
  } else if(typeof module == 'object' && typeof require == 'function') {
    module.exports = factory(require('./kute.js'));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    factory(root.KUTE);
  } else {
    throw new Error("Text-Plugin require KUTE.js.");
  }
}(this, function (KUTE) {
  'use strict';

  var g = typeof global !== 'undefined' ? global : window, // connect to KUTE object and global
    K = KUTE, DOM = K.dom, prepareStart = K.prepareStart,
    parseProperty = K.parseProperty, number = g.Interpolate.number,
    defaultOptions = K.defaultOptions;

  // let's go with the plugin
  var lowerCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").split(""), // lowercase
    upperCaseAlpha = String("abcdefghijklmnopqrstuvwxyz".toUpperCase()).split(""), // uppercase
    nonAlpha = String("~!@#$%^&*()_+{}[];'<>,./?\=-").split(""), // symbols
    numeric = String("0123456789").split(""), // numeric
    alphaNumeric = lowerCaseAlpha.concat(upperCaseAlpha,numeric), // alpha numeric
    allTypes = alphaNumeric.concat(nonAlpha), // all caracters
    random = Math.random, min = Math.min;

  // set default textChars tween option since 1.6.1
  defaultOptions.textChars = 'alpha'; 

  prepareStart.text = prepareStart.number = function(p,v){
    return this.element.innerHTML;
  }

  parseProperty.text = function(p,v) {
    if ( !( 'text' in DOM ) ) {
      DOM.text = function(l,p,a,b,v,o) {
        var tp = tp || o.textChars === 'alpha' ? lowerCaseAlpha // textChars is alpha
            : o.textChars === 'upper' ? upperCaseAlpha  // textChars is numeric
            : o.textChars === 'numeric' ? numeric  // textChars is numeric
            : o.textChars === 'alphanumeric' ? alphaNumeric // textChars is alphanumeric
            : o.textChars === 'symbols' ? nonAlpha // textChars is symbols
            : o.textChars ? o.textChars.split('') // textChars is a custom text
            : lowerCaseAlpha, ll = tp.length,
            t = tp[(random() * ll)>>0], initialText = '', endText = '', firstLetterA = a.substring(0), firstLetterB = b.substring(0);

        // use string.replace(/<\/?[^>]+(>|$)/g, "") to strip HTML tags while animating ? this is definatelly a smart TO DO
        initialText = a !== '' ? firstLetterA.substring(firstLetterA.length, min(v * firstLetterA.length, firstLetterA.length)>>0 ) : ''; // initial text, A value
        endText = firstLetterB.substring(0, min(v * firstLetterB.length, firstLetterB.length)>>0 ); // end text, B value
        l.innerHTML = v < 1 ? endText + t + initialText : b;
      }
    }
    return v;
  }

  parseProperty['number'] = function(p,v,l) {
    if ( !( 'number' in DOM ) ) {
      DOM.number = function(l,p,a,b,v) {
        l.innerHTML = number(a, b, v)>>0;
      }
    }
    return parseInt(v) || 0;
  }

  return this;
}));