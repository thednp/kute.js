/* KUTE.js - The Light Tweening Engine
 * package - Attributes Plugin
 * desc - enables animation for any numeric presentation attribute
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (root,factory) {
  if (typeof define === 'function' && define.amd) {
    define(["kute.js"], factory);
  } else if(typeof module == "object" && typeof require == "function") {
    module.exports = factory(require("./kute.js"));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    factory(root.KUTE);
  } else {
    throw new Error("Attributes Plugin require KUTE.js.");
  }
}(this, function (KUTE) {
  'use strict';

  var g = typeof global !== 'undefined' ? global : window, K = KUTE, DOM = g.dom, prepareStart = K.prS, parseProperty = K.pp,
    unit = g.Interpolate.unit, number = g.Interpolate.number, color = g.Interpolate.color,
    getCurrentValue = function(e,a){ return e.getAttribute(a); }, // get current attribute value
    svgColors = ['fill','stroke','stop-color'], trueColor = K.truC, trueDimension = K.truD, atts,
    replaceUppercase = function(a) {
      return a.replace(/[A-Z]/g, "-$&").toLowerCase();
    }; 
  
  prepareStart['attr'] = function(el,p,v){
    var f = {};
    for (var a in v){
      var _a = replaceUppercase(a).replace(/_+[a-z]+/,''),
        _v = getCurrentValue(el,_a); // get the value for 'fill-opacity' not fillOpacity
      f[_a] = svgColors.indexOf(replaceUppercase(a)) !== -1 ? (_v || 'rgba(0,0,0,0)') : (_v || (/opacity/i.test(a) ? 1 : 0));
    }
    return f;
  };
  
  // process attributes object K.pp.attr(t[x]) 
  // and also register their render functions
  parseProperty['attr'] = function(a,o,l){
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
      if ( svgColors.indexOf(prop) === -1 && (/(%|[a-z]+)$/.test(o[p]) || /(%|[a-z]+)$/.test(cv)) ) {
        var u = trueDimension(cv).u || trueDimension(o[p]).u, s = /%/.test(u) ? '_percent' : '_'+u;
        if (!(p+s in atts)) {
          atts[p+s] = function(l,p,a,b,v) {
            var _p = _p || replaceUppercase(p).replace(s,'');
            l.setAttribute(_p, unit(a.v,b.v,b.u,v) );
          }
        }
        ats[p+s] = trueDimension(o[p]);       
      } else if ( svgColors.indexOf(prop) > -1 ) {
        if (!(p in atts)) {
          atts[p] = function(l,u,a,b,v) {
            var _u = _u || replaceUppercase(u);
            l.setAttribute(_u, color(a,b,v,o.keepHex));
          }
        }
        ats[p] = trueColor(o[p]);     
      } else {
        if (!(p in atts)) {
          atts[p] = function(l,o,a,b,v) {
            var _o = _o || replaceUppercase(o);
            l.setAttribute(_o, number(a,b,v));
          }
        }
        ats[p] = parseFloat(o[p]);     
      }
    }
    return ats;
  }

}));