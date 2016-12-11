/* KUTE.js - The Light Tweening Engine
 * package - Attributes Plugin
 * desc - enables animation for color attributes and any numeric presentation attribute
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
    throw new Error("Attributes Plugin require KUTE.js.");
  }
}(this, function (KUTE) {
  'use strict';

  var g = typeof global !== 'undefined' ? global : window, // connect to KUTE object and global
    K = KUTE, DOM = K.dom, prepareStart = K.prepareStart, parseProperty = K.parseProperty,
    trueColor = K.truC, trueDimension = K.truD, crossCheck = K.crossCheck,
    unit = g.Interpolate.unit, number = g.Interpolate.number, color = g.Interpolate.color;

  // here we go with the plugin
  var getCurrentValue = function(e,a){ return e.getAttribute(a); }, // get current attribute value
    svgColors = ['fill','stroke','stop-color'], attributes,
    replaceUppercase = function(a) {
      return a.replace(/[A-Z]/g, "-$&").toLowerCase();
    }; 
  
  prepareStart.attr = function(p,v){
    var attrStartValues = {};
    for (var a in v){
      var attribute = replaceUppercase(a).replace(/_+[a-z]+/,''),
        currentValue = getCurrentValue(this.element,attribute); // get the value for 'fill-opacity' not fillOpacity
      attrStartValues[attribute] = svgColors.indexOf(attribute) !== -1 ? (currentValue || 'rgba(0,0,0,0)') : (currentValue || (/opacity/i.test(a) ? 1 : 0));
    }
    return attrStartValues;
  };
  
  // process attributes object K.pp.attr(t[x]) 
  // and also register their render functions
  parseProperty.attr = function(a,o){
    if (!('attr' in DOM)) {
      DOM.attr = function(l,p,a,b,v) {
        for ( var o in b ){
          DOM.attributes[o](l,o,a[o],b[o],v);
        }
      }
      attributes = DOM.attributes = {}
    }

    var attributesObject = {};
    for ( var p in o ) {
      var prop = replaceUppercase(p), regex = /(%|[a-z]+)$/, cv = getCurrentValue(this.element,prop.replace(/_+[a-z]+/,''));
      if ( svgColors.indexOf(prop) === -1) {
        if ( cv !== null && regex.test(cv) ) {
          var prefix = trueDimension(cv).u || trueDimension(o[p]).u, s = /%/.test(prefix) ? '_percent' : '_'+prefix;
          if (!(prop+s in attributes)) {
            if (/%/.test(prefix)) {
              attributes[prop+s] = function(l,p,a,b,v) {
                var _p = _p || p.replace(s,'');
                l.setAttribute(_p, ((number(a.v,b.v,v) * 100>>0)/100) + b.u );
              }
            } else {
              attributes[prop+s] = function(l,p,a,b,v) {
                var _p = _p || p.replace(s,'');
                l.setAttribute(_p, (number(a.v,b.v,v)>>0) + b.u );
              }
            }
          }
          attributesObject[prop+s] = trueDimension(o[p]); 
        } else if ( !regex.test(o[p]) || cv === null || cv !== null && !regex.test(cv) ) {
          if (!(prop in attributes)) {
            if (/opacity/i.test(p)) {
              attributes[prop] = function(l,o,a,b,v) {
                l.setAttribute(o, (number(a,b,v) * 100 >> 0) / 100 );
              }
            } else {
              attributes[prop] = function(l,o,a,b,v) {
                l.setAttribute(o, (number(a,b,v) *10 >> 0 ) / 10 );
              }
            }
          }
          attributesObject[prop] = parseFloat(o[p]);     
        }        
      } else {
        if (!(prop in attributes)) {
          attributes[prop] = function(l,u,a,b,v) {
            l.setAttribute(u, color(a,b,v,o.keepHex));
          }
        }
        attributesObject[prop] = trueColor(o[p]);
      }
    }
    return attributesObject;
  }

  return this;
}));