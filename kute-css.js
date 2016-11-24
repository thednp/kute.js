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

  var g = typeof global !== 'undefined' ? global : window, K = KUTE, DOM = g.dom, 
    parseProperty = K.parseProperty, prepareStart = K.prepareStart, property = K.property,
    getCurrentStyle = K.getCurrentStyle, trueDimension = K.truD, trueColor = K.truC,
    number = g._number, unit = g._unit, color = g._color,
    _colors = ['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    _radius  = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'], // border radius px/%
    _boxModel  = ['right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 
      'padding', 'margin', 'paddingTop','paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop','marginBottom', 'marginLeft', 'marginRight', 
      'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'], // dimensions / box model
    _textProperties  = ['fontSize','lineHeight','letterSpacing','wordSpacing'], // text properties
    _clip = ['clip'], _bg  = ['backgroundPosition'], // clip | background position
    _mergeTextAndBox = _boxModel.concat(_textProperties), // a merge of all properties with px|%|em|rem|etc unit
    _mergeUnits = _radius.concat(_boxModel,_textProperties), // a merge of all properties with px|%|em|rem|etc unit
    _all = _colors.concat(_clip, _radius, _boxModel, _textProperties, _bg), al = _all.length, 
    _defaults = _defaults || {}; //all properties default values  
 
  //populate default values object
  for ( var i=0; i< al; i++ ){
    if (_colors.indexOf(_all[i]) !== -1){
      _defaults[_all[i]] = 'rgba(0,0,0,0)'; // _defaults[p] = {r:0,g:0,b:0,a:1};
    } else if ( _mergeUnits.indexOf(_all[i]) !== -1 ) {
      _defaults[_all[i]] = 0;      
    } else if ( _bg.indexOf(_all[i]) !== -1 ){
      _defaults[_all[i]] = [50,50];
    } else if ( _all[i] === 'clip' ){
      _defaults[_all[i]] = [0,0,0,0];  
    }
  }
  
  // create prepare/process/render functions for additional colors properties
  for (var i = 0, l = _colors.length; i<l; i++) {
    parseProperty[_colors[i]] = function(p,v) {
      if (!(p in DOM)) {
        DOM[p] = function(l,p,a,b,v,o) {
          l.style[p] = color(a,b,v,o.keepHex);
        };
      }
      return trueColor(v); 
    };
    prepareStart[_colors[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || _defaults[p];
    };
  }
  
  // create prepare/process/render functions for additional box model properties
  for (var i = 0, l = _mergeTextAndBox.length; i<l; i++) {
    parseProperty[_mergeTextAndBox[i]] = function(p,v){
      if (!(p in DOM)){
        DOM[p] = function(l,p,a,b,v){
          l.style[p] = unit(a.v,b.v,b.u,v);
        }
      }
      return trueDimension(v); 
    };
    prepareStart[_mergeTextAndBox[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || _defaults[p];
    };
  }
  
  //create prepare/process/render functions for radius properties
  for (var i = 0, l = _radius.length; i<l; i++) {
    var prefixedProp = property(_radius[i]);
    parseProperty[prefixedProp] = function(p,v){
      if ( (!(p in DOM)) ) {
        DOM[p] = function(l,p,a,b,v){
          l.style[p] = unit(a.v,b.v,b.u,v);
        }
      }
      return trueDimension(v);
    };
    prepareStart[prefixedProp] = function(el,p,v){
      return getCurrentStyle(el,prefixedProp) || _defaults[p];
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
    return getCurrentStyle(el,p) || _defaults[p];
  }
  
  return this;
});