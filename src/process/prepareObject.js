import prepareProperty from '../objects/prepareProperty';
import supportedProperties from '../objects/supportedProperties';
import defaultValues from '../objects/defaultValues';

/**
 * prepareObject
 *
 * Returns all processed valuesStart / valuesEnd.
 *
 * @param {Element} obj the values start/end object
 * @param {string} fn toggles between the two
 */
export default function prepareObject(obj, fn) { // this, props object, type: start/end
  const propertiesObject = fn === 'start' ? this.valuesStart : this.valuesEnd;

  Object.keys(prepareProperty).forEach((component) => {
    const prepareComponent = prepareProperty[component];
    const supportComponent = supportedProperties[component];

    Object.keys(prepareComponent).forEach((tweenCategory) => {
      const transformObject = {};

      Object.keys(obj).forEach((tweenProp) => {
        // scroll, opacity, other components
        if (defaultValues[tweenProp] && prepareComponent[tweenProp]) {
          propertiesObject[tweenProp] = prepareComponent[tweenProp]
            .call(this, tweenProp, obj[tweenProp]);

        // transform
        } else if (!defaultValues[tweenCategory] && tweenCategory === 'transform'
          && supportComponent.includes(tweenProp)) {
          transformObject[tweenProp] = obj[tweenProp];

        // allow transformFunctions to work with preprocessed input values
        } else if (!defaultValues[tweenProp] && tweenProp === 'transform') {
          propertiesObject[tweenProp] = obj[tweenProp];

        // colors, boxModel, category
        } else if (!defaultValues[tweenCategory]
          && supportComponent && supportComponent.includes(tweenProp)) {
          propertiesObject[tweenProp] = prepareComponent[tweenCategory]
            .call(this, tweenProp, obj[tweenProp]);
        }
      });

      // we filter out older browsers by checking Object.keys
      if (Object.keys(transformObject).length) {
        propertiesObject[tweenCategory] = prepareComponent[tweenCategory]
          .call(this, tweenCategory, transformObject);
      }
    });
  });
}
