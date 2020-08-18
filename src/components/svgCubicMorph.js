import Components from '../objects/components.js'
import selector from '../util/selector.js'
import numbers from '../interpolation/numbers.js' 

import {onStartCubicMorph} from './svgCubicMorphBase.js'

import parsePathString from 'svg-path-commander/src/process/parsePathString.js'
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'
import reverseCurve from 'svg-path-commander/src/process/reverseCurve.js'
import invalidPathValue from 'svg-path-commander/src/util/invalidPathValue.js'

// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Util
function createPath(path) { // create a <path> when glyph
  let np = document.createElementNS('http://www.w3.org/2000/svg','path'), 
      d = path instanceof SVGElement ? path.getAttribute('d') : path
  np.setAttribute('d',d);
  return np
}

function getRotationSegments(s,idx) {
  let segsCount = s.length, pointCount = segsCount - 1

  return s.map((p,i)=>{
    let oldSegIdx = idx + i, seg;
    if (i===0 || s[oldSegIdx] && s[oldSegIdx][0] === 'M') {
      seg = s[oldSegIdx]
      return ['M',seg[seg.length-2],seg[seg.length-1]]
    } else {
      if (oldSegIdx >= segsCount) oldSegIdx -= pointCount;
      return s[oldSegIdx]
    }
  })
}

function getRotations(a) {
  return a.map((s,i) => getRotationSegments(a,i))
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
    throw TypeError(`KUTE.js - ${invalidPathValue} ${e}`)
  }
}
function crossCheckCubicMorph(tweenProp){
  if (this.valuesEnd[tweenProp]) {
    let pathCurve1 = this.valuesStart[tweenProp].curve,
        pathCurve2 = this.valuesEnd[tweenProp].curve

    if ( !pathCurve1 || !pathCurve2 || ( pathCurve1 && pathCurve2 && pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length) ) {
      let path1 = this.valuesStart[tweenProp].original,
          path2 = this.valuesEnd[tweenProp].original,
          curves = pathToCurve(path1,path2),
          
          curve0 = this._reverseFirstPath ? reverseCurve(curves[0]) : curves[0],
          curve1 = this._reverseSecondPath ? reverseCurve(curves[1]) : curves[1]
    
      curve0 = getRotatedCurve.call(this,curve0,curve1)
      this.valuesStart[tweenProp].curve = curve0;
      this.valuesEnd[tweenProp].curve = curve1;
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
    getRotatedCurve, getRotations, 
    getRotationSegments, reverseCurve, createPath
  }
}

export default svgCubicMorph

Components.SVGCubicMorph = svgCubicMorph
