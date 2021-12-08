import numbers from '../interpolation/numbers';

import {
  scrollContainer,
  onStartScroll,
  onCompleteScroll,
  scrollIn,
  scrollOut,
  getScrollTargets,
  preventScroll,
  toggleScrollEvents,
} from './scrollPropertyBase';

// Component Functions
/**
 * Returns the current property computed style.
 * @returns {number} computed style for property
 */
function getScroll() {
  this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window)
    ? scrollContainer : this.element;

  return this.element === scrollContainer
    ? (window.pageYOffset || scrollContainer.scrollTop)
    : this.element.scrollTop;
}

/**
 * Returns the property tween object.
 * @param {string} _ the property name
 * @param {string} value the property value
 * @returns {number} the property tween object
 */
function prepareScroll(/* prop, */_, value) {
  return parseInt(value, 10);
}

// All Component Functions
const scrollFunctions = {
  prepareStart: getScroll,
  prepareProperty: prepareScroll,
  onStart: onStartScroll,
  onComplete: onCompleteScroll,
};

// Full Component
const ScrollProperty = {
  component: 'scrollProperty',
  property: 'scroll',
  defaultValue: 0,
  Interpolate: { numbers },
  functions: scrollFunctions,
  // export stuff to global
  Util: {
    preventScroll, scrollIn, scrollOut, getScrollTargets, toggleScrollEvents,
  },
};

export default ScrollProperty;
