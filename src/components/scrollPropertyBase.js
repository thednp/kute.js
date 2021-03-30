import supportPassive from 'shorter-js/src/boolean/supportPassive.js';
import mouseHoverEvents from 'shorter-js/src/strings/mouseHoverEvents.js';
import supportTouch from 'shorter-js/src/boolean/supportTouch.js';
import numbers from '../interpolation/numbers.js';
import KUTE from '../objects/kute.js';

// Component Util
// events preventing scroll
const touchOrWheel = supportTouch ? 'touchstart' : 'mousewheel';

// true scroll container
// very important and specific to the component
export const scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent)
  ? document.body
  : document.documentElement;

// scroll event options
// it's important to stop propagating when animating scroll
const passiveHandler = supportPassive ? { passive: false } : false;

// prevent mousewheel or touch events while tweening scroll
export function preventScroll(e) {
  if (this.scrolling) e.preventDefault();
}
export function getScrollTargets() {
  const el = this.element;
  return el === scrollContainer ? { el: document, st: document.body } : { el, st: el };
}
export function toggleScrollEvents(action, element) {
  element[action](mouseHoverEvents[0], preventScroll, passiveHandler);
  element[action](touchOrWheel, preventScroll, passiveHandler);
}
export function scrollIn() {
  const targets = getScrollTargets.call(this);

  if ('scroll' in this.valuesEnd && !targets.el.scrolling) {
    targets.el.scrolling = 1;
    toggleScrollEvents('addEventListener', targets.el);
    targets.st.style.pointerEvents = 'none';
  }
}
export function scrollOut() { // prevent scroll when tweening scroll
  const targets = getScrollTargets.call(this);

  if ('scroll' in this.valuesEnd && targets.el.scrolling) {
    targets.el.scrolling = 0;
    toggleScrollEvents('removeEventListener', targets.el);
    targets.st.style.pointerEvents = '';
  }
}

// Component Functions
export function onStartScroll(tweenProp) {
  // checking 0 will NOT add the render function
  if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window)
      ? scrollContainer : this.element;
    scrollIn.call(this);
    KUTE[tweenProp] = (elem, a, b, v) => {
      elem.scrollTop = (numbers(a, b, v)) >> 0;
    };
  }
}
export function onCompleteScroll(/* tweenProp */) {
  scrollOut.call(this);
}

// Base Component
const baseScroll = {
  component: 'baseScroll',
  property: 'scroll',
  // defaultValue: 0,
  Interpolate: { numbers },
  functions: {
    onStart: onStartScroll,
    onComplete: onCompleteScroll,
  },
  // unfortunatelly scroll needs all them no matter the packaging
  Util: {
    preventScroll, scrollIn, scrollOut, getScrollTargets, supportPassive,
  },
};

export default baseScroll;
