import KUTE from '../objects/kute.js'
import Components from '../objects/components.js'
import selector from '../util/selector.js'
import {numbers} from '../objects/interpolate.js'

// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers,coords} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Util
const INVALID_INPUT = 'Invalid path value'

/* Raphael.js - path (https://github.com/DmitryBaranovskiy/raphael)
 * Copyright © 2008-2013 Dmitry Baranovskiy (http://dmitrybaranovskiy.github.io/raphael/)
 * Copyright © 2008-2013 Sencha Labs (http://sencha.com)
 * Licensed under the MIT (http://dmitrybaranovskiy.github.io/raphael/license.html) license.
 * KUTE.js modifications
 * - parsePathString is now moved outside of main functions
 * - processPath moved outside pathToAbsolute function body
 * - fixArc moved outside path2curve function body
 * - fixM moved outside path2curve function body
 * - minor fixes like "a != b" => "a !== b", various undefined/unused variables
*/

// http://schepers.cc/getting-to-the-point
function catmullRom2bezier(crp, z) {
  const d = [];
  for (let i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
    const p = [
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
    ])
  }
  return d
}

function ellipsePath(x, y, rx, ry, a) {
  if (a == null && ry == null) {
    ry = rx;
  }
  x = +x;
  y = +y;
  rx = +rx;
  ry = +ry;
  let res;
  if (a != null) {
    const rad = Math.PI / 180,
          x1 = x + rx * Math.cos(-ry * rad),
          x2 = x + rx * Math.cos(-a * rad),
          y1 = y + rx * Math.sin(-ry * rad),
          y2 = y + rx * Math.sin(-a * rad);
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
}


// Parses given path string into an array of arrays of path segments
function parsePathString(pathString) {
  if (!pathString) {
    return null;
  }
  if( pathString instanceof Array ) {
    return pathString;
  } else {
    
    // tracer minifier cannot compute this string for some reason
    // let spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
    let spaces = `\\${("x09|x0a|x0b|x0c|x0d|x20|xa0|u1680|u180e|u2000|u2001|u2002|u2003|u2004|u2005|u2006|u2007|u2008|u2009|u200a|u202f|u205f|u3000|u2028|u2029").split('|').join('\\')}`,
        pathCommand = new RegExp(`([a-z])[${spaces},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${spaces}]*,?[${spaces}]*)+)`, `ig`),
        pathValues = new RegExp(`(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${spaces}]*,?[${spaces}]*`, `ig`),
        paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [];

    pathString.replace(pathCommand, (a, b, c) => {
      let params = [], name = b.toLowerCase();
      
      c.replace(pathValues, (a, b) => {
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
}

export function pathToAbsolute(pathArray) {
  pathArray = parsePathString(pathArray);

  if (!pathArray || !pathArray.length) {
    return [["M", 0, 0]];
  }
  let res = [], x = 0, y = 0, mx = 0, my = 0, start = 0, pa0;
  if (pathArray[0][0] === "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = ["M", x, y];
  }
  const crz = pathArray.length === 3 &&
      pathArray[0][0] === "M" &&
      pathArray[1][0].toUpperCase() === "R" &&
      pathArray[2][0].toUpperCase() === "Z";
  for (let r, pa, i = start, ii = pathArray.length; i < ii; i++) {
    res.push(r = []);
    pa = pathArray[i];
    pa0 = pa[0];
    if (pa0 !== pa0.toUpperCase()) {
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
      for (let k = 0, kk = pa.length; k < kk; k++) {
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
  return res
}
function l2c(x1, y1, x2, y2) {
  return [x1, y1, x2, y2, x2, y2];
}
function q2c(x1, y1, ax, ay, x2, y2) {
  const _13 = 1 / 3;
  const _23 = 2 / 3;
  return [
          _13 * x1 + _23 * ax,
          _13 * y1 + _23 * ay,
          _13 * x2 + _23 * ax,
          _13 * y2 + _23 * ay,
          x2,
          y2
        ]
}

// for more information of where this math came from visit:
// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
  const _120 = Math.PI * 120 / 180, rad = Math.PI / 180 * (+angle || 0);
  let res = [], xy, f1, f2, cx, cy;

  function rotateVector(x, y, rad) {
    const X = x * Math.cos(rad) - y * Math.sin(rad), 
          Y = x * Math.sin(rad) + y * Math.cos(rad);
    return {x: X, y: Y};
  }

  if (!recursive) {
    xy = rotateVector(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotateVector(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;
    // const cos = Math.cos(Math.PI / 180 * angle);
    // const sin = Math.sin(Math.PI / 180 * angle);
    let x = (x1 - x2) / 2, y = (y1 - y2) / 2, h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    let rx2 = rx * rx, 
        ry2 = ry * ry,
        k = (large_arc_flag == sweep_flag ? -1 : 1) 
          * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) 
          / (rx2 * y * y + ry2 * x * x)));

    cx = k * rx * y / ry + (x1 + x2) / 2,
    cy = k * -ry * x / rx + (y1 + y2) / 2;

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
  let df = f2 - f1;
  if (Math.abs(df) > _120) {
    const f2old = f2, x2old = x2, y2old = y2;

    f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  const c1 = Math.cos(f1),
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
    const newres = [];
    for (let i = 0, ii = res.length; i < ii; i++) {
      newres[i] = i % 2 ? rotateVector(res[i - 1], res[i], rad).y : rotateVector(res[i], res[i + 1], rad).x;
    }
    return newres;
  }
}

export function processPath (path, d, pcom) {
  let nx, ny;
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
        nx = d.x * 2 - d.bx;            // And reflect the previous
        ny = d.y * 2 - d.by;            // command's control point relative to the current point.
      }
      else {                            // or some else or nothing
        nx = d.x;
        ny = d.y;
      }
      path = ["C", nx, ny].concat(path.slice(1));
      break;
    case "T":
      if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
        d.qx = d.x * 2 - d.qx;          // And make a reflection similar
        d.qy = d.y * 2 - d.qy;          // to case "S".
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
  path.map((x,i)=>i?x.toFixed(3):x)
  return path;
}

function fixM (path1, path2, a1, a2, i) {
  if (path1 && path2 && path1[i][0] === "M" && path2[i][0] !== "M") {
    path2.splice(i, 0, ["M", a2.x, a2.y]);
    a1.bx = 0;
    a1.by = 0;
    a1.x = path1[i][1];
    a1.y = path1[i][2];
    // ii = Math.max(p.length, p2 && p2.length || 0);
  }
}

export function fixArc (p, p2, pcoms1, pcoms2, i) {
  if (p[i].length > 7) {
    p[i].shift();
    const pi = p[i];
    while (pi.length) {
      pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
      p2 && (pcoms2[i] = "A"); // the same as above
      p.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
    }
    p.splice(i, 1);
  }
}

export function path2curve(path, path2) {
  const p = pathToAbsolute(path), // holder for previous path command of original path
        p2 = path2 && pathToAbsolute(path2),
        // p2 = path2 ? pathToAbsolute(path2) : pathToAbsolute('M0,0L0,0'),
        attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
        attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null};

  // path commands of original path p
  // path commands of original path p2
  // temporary holder for original path command
  let pcoms1 = [], pcoms2 = [], pfirst = "", pcom = "";

  for (let i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
    p[i] && (pfirst = p[i][0]); // save current path command

    if (pfirst !== "C") { // C is not saved yet, because it may be result of conversion
      pcoms1[i] = pfirst; // Save current path command
      i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
    }
    p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath
    
    // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path
    if (pcoms1[i] !== "A" && pfirst === "C") pcoms1[i] = "C"; 

    // fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1
    fixArc(p, p2, pcoms1, pcoms2, i); // fixArc adds also the right amount of A:s to pcoms1 fixArc (p, p2, pcoms1, pcoms2, i) {
    ii = Math.max(p.length, p2 && p2.length || 0);

    if (p2) { // the same procedures is done to p2
      p2[i] && (pfirst = p2[i][0]);
      if (pfirst !== "C") {
        pcoms2[i] = pfirst;
        i && (pcom = pcoms2[i - 1]);
      }
      p2[i] = processPath(p2[i], attrs2, pcom);

      if (pcoms2[i] !== "A" && pfirst === "C") {
        pcoms2[i] = "C";
      }

      // fixArc(p2, i);
      fixArc(p2, p, pcoms2, pcoms1, i); // fixArc (p, p2, pcoms1, pcoms2, i) {
      ii = Math.max(p.length, p2 && p2.length || 0);
    }
    fixM(p, p2, attrs, attrs2, i);
    p2 && fixM(p2, p, attrs2, attrs, i);
    ii = Math.max(p.length, p2 && p2.length || 0);

    const seg = p[i],
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
}

function createPath (path) { // create a <path> when glyph
  const np = document.createElementNS('http://www.w3.org/2000/svg','path'), 
        d = path instanceof SVGElement ? path.getAttribute('d') : path
  np.setAttribute('d',d);
  return np
}

function getSegments(curveArray) {
  let result = []
  curveArray.map((seg, i) => {
    result[i] = {
      x: seg[seg[0] === 'M' ? 1 : 5],
      y: seg[seg[0] === 'M' ? 2 : 6],
      seg: seg
    }
  })
  return result
}
function reverseCurve(path){
  let newSegments = [],
      oldSegments = getSegments(path),
      segsCount = oldSegments.length,
      pointCount = segsCount - 1,
      oldSegIdx = pointCount,
      oldSegs = []

  oldSegments.map((p,i)=>{
    if (i === 0||oldSegments[oldSegIdx].seg[0] === 'M') {
      newSegments[i] = ['M',oldSegments[oldSegIdx].x,oldSegments[oldSegIdx].y]
    } else {
      oldSegIdx = pointCount - i > 0 ? pointCount - i : pointCount;
      oldSegs = oldSegments[oldSegIdx].seg
      newSegments[i] = [oldSegs[0], oldSegs[5],oldSegs[6],oldSegs[3],oldSegs[4], oldSegs[1], oldSegs[2]]
    }
  })

  return newSegments
}

function getRotationSegments(s,idx) {
  let newSegments = [], segsCount = s.length, pointCount = segsCount - 1

  s.map((p,i)=>{
    let oldSegIdx = idx + i;
    if (i===0 || s[oldSegIdx] && s[oldSegIdx].seg[0] === 'M') {
      newSegments[i] = ['M',s[oldSegIdx].x,s[oldSegIdx].y]
    } else {
      if (oldSegIdx >= segsCount) oldSegIdx -= pointCount;
      newSegments[i] = s[oldSegIdx].seg
    }
  })
  return newSegments
}

function getRotations(a) {
  let startSegments = getSegments(a), rotations = [];
  startSegments.map((s,i)=>{rotations[i] = getRotationSegments(startSegments,i)})
  return rotations
}

function getRotatedCurve(a,b) {
  let startSegments = getSegments(a),
      endSegments = getSegments(b),
      segsCount = startSegments.length,
      pointCount = segsCount - 1,
      linePaths = [],
      lineLengths = [],
      rotations = getRotations(a);

  rotations.map((r,i)=>{
    let sumLensSqrd = 0, linePath = createPath('M0,0L0,0');
    for (let j = 0; j < pointCount; j++) {
      let linePt1 = startSegments[(i + j) % pointCount];
      let linePt2 = endSegments[ j  % pointCount];
      let linePathStr = `M${linePt1.x},${linePt1.y}L${linePt2.x},${linePt2.y}`;
      linePath.setAttribute('d',linePathStr);
      sumLensSqrd += Math.pow(linePath.getTotalLength(),2);
      linePaths[j] = linePath;
    }
    lineLengths[i] = sumLensSqrd
    sumLensSqrd = 0
  })

  let computedIndex = lineLengths.indexOf(Math.min.apply(null,lineLengths)),
      newPath = rotations[computedIndex];
  return newPath
}

export function toPathString(pathArray) {
  let newPath = pathArray.map( (c) => { 
    if (typeof(c) === 'string') {
      return c
    } else {
      let c0 = c.shift();  
      return c0 + c.join(',') 
    }
  })
  return newPath.join('');
}

// Component Functions
export function getCubicMorph(tweenProp){
  return this.element.getAttribute('d');
}
export function prepareCubicMorph(tweenProp,value){
  // get path d attribute or create a path from string value
  let pathObject = {}, 
      el = value instanceof SVGElement ? value : /^\.|^\#/.test(value) ? selector(value) : null,
      pathReg = new RegExp('\\n','ig'); // remove newlines, they break some JSON strings

  try {
    // make sure to return pre-processed values
    if ( typeof(value) === 'object' && value.curve ) {
      return value;
    } else if ( el && /path|glyph/.test(el.tagName) ) {
      pathObject.original = el.getAttribute('d').replace(pathReg,'');
    // } else if (!el && /m|z|c|l|v|q|[0-9]|\,/gi.test(value)) { // maybe it's a string path already
    } else if (!el && typeof(value) === 'string') { // maybe it's a string path already
      pathObject.original = value.replace(pathReg,'');
    }
    return pathObject;
  }
  catch(e){
    throw TypeError(`KUTE.js - ${INVALID_INPUT} ${e}`)
  }
}
export function crossCheckCubicMorph(tweenProp){
  if (this.valuesEnd[tweenProp]) {
    let pathCurve1 = this.valuesStart[tweenProp].curve,
        pathCurve2 = this.valuesEnd[tweenProp].curve

    if ( !pathCurve1 || !pathCurve2 || ( pathCurve1 && pathCurve2 && pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length) ) {
      let path1 = this.valuesStart[tweenProp].original,
          path2 = this.valuesEnd[tweenProp].original,
          curves = path2curve(path1,path2)

      let curve0 = this._reverseFirstPath ? reverseCurve.call(this,curves[0]) : curves[0],
          curve1 = this._reverseSecondPath ? reverseCurve.call(this,curves[1]) : curves[1]
    
      curve0 = getRotatedCurve.call(this,curve0,curve1)
      this.valuesStart[tweenProp].curve = curve0;
      this.valuesEnd[tweenProp].curve = curve1;
    }
  }
}
export function onStartCubicMorph(tweenProp){
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
    KUTE[tweenProp] = function(elem,a,b,v){
      let curve = [], path1 = a.curve, path2 = b.curve;
      for(let i=0, l=path2.length; i<l; i++) { // each path command
        curve.push([path1[i][0]]);
        for(var j=1,l2=path1[i].length;j<l2;j++) { // each command coordinate
          curve[i].push( (numbers(path1[i][j], path2[i][j], v) * 1000 >>0)/1000 );
        }
      }
      elem.setAttribute("d", v === 1 ? b.original : toPathString(curve) );
    }
  }
}

// All Component Functions
export const svgCubicMorphFunctions = {
  prepareStart: getCubicMorph,
  prepareProperty: prepareCubicMorph,
  onStart: onStartCubicMorph,
  crossCheck: crossCheckCubicMorph
}

// Component Base
export const baseSvgCubicMorphOps = {
  component: 'svgCubicMorph',
  property: 'path',
  // defaultValue: [],
  Interpolate: {numbers,toPathString},
  functions: {onStart:onStartCubicMorph}
}

// Component Full
export const svgCubicMorphOps = {
  component: 'svgCubicMorph',
  property: 'path',
  defaultValue: [],
  Interpolate: {numbers,toPathString},
  functions: svgCubicMorphFunctions,
  // export utils to global for faster execution
  Util: {
    l2c, q2c, a2c, catmullRom2bezier, ellipsePath, 
    path2curve, pathToAbsolute, toPathString, parsePathString,
    getRotatedCurve, getRotations, 
    getRotationSegments, reverseCurve, getSegments, createPath
  }
}

Components.SVGCubicMorph = svgCubicMorphOps
