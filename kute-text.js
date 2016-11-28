/* KUTE.js - The Light Tweening Engine
 * package - KUTE.js Text Plugin
 * desc - adds the tween numbers incremental and cool string writing/scrambling
 * by dnp_theme & @dalisoft
 * Licensed under MIT-License
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kute.js'], factory);
  } else if(typeof module == 'object' && typeof require == 'function') {
    module.exports = factory(require('kute.js'));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    factory(root.KUTE);
  } else {
    throw new Error("Text-Plugin require KUTE.js.");
  }
}(this, function (KUTE) {
  'use strict';

  var g = typeof global !== 'undefined' ? global : window, // connect to KUTE object and global
    K = KUTE, DOM = g.dom, prepareStart = K.prepareStart,
    parseProperty = K.parseProperty, number = g._number;
  
  // let's go with the plugin
  var _string = String("abcdefghijklmnopqrstuvwxyz").split(""), // lowercase
    _stringUppercase = String("abcdefghijklmnopqrstuvwxyz".toUpperCase()).split(""), // uppercase
    _symbols = String("~!@#$%^&*()_+{}[];'<>,./?\=-").split(""), // symbols
    _numeric = String("0123456789").split(""), // numeric
    _alphanumeric = _string.concat(_stringUppercase,_numeric), // alpha numeric
    _all = _alphanumeric.concat(_symbols), // all caracters
    random = Math.random, floor = Math.floor, min = Math.min;

  prepareStart['text'] = prepareStart['number'] = function(l,p,v){
    return l.innerHTML;
  }
    
  parseProperty['text'] = function(p,v,l) {
    if ( !( 'text' in DOM ) ) {
      DOM['text'] = function(l,p,a,b,v,o) {
        var tp = tp || o.textChars === 'alpha' ? _string // textChars is alpha
            : o.textChars === 'upper' ? _stringUppercase  // textChars is numeric
            : o.textChars === 'numeric' ? _numeric  // textChars is numeric
            : o.textChars === 'alphanumeric' ? _alphanumeric // textChars is alphanumeric
            : o.textChars === 'symbols' ? _symbols // textChars is symbols
            : o.textChars ? o.textChars.split('') // textChars is a custom text
            : _string, ll = tp.length,
            t = tp[floor((random() * ll))], ix = '', tx = '', fi = a.substring(0), f = b.substring(0); 

        // use string.replace(/<\/?[^>]+(>|$)/g, "") to strip HTML tags while animating ? this is definatelly a smart to do
        ix = a !== '' ? fi.substring(fi.length,floor(min(v * fi.length, fi.length))) : ''; // initial text, A value 
        tx = f.substring(0,floor(min(v * f.length, f.length))); // end text, B value
        l.innerHTML = v < 1 ? tx + t + ix : b;
      }
    }
    return v;
  }
    
  parseProperty['number'] = function(p,v,l) {
    if ( !( 'number' in DOM ) ) {
      DOM['number'] = function(l,p,a,b,v) {
        l.innerHTML = floor( number(a, b, v));
      }
    }
    return parseInt(v) || 0;
  }

  return this;
}));