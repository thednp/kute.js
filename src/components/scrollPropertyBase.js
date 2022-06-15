import passiveHandler from '@thednp/shorty/src/misc/passiveHandler';
import mouseHoverEvents from '@thednp/shorty/src/strings/mouseHoverEvents';
import supportTouch from '@thednp/shorty/src/boolean/supportTouch';
import numbers from '../interpolation/numbers';
import KEC from '../objects/kute';

// Component Util
// events preventing scroll
const touchOrWheel = supportTouch ? 'touchstart' : 'mousewheel';

// true scroll container
// very important and specific to the component
export const scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent)
  ? document.body
  : document.documentElement;

/**
 * Prevent further scroll events until scroll animation is over.
 * @param {Event} e event object
 */
export function preventScroll(e) {
  if (this.scrolling) e.preventDefault();
}

/**
 * Returns the scroll element / target.
 * @returns {{el: Element, st: Element}}
 */
export function getScrollTargets() {
  const el = this.element;
  return el === scrollContainer ? { el: document, st: document.body } : { el, st: el };
}

/**
 * Toggles scroll prevention callback on scroll events.
 * @param {string} action addEventListener / removeEventListener
 * @param {Element} element target
 */
export function toggleScrollEvents(action, element) {
  element[action](mouseHoverEvents[0], preventScroll, passiveHandler);
  element[action](touchOrWheel, preventScroll, passiveHandler);
}

/**
 * Action performed before scroll animation start.
 */
export function scrollIn() {
  const targets = getScrollTargets.call(this);

  if ('scroll' in this.valuesEnd && !targets.el.scrolling) {
    targets.el.scrolling = 1;
    toggleScrollEvents('addEventListener', targets.el);
    targets.st.style.pointerEvents = 'none';
  }
}
/**
 * Action performed when scroll animation ends.
 */
export function scrollOut() { // prevent scroll when tweening scroll
  const targets = getScrollTargets.call(this);

  if ('scroll' in this.valuesEnd && targets.el.scrolling) {
    targets.el.scrolling = 0;
    toggleScrollEvents('removeEventListener', targets.el);
    targets.st.style.pointerEvents = '';
  }
}

// Component Functions
/**
 * * Sets the scroll target.
 * * Adds the scroll prevention event listener.
 * * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartScroll(tweenProp) {
  // checking 0 will NOT add the render function
  if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
    this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window)
      ? scrollContainer : this.element;
    scrollIn.call(this);
    KEC[tweenProp] = (elem, a, b, v) => {
      /* eslint-disable */
      elem.scrollTop = (numbers(a, b, v)) >> 0;
      /* eslint-enable */
    };
  }
}

/**
 * Removes the scroll prevention event listener.
 */
export function onCompleteScroll(/* tweenProp */) {
  scrollOut.call(this);
}

// Base Component
const ScrollPropertyBase = {
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
    preventScroll, scrollIn, scrollOut, getScrollTargets,
  },
};

export default ScrollPropertyBase;
