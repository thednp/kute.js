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
    module.exports = factory(KUTE);
  } else if ( typeof window.KUTE !== 'undefined' ) {		
    factory();
  } else {
    throw new Error("Text-Plugin requires KUTE.js.");
  }
}( function () {
  var K = window.KUTE,
    _s = String("abcdefghijklmnopqrstuvwxyz").split(""), // lowercase
    _S = String("abcdefghijklmnopqrstuvwxyz".toUpperCase()).split(""), // uppercase
    _sb = String("~!@#$%^&*()_+{}[];'<>,./?\=-").split(""), // symbols
    _n = String("0123456789").split(""), // numeric
    _a = _s.concat(_S,_n), // alpha numeric
    _all = _a.concat(_sb), // all caracters
    _r = Math.random, _f = Math.floor, _m = Math.min;

  K.prS['text'] = K.prS['number'] = function(l,p,v){
    return l.innerHTML;
  }
    
  K.pp['text'] = function(p,v,l) {
    if ( !( 'text' in K.dom ) ) {
      K.dom['text'] = function(w,p,v) {
        var tp = tp || w.textChars === 'alpha' ? _s // textChars is alpha
            : w.textChars === 'upper' ? _S  // textChars is numeric
            : w.textChars === 'numeric' ? _n  // textChars is numeric
            : w.textChars === 'alphanumeric' ? _a // textChars is alphanumeric
            : w.textChars === 'symbols' ? _sb // textChars is symbols
            : w.textChars ? w.textChars.split('') // textChars is a custom text
            : _s, l = tp.length, s = w._vE[p], 
            t = tp[_f((_r() * l))], tx = '', f = s.substring(0); 

        tx = f.substring(0,_f(_m(v * f.length, f.length)));
        w._el.innerHTML = v < 1 ? tx+t : tx;
      }
    }
    return v;
  }
    
  K.pp['number'] = function(p,v,l) {
    if ( !( 'number' in K.dom ) ) {
      K.dom['number'] = function(w,p,v) {
        w._el.innerHTML = parseInt(w._vS[p] + (w._vE[p] - w._vS[p]) * v);
      }
    }
    return parseInt(v) || 0;
  }

  return this;
}));