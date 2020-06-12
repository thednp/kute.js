import prepareProperty from '../objects/prepareProperty.js'
import prepareStart from '../objects/prepareStart.js'
import onStart from '../objects/onStart.js'
import onComplete from '../objects/onComplete.js'
import crossCheck from '../objects/crossCheck.js'
import Interpolate from '../objects/interpolate.js'

import Animation from './animation.js'

// AnimationDevelopment class 
export default class AnimationDevelopment extends Animation {
  constructor(...args){
    super(...args)
  }
  setComponent(Component){
    super.setComponent(Component)

    const propertyInfo = this
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty, Util }
    const Functions = { prepareProperty,prepareStart,onStart,onComplete,crossCheck }
    const Category = Component.category
    const Property = Component.property
    const Length = Component.properties && Component.properties.length || Component.subProperties && Component.subProperties.length

    // set defaultValues
    if ('defaultValue' in Component){ // value 0 will invalidate

      propertyInfo.supports = `${Property} property`
      propertyInfo.defaultValue = `${(Component.defaultValue+'').length?"YES":"not set or incorrect"}`

    } else if (Component.defaultValues) {
      propertyInfo.supports = `${Length||Property} ${Property||Category} properties`
      propertyInfo.defaultValues = Object.keys(Component.defaultValues).length === Length ? `YES` : `Not set or incomplete`
    }

    // set additional options
    if (Component.defaultOptions) {
      propertyInfo.extends = []

      for (const op in Component.defaultOptions) {
        propertyInfo.extends.push(op)
      }

      propertyInfo.extends.length ? propertyInfo.extends = `with <${propertyInfo.extends.join(', ')}> new option(s)` : delete propertyInfo.extends
    }

    // set functions
    if (Component.functions) {
      propertyInfo.interface = []
      propertyInfo.render = []
      propertyInfo.warning = []
      for (const fn in Functions) {
        if (fn in Component.functions) {
          fn === 'prepareProperty' ? propertyInfo.interface.push(`fromTo()`) : 0
          fn === 'prepareStart' ? propertyInfo.interface.push(`to()`) : 0
          fn === 'onStart' ? propertyInfo.render = `can render update` : 0
        } else {
          fn === 'prepareProperty' ? propertyInfo.warning.push(`fromTo()`) : 0
          fn === 'prepareStart' ? propertyInfo.warning.push(`to()`) : 0
          fn === 'onStart' ? propertyInfo.render = `no function to render update` : 0
        }
      }
      propertyInfo.interface.length ? propertyInfo.interface = `${Category||Property} can use [${propertyInfo.interface.join(', ')}] method(s)` : delete propertyInfo.uses
      propertyInfo.warning.length ? propertyInfo.warning = `${Category||Property} can't use [${propertyInfo.warning.join(', ')}] method(s) because values aren't processed` : delete propertyInfo.warning
    }

    // register Interpolation functions
    if (Component.Interpolate) {
      propertyInfo.uses = []
      propertyInfo.adds = []

      for (const fn in Component.Interpolate) {
        const compIntObj = Component.Interpolate[fn]
        // register new Interpolation functions
        if ( typeof(compIntObj) === 'function' ) {
          if ( !Interpolate[fn] ) {
            propertyInfo.adds.push(`${fn}`)
          }
          propertyInfo.uses.push(`${fn}`)
        } else {
          for ( const sfn in compIntObj ) {
            if ( typeof(compIntObj[sfn]) === 'function' && !Interpolate[fn] ) {
              propertyInfo.adds.push(`${sfn}`)
            }
            propertyInfo.uses.push(`${sfn}`)
          }
        }
      }

      propertyInfo.uses.length ? propertyInfo.uses = `[${propertyInfo.uses.join(', ')}] interpolation function(s)` : delete propertyInfo.uses
      propertyInfo.adds.length ? propertyInfo.adds = `new [${propertyInfo.adds.join(', ')}] interpolation function(s)` : delete propertyInfo.adds
    } else {
      propertyInfo.critical = `For ${Property||Category} no interpolation function[s] is set`
    }

    // set component util
    if (Component.Util) {
      propertyInfo.hasUtil = Object.keys(Component.Util).join(',')
    }
  
    return propertyInfo
  }
}