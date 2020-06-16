import {numbers} from '../objects/interpolate.js'
import Components from '../objects/components.js'

import {scrollContainer,onStartScroll,onCompleteScroll,scrollIn,scrollOut,getScrollTargets,preventScroll} from './scrollPropertyBase.js'

// Component Functions
function getScroll(){
  this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window) ? scrollContainer : this.element;
  return this.element === scrollContainer ? (window.pageYOffset || scrollContainer.scrollTop) : this.element.scrollTop;
}
function prepareScroll(prop,value){
  return parseInt(value);
}

// All Component Functions
const scrollFunctions = {
  prepareStart: getScroll,
  prepareProperty: prepareScroll,
  onStart: onStartScroll,
  onComplete: onCompleteScroll
}

// Full Component
const scrollProperty = {
  component: 'scrollProperty',
  property: 'scroll',
  defaultValue: 0,
  Interpolate: {numbers},
  functions: scrollFunctions,
  // export stuff to global
  Util: { preventScroll, scrollIn, scrollOut, getScrollTargets }
}

export default scrollProperty

Components.ScrollProperty = scrollProperty