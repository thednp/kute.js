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
  var K = window.KUTE, S = S || {}, 
      p2s=/,?([a-z]),?/gi,
      _unl = ['strokeWidth', 'strokeOpacity', 'fillOpacity', 'stopOpacity'], // unitless SVG props;
      _cls = ['fill', 'stroke', 'stopColor']; // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)

  // get path
  S.getPath = function(e){
    var p = {}, el = typeof e === 'object' ? e : /^\.|^\#/.test(e) ? document.querySelector(e) : null;
    if ( el && /path|glyph/.test(el.tagName) ) {
      p.e = el;
      p.o = el.getAttribute('d');

    } else if (!el && /m|z|c|l|v|q|[0-9]|\,/gi.test(e)) { // maybe it's a string path already
      el = document.querySelector('[d="'+e+'"]');
      var newp = document.createElement('path'); 
      newp.setAttribute('d',e);
      p.e = el || newp;
      p.o = e;
    }
    return p;
  }

  
  // process path now
  S.pathCross = function(w){
    var o1 = w._vS.path.o, o2 = w._vE.path.o,
      p1 = pathMulti(o1), p2 = pathMulti(o2), t, b1, b2;

    w._vS.path.d = {}; w._vE.path.d = {};  
    if ( typeof p1 === 'object' || typeof p2 === 'object' ) {
      if (typeof p1 === 'object' && typeof p2 === 'string') {

        t = clone(p2);  p2 = {}; b2 = curvePathBBox(path2curve(t));
        for (var i in p1) {
          // if (i*1 === 0) {
            p2[i] = t;           
          // } else {
          //   p2[i] = (i*1) % 2 ? 'M'+b2.cx+' '+b2.cy+ +'l0 0' : 'M'+b2.x+' '+b2.y +'l0 0';
          // }
        }

      } else if (typeof p1 === 'string' && typeof p2 === 'object') {
        t = clone(p1); p1 = {}; b1 = curvePathBBox(path2curve(t));
        for (var i in p2) {
          // if (i*1 === 0) {
            p1[i] = t; // perhaps in the future do something about the corresponding shape
          // } else {
          //   p1[i] = (i*1) % 2 ? 'M'+b1.cx+' '+b1.cy+ +'l0 0' : 'M'+b1.x+' '+b1.y +'l0 0';
          // } 
        }

      } else if (typeof p1 === 'object' && typeof p2 === 'object') {
        var pl1 = oKeys(p1).length, pl2 = oKeys(p2).length, s1, s2;
        
        if (pl1 > pl2) {
          for (var i in p1){
            if (!(i in p2)) {
              s2 = getBSBox(p2,i);
              b2 = curvePathBBox(path2curve(p2[s2]));
              // p2[i] = p2[s2]; // or get the biggest/smalles shape
              p2[i] = (i*1) % 2 ? 'M'+b2.cx+' '+b2.cy+ +'l0 0' : 'M'+b2.x+' '+b2.y +'l0 0';
            }
          }

        } else if (pl1<pl2) {
          for (var i in p2){
            if (!(i in p1)) {
              s1 = getBSBox(p1,i);
              b1 = curvePathBBox(path2curve(p1[s1]));
              // p1[i] = p1[s1]; // or get the biggest/smallest shape
              p1[i] = (i*1) % 2 ? 'M'+b1.cx+' '+b1.cy+ +'l0 0' : 'M'+b1.x+' '+b1.y +'l0 0';
            }
          }

        }
      }
      
      for (var j in p1) {
        w._vS.path.d[j] = path2curve(p1[j],p2[j])[0];
        w._vE.path.d[j] = path2curve(p1[j],p2[j])[1];          
      }      
    } else { // we do some single path shapes
      // w._vS.path = w._vE.path = [];
      w._vS.path.d = path2curve(p1,p2)[0];
      w._vE.path.d = path2curve(p1,p2)[1];
    }
  }
  
  function getBSBox(c,i) {
    if (typeof c === 'object'){
      var s = [];
      for (var i in c){
        var bb = curvePathBBox(path2curve(c[i]));
        s.push(bb.w+bb.h);
      }
      if ( i*1 % 2 ) {
        return s.indexOf(Math.min.apply(null, s)).toString();
      } else {
        return s.indexOf(Math.max.apply(null, s)).toString();
      }
    }
  }
  
  function oKeys(o){
    var k = [], p;
    if (!Object.keys) {
      for (p in o) { k.push(p); }
      return k;
    } else {
      return Object.keys(o);
    }
  }
  
  function random(m,M) {
      return Math.floor(Math.random() * (M - m + 1)) + m;
  }
  
  function pathMulti(p){
    var a = p.split(/z/i), path;
    if (a.length > 2) {
      for (var i = 0; i< a.length; i++) { trm(a[i].replace(/\n/,'')); if ( !/[0-9a-z]/gi.test(a[i]) ) { a.splice(i,1) } }
      path = {};
      for (var i=0, l=a.length; i<l; i++) { path[i] = a[i] + 'z'; }
    } else { path = trm(p); }
    return path;
  }
  
  function trm(s){
    if (!String.prototype.trim) {
      return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    } else { return s.trim(); }
  }
  
  
  // register the render SVG path object  
  // process attributes object K.pa(t[x]) and also register their render functions
  K.pp.path = function(a,o){
    if (!('path' in K.dom)) {
      K.dom['path'] = function(w,p,v){
        var curves = [], curve =[], i, l, str='', tp = tp || typeof w._vE.path.d[0][0] === 'object';
        if (tp){ // we process multipath first
          for(i in w._vE.path.d) { // each parent path 
            curves[i] = [];
            for ( var k = 0, l2 = w._vE.path.d[i].length; k < l2; k++){ // each path
              curves[i][k] = [];
              curves[i][k].push([w._vS.path.d[i][k][0]]);
              for(var j=1,l3=w._vE.path.d[i][k].length;j<l3;j++) { // each point
                curves[i][k].push(w._vS.path.d[i][k][j]+(w._vE.path.d[i][k][j]-w._vS.path.d[i][k][j])*v);
              }
              curves[i].push('z');
            }
            str += S.path2string(curves[i]);
          }
          w._el.setAttribute("d", v === 1 ? w._vE.path.o : str);           
        } else {
          for(i=0,l=w._vE.path.d.length;i<l;i++) { //
            curve.push([w._vS.path.d[i][0]]);
            for(var j=1,l2=w._vS.path.d[i].length;j<l2;j++) { // each point
              curve[i].push(w._vS.path.d[i][j]+(w._vE.path.d[i][j]-w._vS.path.d[i][j])*v);
            }
          }
          curve.push('z');
          w._el.setAttribute("d", v === 1 ? w._vE.path.o : S.path2string(curve) );          
        }
      }
    }
    return S.getPath(o);
  }
  
  
  function closestPoint(pathNode, point) {
    var pathLength = pathNode.getTotalLength(),
        precision = pathLength / pathNode.pathSegList.numberOfItems * .125,
        best,
        bestLength,
        bestDistance = Infinity;
    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
      if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
        best = scan, bestLength = scanLength, bestDistance = scanDistance;
      }
    }
    // binary search for precise estimate
    precision *= .5;
    while (precision > .5) {
      var before,
          after,
          beforeLength,
          afterLength,
          beforeDistance,
          afterDistance;
      if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
        best = before, bestLength = beforeLength, bestDistance = beforeDistance;
      } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
        best = after, bestLength = afterLength, bestDistance = afterDistance;
      } else {
        precision *= .5;
      }
    }
    best = [best.x, best.y];
    best.distance = Math.sqrt(bestDistance);
    return best;
    function distance2(p) {
      var dx = p.x - point[0],
          dy = p.y - point[1];
      return dx * dx + dy * dy;
    }
  }
  
  // K.dom[p] = function(w,p,v) { // for SVG unitless related CSS props
  //   w._el.style[p] = w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v;
  // };

  

  /*
  * Paths
  */

  var spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
  var pathCommand = new RegExp("([a-z])[" + spaces + ",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[" + spaces + "]*,?[" + spaces + "]*)+)", "ig");
  var pathValues = new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[" + spaces + "]*,?[" + spaces + "]*", "ig");

  
  // Parses given path string into an array of arrays of path segments
  function parsePathString(pathString) {
    if (!pathString) {
      return null;
    }

    if( pathString instanceof Array ) {
      return pathString;
    } else {
      var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
          data = [];

      String(pathString).replace(pathCommand, function(a, b, c) {
        var params = [],
            name = b.toLowerCase();
        c.replace(pathValues, function (a, b) {
          b && params.push(+b);
        });
        if (name == "m" && params.length > 2) {
          data.push([b].concat(params.splice(0, 2)));
          name = "l";
          b = b == "m" ? "l" : "L";
        }
        if (name == "o" && params.length == 1) {
          data.push([b, params[0]]);
        }
        if (name == "r") {
          data.push([b].concat(params));
        } else while (params.length >= paramCounts[name]) {
          data.push([b].concat(params.splice(0, paramCounts[name])));
          if (!paramCounts[name]) {
            break;
          }
        }
      });

      return data;
    }
  };


  // http://schepers.cc/getting-to-the-point
  function catmullRom2bezier(crp, z) {
    var d = [];
    for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
      var p = [
                {x: +crp[i - 2], y: +crp[i - 1]},
                {x: +crp[i],     y: +crp[i + 1]},
                {x: +crp[i + 2], y: +crp[i + 3]},
                {x: +crp[i + 4], y: +crp[i + 5]}
              ];
      if (z) {
        if (!i) {
          p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
        } else if (iLen - 4 == i) {
          p[3] = {x: +crp[0], y: +crp[1]};
        } else if (iLen - 2 == i) {
          p[2] = {x: +crp[0], y: +crp[1]};
          p[3] = {x: +crp[2], y: +crp[3]};
        }
      } else {
        if (iLen - 4 == i) {
          p[3] = p[2];
        } else if (!i) {
          p[0] = {x: +crp[i], y: +crp[i + 1]};
        }
      }
      d.push(["C",
            (-p[0].x + 6 * p[1].x + p[2].x) / 6,
            (-p[0].y + 6 * p[1].y + p[2].y) / 6,
            (p[1].x + 6 * p[2].x - p[3].x) / 6,
            (p[1].y + 6*p[2].y - p[3].y) / 6,
            p[2].x,
            p[2].y
      ]);
    }

    return d;

  };

  function ellipsePath(x, y, rx, ry, a) {
    if (a == null && ry == null) {
      ry = rx;
    }
    x = +x;
    y = +y;
    rx = +rx;
    ry = +ry;
    if (a != null) {
      var rad = Math.PI / 180,
          x1 = x + rx * Math.cos(-ry * rad),
          x2 = x + rx * Math.cos(-a * rad),
          y1 = y + rx * Math.sin(-ry * rad),
          y2 = y + rx * Math.sin(-a * rad),
          res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
    } else {
      res = [
          ["M", x, y],
          ["m", 0, -ry],
          ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
          ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
          ["z"]
      ];
    }
    return res;
  };

  function pathToAbsolute(pathArray) {
    pathArray = parsePathString(pathArray);

    if (!pathArray || !pathArray.length) {
      return [["M", 0, 0]];
    }
    var res = [],
        x = 0,
        y = 0,
        mx = 0,
        my = 0,
        start = 0,
        pa0;
    if (pathArray[0][0] == "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      res[0] = ["M", x, y];
    }
    var crz = pathArray.length == 3 &&
        pathArray[0][0] == "M" &&
        pathArray[1][0].toUpperCase() == "R" &&
        pathArray[2][0].toUpperCase() == "Z";
    for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
      res.push(r = []);
      pa = pathArray[i];
      pa0 = pa[0];
      if (pa0 != pa0.toUpperCase()) {
        r[0] = pa0.toUpperCase();
        switch (r[0]) {
          case "A":
            r[1] = pa[1];
            r[2] = pa[2];
            r[3] = pa[3];
            r[4] = pa[4];
            r[5] = pa[5];
            r[6] = +pa[6] + x;
            r[7] = +pa[7] + y;
            break;
          case "V":
            r[1] = +pa[1] + y;
            break;
          case "H":
            r[1] = +pa[1] + x;
            break;
          case "R":
            var dots = [x, y].concat(pa.slice(1));
            for (var j = 2, jj = dots.length; j < jj; j++) {
              dots[j] = +dots[j] + x;
              dots[++j] = +dots[j] + y;
            }
            res.pop();
            res = res.concat(catmullRom2bezier(dots, crz));
            break;
          case "O":
            res.pop();
            dots = ellipsePath(x, y, pa[1], pa[2]);
            dots.push(dots[0]);
            res = res.concat(dots);
            break;
          case "U":
            res.pop();
            res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
            r = ["U"].concat(res[res.length - 1].slice(-2));
            break;
          case "M":
            mx = +pa[1] + x;
            my = +pa[2] + y;
          default:
            for (j = 1, jj = pa.length; j < jj; j++) {
              r[j] = +pa[j] + ((j % 2) ? x : y);
            }
        }
      } else if (pa0 == "R") {
        dots = [x, y].concat(pa.slice(1));
        res.pop();
        res = res.concat(catmullRom2bezier(dots, crz));
        r = ["R"].concat(pa.slice(-2));
      } else if (pa0 == "O") {
        res.pop();
        dots = ellipsePath(x, y, pa[1], pa[2]);
        dots.push(dots[0]);
        res = res.concat(dots);
      } else if (pa0 == "U") {
        res.pop();
        res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
        r = ["U"].concat(res[res.length - 1].slice(-2));
      } else {
        for (var k = 0, kk = pa.length; k < kk; k++) {
          r[k] = pa[k];
        }
      }
      pa0 = pa0.toUpperCase();
      if (pa0 != "O") {
        switch (r[0]) {
          case "Z":
            x = +mx;
            y = +my;
            break;
          case "H":
            x = r[1];
            break;
          case "V":
            y = r[1];
            break;
          case "M":
            mx = r[r.length - 2];
            my = r[r.length - 1];
          default:
            x = r[r.length - 2];
            y = r[r.length - 1];
        }
      }
    }

    return res;
  };


  function l2c(x1, y1, x2, y2) {
    return [x1, y1, x2, y2, x2, y2];
  };
  function q2c(x1, y1, ax, ay, x2, y2) {
    var _13 = 1 / 3,
        _23 = 2 / 3;
    return [
            _13 * x1 + _23 * ax,
            _13 * y1 + _23 * ay,
            _13 * x2 + _23 * ax,
            _13 * y2 + _23 * ay,
            x2,
            y2
        ];
  };
  function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    // for more information of where this math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (+angle || 0),
        res = [],
        xy,
        rotate = function (x, y, rad) {
            var X = x * Math.cos(rad) - y * Math.sin(rad),
                Y = x * Math.sin(rad) + y * Math.cos(rad);
            return {x: X, y: Y};
        };
    if (!recursive) {
      xy = rotate(x1, y1, -rad);
      x1 = xy.x;
      y1 = xy.y;
      xy = rotate(x2, y2, -rad);
      x2 = xy.x;
      y2 = xy.y;
      var cos = Math.cos(Math.PI / 180 * angle),
          sin = Math.sin(Math.PI / 180 * angle),
          x = (x1 - x2) / 2,
          y = (y1 - y2) / 2;
      var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx = h * rx;
        ry = h * ry;
      }
      var rx2 = rx * rx,
          ry2 = ry * ry,
          k = (large_arc_flag == sweep_flag ? -1 : 1) *
              Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
          cx = k * rx * y / ry + (x1 + x2) / 2,
          cy = k * -ry * x / rx + (y1 + y2) / 2,
          f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
          f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      f1 < 0 && (f1 = Math.PI * 2 + f1);
      f2 < 0 && (f2 = Math.PI * 2 + f2);
      if (sweep_flag && f1 > f2) {
        f1 = f1 - Math.PI * 2;
      }
      if (!sweep_flag && f2 > f1) {
        f2 = f2 - Math.PI * 2;
      }
    } else {
      f1 = recursive[0];
      f2 = recursive[1];
      cx = recursive[2];
      cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
      var f2old = f2,
          x2old = x2,
          y2old = y2;
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return [m2, m3, m4].concat(res);
    } else {
      res = [m2, m3, m4].concat(res).join().split(",");
      var newres = [];
      for (var i = 0, ii = res.length; i < ii; i++) {
        newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
      }
      return newres;
    }
  };

  function clone(obj) {
    var copy;

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = clone(obj[attr]);
        }
      }
      return copy;
    }

    return obj;
  }

  function path2curve(path, path2) {
    var p = pathToAbsolute(path),
        p2 = path2 && pathToAbsolute(path2),
        attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
        attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
        processPath = function (path, d, pcom) {
          var nx, ny;
          if (!path) {
            return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
          }
          !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
          switch (path[0]) {
            case "M":
              d.X = path[1];
              d.Y = path[2];
              break;
            case "A":
              path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
              break;
            case "S":
              if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
                nx = d.x * 2 - d.bx;          // And reflect the previous
                ny = d.y * 2 - d.by;          // command's control point relative to the current point.
              }
              else {                            // or some else or nothing
                nx = d.x;
                ny = d.y;
              }
              path = ["C", nx, ny].concat(path.slice(1));
              break;
            case "T":
              if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
                d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                d.qy = d.y * 2 - d.qy;        // to case "S".
              }
              else {                            // or something else or nothing
                d.qx = d.x;
                d.qy = d.y;
              }
              path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
              break;
            case "Q":
              d.qx = path[1];
              d.qy = path[2];
              path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
              break;
            case "L":
              path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
              break;
            case "H":
              path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
              break;
            case "V":
              path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
              break;
            case "Z":
              path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
              break;
          }
          return path;
        },
        fixArc = function (pp, i) {
          if (pp[i].length > 7) {
            pp[i].shift();
            var pi = pp[i];
            while (pi.length) {
              pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
              p2 && (pcoms2[i] = "A"); // the same as above
              pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
            }
            pp.splice(i, 1);
            ii = Math.max(p.length, p2 && p2.length || 0);
          }
        },
        fixM = function (path1, path2, a1, a2, i) {
          if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
            path2.splice(i, 0, ["M", a2.x, a2.y]);
            a1.bx = 0;
            a1.by = 0;
            a1.x = path1[i][1];
            a1.y = path1[i][2];
            ii = Math.max(p.length, p2 && p2.length || 0);
          }
        },
        pcoms1 = [], // path commands of original path p
        pcoms2 = [], // path commands of original path p2
        pfirst = "", // temporary holder for original path command
        pcom = ""; // holder for previous path command of original path
    for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
      p[i] && (pfirst = p[i][0]); // save current path command

      if (pfirst != "C") { // C is not saved yet, because it may be result of conversion
        pcoms1[i] = pfirst; // Save current path command
        i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
      }
      p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

      if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
      // which may produce multiple C:s
      // so we have to make sure that C is also C in original path

      fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

      if (p2) { // the same procedures is done to p2
        p2[i] && (pfirst = p2[i][0]);
        if (pfirst != "C") {
          pcoms2[i] = pfirst;
          i && (pcom = pcoms2[i - 1]);
        }
        p2[i] = processPath(p2[i], attrs2, pcom);

        if (pcoms2[i] != "A" && pfirst == "C") {
          pcoms2[i] = "C";
        }

        fixArc(p2, i);
      }
      fixM(p, p2, attrs, attrs2, i);
      fixM(p2, p, attrs2, attrs, i);
      var seg = p[i],
          seg2 = p2 && p2[i],
          seglen = seg.length,
          seg2len = p2 && seg2.length;
      attrs.x = seg[seglen - 2];
      attrs.y = seg[seglen - 1];
      attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
      attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
      attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
      attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
      attrs2.x = p2 && seg2[seg2len - 2];
      attrs2.y = p2 && seg2[seg2len - 1];
    }

    return p2 ? [p, p2] : p;
  };

  function box(x, y, width, height) {
    if (x == null) {
      x = y = width = height = 0;
    }
    if (y == null) {
      y = x.y;
      width = x.width;
      height = x.height;
      x = x.x;
    }
    return {
      x: x,
      y: y,
      w: width,
      h: height,
      cx: x + width / 2,
      cy: y + height / 2
    };
  };

  // Returns bounding box of cubic bezier curve.
  // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
  // Original version: NISHIO Hirokazu
  // Modifications: https://github.com/timo22345
  function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
    var tvalues = [],
        bounds = [[], []],
        a, b, c, t, t1, t2, b2ac, sqrtb2ac;
    for (var i = 0; i < 2; ++i) {
      if (i == 0) {
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
      } else {
        b = 6 * y0 - 12 * y1 + 6 * y2;
        a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
        c = 3 * y1 - 3 * y0;
      }
      if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) < 1e-12) {
          continue;
        }
        t = -c / b;
        if (0 < t && t < 1) {
          tvalues.push(t);
        }
        continue;
      }
      b2ac = b * b - 4 * c * a;
      sqrtb2ac = Math.sqrt(b2ac);
      if (b2ac < 0) {
        continue;
      }
      t1 = (-b + sqrtb2ac) / (2 * a);
      if (0 < t1 && t1 < 1) {
        tvalues.push(t1);
      }
      t2 = (-b - sqrtb2ac) / (2 * a);
      if (0 < t2 && t2 < 1) {
        tvalues.push(t2);
      }
    }

    var j = tvalues.length,
        jlen = j,
        mt;
    while (j--) {
      t = tvalues[j];
      mt = 1 - t;
      bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
      bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
    }

    bounds[0][jlen] = x0;
    bounds[1][jlen] = y0;
    bounds[0][jlen + 1] = x3;
    bounds[1][jlen + 1] = y3;
    bounds[0].length = bounds[1].length = jlen + 2;

    return {
      min: {x: Math.min.apply(0, bounds[0]), y: Math.min.apply(0, bounds[1])},
      max: {x: Math.max.apply(0, bounds[0]), y: Math.max.apply(0, bounds[1])}
    };
  };

  function curvePathBBox(path) {
    var x = 0,
        y = 0,
        X = [],
        Y = [],
        p;
    for (var i = 0, ii = path.length; i < ii; i++) {
      p = path[i];
      if (p[0] == "M") {
        x = p[1];
        y = p[2];
        X.push(x);
        Y.push(y);
      } else {
        var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
        X = X.concat(dim.min.x, dim.max.x);
        Y = Y.concat(dim.min.y, dim.max.y);
        x = p[5];
        y = p[6];
      }
    }
    var xmin = Math.min.apply(0, X),
        ymin = Math.min.apply(0, Y),
        xmax = Math.max.apply(0, X),
        ymax = Math.max.apply(0, Y),
        bb = box(xmin, ymin, xmax - xmin, ymax - ymin);

    return bb;
  };



  S.path2string = function(path) {
    return path.join(',').replace(p2s, "$1");
  };

  return S;
}));
