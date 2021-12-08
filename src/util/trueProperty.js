import getPrefix from './getPrefix';

/**
 * trueProperty
 *
 * Returns prefixed property name in a legacy browser
 * or the regular name in modern browsers.
 *
 * @param {string} property the property name
 * @returns {string} the right property name for every browser
 */
const trueProperty = (property) => {
  const prop = !(property in document.head.style)
    ? getPrefix() + (property.charAt(0).toUpperCase() + property.slice(1))
    : property;
  return prop;
};

export default trueProperty;
