import KUTE from '../core/globals.js'
import {defaultValues,Components} from '../core/objects.js'
import {trueDimension} from '../util/util.js'
import {getStyleForProperty} from '../core/process.js'
import {units} from '../core/interpolate.js' 

// const borderRadius = { category : 'borderRadius', properties : [..], defaultValues: {..}, interpolation: {units} }

// Component Properties
const radiusProps = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius']
const radiusValues = {}

radiusProps.map(x => radiusValues[x] = 0);

// Component Functions
export function radiusOnStartFn(tweenProp){
  if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.style[tweenProp] = units(a.v,b.v,b.u,v);
    }
  }
}
const radiusOnStart = {}
radiusProps.forEach(tweenProp => {
  radiusOnStart[tweenProp] = radiusOnStartFn
});
export function getRadius(tweenProp){
  return getStyleForProperty(this.element,tweenProp) || defaultValues[tweenProp];
}
export function prepareRadius(tweenProp,value){
  return trueDimension(value);
}

// All Component Functions
export const radiusFunctions = {
  prepareStart: getRadius,
  prepareProperty: prepareRadius,
  onStart: radiusOnStart
}

// Base Component
export const baseRadiusOps = {
  component: 'borderRadiusProps',
  category: 'borderRadius',
  properties: radiusProps,
  // defaultValues: radiusValues,
  Interpolate: {units},
  functions: {onStart: radiusOnStart}
}

// Full Component
export const radiusOps = {
  component: 'borderRadiusProps',
  category: 'borderRadius',
  properties: radiusProps,
  defaultValues: radiusValues,
  Interpolate: {units},
  functions: radiusFunctions,
  Util: {trueDimension}
}

Components.BorderRadiusProperties = radiusOps