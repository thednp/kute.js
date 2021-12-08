import defaultValues from '../objects/defaultValues';

/**
 * getStyleForProperty
 *
 * Returns the computed style property for element for .to() method.
 * Used by for the `.to()` static method.
 *
 * @param {Element} elem
 * @param {string} propertyName
 * @returns {string}
 */
export default function getStyleForProperty(elem, propertyName) {
  let result = defaultValues[propertyName];
  const styleAttribute = elem.style;
  const computedStyle = getComputedStyle(elem) || elem.currentStyle;
  const styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName])
    ? styleAttribute[propertyName]
    : computedStyle[propertyName];

  if (propertyName !== 'transform' && (propertyName in computedStyle || propertyName in styleAttribute)) {
    result = styleValue;
  }

  return result;
}
