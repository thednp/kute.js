/* KUTE.js - The Light Tweening Engine
 * package - SVG Plugin
 * desc - draw strokes, morph paths and SVG color props
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (root,factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kute.js'], factory);
  } else if(typeof module == 'object' && typeof require == 'function') {
    module.exports = factory(require('kute.js'));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    root.KUTE.svg = factory(root.KUTE);
  } else {
    throw new Error("SVG Plugin require KUTE.js.");
  }
}(this, function(KUTE) {
  'use strict'; 

  // variables, reference global objects, prepare properties
  var g = typeof global !== 'undefined' ? global : window, K = KUTE, p, 
    DOM = g.dom, parseProperty = K.parseProperty, prepareStart = K.prepareStart, getCurrentStyle = K.getCurrentStyle,
    trueColor = K.truC, trueDimension = K.truD,
    _isIE = navigator && (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) !== null) ? parseFloat( RegExp.$1 ) : false,
    _numeric = ['strokeWidth', 'strokeOpacity', 'fillOpacity', 'stopOpacity'], // numeric SVG CSS props
    _colors = ['fill', 'stroke', 'stopColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    pathReg = /(m[^(h|v|l)]*|[vhl][^(v|h|l|z)]*)/gmi, ns = 'http://www.w3.org/2000/svg',
    number = g._number, unit = g._unit, color = g._color, // interpolate functions
    coords = g._coords = function(a,b,l,v) { // function(array1, array2, array2.length, progress) for SVG morph
      var points =[];
      for(var i=0;i<l;i++) { // for each point
        points[i] = [];
        for(var j=0;j<2;j++) { // each point coordinate
          points[i].push(a[i][j]+(b[i][j]-a[i][j])*v);
        }
      }
      return points;
    };

  if (_isIE&&_isIE<9) {return;} // return if SVG API is not supported


  // SVG MORPH
  var getSegments = function(s,e,r){ // getSegments returns an array of points based on a sample size morphPrecision
      var s1 = [], e1 = [], le1 = s.getTotalLength(), le2 = e.getTotalLength(), ml = Math.max(le1,le2),
        d = r, ar = ml / r, j = 0, sl = ar*r; // sl = sample length

      while ( (j += r) < sl ) { // populate the points arrays based on morphPrecision as sample size
        s1.push( [s.getPointAtLength(j).x, s.getPointAtLength(j).y]);
        e1.push( [e.getPointAtLength(j).x, e.getPointAtLength(j).y]);
      }
      return [s1,e1];
    },
    getClosestPoint = function(p,t,s){ // getClosestPoint for polygon paths it returns a close point from the original path (length,pointAtLength,smallest); // intervalLength
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
    },
    pathToAbsolute = function(p) { // simple pathToAbsolute for polygons | this is still BETA / a work in progress
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
    },
    getOnePath = function(p){ return p.split(/z/i).shift() + 'z'; }, // getOnePath, first path only
    createPath = function (p){ // createPath
      var c = document.createElementNS(ns,'path'), d = typeof p === 'object' ? p.getAttribute('d') : p; 
      c.setAttribute('d',d); return c;
    },
    forcePath = function(p){ // forcePath for glyph elements
      if (p.tagName === 'glyph') { // perhaps we can also change other SVG tags in the future 
        var c = createPath(p); p.parentNode.appendChild(c); return c;
      } 
      return p;
    },
    clone = function(a) {
      var copy;
      if (a instanceof Array) {
        copy = [];
        for (var i = 0, len = a.length; i < len; i++) {
          copy[i] = clone(a[i]);
        }
        return copy;
      }
      return a;
    },
    getPath = function(e){ // get path d attribute or create a path from string value
      var p = {}, el = typeof e === 'object' ? e : /^\.|^\#/.test(e) ? document.querySelector(e) : null;
      if ( el && /path|glyph/.test(el.tagName) ) {
        p.e = forcePath(el);
        p.o = el.getAttribute('d');

      } else if (!el && /[a-z][^a-z]*/ig.test(e)) { // maybe it's a string path already
        p.e = createPath(e.trim());
        p.o = e;
      }
      return p;
    },
    computePathCross = function(s,e){ // pathCross
      var s1, e1, pointsArray, largerPathLength, smallerPath, largerPath, simluatedSmallerPath, nsm = [], sml, cl = [], len, tl, cs;

      if (!this._isP) {
        s = createPath(s); e = createPath(e);  
        pointsArray = getSegments(s,e,this._mpr); 
        s1 = pointsArray[0]; e1 = pointsArray[1]; largerPathLength = e1.length;
      } else {
        s = pathToAbsolute(s); e = pathToAbsolute(e);

        if ( s.length !== e.length ){
          largerPathLength = Math.max(s.length,e.length);
          if ( largerPathLength === e.length) { smallerPath = s; largerPath = e; } else { smallerPath = e; largerPath = s; }
          sml = smallerPath.length;

          simluatedSmallerPath = createPath('M'+smallerPath.join('L')+'z'); len = simluatedSmallerPath.getTotalLength() / largerPathLength;
          for (var i=0; i<largerPathLength; i++){
            tl = simluatedSmallerPath.getPointAtLength(len*i);
            cs = getClosestPoint(len,tl,smallerPath);
            nsm.push( [ cs[0], cs[1] ] );
          }

          if (largerPathLength === e.length) { e1 = largerPath; s1 = nsm; } else { s1 = largerPath; e1 = nsm; }
        } else {
          s1 = s; e1 = e;
        }
      }

      // reverse arrays
      if (this._rv1) { s1.reverse(); }
      if (this._rv2) { e1.reverse(); }
      
      // shift second array to for smallest tween distance
      if (this._idx) {
        var e11 = e1.splice(this._idx,largerPathLength-this._idx);
        e1 = e11.concat(e1);
      }

      s = e = null;
      return [s1,e1]
    },
    SVG = {
      pathCross : function(w){ // pathCross
        var p1 = getOnePath(w._vS.path.o), p2 = getOnePath(w._vE.path.o), paths;

        // path tween options
        this._mpr = w.options.morphPrecision || 15;
        this._idx = w.options.morphIndex;
        this._rv1 = w.options.reverseFirstPath;
        this._rv2 = w.options.reverseSecondPath;
          
        // begin processing paths
        this._isP = !/[CSQTA]/i.test(p1) && !/[CSQTA]/i.test(p2); // check if both shapes are polygons

        paths = computePathCross.apply(this,[p1,p2]);

        w._vS.path.d = paths[0];
        w._vE.path.d = paths[1];
      }
    };

  // a shortHand pathCross && SVG transform stack
  K.svq = function(w){ if ( w._vE.path ) SVG.pathCross(w); if ( w._vE.svgTransform ) stackTransform(w); }
  
  // process path object and also register the render function
  parseProperty['path'] = function(a,o,l) { // K.pp['path']('path',value,element);
    if (!('path' in DOM)) {
      DOM['path'] = function(l,p,a,b,v){
        l.setAttribute("d", v === 1 ? b.o : 'M' + coords( a['d'],b['d'],b['d'].length,v ) + 'Z' );   
      }
    }
    return getPath(o);
  };
    
  prepareStart['path'] = function(el,p,v){
    return el.getAttribute('d');
  };


  // SVG DRAW
  var percent = function(v,l){ return parseFloat(v) / 100 * l;}, // percent
    // SVG DRAW UTILITITES
    // http://stackoverflow.com/a/30376660
    getRectLength = function(el){ // getRectLength - return the length of a Rect
      var w = el.getAttribute('width');
      var h = el.getAttribute('height');
      return (w*2)+(h*2);
    },
    getPolyLength = function(el){ // getPolygonLength / getPolylineLength - return the length of the Polygon / Polyline
      var points = el.getAttribute('points').split(' '), len = 0;
      if (points.length > 1) {
        var coord = function (p) {
          var c = p.split(',');
          if (c.length != 2) { return; } // return undefined
          if (isNaN(c[0]) || isNaN(c[1])) { return; }
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
    },
    getLineLength = function(el){ // getLineLength - return the length of the line
      var x1 = el.getAttribute('x1');
      var x2 = el.getAttribute('x2');
      var y1 = el.getAttribute('y1');
      var y2 = el.getAttribute('y2');
      return Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1),2));
    },
    getCircleLength = function(el){ // getCircleLength - return the length of the circle
      var r = el.getAttribute('r');
      return 2 * Math.PI * r; 
    },
    getEllipseLength = function(el) { // getEllipseLength - returns the length of an ellipse
      var rx = el.getAttribute('rx'), ry = el.getAttribute('ry'),
          len = 2*rx, wid = 2*ry;
      return ((Math.sqrt(.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
    },
    getTotalLength = function(el){ // getLength - returns the result of any of the below functions
      if (/rect/.test(el.tagName)) {
        return getRectLength(el);
      } else if (/circle/.test(el.tagName)) {
        return getCircleLength(el);
      } else if (/ellipse/.test(el.tagName)) {
        return getEllipseLength(el);
      } else if (/polygon|polyline/.test(el.tagName)) {
        return getPolyLength(el);
      } else if (/line/.test(el.tagName)) {
        return getLineLength(el);
      }
    },
    getDraw = function(e,v){
      var l = /path|glyph/.test(e.tagName) ? e.getTotalLength() : getTotalLength(e), start, end, d, o;
      if ( v instanceof Object ) {
        return v;
      } else if (typeof v === 'string') { 
        v = v.split(/\,|\s/);
        start = /%/.test(v[0]) ? percent(v[0].trim(),l) : parseFloat(v[0]);
        end = /%/.test(v[1]) ? percent(v[1].trim(),l) : parseFloat(v[1]);
      } else if (typeof v === 'undefined') {
        o = parseFloat(getCurrentStyle(e,'stroke-dashoffset'));
        d = getCurrentStyle(e,'stroke-dasharray').split(/\,/);
        
        start = 0-o;
        end = parseFloat(d[0]) + start || l;
      }
      return { s: start, e: end, l: l } 
    };
  
  parseProperty['draw'] = function(a,o,el){ // register the draw property
    if (!('draw' in DOM)) {
      DOM['draw'] = function(l,p,a,b,v){
        var ll = a.l, s = number(a.s,b.s,v), e = number(a.e,b.e,v), o = 0 - s;
        l.style.strokeDashoffset = o +'px';
        l.style.strokeDasharray = e+o<1 ? '0px, ' + ll + 'px' : (e+o) + 'px, ' + ll + 'px';
      }
    }
    return getDraw(el,o);
  }
  
  prepareStart['draw'] = function(el,p,v){
    return getDraw(el);
  }

  
  // SVG CSS Color Properties
  for ( var i = 0, l = _colors.length; i< l; i++) { 
    parseProperty[_colors[i]] = function(p,v){
      if (!(p in DOM)) {
        DOM[p] = function(l,p,a,b,v,o) {
          l.style[p] = color(a,b,v,o.keepHex);
        };
      }
      return trueColor(v); 
    } 
    prepareStart[_colors[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || 'rgb(0,0,0)';
    }
  }

  // Other SVG related CSS props
  for ( var i = 0, l = _numeric.length; i< l; i++) { // for numeric CSS props from any type of SVG shape
    if (_numeric[i] === 'strokeWidth'){ // stroke can be unitless or unit | http://stackoverflow.com/questions/1301685/fixed-stroke-width-in-svg
      parseProperty[_numeric[i]] = function(p,v){
        if (!(p in DOM)) {
          DOM[p] = function(l,p,a,b,v) {
            l.style[p] = typeof b === 'number' ? number(a,b,v) :  unit(a.v,b.v,b.u,v);
          }
        }
        return /px|%|em|vh|vw/.test(v) ? trueDimension(v) : parseFloat(v);
      }
    } else {
      parseProperty[_numeric[i]] = function(p,v){
        if (!(p in DOM)) {
          DOM[p] = function(l,p,a,b,v) {
            l.style[p] = number(a,b,v);
          }
        }
        return parseFloat(v);
      }
    } 
    prepareStart[_numeric[i]] = function(el,p,v){
      return getCurrentStyle(el,p) || 0;
    }
  }

  // SVG Transform
  var parseTransform = function (a){ // helper function that turns transform value from string to object
      var d = a && /\)/.test(a) ? a.split(')') : 'none', j, c ={}, p;

      if (d instanceof Array) {
        for (j=0; j<d.length; j++){
          p = d[j].split('('); p[0] !== '' && (c[p[0].replace(/\s/,'')] = p[1] );
        }
      }
      return c;
    },
    translateSVG = g._translateSVG = function (s,e,a,b,v){ // translate(i+'(',')',a[i],b[i],v)
      return s + ((a[1] === b[1] && b[1] === 0 ) ? number(a[0],b[0],v) : number(a[0],b[0],v) + ' ' + number(a[1],b[1],v)) + e;
    },
    rotateSVG = g._rotateSVG = function (s,e,a,b,v){
       return s + (number(a[0],b[0],v) + ' ' + b[1] + ',' + b[2]) + e;
    },
    scaleOrSkew = g._scaleOrSkewSVG = function (s,e,a,b,v){ // scale / skew
      return s + number(a,b,v) + e;
    },
    stackTransform = function (w){ // helper function that helps preserve current transform properties into the objects
      var bb = w._el.getBBox(), ctr = parseTransform(w._el.getAttribute('transform')), r, t, i,
        cx = bb.x + bb.width/2, cy = bb.y + bb.height/2;
      
      for ( i in ctr ) { // populate the valuesStart
        if (i === 'translate'){
          t = ctr[i] instanceof Array ? ctr[i] : /\,|\s/.test(ctr[i]) ? ctr[i].split(/\,|\s/) : [ctr[i]*1,0];
          w._vS.svgTransform[i] = [t[0] * 1||0, t[1] * 1||0];
        } else if (i === 'scale'){
          w._vS.svgTransform[i] = ctr[i] * 1||1;
        } else if (i === 'rotate'){
          r = ctr[i] instanceof Array ? ctr[i]
          : /\s/.test(ctr[i]) ? [ctr[i].split(' ')[0]*1, ctr[i].split(' ')[1].split(',')[0]*1, ctr[i].split(' ')[1].split(',')[1]*1] 
          : [ctr[i]*1,cx,cy];
          w._vS.svgTransform[i] = r;
        } else if (/skew/.test(i)) {
          w._vS.svgTransform[i] = ctr[i] * 1||0;
        }
      }

      for (var i in w._vS.svgTransform) {
        if (!(i in w._vE.svgTransform)) { // copy existing and unused properties to the valuesEnd
          w._vE.svgTransform[i] = w._vS.svgTransform[i];
        }
        if (i === 'rotate' in w._vS.svgTransform && 'rotate' in w._vE.svgTransform){ // make sure to use the right transform origin when rotation is used
          w._vE.svgTransform.rotate[1] = w._vS.svgTransform.rotate[1] = cx;
          w._vE.svgTransform.rotate[2] = w._vS.svgTransform.rotate[2] = cy;
        }
      }
    };

  parseProperty['svgTransform'] = function(p,v,l){
    // register the render function
    if (!('svgTransform' in DOM)) {
      
      DOM['svgTransform'] = function(l,p,a,b,v){
        var tl = '', rt = '', sx = '', sy = '', s = '';

        for (var i in b){
          if ( i === 'translate'){ // translate
            tl += translateSVG(i+'(',')',a[i],b[i],v);
          } else if ( i === 'rotate'){ // rotate
            rt += rotateSVG(i+'(',')',a[i],b[i],v);
          } else if ( i === 'scale'){ // scale
            s += scaleOrSkew(i+'(',')',a[i],b[i],v);
          } else if ( i === 'skewX'){ // skewX
            sx += scaleOrSkew(i+'(',')',a[i],b[i],v);
          } else if ( i === 'skewY'){ // skewY
            sy += scaleOrSkew(i+'(',')',a[i],b[i],v);
          }
        }

        l.setAttribute('transform', (tl+s+rt+sx+sy) );
      }
    }

    // now prepare transform
    var tf = {}, bb = l.getBBox(), cx = bb.x + bb.width/2, cy = bb.y + bb.height/2, r, cr, t, ct;

    for ( i in v ) { // populate the valuesStart and / or valuesEnd
      if (i === 'rotate'){
        r = v[i] instanceof Array ? v[i]
        : /\s/.test(v[i]) ? [v[i].split(' ')[0]*1, v[i].split(' ')[1].split(',')[0]*1, v[i].split(' ')[1].split(',')[1]*1] 
        : [v[i]*1,cx,cy];
        tf[i] = r;
      } else if (i === 'translate'){
        t = v[i] instanceof Array ? v[i] : /\,|\s/.test(v[i]) ? v[i].split(/\,|\s/) : [v[i]*1,0];
        tf[i] = [t[0] * 1||0, t[1] * 1||0];
      } else if (i === 'scale'){
        tf[i] = v[i] * 1||1;
      } else if (/skew/.test(i)) {
        tf[i] = v[i] * 1||0;
      }
    }

    // try to adjust translation when scale is used, probably we should do the same when using skews, but I think it's a waste of time
    // http://www.petercollingridge.co.uk/interactive-svg-components/pan-and-zoom-control
    if ('scale' in tf) {
      !('translate' in tf) && ( tf['translate'] = [0,0] ); // if no translate is found in current value or next value, we default to 0
      tf['translate'][0] += (1-tf['scale']) * bb.width/2;
      tf['translate'][1] += (1-tf['scale']) * bb.height/2;
      // adjust rotation transform origin and translation when skews are used, to make the animation look exactly the same as if we were't using svgTransform
      // http://stackoverflow.com/questions/39191054/how-to-compensate-translate-when-skewx-and-skewy-are-used-on-svg/39192565#39192565
      if ('rotate' in tf) {
        tf['rotate'][1] -= 'skewX' in tf ? Math.tan(tf['skewX']) * bb.height : 0;
        tf['rotate'][2] -= 'skewY' in tf ? Math.tan(tf['skewY']) * bb.width : 0;
      }
      tf['translate'][0] += 'skewX' in tf ? Math.tan(tf['skewX']) * bb.height*2 : 0;
      tf['translate'][1] += 'skewY' in tf ? Math.tan(tf['skewY']) * bb.width*2 : 0;
    } // more variations here https://gist.github.com/thednp/0b93068e20adb84658b5840ead0a07f8

    return tf;
  }

  // KUTE.prepareStart prepareStart[p](el,p,to[p])
  // returns an obect with current transform attribute value
  prepareStart['svgTransform'] = function(l,p,t) {
    var tr = {}, i, ctr = parseTransform(l.getAttribute('transform'));
    for (i in t) { tr[i] = i in ctr ? ctr[i] : (i==='scale'?1:0); } // find a value in current attribute value or add a default value
    return tr;
  }

  return SVG;

}));