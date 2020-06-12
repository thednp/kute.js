import supportedProperties from '../objects/supportedProperties.js'
import defaultOptions from '../objects/defaultOptions.js'
import onStart from '../objects/onStart.js'
import onComplete from '../objects/onComplete.js'
import crossCheck from '../objects/crossCheck.js'
import linkProperty from '../objects/linkProperty.js'
import Util from '../objects/util.js'
import Interpolate from '../objects/interpolate.js'

// Animation class 
export default class AnimationBase {
  constructor(Component){
    this.Component = Component
    return this.setComponent()
  }
  setComponent(){
    const Component = this.Component
    const ComponentName = Component.component
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty }
    const Functions = { onStart, onComplete, crossCheck }
    const Category = Component.category
    const Property = Component.property

    // set supported category/property
    supportedProperties[ComponentName] = Component.properties || Component.subProperties || Component.property

    // set additional options
    if (Component.defaultOptions) {
      for (const op in Component.defaultOptions) {
        defaultOptions[op] = Component.defaultOptions[op]
      }
    }

    // set functions
    if (Component.functions) {
      for (const fn in Functions) {
        if (fn in Component.functions && ['onStart','onComplete'].includes(fn)) {
          if (typeof (Component.functions[fn]) === 'function' ) {
            // !Functions[fn][ Category||Property ] && (Functions[fn][ Category||Property ] = Component.functions[fn])
            !Functions[fn][ComponentName] && (Functions[fn][ComponentName] = {})
            !Functions[fn][ComponentName][ Category||Property ] && (Functions[fn][ComponentName][ Category||Property ] = Component.functions[fn])
          } else {
            for ( const ofn in Component.functions[fn] ){
              // !Functions[fn][ofn] && (Functions[fn][ofn] = Component.functions[fn][ofn])
              !Functions[fn][ComponentName] && (Functions[fn][ComponentName] = {})
              !Functions[fn][ComponentName][ofn] && (Functions[fn][ComponentName][ofn] = Component.functions[fn][ofn])
            }
          }
        }
      }
    }

    // set interpolate
    if (Component.Interpolate) {
      for (const fn in Component.Interpolate) {
        // register new Interpolation functions
        if (!Interpolate[fn]) {
          Interpolate[fn] = Component.Interpolate[fn];
        }
      }
      linkProperty[ComponentName] = Component.Interpolate
    }

    // set component util
    if (Component.Util) {
      for (const fn in Component.Util){
        !Util[fn] && (Util[fn] = Component.Util[fn])
      }
    }

    return {name:ComponentName}
  }
}