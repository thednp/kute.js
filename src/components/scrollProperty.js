import KUTE from '../core/globals.js'
import {numbers} from '../core/interpolate.js'
import {Components} from '../core/objects.js'

import {on} from 'shorter-js/src/event/on.js'
import {off} from 'shorter-js/src/event/off.js'
import {supportPassive} from 'shorter-js/src/boolean/supportPassive.js'
import {mouseHoverEvents} from 'shorter-js/src/strings/mouseHoverEvents.js'

// Component Util
// events preventing scroll
const canTouch = ('ontouchstart' in window || navigator && navigator.msMaxTouchPoints) || false // support Touch?
const touchOrWheel = canTouch ? 'touchstart' : 'mousewheel'

// true scroll container
// very important and specific to the component
const scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent) ? document.body : document.getElementsByTagName('HTML')[0]

// scroll event options
// it's important to stop propagating when animating scroll
const passiveHandler = supportPassive ? { passive: false } : false

// prevent mousewheel or touch events while tweening scroll
function preventScroll(e) { 
  this.scrolling && e.preventDefault()
}
function getScrollTargets(){
  let el = this.element
  return el === scrollContainer ? { el: document, st: document.body } : { el: el, st: el}
}
function scrollIn(){
  let targets = getScrollTargets.call(this)

  if ( 'scroll' in this.valuesEnd && !targets.el.scrolling) {
    targets.el.scrolling = 1;
    on( targets.el, mouseHoverEvents[0], preventScroll, passiveHandler);
    on( targets.el, touchOrWheel, preventScroll, passiveHandler);
    targets.st.style.pointerEvents = 'none'
  }
}
function scrollOut(){ //prevent scroll when tweening scroll
  let targets = getScrollTargets.call(this)

  if ( 'scroll' in this.valuesEnd && targets.el.scrolling) {
    targets.el.scrolling = 0;
    off( targets.el, mouseHoverEvents[0], preventScroll, passiveHandler);
    off( targets.el, touchOrWheel, preventScroll, passiveHandler);
    targets.st.style.pointerEvents = ''
  }
}

// Component Functions
export function getScroll(){
  this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window) ? scrollContainer : this.element; 

  scrollIn.call(this);
  return this.element === scrollContainer ? (window.pageYOffset || scrollContainer.scrollTop) : this.element.scrollTop;
}
export function prepareScroll(prop,value){
  return parseInt(value);
}
export function onStartScroll(tweenProp){
  if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) { // checking 0 will NOT add the render function
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.scrollTop = (numbers(a,b,v))>>0;
    };
  }
}
export function onCompleteScroll(tweenProp){
  scrollOut.call(this)
}

// All Component Functions
export const scrollFunctions = {
  prepareStart: getScroll,
  prepareProperty: prepareScroll,
  onStart: onStartScroll,
  onComplete: onCompleteScroll
}

// Base Component
export const baseScrollOps = {
  component: 'scrollProperty',
  property: 'scroll',
  // defaultValue: 0,
  Interpolate: {numbers},
  functions: {
    onStart: onStartScroll,
    onComplete: onCompleteScroll
  },
  // unfortunatelly scroll needs all them no matter the packaging
  Util: { preventScroll, scrollIn, scrollOut, scrollContainer, passiveHandler, getScrollTargets }
}

// Full Component
export const scrollOps = {
  component: 'scrollProperty',
  property: 'scroll',
  defaultValue: 0,
  Interpolate: {numbers},
  functions: scrollFunctions,
  // export stuff to global
  Util: { preventScroll, scrollIn, scrollOut, scrollContainer, passiveHandler, getScrollTargets }

}

Components.ScrollProperty = scrollOps
