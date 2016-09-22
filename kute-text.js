/* KUTE.js - The Light Tweening Engine
 * package - KUTE.js Text Plugin
 * desc - adds the tween numbers incremental and cool string writing/scrambling
 * by dnp_theme & @dalisoft
 * Licensed under MIT-License
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    var KUTE = require("./kute.js");   
    module.exports = factory();
  } else if ( typeof window.KUTE !== 'undefined' ) {		
    factory();
  } else {
    throw new Error("Text-Plugin requires KUTE.js.");
  }
}( function (KUTE) {
  'use strict';
  var K = window.KUTE, DOM = K.dom, prepareStart = K.prS, 
    parseProperty = K.pp, number = K.Interpolate.number,
    _s = String("abcdefghijklmnopqrstuvwxyz").split(""), // lowercase
    _S = String("abcdefghijklmnopqrstuvwxyz".toUpperCase()).split(""), // uparsePropertyercase
    _sb = String("~!@#$%^&*()_+{}[];'<>,./?\=-").split(""), // symbols
    _n = String("0123456789").split(""), // numeric
    _a = _s.concat(_S,_n), // alpha numeric
    _all = _a.concat(_sb), // all caracters
    random = Math.random, floor = Math.floor, min = Math.min;

  prepareStart['text'] = prepareStart['number'] = function(l,p,v){
    return l.innerHTML;
  }
    
  parseProperty['text'] = function(p,v,l) {
    if ( !( 'text' in DOM ) ) {
      DOM['text'] = function(l,p,a,b,v,o) {
        var tp = tp || o.textChars === 'alpha' ? _s // textChars is alpha
            : o.textChars === 'upper' ? _S  // textChars is numeric
            : o.textChars === 'numeric' ? _n  // textChars is numeric
            : o.textChars === 'alphanumeric' ? _a // textChars is alphanumeric
            : o.textChars === 'symbols' ? _sb // textChars is symbols
            : o.textChars ? o.textChars.split('') // textChars is a custom text
            : _s, ll = tp.length,
            t = tp[floor((random() * ll))], ix = '', tx = '', fi = a.substring(0), f = b.substring(0); 

        // use string.replace(/<\/?[^>]+(>|$)/g, "") to strip HTML tags while animating ?
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
        l.innerHTML = parseInt( number(a, b, v));
      }
    }
    return parseInt(v) || 0;
  }

  return this;
}));