import getPrefix from './getPrefix.js'

// trueProperty - returns prefixed property | property
export default function(property) {
  return !(property in document.body.style) 
          ? getPrefix() + (property.charAt(0).toUpperCase() + property.slice(1)) 
          : property;
}