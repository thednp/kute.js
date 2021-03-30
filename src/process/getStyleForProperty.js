import defaultValues from '../objects/defaultValues.js';

// getStyleForProperty - get computed style property for element for .to() method
export default function getStyleForProperty(elem, propertyName) {
  const styleAttribute = elem.style;
  const computedStyle = getComputedStyle(elem) || elem.currentStyle;
  const styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName])
    ? styleAttribute[propertyName]
    : computedStyle[propertyName];
  let result = defaultValues[propertyName];

  if (propertyName !== 'transform' && (propertyName in computedStyle || propertyName in styleAttribute)) {
    result = styleValue;
  }

  return result;
}
