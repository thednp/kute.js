import KUTE from '../objects/kute.js'
import defaultValues from '../objects/defaultValues.js'
import Components from '../objects/components.js'
import {numbers,arrays} from '../objects/interpolate.js'

// const transformMatrix = { property : 'transform', defaultValue: {}, interpolators: {} }, functions = { prepareStart, prepareProperty, onStart, crossCheck }

// Component name
const componentName = 'transformMatrix'

// Component special
export const CSS3Matrix = typeof(DOMMatrix) !== 'undefined' ? DOMMatrix 
                        : typeof(WebKitCSSMatrix) !== 'undefined' ? WebKitCSSMatrix
                        : typeof(CSSMatrix) !== 'undefined' ? CSSMatrix
                        : typeof(MSCSSMatrix) !== 'undefined' ? MSCSSMatrix
                        : null

// Component Functions
export function getTransform(tweenProp, value){
  let transformObject = {}

  if (this.element[componentName]) {
    const currentValue = this.element[componentName]
    for (const vS in currentValue) {
      transformObject[vS] = currentValue[vS]
    }
  } else {
    for (const vE in value){
      transformObject[vE] = vE === 'perspective' ? value[vE] : defaultValues.transform[vE]
    }
  }
  return transformObject
}
export function prepareTransform(tweenProp,value){
  if ( typeof(value) === 'object' && !value.length) {
    let transformObject = {},
        translate3dObj = {},
        rotate3dObj = {},
        scale3dObj = {},
        skewObj = {},
        axis = [{translate3d:translate3dObj},{rotate3d:rotate3dObj},{skew:skewObj},{scale3d:scale3dObj}];

    for (const prop in value) {
      if ( /3d/.test(prop) && typeof(value[prop]) === 'object' && value[prop].length ){
        let pv = value[prop].map( (v) => prop === 'scale3d' ? parseFloat(v) : parseInt(v) )
        transformObject[prop] = prop === 'scale3d' ? [pv[0]||1, pv[1]||1, pv[2]||1] : [pv[0]||0, pv[1]||0, pv[2]||0]
      } else if ( /[XYZ]/.test(prop) ) {
        let obj = /translate/.test(prop) ? translate3dObj 
                : /rotate/.test(prop) ? rotate3dObj 
                : /scale/.test(prop) ? scale3dObj 
                : /skew/.test(prop) ? skewObj : {};
        let idx = prop.replace(/translate|rotate|scale|skew/,'').toLowerCase()
        obj[idx] = /scale/.test(prop) ? parseFloat(value[prop]) : parseInt(value[prop])
      } else if ('skew' === prop ) {
        let pv = value[prop].map(v => parseInt(v)||0)
        transformObject[prop] = [pv[0]||0, pv[1]||0]
      } else { // perspective
        transformObject[prop] = parseInt(value[prop]);
      }
    }

    axis.map((o) => {
      const tp = Object.keys(o)[0]
      const tv = o[tp]
      if ( Object.keys(tv).length && !transformObject[tp]) {
        transformObject[tp] = tp === 'scale3d' ? [tv.x || 1, tv.y || 1, tv.z || 1] 
                            : tp === 'skew' ? [tv.x || 0, tv.y || 0]
                            : [tv.x || 0, tv.y || 0, tv.z || 0]; // translate|rotate
      }
    })
    return transformObject;
  } else { // string | array
  // if ( typeof (value) === 'object' && value.length ) {
  // } else if ( typeof (value) === string && value.includes('matrix')) {
    // decompose matrix to object
    console.error(`KUTE.js - "${value}" is not valid/supported transform function`)
  }
}
export const onStartTransform = {
  transform : function(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      
      KUTE[tweenProp] = (elem, a, b, v) => {
        
        let matrix = new CSS3Matrix()
        let transformObject = {}

        for ( const p in b ) {
          transformObject[p] = p === 'perspective' ? numbers(a[p],b[p],v) : arrays(a[p],b[p],v)
        }

        // set perspective
        transformObject.perspective && (matrix.m34 = -1/transformObject.perspective)
        // set translate
        matrix = transformObject.translate3d ? (matrix.translate(transformObject.translate3d[0],transformObject.translate3d[1],transformObject.translate3d[2])) : matrix
        // set rotation
        matrix = transformObject.rotate3d ? (matrix.rotate(transformObject.rotate3d[0],transformObject.rotate3d[1],transformObject.rotate3d[2])) : matrix
        // set skew
        if (transformObject.skew) {
          matrix = transformObject.skew[0] ? matrix.skewX(transformObject.skew[0]) : matrix;
          matrix = transformObject.skew[1] ? matrix.skewY(transformObject.skew[1]) : matrix;
        }
        // set scale
        matrix = transformObject.scale3d ? (matrix.scale(transformObject.scale3d[0],transformObject.scale3d[1],transformObject.scale3d[2])): matrix

        // set element style
        elem.style[tweenProp] = matrix.toString();
      }
    }
  },
  CSS3Matrix: function(prop) {
    if (this.valuesEnd.transform){
      !KUTE[prop] && (KUTE[prop] = CSS3Matrix)
    }
  },    
}
export function onCompleteTransform(tweenProp){
  if (this.valuesEnd[tweenProp]) {
    this.element[componentName] = {}
    for (const tf in this.valuesEnd[tweenProp]){
      this.element[componentName][tf] = this.valuesEnd[tweenProp][tf]
    }
  }
}
export function crossCheckTransform(tweenProp){
  if (this.valuesEnd[tweenProp]) {
    if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective){
      this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective
    }
  }
}

// All Component Functions
export const matrixFunctions = {
  prepareStart: getTransform,
  prepareProperty: prepareTransform,
  onStart: onStartTransform,
  onComplete: onCompleteTransform,
  crossCheck: crossCheckTransform
}

// Component Base Object
export const baseMatrixTransformOps = {
  component: componentName,
  property: 'transform',
  // subProperties: ['perspective','translate3d','translateX','translateY','translateZ','rotate3d','rotateX','rotateY','rotateZ','skew','skewX','skewY','scale3d','scaleX','scaleY','scaleZ'],
  // defaultValue: {perspective:400,translate3d:[0,0,0],translateX:0,translateY:0,translateZ:0,rotate3d:[0,0,0],rotateX:0,rotateY:0,rotateZ:0,skew:[0,0],skewX:0,skewY:0,scale3d:[1,1,1],scaleX:1,scaleY:1,scaleZ:1},
  functions: {onStart: onStartTransform},
  Interpolate: {
    perspective: numbers,
    translate3d: arrays, 
    rotate3d: arrays,
    skew: arrays,
    scale3d: arrays
  }
}

// Component Full Object
export const matrixTransformOps = {
  component: componentName,
  property: 'transform',
  // subProperties: ['perspective','translate3d','translateX','translateY','translateZ','rotate3d','rotateX','rotateY','rotateZ','skew','skewX','skewY','scale3d','scaleX','scaleY','scaleZ'],
  defaultValue: {perspective:400,translate3d:[0,0,0],translateX:0,translateY:0,translateZ:0,rotate3d:[0,0,0],rotateX:0,rotateY:0,rotateZ:0,skew:[0,0],skewX:0,skewY:0,scale3d:[1,1,1],scaleX:1,scaleY:1,scaleZ:1},
  functions: matrixFunctions,
  Interpolate: {
    perspective: numbers,
    translate3d: arrays, 
    rotate3d: arrays,
    skew: arrays,
    scale3d: arrays
  }
}

Components.TransformMatrix = matrixTransformOps
