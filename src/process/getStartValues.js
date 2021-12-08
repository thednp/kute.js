import getInlineStyle from './getInlineStyle';
import prepareObject from './prepareObject';
import defaultValues from '../objects/defaultValues';
import prepareStart from '../objects/prepareStart';
import supportedProperties from '../objects/supportedProperties';

/**
 * getStartValues
 *
 * Returns the start values for to() method.
 * Used by for the `.to()` static method.
 *
 * @this {KUTE.Tween} the tween instance
 */
export default function getStartValues() {
  const startValues = {};
  const currentStyle = getInlineStyle(this.element);

  Object.keys(this.valuesStart).forEach((tweenProp) => {
    Object.keys(prepareStart).forEach((component) => {
      const componentStart = prepareStart[component];

      Object.keys(componentStart).forEach((tweenCategory) => {
        // clip, opacity, scroll
        if (tweenCategory === tweenProp && componentStart[tweenProp]) {
          startValues[tweenProp] = componentStart[tweenCategory]
            .call(this, tweenProp, this.valuesStart[tweenProp]);
        // find in an array of properties
        } else if (supportedProperties[component]
          && supportedProperties[component].includes(tweenProp)) {
          startValues[tweenProp] = componentStart[tweenCategory]
            .call(this, tweenProp, this.valuesStart[tweenProp]);
        }
      });
    });
  });

  // stack transformCSS props for .to() chains
  // also add to startValues values from previous tweens
  Object.keys(currentStyle).forEach((current) => {
    if (!(current in this.valuesStart)) {
      startValues[current] = currentStyle[current] || defaultValues[current];
    }
  });

  this.valuesStart = {};
  prepareObject.call(this, startValues, 'start');
}
