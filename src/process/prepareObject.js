import prepareProperty from '../objects/prepareProperty.js'
import supportedProperties from '../objects/supportedProperties.js'
import defaultValues from '../objects/defaultValues.js'

// prepareObject - returns all processed valuesStart / valuesEnd
export default function (obj, fn) { // this, props object, type: start/end
  const propertiesObject = fn === 'start' ? this.valuesStart : this.valuesEnd
        
  for ( const component in prepareProperty ) {
    let prepareComponent = prepareProperty[component],
        supportComponent = supportedProperties[component]

    for ( const tweenCategory in prepareComponent ) {
      let transformObject = {}
      for (const tweenProp in obj) {

        if ( defaultValues[tweenProp] && prepareComponent[tweenProp] ) { // scroll, opacity, other components
          propertiesObject[tweenProp] = prepareComponent[tweenProp].call(this,tweenProp,obj[tweenProp]); 
        } else if ( !defaultValues[tweenCategory] && tweenCategory === 'transform' && supportComponent.includes(tweenProp) ) { // transform
          transformObject[tweenProp] = obj[tweenProp]
        } else if (!defaultValues[tweenProp] && tweenProp === 'transform') { // allow transformFunctions to work with preprocessed input values
          propertiesObject[tweenProp] = obj[tweenProp]          
        } else if ( !defaultValues[tweenCategory] && supportComponent && supportComponent.includes(tweenProp) ) { // colors, boxModel, category
          propertiesObject[tweenProp] = prepareComponent[tweenCategory].call(this,tweenProp,obj[tweenProp]);
        }
      }
      // we filter out older browsers by checking Object.keys
      if (Object.keys && Object.keys(transformObject).length){
        propertiesObject[tweenCategory] = prepareComponent[tweenCategory].call(this,tweenCategory,transformObject);
      }
    }
  }
}