import {trueProperty} from '../util/util.js'
import {defaultValues,supportedProperties,prepareStart,prepareProperty} from './objects.js'

// get transform style for element from cssText for .to() method
export function getInlineStyle(el) {
  if ( !el.style ) return; // if the scroll applies to `window` it returns as it has no styling
  const css = el.style.cssText.replace(/\s/g,'').split(';'); // the cssText | the resulting transform object
  const transformObject = {};
  const arrayFn = ['translate3d','translate','scale3d','skew']

  // if we have any inline style in the cssText attribute, usually it has higher priority
  for ( let i=0, csl = css.length; i<csl; i++ ){
    if ( /transform/i.test(css[i])) {
      const tps = css[i].split(':')[1].split(')'); //all transform properties
      for ( let k=0, tpl = tps.length-1; k< tpl; k++){
        const tpv = tps[k].split('('); // each transform property, the sp is for transform property
        const tp = tpv[0];
        const tv = tpv[1];
        if ( !/matrix/.test(tp) ){
          transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
        }
      }
    }
  }
  return transformObject;
}

// get computed style property for element for .to() method
export function getStyleForProperty(elem, propertyName) {
  const styleAttribute = elem.style;

  const computedStyle = getComputedStyle(elem) || elem.currentStyle;

  // the computed style | prefixed property
  const prefixedProp = trueProperty(propertyName);

  const styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName]) 
                    ? styleAttribute[propertyName] 
                    : computedStyle[prefixedProp];
  if ( propertyName !== 'transform' && (prefixedProp in computedStyle || prefixedProp in styleAttribute) ) {
    return styleValue ? styleValue : defaultValues[propertyName];
  }
}

export function getStartValues () { // to REWORK with COMPONENT
  const startValues = {}, 
        currentStyle = getInlineStyle(this.element);

  for (const tweenProp in this.valuesStart) {
    for ( const component in prepareStart) {
      let componentStart = prepareStart[component]
      for ( const tweenCategory in componentStart) {
        if ( tweenCategory === tweenProp && componentStart[tweenProp] ) { // clip, opacity, scroll
          startValues[tweenProp] = componentStart[tweenCategory].call(this,tweenProp,this.valuesStart[tweenProp])
        } else if ( supportedProperties[component].includes(tweenProp) ) { // find in an array of properties
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

// process properties for endValues or startValues
// NEVER CHANGE THIS
export function prepareObject (obj, fn) { // this, props object, type: start/end
  const propertiesObject = fn === 'start' ? this.valuesStart : this.valuesEnd
        
  for ( const component in prepareProperty ) {
    let prepareComponent = prepareProperty[component]
    let supportComponent = supportedProperties[component]

    // don't feed old browsers with SVG components
    // if (typeof(SVGElement) === undefined && /svg/i.test(component)){
    //   continue
    // }

    for ( const tweenCategory in prepareComponent ) {
      // don't feed old browsers with unsupported props
      // if (!(tweenCategory in document.body.style)) continue;
      let transformObject = {}
      for (const tweenProp in obj) {
        // don't feed old browsers with unsupported props
        // if (!(tweenProp in document.body.style)) continue;

        if ( defaultValues[tweenProp] && prepareComponent[tweenProp] /*&& tweenProp === tweenCategory*/ ) { // scroll, opacity, other components
          propertiesObject[tweenProp] = prepareComponent[tweenProp].call(this,tweenProp,obj[tweenProp]); 
        } else if ( !defaultValues[tweenCategory] && tweenCategory === 'transform' && supportComponent.includes(tweenProp) ) { // transform
          transformObject[tweenProp] = obj[tweenProp]
        } else if ( !defaultValues[tweenCategory] && supportComponent.includes(tweenProp) ) { // colors, boxModel, category
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

export default {
  getInlineStyle,
  getStyleForProperty,
  getStartValues,
  prepareObject
}