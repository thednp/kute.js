import KEC from '../objects/kute';
import linkProperty from '../objects/linkProperty';
import supportedProperties from '../objects/supportedProperties';

/**
 * linkInterpolation
 * @this {KUTE.Tween}
 */
export default function linkInterpolation() { // DON'T change
  Object.keys(linkProperty).forEach((component) => {
    const componentLink = linkProperty[component];
    const componentProps = supportedProperties[component];

    Object.keys(componentLink).forEach((fnObj) => {
      if (typeof (componentLink[fnObj]) === 'function' // ATTR, colors, scroll, boxModel, borderRadius
          && Object.keys(this.valuesEnd).some((i) => (componentProps && componentProps.includes(i))
          || (i === 'attr' && Object.keys(this.valuesEnd[i]).some((j) => componentProps && componentProps.includes(j))))) {
        if (!KEC[fnObj]) KEC[fnObj] = componentLink[fnObj];
      } else {
        Object.keys(this.valuesEnd).forEach((prop) => {
          const propObject = this.valuesEnd[prop];
          if (propObject instanceof Object) {
            Object.keys(propObject).forEach((i) => {
              if (typeof (componentLink[i]) === 'function') { // transformCSS3
                if (!KEC[i]) KEC[i] = componentLink[i];
              } else {
                Object.keys(componentLink[fnObj]).forEach((j) => {
                  if (componentLink[i] && typeof (componentLink[i][j]) === 'function') { // transformMatrix
                    if (!KEC[j]) KEC[j] = componentLink[i][j];
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
