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
  var K = window.KUTE;
  
  // get current attribute value
  K.gCA = function(e,a){
    return e.getAttribute(a);
  }
  
  K.prS['attr'] = function(el,p,v){
    var f = {};
    for (var a in v){
      f[a.replace(/_+[a-z]+/,'')] = K.gCA(el,a.replace(/_+[a-z]+/,''));
    }
    return f;
  };
  
  // register the render attributes object
  if (!('attr' in K.dom)) {
    K.dom.attr = function(w,p,v){
      for ( var o in w._vE[p] ){
        K.dom.attr.prototype[o](w,o,v);
      }
    }; 
  }
  
  var ra = K.dom.attr.prototype;
  
  // process attributes object K.pp.attr(t[x]) 
  // and also register their render functions
  K.pp['attr'] = function(a,o){
    var ats = {}, p;
    for ( p in o ) {
      if ( /%|px/.test(o[p]) ) {
        var u = K.truD(o[p]).u, s = /%/.test(u) ? '_percent' : '_'+u;
        if (!(p+s in ra)) {
          ra[p+s] = function(w,p,v){
            w._el.setAttribute(p.replace(s,''), (w._vS.attr[p].v + (w._vE.attr[p].v - w._vS.attr[p].v) * v) + w._vE.attr[p].u);
          }
        }
        ats[p+s] = K.truD(o[p]);       
      } else {
        if (!(p in ra)) {
          ra[p] = function(w,p,v){
            w._el.setAttribute(p, w._vS.attr[p] + (w._vE.attr[p]- w._vS.attr[p]) * v);
          }
        }
        ats[p] = o[p] * 1;     
      }
    }
    return ats;
  }

}));