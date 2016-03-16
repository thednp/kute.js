/* KUTE.js - The Light Tweening Engine
 * package - SVG Plugin
 * desc - draw strokes, morph paths and SVG color props
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
    window.KUTE.svg = window.KUTE.svg || factory(KUTE);
  } else {
    throw new Error("SVG Plugin require KUTE.js.");
  }
}( function (KUTE) {
  'use strict';
  
  var K = window.KUTE, S = S || {}, p,
    _svg = document.getElementsByTagName('path')[0],
    _ns = _svg && _svg.ownerSVGElement && _svg.ownerSVGElement.namespaceURI || 'http://www.w3.org/2000/svg',
    _nm = ['strokeWidth', 'strokeOpacity', 'fillOpacity', 'stopOpacity'], // numeric SVG CSS props
    _cls = ['fill', 'stroke', 'stopColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    trm = function(s){ if (!String.prototype.trim) { return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); } else { return s.trim(); }};
  
  if (_svg && !_svg.ownerSVGElement) {return;} // if SVG API is not supported, return
    
  // SVG MORPH
  // get path d attribute or create a path with string value
  S.getPath = function(e){
    var p = {}, el = typeof e === 'object' ? e : /^\.|^\#/.test(e) ? document.querySelector(e) : null;
    if ( el && /path|glyph/.test(el.tagName) ) {
      p.e = S.forcePath(el);
      p.o = el.getAttribute('d');

    } else if (!el && /[a-z][^a-z]*/ig.test(e)) { // maybe it's a string path already
      var np = S.createPath(trm(e));
      p.e = np;
      p.o = e;
    }
    return p;
  }
  
  S.pathCross = function(w){
    // path tween options
    this._mpr = w.morphPrecision || 25;  
    this._midx = w.morphIndex; 
    this._smi = w.showMorphInfo;
    this._rv1 = w.reverseFirstPath;
    this._rv2 = w.reverseSecondPath;
    
    var p1 = S.getOnePath(w._vS.path.o), p2 = S.getOnePath(w._vE.path.o), arr;
    
    arr = S._pathCross(p1,p2);

    w._vS.path.d = arr[0];
    w._vE.path.d = arr[1];
  }

  S._pathCross = function(s,e){
    s = S.createPath(s); e = S.createPath(e);    
    var arr = S.getSegments(s,e,this._mpr), s1 = arr[0], e1 = arr[1], arL = e1.length, idx;
    
    // reverse arrays
    if (this._rv1) { s1.reverse(); }
    if (this._rv2) { e1.reverse(); }

    // determine index for best/minimum distance between points
    if (this._smi) { idx = S.getBestIndex(s1,e1); }
    
    // shift second array to for smallest tween distance
    if (this._midx) {
      var e11 = e1.splice(this._midx,arL-this._midx);
      e1 = e11.concat(e1);
    }

    // the console.log helper utility
    if (this._smi) {
      console.log( 'KUTE.js Path Morph Log\nThe morph used ' + arL + ' points to draw both paths based on '+this._mpr+' morphPrecision value.\n' 
        + (this._midx ? 'You\'ve configured the morphIndex to ' + this._midx + ' while the recommended is ' + idx+ '.\n' : 'You may also consider a morphIndex for the second path. Currently the best index seems to be ' + idx + '.\n')
        + (
            !this._rv1 && !this._rv2 ? 'If the current animation is not satisfactory, consider reversing one of the paths. Maybe the paths do not intersect or they really have different draw directions.' :
            'You\'ve chosen that the first path to have ' + ( this._rv1  ? 'REVERSED draw direction, ' : 'UNCHANGED draw direction, ') + 'while second path is to be ' + (this._rv2 ? 'REVERSED.\n' : 'UNCHANGED.\n')
          )
      );
    }
    
    s = e = null;
    return [s1,e1]
  }

  S.getSegments = function(s,e,r){
    var s1 = [], e1 = [], le1 = s.getTotalLength(), le2 = e.getTotalLength(), ml = Math.max(le1,le2),
      d = r, ar = ml / r, j = 0, sl = ar*r; // sl = sample length

    // populate the points arrays based on morphPrecision as sample size
    while ( (j += r) < sl ) {
      s1.push( [s.getPointAtLength(j).x, s.getPointAtLength(j).y]);
      e1.push( [e.getPointAtLength(j).x, e.getPointAtLength(j).y]);
    }
    return [s1,e1];
  }    
  
  S.getBestIndex = function(s,e){
    var s1 = S.clone(s), e1 = S.clone(e), d = [], i, r = [], l = s1.length, t, ax, ay;
    for (i=0; i<l; i++){
      t = e1.splice(i,l-i); e1 = t.concat(e1);
      ax = Math.abs(s1[i][0] - e1[i][0]);
      ay = Math.abs(s1[i][1] - e1[i][1]);
      d.push( Math.sqrt( ax * ax + ay * ay ) );
      r.push( e1 );
      e1 = []; e1 = S.clone(e); t = null;
    }
    return d.indexOf(Math.min.apply(null,d));
  }
  
  S.getOnePath = function(p){
    var a = p.split(/z/i);
    if (a.length > 2) {
       return trm(a[0]) + 'z';
    } else { return trm(p); }
  }

  S.createPath = function (p){
    var c = document.createElementNS(_ns,'path'), d = typeof p === 'object' ? p.getAttribute('d') : p; 
    c.setAttribute('d',d); return c;
  }
  
  S.forcePath = function(p){
    if (p.tagName === 'glyph') { // perhaps we can also change other SVG tags in the future 
      var c = S.createPath(p); p.parentNode.appendChild(c); return c;
    } 
    return p;
  }
  
  S.clone = function(obj) {
    var copy;

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = S.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = S.clone(obj[attr]);
        }
      }
      return copy;
    }

    return obj;
  }  
  
  // register the render SVG path object  
  // process path object and also register the render function
  K.pp['path'] = function(a,o,l) {
    if (!('path' in K.dom)) {
      K.dom['path'] = function(w,p,v){    
        var curve =[], i, l;

        for(i=0,l=w._vE.path.d.length;i<l;i++) { // for each point
          curve[i] = [];
          for(var j=0;j<2;j++) { // each point coordinate
            curve[i].push(w._vS.path.d[i][j]+(w._vE.path.d[i][j]-w._vS.path.d[i][j])*v);
          }
        }
        w._el.setAttribute("d", v === 1 ? w._vE.path.o : 'M' + curve.join('L') + 'Z' );       
      }
    }
    return S.getPath(o);
  };
    
  K.prS['path'] = function(el,p,v){
    return el.getAttribute('d');
  };

  // SVG DRAW
  S.getDraw = function(e,v){
    var l = e.getTotalLength(), start, end, d, o;
    if ( v instanceof Object ) {
      return v;
    } else if (typeof v === 'string') { 
      v = v.split(/\,|\s/);
      start = /%/.test(v[0]) ? S.percent(trm(v[0]),l) : parseFloat(v[0]);
      end = /%/.test(v[1]) ? S.percent(trm(v[1]),l) : parseFloat(v[1]);
    } else if (typeof v === 'undefined') {
      o = parseFloat(K.gCS(e,'strokeDashoffset'));
      d = K.gCS(e,'strokeDasharray').split(/\,/);
      
      start = 0-o;
      end = parseFloat(d[0]) + start || l;
    }
    
    return { s: start, e: end, l: l } 
  };
  
  S.percent = function(v,l){
    return parseFloat(v) / 100 * l;
  };
  
  // register the draw
  K.pp['draw'] = function(a,o,l){
    if (!('draw' in K.dom)) {
      K.dom['draw'] = function(w,p,v){
        var l, s, e, o;
        l = w._vS.draw.l;
        s = w._vS.draw.s+(w._vE.draw.s-w._vS.draw.s)*v;
        e = w._vS.draw.e+(w._vE.draw.e-w._vS.draw.e)*v;
        o = 0 - s;
        
        w._el.style.strokeDashoffset = o +'px';
        w._el.style.strokeDasharray = e+o<1 ? '0px, ' + l + 'px' : (e+o) + 'px, ' + l + 'px';
      }
    }
    return S.getDraw(l,o);
  }
  
  K.prS['draw'] = function(el,p,v){
    return S.getDraw(el)
  }
  
  // SVG CSS Properties
  for ( var i = 0, l = _cls.length; i< l; i++) {
    p = _cls[i];
    K.pp[p] = function(p,v){
      if (!(p in K.dom)) {
        K.dom[p] = function(w,p,v){
          var _c = {}; 
          for (var c in w._vE[p]) {
            if ( c !== 'a' ){
              _c[c] = parseInt(w._vS[p][c] + (w._vE[p][c] - w._vS[p][c]) * v )||0;            
            } else {
              _c[c] = (w._vS[p][c] && w._vE[p][c]) ? parseFloat(w._vS[p][c] + (w._vE[p][c] - w._vS[p][c]) * v) : null;
            }
          }
        
          if ( w._hex ) {
            w._el.style[p] = K.rth( _c.r, _c.g, _c.b );
          } else {
            w._el.style[p] = !_c.a ? 'rgb(' + _c.r + ',' + _c.g + ',' + _c.b + ')' : 'rgba(' + _c.r + ',' + _c.g + ',' + _c.b + ',' + _c.a + ')';
          }
        }
      }
      return K.truC(v);
    } 
    K.prS[p] = function(el,p,v){
       return K.gCS(el,p) || 'rgba(0,0,0,0)';
    }
  }
  
  for ( var i = 0, l = _nm.length; i< l; i++) { // for numeric CSS props SVG related
    p = _nm[i];
    if (p === 'strokeWidth'){
      K.pp[p] = function(p,v){
        if (!(p in K.dom)) {
          K.dom[p] = function(w,p,v) {
            w._el.style[p] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v) + w._vS[p].unit;
          }
        }
        return K.pp.box(p,v);
      }
    } else {
      K.pp[p] = function(p,v){
        if (!(p in K.dom)) {
          K.dom[p] = function(w,p,v) {
            w._el.style[p] = w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v;
          }
        }
        return K.pp.unl(p,v);
      }
    } 
    K.prS[p] = function(el,p,v){
       return K.gCS(el,p) || 0;
    }
  }
  
  return S;
}));