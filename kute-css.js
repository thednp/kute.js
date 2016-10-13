/* KUTE.js - The Light Tweening Engine
 * package CSS Plugin
 * by dnp_theme
 * Licensed under MIT-License
 */
(function(root,factory){
  if (typeof define === 'function' && define.amd) {
    define(['kute.js'], factory);
  } else if(typeof module == 'object' && typeof require == 'function') {
    module.exports = factory(require('kute.js'));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    factory(root.KUTE);
  } else {
    throw new Error("CSS Plugin require KUTE.js.")
  }
})(this, function(KUTE){
  'use strict';

  var g = typeof global !== 'undefined' ? global : window, K = KUTE, DOM = g.dom, parseProperty = K.pp, prepareStart = K.prS, 
    getCurrentStyle = K.gCS, trueDimension = K.truD, trueColor = K.truC,
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
    if (_cls.indexOf(_all[i]) !== -1){
      _d[_all[i]] = 'rgba(0,0,0,0)'; // _d[p] = {r:0,g:0,b:0,a:1};
    } else if ( _mg.indexOf(_all[i]) !== -1 ) {
      _d[_all[i]] = 0;      
    } else if ( _bg.indexOf(_all[i]) !== -1 ){
      _d[_all[i]] = [50,50];
    } else if ( _all[i] === 'clip' ){
      _d[_all[i]] = [0,0,0,0];  
    }
  }
  
  // create prepare/process/render functions for additional colors properties
  for (var i = 0, l = _cls.length; i<l; i++) {
    parseProperty[_cls[i]] = function(p,v) {
      if (!(p in DOM)) {
        DOM[p] = function(l,p,a,b,v,o) {
          l.style[p] = color(a,b,v,o.keepHex);
        };
      }
      return trueColor(v); 
    };
    prepareStart[_cls[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || _d[p];
    };
  }
  
  // create prepare/process/render functions for additional box model properties
  for (var i = 0, l = _mg.length; i<l; i++) {
    parseProperty[_mg[i]] = function(p,v){
      if (!(p in DOM)){
        DOM[p] = function(l,p,a,b,v){
          l.style[p] = unit(a.v,b.v,b.u,v);
        }
      }
      return trueDimension(v); 
    };
    prepareStart[_mg[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || _d[p];
    };
  }
  
  //create prepare/process/render functions for radius properties
  for (var i = 0, l = _rd.length; i<l; i++) {
    parseProperty[_rd[i]] = function(p,v){
      if ( (!(p in DOM)) ) {
        if (p === 'borderRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_br] = unit(a.v,b.v,b.u,v);
          }    
        } else if (p === 'borderTopLeftRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brtl] = unit(a.v,b.v,b.u,v);
          }  
        } else if (p === 'borderTopRightRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brtr] = unit(a.v,b.v,b.u,v);
          }
        } else if (p === 'borderBottomLeftRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brbl] = unit(a.v,b.v,b.u,v);
          }
        } else if (p === 'borderBottomRightRadius') {
          DOM[p] = function(l,p,a,b,v){
            l.style[_brbr] = unit(a.v,b.v,b.u,v);
          }
        }
      }
      return trueDimension(v);
    };
    prepareStart[_rd[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || _d[p];
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
      return [ trueDimension(v[0]), trueDimension(v[1]), trueDimension(v[2]), trueDimension(v[3]) ];
    } else {       
      var ci = v.replace(/rect|\(|\)/g,''); 
      ci = /\,/g.test(ci) ? ci.split(/\,/g) : ci.split(/\s/g);
      return [ trueDimension(ci[0]),  trueDimension(ci[1]), trueDimension(ci[2]),  trueDimension(ci[3]) ];
    }
  };
  
  prepareStart['clip'] = function(el,p,v){
    var c = getCurrentStyle(el,p), w = getCurrentStyle(el,'width'), h = getCurrentStyle(el,'height');      
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
      return { x: trueDimension(v[0])||{ v: 50, u: '%' }, y: trueDimension(v[1])||{ v: 50, u: '%' } };
    } else {
      var posxy = v.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/g,50), xp, yp;
      posxy = /\,/g.test(posxy) ? posxy.split(/\,/g) : posxy.split(/\s/g); posxy = posxy.length === 2 ? posxy : [posxy[0],50];
      xp = trueDimension(posxy[0]); yp = trueDimension(posxy[1]);
      return { x: xp, y: yp };
    }
  }
  prepareStart['backgroundPosition'] = function(el,p,v){
    return getCurrentStyle(el,p) || _d[p];
  }
  
  return this;
});