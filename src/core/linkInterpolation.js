import KUTE from '../objects/kute.js';
import linkProperty from '../objects/linkProperty.js';
import supportedProperties from '../objects/supportedProperties.js';

export default function linkInterpolation() { // DON'T change
  Object.keys(linkProperty).forEach((component) => {
    const componentLink = linkProperty[component];
    const componentProps = supportedProperties[component];

    Object.keys(componentLink).forEach((fnObj) => {
      if (typeof (componentLink[fnObj]) === 'function' // ATTR, colors, scroll, boxModel, borderRadius
          && Object.keys(this.valuesEnd).some((i) => (componentProps && componentProps.includes(i))
          || (i === 'attr' && Object.keys(this.valuesEnd[i]).some((j) => componentProps && componentProps.includes(j))))) {
        if (!KUTE[fnObj]) KUTE[fnObj] = componentLink[fnObj];
      } else {
        Object.keys(this.valuesEnd).forEach((prop) => {
          const propObject = this.valuesEnd[prop];
          if (propObject instanceof Object) {
            Object.keys(propObject).forEach((i) => {
              if (typeof (componentLink[i]) === 'function') { // transformCSS3
                if (!KUTE[i]) KUTE[i] = componentLink[i];
              } else {
                Object.keys(componentLink[fnObj]).forEach((j) => {
                  if (componentLink[i] && typeof (componentLink[i][j]) === 'function') { // transformMatrix
                    if (!KUTE[j]) KUTE[j] = componentLink[i][j];
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}
