/**
 * selector
 *
 * A selector utility for KUTE.js.
 *
 * @param {KUTE.selectorType} el target(s) or string selector
 * @param {boolean | number} multi when true returns an array/collection of elements
 * @returns {Element | Element[] | null}
 */
export default function selector(el, multi) {
  try {
    let requestedElem;
    let itemsArray;
    if (multi) {
      itemsArray = el instanceof Array && el.every((x) => x instanceof Element);
      requestedElem = el instanceof HTMLCollection || el instanceof NodeList || itemsArray
        ? el : document.querySelectorAll(el);
    } else {
      requestedElem = el instanceof Element || el === window // scroll
        ? el : document.querySelector(el);
    }
    return requestedElem;
  } catch (e) {
    throw TypeError(`KUTE.js - Element(s) not found: ${el}.`);
  }
}
