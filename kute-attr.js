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
    gCA = function(e,a){ // get current attribute value
      return e.getAttribute(a);
    };
  
  K.prS['attr'] = function(el,p,v){
    var f = {};
    for (var a in v){
      f[a.replace(/_+[a-z]+/,'')] = gCA(el,a.replace(/_+[a-z]+/,''));
    }
    return f;
  };
  
  // process attributes object K.pp.attr(t[x]) 
  // and also register their render functions
  PP['attr'] = function(a,o){
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
      if ( /%|px/.test(o[p]) ) {
        var u = K.truD(o[p]).u, s = /%/.test(u) ? '_percent' : '_'+u;
        if (!(p+s in atts)) {
          atts[p+s] = function(l,p,a,b,v) {
            var _p = p.replace(s,'');
            l.setAttribute(_p, unit(a.v,b.v,b.u,v) );
          }
        }
        ats[p+s] = K.truD(o[p]);       
      } else {
        if (!(p in atts)) {
          atts[p] = function(l,o,a,b,v) {
            l.setAttribute(o, number(a,b,v));
          }
        }
        ats[p] = parseFloat(o[p]);     
      }
    }
    return ats;
  }

}));