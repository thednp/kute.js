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

  var g = typeof global !== 'undefined' ? global : window, K = KUTE, DOM = K.dom, // connect to KUTE object and global
    parseProperty = K.parseProperty, prepareStart = K.prepareStart, property = K.property,
    getCurrentStyle = K.getCurrentStyle, trueDimension = K.truD, trueColor = K.truC,
    number = g.Interpolate.number, unit = g.Interpolate.unit, color = g.Interpolate.color;

  // supported properties
  var _colors = ['borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    _boxModel  = ['right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 
      'padding', 'margin', 'paddingTop','paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop','marginBottom', 'marginLeft', 'marginRight', 
      'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'], // dimensions / box model
    _radius  = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'], // border radius px/%
    _textProperties  = ['fontSize','lineHeight','letterSpacing','wordSpacing'], // text properties
    _clip = ['clip'], _backgroundPosition  = ['backgroundPosition'], // clip | background position
    _textAndBox = _boxModel.concat(_textProperties), // a merge of all properties with px|%|em|rem|etc unit
    _mergeUnits = _radius.concat(_boxModel,_textProperties), // a merge of all properties with px|%|em|rem|etc unit
    _all = _colors.concat(_clip, _radius, _boxModel, _textProperties, _backgroundPosition), al = _all.length, 
    _defaults = _defaults || {}; //all properties default values  
 
  //populate default values object
  for ( var i=0; i< al; i++ ){
    if (_colors.indexOf(_all[i]) !== -1){
      _defaults[_all[i]] = 'rgba(0,0,0,0)'; // _defaults[p] = {r:0,g:0,b:0,a:1};
    } else if ( _mergeUnits.indexOf(_all[i]) !== -1 ) {
      _defaults[_all[i]] = 0;      
    } else if ( _backgroundPosition.indexOf(_all[i]) !== -1 ){
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
    prepareStart[_colors[i]] = function(p){
      return getCurrentStyle(this.element,p) || _defaults[p];
    };
  }
  
  // create prepare/process/render functions for additional box model properties
  for (var i = 0, l = _textAndBox.length; i<l; i++) {
    parseProperty[_textAndBox[i]] = function(p,v){
      if (!(p in DOM)){
        if (_boxModel.indexOf(p) > -1) {
          DOM[p] = function(l,p,a,b,v){
            l.style[p] = ( v > 0.98 || v<0.02 ? (number(a.v,b.v,v) * 100 >> 0)/100 : number(a.v,b.v,v)>>0 ) + b.u;
          }
        } else {
          DOM[p] = function(l,p,a,b,v){
            l.style[p] = ((number(a.v,b.v,v) * 100 >> 0)/100) + b.u;
          }
        }
      }
      return trueDimension(v); 
    };
    prepareStart[_textAndBox[i]] = function(p,v){
      return getCurrentStyle(this.element,p) || _defaults[p];
    };
  }
  
  //create prepare/process/render functions for radius properties
  for (var i = 0, l = _radius.length; i<l; i++) {

    parseProperty[_radius[i]] = function(p,v){
      if ( (!(p in DOM)) ) {
        DOM[p] = function(l,p,a,b,v){
          l.style[p] = ((number(a.v,b.v,v) * 100 >> 0)/100) + b.u;
        }
      }
      return trueDimension(v);
    };
    prepareStart[_radius[i]] = function(p,v){
      var radiusProp = p === _radius[0] ? _radius[1] : p; radiusProp = property(radiusProp); // old Safari has a problem with borderRadius
      return getCurrentStyle(this.element,radiusProp) || _defaults[p];
    };
  }
  
  // clip
  parseProperty.clip = function(p,v){
    if ( !(p in DOM) ) {
      DOM[p] = function(l,p,a,b,v) {
        var h = 0, cl = [];
        for (h;h<4;h++){
          var c1 = a[h].v, c2 = b[h].v, cu = b[h].u || 'px';
          cl[h] = ((number(c1,c2,v)*100 >> 0)/100) + cu;
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
  
  prepareStart.clip = function(p,v){
    var c = getCurrentStyle(this.element,p), w = getCurrentStyle(this.element,'width'), h = getCurrentStyle(this.element,'height');      
    return !/rect/.test(c) ? [0, w, h, 0] : c;
  };
    
  // background position
  parseProperty.backgroundPosition = function(p,v) {
    if ( !(p in DOM) ) {
      DOM[p] = function(l,p,a,b,v) {
        l.style[p] = ((number(a[0],b[0],v)*100>>0)/100) + '%' + ' ' + ((number(a[1],b[1],v)*100>>0)/100) + '%';
      };
    }
    if ( v instanceof Array ){
      var x = trueDimension(v[0]).v, y = trueDimension(v[1]).v;
      return [ x !== NaN ? x : 50, y !== NaN ? y : 50 ];
    } else {
      var posxy = v.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/g,50);
      posxy = posxy.split(/(\,|\s)/g); posxy = posxy.length === 2 ? posxy : [posxy[0],50]; 
      return [ trueDimension(posxy[0]).v, trueDimension(posxy[1]).v ];
    }
  }
  prepareStart.backgroundPosition = function(p,v){
    return getCurrentStyle(this.element,p) || _defaults[p];
  }  
  
  return this;
});