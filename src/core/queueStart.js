import onStart from '../objects/onStart';
import linkInterpolation from './linkInterpolation';

export default function queueStart() {
  // fire onStart actions
  Object.keys(onStart).forEach((obj) => {
    if (typeof (onStart[obj]) === 'function') {
      onStart[obj].call(this, obj); // easing functions
    } else {
      Object.keys(onStart[obj]).forEach((prop) => {
        onStart[obj][prop].call(this, prop);
      });
    }
  });

  // add interpolations
  linkInterpolation.call(this);
}
