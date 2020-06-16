import KUTE from '../objects/kute.js'

// const SVGMorph = { property : 'path', defaultValue: [], interpolators: {numbers,coords} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component Interpolation
// function function(array1, array2, length, progress)
export function coords (a, b, l, v) {
  const points = [];
  for(let i=0;i<l;i++) { // for each point
    points[i] = [];
    for(let j=0;j<2;j++) { // each point coordinate
      points[i].push( ((a[i][j]+(b[i][j]-a[i][j])*v) * 1000 >> 0)/1000 );
    }
  }
  return points;
}

// Component functions
export function onStartSVGMorph(tweenProp){
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      let path1 = a.pathArray, path2 = b.pathArray, len = path2.length, pathString;
      pathString = v === 1 ? b.original : `M${coords( path1, path2, len, v ).join('L')}Z`;
      elem.setAttribute("d", pathString );
    }
  }
}

// Component Base
const baseSVGMorph = {
  component: 'baseSVGMorph',
  property: 'path',
  Interpolate: coords,
  functions: {onStart:onStartSVGMorph}
}

export default baseSVGMorph