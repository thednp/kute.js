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
  var K = window.KUTE, p,
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
    K.pp[p] = function(p,v) {
      if ( (!(p in K.dom)) ) {
        K.dom[p] = function(w,p,v) {
          var _c = {}; 
          for (var c in w._vE[p].value) {
            if ( c !== 'a' ){
              _c[c] = parseInt(w._vS[p].value[c] + (w._vE[p].value[c] - w._vS[p].value[c]) * v )||0;            
            } else {
              _c[c] = (w._vS[p].value[c] && w._vE[p].value[c]) ? parseFloat(w._vS[p].value[c] + (w._vE[p].value[c] - w._vS[p].value[c]) * v) : null;
            }          
          }

          if ( w._hex ) {
            w._el.style[p] = K.rth( _c.r, _c.g, _c.b );
          } else {
            w._el.style[p] = !_c.a || _isIE8 ? 'rgb(' + _c.r + ',' + _c.g + ',' + _c.b + ')' : 'rgba(' + _c.r + ',' + _c.g + ',' + _c.b + ',' + _c.a + ')';          
          }  
        };
      }
      return K.pp.cls(p,v);
    };
    K.prS[p] = function(el,p,v){
      return K.gCS(el,p) || _d[p];
    };
  }
  
  // create prepare/process/render functions for additional box model properties
  for (var i = 0, l = _mg.length; i<l; i++) {
    p = _mg[i];
    K.pp[p] = function(p,v){
      if ( (!(p in K.dom)) ) {
        K.dom[p] = function(w,p,v) {
          w._el.style[p] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
        };
      }      
      return K.pp.box(p,v);
    };
    K.prS[p] = function(el,p,v){
      return K.gCS(el,p) || _d[p];
    };
  }
  
  //create prepare/process/render functions for radius properties
  for (var i = 0, l = _rd.length; i<l; i++) {
    p = _rd[i];
    K.pp[p] = function(p,v){
      if ( (!(p in K.dom)) ) {
        if (p === 'borderRadius') {
          K.dom[p] = function(w,p,v) {
            w._el.style[_br] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
          };        
        } else if (p === 'borderTopLeftRadius') {
          K.dom[p] = function(w,p,v) {
            w._el.style[_brtl] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
          };
        } else if (p === 'borderTopRightRadius') {
          K.dom[p] = function(w,p,v) {
            w._el.style[_brtr] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
          };
        } else if (p === 'borderBottomLeftRadius') {
          K.dom[p] = function(w,p,v) {
            w._el.style[_brbl] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
          };
        } else if (p === 'borderBottomRightRadius') {
          K.dom[p] = function(w,p,v) {
            w._el.style[_brbr] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
          };
        }
      }      
      return K.pp.box(p,v);
    };
    K.prS[p] = function(el,p,v){
      return K.gCS(el,p) || _d[p];
    };
  }
  
  // clip
  K.pp['clip'] = function(p,v){
    if ( !(p in K.dom) ) {
      K.dom[p] = function(w,p,v) {
        var h = 0, cl = [];
        for (h;h<4;h++){
          var c1 = w._vS[p][h].v, c2 = w._vE[p][h].v, cu = w._vE[p][h].u || 'px';
          cl[h] = ((c1 + ( c2 - c1 ) * v)) + cu;
        }  
        w._el.style[p] = 'rect('+cl+')';
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
  
  K.prS['clip'] = function(el,p,v){
    var c = K.gCS(el,p), w = K.gCS(el,'width'), h = K.gCS(el,'height');      
    return !/rect/.test(c) ? [0, w, h, 0] : c;
  };
    
  // background position
  K.pp['backgroundPosition'] = function(p,v) {
    if ( !(p in K.dom) ) {        
      K.dom[p] = function(w,p,v) {
        var px1 = w._vS[p].x.v, px2 = w._vE[p].x.v, py1 = w._vS[p].y.v, py2 = w._vE[p].y.v,
          px = (px1 + ( px2 - px1 ) * v), pxu = '%', py = (py1 + ( py2 - py1 ) * v), pyu = '%';      
        w._el.style[p] = px + pxu + ' ' + py + pyu;
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
  K.prS['backgroundPosition'] = function(el,p,v){
    return K.gCS(el,p) || _d[p];
  }
  
  return this;
});