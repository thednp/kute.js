import supportedProperties from '../objects/supportedProperties.js'
import defaultValues from '../objects/defaultValues.js'
import defaultOptions from '../objects/defaultOptions.js'
import prepareProperty from '../objects/prepareProperty.js'
import prepareStart from '../objects/prepareStart.js'
import onStart from '../objects/onStart.js'
import onComplete from '../objects/onComplete.js'
import crossCheck from '../objects/crossCheck.js'
import linkProperty from '../objects/linkProperty.js'
import Util from '../objects/util.js'
import Interpolate from '../objects/interpolate.js'

// Animation class 
// * builds KUTE components 
// * populate KUTE objects
// * AnimatonBase creates a KUTE.js build for pre-made Tween objects
// * AnimatonDevelopment can help you debug your new components
export default class Animation {
  constructor(Component){
    try {
      if ( Component.component in supportedProperties ) {
        console.error(`KUTE.js - ${Component.component} already registered`);
      } else if ( Component.property in defaultValues  ) {
        console.error(`KUTE.js - ${Component.property} already registered`);
      } else {
        this.setComponent(Component)
      }
    } catch(e){
      console.error(e)
    }
  }
  setComponent(Component){
    const propertyInfo = this
    const ComponentName = Component.component
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty, Util }
    const Functions = { prepareProperty, prepareStart, onStart, onComplete, crossCheck }
    const Category = Component.category
    const Property = Component.property
    const Length = Component.properties && Component.properties.length || Component.subProperties && Component.subProperties.length

    // {property,defaultvalue,defaultOptions,Interpolate,functions} // single property
    // {category,properties,defaultvalues,defaultOptions,Interpolate,functions} // category colors, boxModel, borderRadius
    // {property,subProperties,defaultvalues,defaultOptions,Interpolate,functions} // property with multiple sub properties. Eg transform, filter
    // {category,subProperties,defaultvalues,defaultOptions,Interpolate,functions} // property with multiple sub properties. Eg attr
    
    // set supported category/property
    supportedProperties[ComponentName] = Component.properties || Component.subProperties || Component.property

    // set defaultValues
    if ('defaultValue' in Component){ // value 0 will invalidate
      defaultValues[ Property ] = Component.defaultValue

      // minimal info
      propertyInfo.supports = `${Property} property`

    } else if (Component.defaultValues) {
      for (const dv in Component.defaultValues) {
        defaultValues[dv] = Component.defaultValues[dv]
      }
      // minimal info
      propertyInfo.supports = `${Length||Property} ${Property||Category} properties`
    }

    // set additional options
    if (Component.defaultOptions) {
      for (const op in Component.defaultOptions) {
        defaultOptions[op] = Component.defaultOptions[op]
      }
    }

    // set functions
    if (Component.functions) {
      for (const fn in Functions) {
        if (fn in Component.functions) {
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

    // set component interpolate
    if (Component.Interpolate) {
      for (const fn in Component.Interpolate) {
        const compIntObj = Component.Interpolate[fn]
        if ( typeof(compIntObj) === 'function' && !Interpolate[fn] ) {
          Interpolate[fn] = compIntObj;
        } else {
          for ( const sfn in compIntObj ) {
            if ( typeof(compIntObj[sfn]) === 'function' && !Interpolate[fn] ) {
              Interpolate[fn] = compIntObj[sfn];
            }
          }
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

    return propertyInfo
  }
}