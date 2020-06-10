import defaultValues from '../objects/defaultValues.js'

// getStyleForProperty - get computed style property for element for .to() method 
export default function(elem, propertyName) {
  let styleAttribute = elem.style,
      computedStyle = getComputedStyle(elem) || elem.currentStyle,
      styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName]) 
                  ? styleAttribute[propertyName] 
                  : computedStyle[propertyName];
  if ( propertyName !== 'transform' && (propertyName in computedStyle || propertyName in styleAttribute) ) {
    return styleValue ? styleValue : defaultValues[propertyName];
  }
}