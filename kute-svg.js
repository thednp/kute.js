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
    _svg = document.querySelector('path') || document.querySelector('svg'),
    _ns = _svg && _svg.ownerSVGElement && _svg.ownerSVGElement.namespaceURI || 'http://www.w3.org/2000/svg',
    _nm = ['strokeWidth', 'strokeOpacity', 'fillOpacity', 'stopOpacity'], // numeric SVG CSS props
    _cls = ['fill', 'stroke', 'stopColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    pathReg = /(m[^(h|v|l)]*|[vhl][^(v|h|l|z)]*)/gmi;
  
  if (_svg && !_svg.ownerSVGElement) {return;} // if SVG API is not supported, return
    
  // SVG MORPH
  S.gPt = function(e){ // get path d attribute or create a path from string value
    var p = {}, el = typeof e === 'object' ? e : /^\.|^\#/.test(e) ? document.querySelector(e) : null;
    if ( el && /path|glyph/.test(el.tagName) ) {
      p.e = S.fPt(el);
      p.o = el.getAttribute('d');

    } else if (!el && /[a-z][^a-z]*/ig.test(e)) { // maybe it's a string path already
      var np = S.cP(e.trim());
      p.e = np;
      p.o = e;
    }
    return p;
  }
  
  S.pCr = function(w){ // pathCross
    // path tween options
    this._mpr = w.morphPrecision || 25;  
    this._midx = w.morphIndex; 
    this._smi = w.showMorphInfo;
    this._rv1 = w.reverseFirstPath;
    this._rv2 = w.reverseSecondPath;
    
    var p1 = S.gOp(w._vS.path.o), p2 = S.gOp(w._vE.path.o), arr;
    this._isp = !/[CSQTA]/i.test(p1) && !/[CSQTA]/i.test(p2); // both shapes are polygons
    
    arr = S._pCr(p1,p2,w._el.parentNode);

    w._vS.path.d = arr[0];
    w._vE.path.d = arr[1];
  }

  S._pCr = function(s,e,svg){ // _pathCross
    var s1, e1, arr, idx, arL, sm, lg, smp, lgp, nsm = [], sml, cl = [], len, tl, cs;
    this._sp = false;
    
    if (!this._isp) {
        s = S.cP(s); e = S.cP(e);  
        arr = S.gSegs(s,e,this._mpr); 
        s1 = arr[0]; e1 = arr[1]; arL = e1.length;
    } else {
      s = S.pTA(s); e = S.pTA(e); 
      arL = Math.max(s.length,e.length);
      if ( arL === e.length) { sm = s; lg = e; } else { sm = e; lg = s; }
      sml = sm.length;

      smp = S.cP('M'+sm.join('L')+'z'); len = smp.getTotalLength() / arL;
      for (var i=0; i<arL; i++){
        tl = smp.getPointAtLength(len*i);
        cs = S.gCP(len,tl,sm);
        nsm.push( [ cs[0], cs[1] ] );
      }

      if (arL === e.length) { e1 = lg; s1 = nsm; } else { s1 = lg; e1 = nsm; }
    }

    // reverse arrays
    if (this._rv1) { s1.reverse(); }
    if (this._rv2) { e1.reverse(); }

    // determine index for best/minimum distance between points
    if (this._smi) { idx = S.gBi(s1,e1); }
    
    // shift second array to for smallest tween distance
    if (this._midx) {
      var e11 = e1.splice(this._midx,arL-this._midx);
      e1 = e11.concat(e1);
    }

    // the console.log helper utility
    if (this._smi) {
      // also show the points
      S.shP(s1,e1,svg);
      var mpi = this._isp ? 'the polygon with the most points.\n' : (this._mpr === 25 ? 'the default' : 'your') +' morphPrecision value of '+this._mpr+'.\n';
      console.log( 'KUTE.js Path Morph Log\nThe morph used ' + arL + ' points to draw both paths based on '+mpi 
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

  S.gSegs = function(s,e,r){ // getSegments returns an array of points based on a sample size morphPrecision
    var s1 = [], e1 = [], le1 = s.getTotalLength(), le2 = e.getTotalLength(), ml = Math.max(le1,le2),
      d = r, ar = ml / r, j = 0, sl = ar*r; // sl = sample length

    while ( (j += r) < sl ) { // populate the points arrays based on morphPrecision as sample size
      s1.push( [s.getPointAtLength(j).x, s.getPointAtLength(j).y]);
      e1.push( [e.getPointAtLength(j).x, e.getPointAtLength(j).y]);
    }
    return [s1,e1];
  }
  
  S.gCP = function(p,t,s){ // getClosestPoint for polygon paths it returns a close point from the original path (length,pointAtLength,smallest); // intervalLength
    var x, y, a = [], l = s.length, dx, nx, pr;
    for (i=0; i<l; i++){
      x = Math.abs(s[i][0] - t.x);
      y = Math.abs(s[i][1] - t.y);
      a.push( Math.sqrt( x * x + y * y ) );
    }
    dx = a.indexOf(Math.min.apply(null,a));
    pr = !!s[dx-1] ? dx-1 : l-1;
    nx = !!s[dx+1] ? dx+1 : 0;
    return Math.abs(s[pr][0] - t.x) < p && Math.abs(s[pr][1] - t.y) < p ? s[pr]
    : Math.abs(s[nx][0] - t.x) < p && Math.abs(s[nx][1] - t.y) < p ? s[nx] 
    : Math.abs(s[dx][0] - t.x) < p && Math.abs(s[dx][1] - t.y) < p ? s[dx] 
    : [t.x,t.y];
  }
  
  S.shP = function(s,e,v){// showPoints helper function to visualize the points on the path
    if (!this._sp){
        var c, a = arguments, cl, p, l;
        for (var i=0; i<2; i++){
          p = a[i]; l = p.length; cl = i=== 0 ? { f: 'DeepPink', o: 'HotPink' } : { f: 'Lime', o: 'LimeGreen' };
          for (var j=0; j<l; j++) {
            c = document.createElementNS(_ns,'circle');
            c.setAttribute('cx',p[j][0]); c.setAttribute('cy',p[j][1]);
            c.setAttribute('r', j===0 ? 20 : 10 ); c.setAttribute('fill', j===0 ? cl.f : cl.o);
            if (this._isp) { v.appendChild(c); } else if (!this._isp && j===0 ) { v.appendChild(c);}
          }
        }
        this._sp = true; c = null;
    }      
  }
  
  S.gBi = function(s,e){ // getBestIndex for shape rotation
    var s1 = S.clone(s), e1 = S.clone(e), d = [], i, l = e.length, t, ax, ay;
    for (i=0; i<l; i++){
      t = e1.splice(i,l-i); e1 = t.concat(e1);
      ax = Math.abs(s1[i][0] - e1[i][0]);
      ay = Math.abs(s1[i][1] - e1[i][1]);
      d.push( Math.sqrt( ax * ax + ay * ay ) );
      e1 = []; e1 = S.clone(e); t = null;
    }
    return d.indexOf(Math.min.apply(null,d));
  }
  
  S.gOp = function(p){ // getOnePath, first path only
    var a = p.split(/z/i);
    if (a.length > 2) {
       return a[0].trim() + 'z';
    } else { return p.trim(); }
  }

  S.cP = function (p){ // createPath
    var c = document.createElementNS(_ns,'path'), d = typeof p === 'object' ? p.getAttribute('d') : p; 
    c.setAttribute('d',d); return c;
  }
  
  S.fPt = function(p){ // forcePath for glyph elements
    if (p.tagName === 'glyph') { // perhaps we can also change other SVG tags in the future 
      var c = S.cP(p); p.parentNode.appendChild(c); return c;
    } 
    return p;
  }
  
  S.clone = function(a) {
    var copy;
    if (a instanceof Array) {
      copy = [];
      for (var i = 0, len = a.length; i < len; i++) {
        copy[i] = S.clone(a[i]);
      }
      return copy;
    }
    return a;
  }
  
  S.pTA = function(p) { // simple pathToAbsolute for polygons | this is still BETA / a work in progress
    var np = p.match(pathReg), wp = [], l = np.length, s, c, r, x = 0, y = 0;
    for (var i = 0; i<l; i++){
      np[i] = np[i]; c = np[i][0]; r = new RegExp(c+'[^\\d|\\-]*','i'); 
      np[i] = np[i].replace(/(^|[^,])\s*-/g, '$1,-').replace(/(\s+\,|\s|\,)/g,',').replace(r,'').split(',');
      np[i][0] = parseFloat(np[i][0]);
      np[i][1] = parseFloat(np[i][1]);
      if (i === 0) { x+=np[i][0]; y +=np[i][1]; } 
      else {
        x = np[i-1][0]; 
        y = np[i-1][1]; 
        if (/l/i.test(c)) {
          np[i][0] = c === 'l' ? np[i][0] + x : np[i][0];
          np[i][1] = c === 'l' ? np[i][1] + y : np[i][1];  
        } else if (/h/i.test(c)) {
          np[i][0] = c === 'h' ? np[i][0] + x : np[i][0];
          np[i][1] = y;  
        } else if (/v/i.test(c)) {
          np[i][0] = x;
          np[i][1] = c === 'v' ? np[i][0] + y : np[i][0];
        }
      }
    }
    return np;
  }
  
  // a shortHand pathCross
  K.svq = function(w){ if ( w._vE.path ) S.pCr(w); }
  
  // register the render SVG path object  
  // process path object and also register the render function
  K.pp['path'] = function(a,o,l) { // K.pp['path']('path',value,element);
    if (!('path' in K.dom)) {
      K.dom['path'] = function(w,p,v){
        var points =[], i, l;
        for(i=0,l=w._vE.path.d.length;i<l;i++) { // for each point
          points[i] = [];
          for(var j=0;j<2;j++) { // each point coordinate
            points[i].push(w._vS.path.d[i][j]+(w._vE.path.d[i][j]-w._vS.path.d[i][j])*v);
          }
        }
        w._el.setAttribute("d", v === 1 ? w._vE.path.o : 'M' + points.join('L') + 'Z' );       
      }
    }
    return S.gPt(o);
  };
    
  K.prS['path'] = function(el,p,v){
    return el.getAttribute('d');
  };

  // SVG DRAW
  S.gDr = function(e,v){
    var l = /path|glyph/.test(e.tagName) ? e.getTotalLength() : S.gL(e), start, end, d, o;
    if ( v instanceof Object ) {
      return v;
    } else if (typeof v === 'string') { 
      v = v.split(/\,|\s/);
      start = /%/.test(v[0]) ? S.pc(v[0].trim(),l) : parseFloat(v[0]);
      end = /%/.test(v[1]) ? S.pc(v[1].trim(),l) : parseFloat(v[1]);
    } else if (typeof v === 'undefined') {
      o = parseFloat(K.gCS(e,'strokeDashoffset'));
      d = K.gCS(e,'strokeDasharray').split(/\,/);
      
      start = 0-o;
      end = parseFloat(d[0]) + start || l;
    }
    
    return { s: start, e: end, l: l } 
  };
  
  S.pc = function(v,l){
    return parseFloat(v) / 100 * l;
  };
  
  K.pp['draw'] = function(a,o,l){ // register the draw property
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
    return S.gDr(l,o);
  }
  
  K.prS['draw'] = function(el,p,v){
    return S.gDr(el)
  }

  // SVG DRAW UTILITITES
  S.gL = function(el){ // getLength - returns the result of any of the below functions
    if (/rect/.test(el.tagName)) {
      return S.gRL(el);
    } else if (/circle/.test(el.tagName)) {
      return S.gCL(el);
    } else if (/ellipse/.test(el.tagName)) {
      return S.gEL(el);
    } else if (/polygon|polyline/.test(el.tagName)) {
      return S.gPL(el);
    } else if (/line/.test(el.tagName)) {
      return S.gLL(el);
    }
  }

  S.gRL = function(el){ // getRectLength - return the length of a Rect
    var w = el.getAttribute('width');
    var h = el.getAttribute('height');
    return (w*2)+(h*2);
  }

  S.gPL = function(el){ // getPolygonLength - return the length of the Polygon / Polyline
    var points = el.getAttribute('points').split(' '), len = 0;
    if (points.length > 1) {
      var coord = function (p) {
        var c = p.split(',');
        if (c.length != 2) {
          return; // return undefined
        }
        if (isNaN(c[0]) || isNaN(c[1])) {
          return;
        }
        return [parseFloat(c[0]), parseFloat(c[1])];
      };

      var dist = function (c1, c2) {
        if (c1 != undefined && c2 != undefined) {
          return Math.sqrt(Math.pow((c2[0]-c1[0]), 2) + Math.pow((c2[1]-c1[1]), 2));
        }
        return 0;
      };

      if (points.length > 2) {
        for (var i=0; i<points.length-1; i++) {
          len += dist(coord(points[i]), coord(points[i+1]));
        }
      }
      len += dist(coord(points[0]), coord(points[points.length-1]));
    }
    return len;
  }

  S.gLL = function(el){ // getLineLength - return the length of the line
    var x1 = el.getAttribute('x1');
    var x2 = el.getAttribute('x2');
    var y1 = el.getAttribute('y1');
    var y2 = el.getAttribute('y2');
    return Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1),2));
  }

  S.gCL = function(el){ // getCircleLength - return the length of the circle
    var r = el.getAttribute('r');
    return 2 * Math.PI * r; 
  }

  S.gEL = function(el) { // getEllipseLength - returns the length of an ellipse
    var rx = el.getAttribute('rx'), ry = el.getAttribute('ry'),
        len = 2*rx, wid = 2*ry;
    return ((Math.sqrt(.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
  } 
  
  
  // SVG CSS Color Properties
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
  
  for ( var i = 0, l = _nm.length; i< l; i++) { // for numeric CSS props from any type of SVG shape
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
            w._el.style[p] = w._vS[p] + (w._vE[p] - w._vS[p]) * v;
          }
        }
        return parseFloat(v);
      }
    } 
    K.prS[p] = function(el,p,v){
      return K.gCS(el,p) || 0;
    }
  }

  // SVG Transform
  K.pp['svgTransform'] = function(p,v,l){
    // register the render function
    if (!('svgTransform' in K.dom)) {
      K.dom['svgTransform'] = function(w,p,v) {
        var tr = '', i;
        for (i in w._vE[p]){
          tr += i + '('; // start string
          if ( i === 'translate'){ // translate
            tr += (w._vS[p][i][1] === w._vE[p][i][1] && w._vE[p][i][1] === 0 ) 
            ? (w._vS[p][i][0] + (w._vE[p][i][0] - w._vS[p][i][0]) * v )
            : (w._vS[p][i][0] + (w._vE[p][i][0] - w._vS[p][i][0]) * v ) + ' ' + (w._vS[p][i][1] + (w._vE[p][i][1] - w._vS[p][i][1]) * v );
          } else if ( i === 'rotate'){ // rotate
            tr += w._vS[p][i][0] + (w._vE[p][i][0] - w._vS[p][i][0]) * v + ' ';
            tr += !w.reversed ? w._vE[p][i][1] + ',' + w._vE[p][i][2] : w._vS[p][i][1] + ',' + w._vS[p][i][2]; // make sure to always use the right transform-origin
          } else { // scale, skewX or skewY
            tr +=  w._vS[p][i] + (w._vE[p][i] - w._vS[p][i]) * v;
          }
          tr += ') '; // end string
        }
        w._el.setAttributeNS(null,'transform', tr.replace(/\)\s$/,')') );
      }
    }

    // return transform object
    var tf = {}, bb = l.getBBox(), cx = bb.x + bb.width/2, cy = bb.y + bb.height/2, i, r, t;
    for ( i in v ) {
      if (i === 'rotate'){
        r = v[i] instanceof Array ? v[i] 
        : /\s/.test(v[i]) ? [v[i].split(' ')[0]*1, v[i].split(' ')[1].split(',')[0]*1, v[i].split(' ')[1].split(',')[1]*1] 
        : [v[i],cx,cy];
        tf[i] = r;
      } else if (i === 'translate'){
        t = v[i] instanceof Array ? v[i] : /\s/.test(v[i]) ? v[i].split(' ') : [v[i],0];
        tf[i] = [t[0] * 1||0, t[1] * 1];
      } else if (i === 'scale'){
        tf[i] = v[i] * 1||1;
      } else {
        tf[i] = v[i] * 1||0;
      }
    }

    // http://www.petercollingridge.co.uk/interactive-svg-components/pan-and-zoom-control
    // try to adjust translation when scale is used
    if ('scale' in tf) {
      tf['translate'] = !( 'translate' in tf ) ? [0,0] : tf['translate'];
      tf['translate'][0] += (1-tf['scale']) * bb.width/2; 
      tf['translate'][1] += (1-tf['scale']) * bb.height/2;
    }
    return tf;
  }

  // KUTE.prepareStart K.prS[p](el,p,to[p])
  // returns an obect with current transform attribute value
  K.prS['svgTransform'] = function(l,p,t) {
    var tr = {}, cta = l.getAttributeNS(null,'transform'), 
        ct = cta && /\)/.test(cta) ? cta.split(')') : 'none', i, j, ctr ={}, pr;
    if (ct instanceof Array) {
      for (j=0; j<ct.length; j++){
        pr = ct[j].split('(');
        pr[0] !== '' && (ctr[pr[0].replace(/\s/,'')] = pr[1] );
      }
    }
    // find a value in current attribute value or add a default value
    for (i in t) { tr[i] = i in ctr ? ctr[i] : 0; }
    return tr;
  }
  
  return S;
}));