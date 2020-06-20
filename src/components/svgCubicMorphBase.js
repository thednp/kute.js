import KUTE from '../objects/kute.js'
import numbers from '../interpolation/numbers.js' 

// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Interpolation
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

// Component Base
const baseSvgCubicMorph = {
  component: 'baseSVGCubicMorph',
  property: 'path',
  // defaultValue: [],
  Interpolate: {numbers,toPathString},
  functions: {onStart:onStartCubicMorph}
}

export default baseSvgCubicMorph