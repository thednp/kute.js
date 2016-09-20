/* KUTE.js - The Light Tweening Engine
 * package - Attributes Plugin
 * desc - enables animation for any numeric presentation attribute
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    // We assume, that require() is sync.
    var KUTE = require("./kute.js");   
    // Export the modified one. Not really required, but convenient.
    module.exports = factory(KUTE);
  } else if ( typeof window.KUTE !== 'undefined' ) {
    // Browser globals		
    factory(KUTE);
  } else {
    throw new Error("Attributes Plugin require KUTE.js.");
  }
}( function (KUTE) {
  'use strict';

  var K = window.KUTE, DOM = K.dom, PP = K.pp, unit = K.Interpolate.unit, number = K.Interpolate.number, atts,
    getCurrentValue = function(e,a){ return e.getAttribute(a); }, // get current attribute value
    replaceUppercase = function(a) {
      return /[A-Z]/g.test(a) ? a.replace(a.match(/[A-Z]/g)[0],'-'+a.match(/[A-Z]/g)[0].toLowerCase()) : a;
    }; 
  
  K.prS['attr'] = function(el,p,v){
    var f = {};
    for (var a in v){
      var _a = replaceUppercase(a).replace(/_+[a-z]+/,''),
        _v = getCurrentValue(el,_a); // get the value for 'fill-opacity' not fillOpacity
      f[_a] = _v || (/opacity/i.test(a) ? 1 : 0);
    }
    return f;
  };
  
  // process attributes object K.pp.attr(t[x]) 
  // and also register their render functions
  PP['attr'] = function(a,o,l){
    if (!('attr' in DOM)) {
      DOM.attr = function(l,p,a,b,v) { 
        for ( var o in b ){
          DOM.attributes[o](l,o,a[o],b[o],v);
        }
      }
      atts = DOM.attributes = {}
    }

    var ats = {}, p;
    for ( p in o ) {
      var prop = replaceUppercase(p), cv = getCurrentValue(l,prop.replace(/_+[a-z]+/,''));
      if ( /%|[a-z]/.test(o[p]) || /%|[a-z]/.test(cv) ) {
        var u = K.truD(cv).u || K.truD(o[p]).u, s = /%/.test(u) ? '_percent' : '_'+u; prop = prop.replace(s,'');
        if (!(p+s in atts)) {
          atts[p+s] = function(l,p,a,b,v) {
            l.setAttribute(prop, unit(a.v,b.v,b.u,v) );
          }
        }
        ats[p+s] = K.truD(o[p]);       
      } else {
        if (!(p in atts)) {
          atts[p] = function(l,o,a,b,v) {
            l.setAttribute(prop, number(a,b,v));
          }
        }
        ats[p] = parseFloat(o[p]);     
      }
    }
    return ats;
  }

}));