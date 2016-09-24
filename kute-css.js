/* KUTE.js - The Light Tweening Engine
 * package CSS Plugin
 * by dnp_theme
 * Licensed under MIT-License
 */
(function(factory){
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    var KUTE = require("./kute.js");
    // Export the modified one. Not really required, but convenient.
    module.exports = factory(KUTE);
  } else if(typeof window.KUTE != "undefined") {
    factory(KUTE);
  } else {
    throw new Error("CSS Plugin require KUTE.js.")
  }
})(function(KUTE){
  'use strict';
  var g = window, K = g.KUTE, p, DOM = g.dom, parseProperty = K.pp, prepareStart = K.prS, getComputedStyle = K.gCS,
    _br = K.property('borderRadius'), _brtl = K.property('borderTopLeftRadius'), _brtr = K.property('borderTopRightRadius'), // all radius props prefixed
    _brbl = K.property('borderBottomLeftRadius'), _brbr = K.property('borderBottomRightRadius'),
    _cls = ['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    _rd  = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'], // border radius px/any
    _bm  = ['right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 
    'padding', 'margin', 'paddingTop','paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop','marginBottom', 'marginLeft', 'marginRight', 
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'], // dimensions / box model
    _tp  = ['fontSize','lineHeight','letterSpacing','wordSpacing'], // text properties
    _clp = ['clip'], _bg  = ['backgroundPosition'], // clip | background position
     
    _mg = _rd.concat(_bm,_tp), // a merge of all properties with px|%|em|rem|etc unit
    _all = _cls.concat(_clp, _rd, _bm, _tp, _bg), al = _all.length, 
    number = g.Interpolate.number, unit = g.Interpolate.unit, color = g.Interpolate.color,
    _d = _d || {}; //all properties default values  
 
  //populate default values object
  for ( var i=0; i< al; i++ ){
    p = _all[i];
    if (_cls.indexOf(p) !== -1){
      _d[p] = 'rgba(0,0,0,0)'; // _d[p] = {r:0,g:0,b:0,a:1};
    } else if ( _mg.indexOf(p) !== -1 ) {
      _d[p] = 0;      
    } else if ( _bg.indexOf(p) !== -1 ){
      _d[p] = [50,50];
    } else if ( p === 'clip' ){
      _d[p] = [0,0,0,0];  
    }
  }
  
  // create prepare/process/render functions for additional colors properties
  for (var i = 0, l = _cls.length; i<l; i++) {
    p = _cls[i];
    parseProperty[p] = function(p,v) {
      if (!(p in DOM)) {
        DOM[p] = function(l,p,a,b,v,o) {
          l.style[p] = color(a,b,v,o.keepHex);
        };
      }
      return parseProperty.cls(p,v);
    };
    prepareStart[p] = function(el,p,v){
      return getComputedStyle(el,p) || _d[p];
    };
  }
  
  // create prepare/process/render functions for additional box model properties
  for (var i = 0, l = _mg.length; i<l; i++) {
    p = _mg[i];
    parseProperty[p] = function(p,v){
      if (!(p in DOM)){
        DOM[p] = function(l,p,a,b,v){
          l.style[p] = unit(a.value,b.value,b.unit,v);
        }
      }
      return parseProperty.box(p,v);
    };
    prepareStart[p] = function(el,p,v){
      return getComputedStyle(el,p) || _d[p];
    };
  }
  
  //create prepare/process/render functions for radius properties
  for (var i = 0, l = _rd.length; i<l; i++) {
    p = _rd[i];
    parseProperty[p] = function(p,v){
      if ( (!(p in DOM)) ) {
        if (p === 'borderRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_br] = unit(a.value,b.value,b.unit,v);
          }    
        } else if (p === 'borderTopLeftRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brtl] = unit(a.value,b.value,b.unit,v);
          }  
        } else if (p === 'borderTopRightRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brtr] = unit(a.value,b.value,b.unit,v);
          }
        } else if (p === 'borderBottomLeftRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brbl] = unit(a.value,b.value,b.unit,v);
          }
        } else if (p === 'borderBottomRightRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brbr] = unit(a.value,b.value,b.unit,v);
          }
        }
      }      
      return parseProperty.box(p,v);
    };
    prepareStart[p] = function(el,p,v){
      return getComputedStyle(el,p) || _d[p];
    };
  }
  
  // clip
  parseProperty['clip'] = function(p,v){
    if ( !(p in DOM) ) {
      DOM[p] = function(l,p,a,b,v) {
        var h = 0, cl = [];
        for (h;h<4;h++){
          var c1 = a[h].v, c2 = b[h].v, cu = b[h].u || 'px';
          cl[h] = unit(c1,c2,cu,v);
        }  
        l.style[p] = 'rect('+cl+')';
      };
    }
    if ( v instanceof Array ){
      return [ K.truD(v[0]), K.truD(v[1]), K.truD(v[2]), K.truD(v[3]) ];
    } else {       
      var ci = v.replace(/rect|\(|\)/g,''); 
      ci = /\,/g.test(ci) ? ci.split(/\,/g) : ci.split(/\s/g);
      return [ K.truD(ci[0]),  K.truD(ci[1]), K.truD(ci[2]),  K.truD(ci[3]) ];
    }
  };
  
  prepareStart['clip'] = function(el,p,v){
    var c = getComputedStyle(el,p), w = getComputedStyle(el,'width'), h = getComputedStyle(el,'height');      
    return !/rect/.test(c) ? [0, w, h, 0] : c;
  };
    
  // background position
  parseProperty['backgroundPosition'] = function(p,v) {
    if ( !(p in DOM) ) {        
      DOM[p] = function(l,p,a,b,v) {
        l.style[p] = unit(a.x.v,b.x.v,'%',v) + ' ' + unit(a.y.v,b.y.v,'%',v);
      };
    }
    if ( v instanceof Array ){        
      return { x: K.truD(v[0])||{ v: 50, u: '%' }, y: K.truD(v[1])||{ v: 50, u: '%' } };
    } else {
      var posxy = v.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/g,50), xp, yp;
      posxy = /\,/g.test(posxy) ? posxy.split(/\,/g) : posxy.split(/\s/g); posxy = posxy.length === 2 ? posxy : [posxy[0],50];
      xp = K.truD(posxy[0]); yp = K.truD(posxy[1]);
      return { x: xp, y: yp };
    }
  }
  prepareStart['backgroundPosition'] = function(el,p,v){
    return getComputedStyle(el,p) || _d[p];
  }
  
  return this;
});