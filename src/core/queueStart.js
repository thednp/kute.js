import onStart from '../objects/onStart.js'
import linkInterpolation from './linkInterpolation.js'

export default function(){
  // fire onStart actions
  for (let obj in onStart) {
    if (typeof (onStart[obj]) === 'function') {
      onStart[obj].call(this,obj) // easing functions
    } else {
      for (let prop in onStart[obj]) {
        onStart[obj][prop].call(this,prop);
      }
    }
  }
  // add interpolations
  linkInterpolation.call(this)
}