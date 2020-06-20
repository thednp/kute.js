import KUTE from '../objects/kute.js'
import numbers from '../interpolation/numbers.js'
import arrays from '../interpolation/arrays.js'

// const transformMatrix = { property : 'transform', defaultValue: {}, interpolators: {} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component name
const matrixComponent = 'transformMatrix'

// Component special
const CSS3Matrix = typeof(DOMMatrix) !== 'undefined' ? DOMMatrix 
                 : typeof(WebKitCSSMatrix) !== 'undefined' ? WebKitCSSMatrix
                 : typeof(CSSMatrix) !== 'undefined' ? CSSMatrix
                 : typeof(MSCSSMatrix) !== 'undefined' ? MSCSSMatrix
                 : null

// Component Functions
export const onStartTransform = {
  transform : function(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      
      KUTE[tweenProp] = (elem, a, b, v) => {
        let matrix = new CSS3Matrix(), transformObject = {}

        for ( const p in b ) {
          transformObject[p] = p === 'perspective' ? numbers(a[p],b[p],v) : arrays(a[p],b[p],v)
        }

        transformObject.perspective && (matrix.m34 = -1/transformObject.perspective)// set perspective
        matrix = transformObject.translate3d ? (matrix.translate(transformObject.translate3d[0],transformObject.translate3d[1],transformObject.translate3d[2])) : matrix // set translate
        matrix = transformObject.rotate3d ? (matrix.rotate(transformObject.rotate3d[0],transformObject.rotate3d[1],transformObject.rotate3d[2])) : matrix // set rotation
        if (transformObject.skew) { // set skew
          matrix = transformObject.skew[0] ? matrix.skewX(transformObject.skew[0]) : matrix;
          matrix = transformObject.skew[1] ? matrix.skewY(transformObject.skew[1]) : matrix;
        }
        matrix = transformObject.scale3d ? (matrix.scale(transformObject.scale3d[0],transformObject.scale3d[1],transformObject.scale3d[2])): matrix // set scale
        elem.style[tweenProp] = matrix.toString() // set element style
      }
    }
  },
  CSS3Matrix: function(prop) {
    if (this.valuesEnd.transform){
      !KUTE[prop] && (KUTE[prop] = CSS3Matrix)
    }
  },    
}

// Component Base Object
export const baseMatrixTransform = {
  component: matrixComponent,
  property: 'transform',
  functions: {onStart: onStartTransform},
  Interpolate: {
    perspective: numbers,
    translate3d: arrays, 
    rotate3d: arrays,
    skew: arrays,
    scale3d: arrays
  }
}

export default baseMatrixTransform