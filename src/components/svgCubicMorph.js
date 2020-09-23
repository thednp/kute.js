import Components from '../objects/components.js'
import selector from '../util/selector.js'
import numbers from '../interpolation/numbers.js' 

import {onStartCubicMorph} from './svgCubicMorphBase.js'

import parsePathString from 'svg-path-commander/src/process/parsePathString.js'
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'
import reverseCurve from 'svg-path-commander/src/process/reverseCurve.js'
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js'
import clonePath from 'svg-path-commander/src/process/clonePath.js'
import splitCubic from 'svg-path-commander/src/process/splitCubic.js'
import splitPath from 'svg-path-commander/src/process/splitPath.js'
import getSegCubicLength from 'svg-path-commander/src/util/getSegCubicLength.js'
import distanceSquareRoot from 'svg-path-commander/src/math/distanceSquareRoot.js'


// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Util
function getCurveArray(pathString){
  return pathToCurve(splitPath(pathToString(pathToAbsolute(pathString)))[0]).map((segment,i,pathArray)=>{
    let segmentData = i && pathArray[i-1].slice(-2).concat(segment.slice(1)),
        curveLength = i ? getSegCubicLength.apply(0, segmentData ) : 0,
        subsegs = i ? (curveLength ? splitCubic( segmentData ) : [segment,segment]) : [segment]; // must be [segment,segment] 
    return { 
      s: segment, 
      ss: subsegs,
      l: curveLength
    }
  })
}

function equalizeSegments(path1,path2,TL){
  let c1 = getCurveArray(path1),
      c2 = getCurveArray(path2), 
      L1 = c1.length,
      L2 = c2.length,
      l1 = c1.filter(x=>x.l).length,
      l2 = c2.filter(x=>x.l).length,
      m1 = c1.filter(x=>x.l).reduce((a,{l})=>a+l,0) / l1 || 0,
      m2 = c2.filter(x=>x.l).reduce((a,{l})=>a+l,0) / l2 || 0,
      tl = TL || Math.max(L1,L2),
      mm = [m1,m2],
      dif = [tl-L1,tl-L2],
      canSplit = 0,
      result = [c1,c2].map((x,i) => x.l === tl ? x.map(y=>y.s)
             : x.map((y,j) => {
                canSplit = j && dif[i] && y.l >= mm[i]
                dif[i] -= canSplit ? 1 : 0
                return canSplit ? y.ss : [y.s]
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
      lineLengths = [],
      computedIndex = 0,
      sumLensSqrd = 0,
      rotations = getRotations(a);

  rotations.map((r,i)=>{
    a.slice(1).map((s,j) => {
      sumLensSqrd += distanceSquareRoot(a[(i+j) % segCount].slice(-2),b[j % segCount].slice(-2))
    })
    lineLengths[i] = sumLensSqrd
    sumLensSqrd = 0
  })

  computedIndex = lineLengths.indexOf(Math.min.apply(null,lineLengths))

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
    reverseCurve, clonePath, getDrawDirection,
    splitCubic, getCurveArray
  }
}

export default svgCubicMorph

Components.SVGCubicMorph = svgCubicMorph
