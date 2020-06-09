export const Tweens = []

export const Components = {}

export const supportedProperties = {}

export const defaultValues = {}; 

export const defaultOptions = {
  duration: 700,
  delay: 0,
  easing: 'linear'
}

// check current property value when .to() method is used
export const prepareStart = {}

// used in preparePropertiesObject
export const prepareProperty = {} 

// checks for differences between the processed start and end values, 
// can be set to make sure start unit and end unit are same, 
// stack transforms, process SVG paths,
// any type of post processing the component needs
export const crossCheck = {}

// schedule property specific function on animation complete
export const onComplete = {}

// schedule property specific function on animation start
// link property update function to KUTE.js execution context
export const onStart = {}

// link properties to interpolate functions
export const linkProperty = {}

// util - a general object for utils like rgbToHex, processEasing
export const Util = {}

export const BaseObjects = { 
  defaultOptions,
  linkProperty,
  onComplete,
  onStart,
  supportedProperties 
}

export default {
  supportedProperties,
  defaultOptions,
  defaultValues,
  prepareProperty,
  prepareStart,
  crossCheck,
  onStart,
  onComplete,
  linkProperty
}
