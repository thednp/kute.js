import getInlineStyle from './getInlineStyle.js'
import prepareObject from './prepareObject.js'
import defaultValues from '../objects/defaultValues.js'
import prepareStart from '../objects/prepareStart.js'
import supportedProperties from '../objects/supportedProperties.js'

// getStartValues - returns the startValue for to() method
export default function () { 
  const startValues = {}, 
        currentStyle = getInlineStyle(this.element);

  for (const tweenProp in this.valuesStart) {
    for ( const component in prepareStart) {
      let componentStart = prepareStart[component]
      for ( const tweenCategory in componentStart) {
        if ( tweenCategory === tweenProp && componentStart[tweenProp] ) { // clip, opacity, scroll
          startValues[tweenProp] = componentStart[tweenCategory].call(this,tweenProp,this.valuesStart[tweenProp])
        } else if ( supportedProperties[component] && supportedProperties[component].includes(tweenProp) ) { // find in an array of properties
          startValues[tweenProp] = componentStart[tweenCategory].call(this,tweenProp,this.valuesStart[tweenProp]) 
        }
      }
    }
  }

  // stack transformCSS props for .to() chains
  for ( const current in currentStyle ){ // also add to startValues values from previous tweens
    if ( !( current in this.valuesStart ) ) {
      startValues[current] = currentStyle[current] || defaultValues[current];
    }
  }
  this.valuesStart = {}
  prepareObject.call(this,startValues,'start');
}