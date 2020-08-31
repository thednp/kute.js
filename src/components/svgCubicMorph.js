import Components from '../objects/components.js'
import selector from '../util/selector.js'
import numbers from '../interpolation/numbers.js' 

import {onStartCubicMorph} from './svgCubicMorphBase.js'

import parsePathString from 'svg-path-commander/src/process/parsePathString.js'
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'
import reverseCurve from 'svg-path-commander/src/process/reverseCurve.js'
import createPath from 'svg-path-commander/src/util/createPath.js'
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js'
import clonePath from 'svg-path-commander/src/process/clonePath.js'
import splitCubic from 'svg-path-commander/src/process/splitCubic.js'
import splitPath from 'svg-path-commander/src/process/splitPath.js'

// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Util
function getCurveArray(pathString){
  return pathToCurve(splitPath(pathToString(pathToAbsolute(pathString)))[0]).map((x,i,pathArray)=>{
    let curveToPath = i ? [['M'].concat(pathArray[i-1].slice(-2))].concat([x]) : [],
        curveLength = i ? createPath(pathToString(clonePath(curveToPath))).getTotalLength() : 0,
        subsegs = i ? (curveLength ? splitCubic( pathArray[i-1].slice(-2).concat(x.slice(1)) ) : [x,x]) : [x];
    return { 
      seg: x, 
      subsegs: subsegs,
      length: curveLength
    }
  })
}

function equalizeSegments(path1,path2,TL){
  let c1 = getCurveArray(path1),
      c2 = getCurveArray(path2), 
      L1 = c1.length,
      L2 = c2.length,
      l1 = c1.filter(x=>x.length).length,
      l2 = c2.filter(x=>x.length).length,
      m1 = c1.filter(x=>x.length).reduce((a,{length})=>a+length,0) / l1 || 0,
      m2 = c2.filter(x=>x.length).reduce((a,{length})=>a+length,0) / l2 || 0,
      tl = TL || Math.max(L1,L2),
      mm = [m1,m2],
      dif = [tl-L1,tl-L2],
      result = [c1,c2].map((x,i) => x.length === tl ? x.map(y=>y.seg)
             : x.map((y,j) => {
                let canSplit = j && dif[i] && y.length >= mm[i],
                    segResult = canSplit ? y.subsegs : [y.seg]
                dif[i] -= canSplit ? 1 : 0
                return segResult
              }).flat())

  return result[0].length === result[1].length ? result : equalizeSegments(result[0],result[1],tl)
}

function getRotations(a) {
  let segCount = a.length, pointCount = segCount - 1

  return a.map((f,idx) => {
    return a.map((p,i)=>{
      let oldSegIdx = idx + i, seg;
      if (i===0 || a[oldSegIdx] && a[oldSegIdx][0] === 'M') {
        seg = a[oldSegIdx]
        return ['M'].concat(seg.slice(-2))
      } else {
        if (oldSegIdx >= segCount) oldSegIdx -= pointCount;
        return a[oldSegIdx]
      }
    })
  })
}

function getRotatedCurve(a,b) {
  let segCount = a.length - 1,
      linePaths = [],
      lineLengths = [],
      rotations = getRotations(a);

  rotations.map((r,i)=>{
    let sumLensSqrd = 0, 
        linePath = createPath('M0,0L0,0'),
        linePt1, ll1,
        linePt2, ll2,
        linePathStr

    for (let j = 0; j < segCount; j++) {
      linePt1 = a[(i + j) % segCount]; ll1 = linePt1.length
      linePt2 = b[ j  % segCount]; ll2 = linePt2.length
      linePathStr = `M${linePt1[ll1-2]},${linePt1[ll1-1]}L${linePt2[ll2-2]},${linePt2[ll2-1]}`
      linePath.setAttribute('d',linePathStr);
      sumLensSqrd += Math.pow(linePath.getTotalLength(),2);
      linePaths[j] = linePath;
    }
    lineLengths[i] = sumLensSqrd
    sumLensSqrd = 0
  })

  let computedIndex = lineLengths.indexOf(Math.min.apply(null,lineLengths))

  return rotations[computedIndex]
}

// Component Functions
function getCubicMorph(tweenProp){
  return this.element.getAttribute('d');
}
function prepareCubicMorph(tweenProp,value){
  // get path d attribute or create a path from string value
  let pathObject = {}, 
      el = value instanceof SVGElement ? value : /^\.|^\#/.test(value) ? selector(value) : null,
      pathReg = new RegExp('\\n','ig'); // remove newlines, they break some JSON strings

  // make sure to return pre-processed values
  if ( typeof(value) === 'object' && value.curve ) {
    return value;
  } else if ( el && /path|glyph/.test(el.tagName) ) {
    pathObject.original = el.getAttribute('d').replace(pathReg,'');
  } else if (!el && typeof(value) === 'string') { // maybe it's a string path already
    pathObject.original = value.replace(pathReg,'');
  }
  return pathObject;
}
function crossCheckCubicMorph(tweenProp){
  if (this.valuesEnd[tweenProp]) {
    let pathCurve1 = this.valuesStart[tweenProp].curve,
        pathCurve2 = this.valuesEnd[tweenProp].curve

    if ( !pathCurve1 || !pathCurve2 || ( pathCurve1 && pathCurve2 && pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length) ) {
      let path1 = this.valuesStart[tweenProp].original,
          path2 = this.valuesEnd[tweenProp].original,
          curves = equalizeSegments(path1,path2),
          curve0 = getDrawDirection(curves[0]) !== getDrawDirection(curves[1]) ? reverseCurve(curves[0]) : clonePath(curves[0])
      this.valuesStart[tweenProp].curve = curve0;
      this.valuesEnd[tweenProp].curve = getRotatedCurve(curves[1],curve0)
    }
  }
}

// All Component Functions
const svgCubicMorphFunctions = {
  prepareStart: getCubicMorph,
  prepareProperty: prepareCubicMorph,
  onStart: onStartCubicMorph,
  crossCheck: crossCheckCubicMorph
}

// Component Full
const svgCubicMorph = {
  component: 'svgCubicMorph',
  property: 'path',
  defaultValue: [],
  Interpolate: {numbers,pathToString},
  functions: svgCubicMorphFunctions,
  // export utils to global for faster execution
  Util: {
    pathToCurve, pathToAbsolute, pathToString, parsePathString,
    getRotatedCurve, getRotations, equalizeSegments,
    reverseCurve, createPath, clonePath, getDrawDirection,
    splitCubic, getCurveArray
  }
}

export default svgCubicMorph

Components.SVGCubicMorph = svgCubicMorph
