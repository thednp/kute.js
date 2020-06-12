import KUTE from '../objects/kute.js'
import linkProperty from '../objects/linkProperty.js'
import supportedProperties from '../objects/supportedProperties.js'

export default function() { // DON'T change
  for (const component in linkProperty){
    const componentLink = linkProperty[component]
    const componentProps = supportedProperties[component]

    for ( const fnObj in componentLink ) {
      if ( typeof(componentLink[fnObj]) === 'function' 
          && Object.keys(this.valuesEnd).some(i => componentProps && componentProps.includes(i) 
          || i=== 'attr' && Object.keys(this.valuesEnd[i]).some(j => componentProps && componentProps.includes(j)) ) ) 
      { // ATTR, colors, scroll, boxModel, borderRadius
        !KUTE[fnObj] && (KUTE[fnObj] = componentLink[fnObj])
      } else {

        for ( const prop in this.valuesEnd ) {
          for ( const i in this.valuesEnd[prop] ) {
            if ( typeof(componentLink[i]) === 'function' ) { // transformCSS3
              !KUTE[i] && (KUTE[i] = componentLink[i])
            } else {
              for (const j in componentLink[fnObj]){
                if (componentLink[i] && typeof(componentLink[i][j]) === 'function' ) { // transformMatrix
                  !KUTE[j] && (KUTE[j] = componentLink[i][j])
                }
              }
            } 
          }
        }
      }
    }
  }
}