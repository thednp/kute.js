import KUTE from '../objects/kute.js'
import numbers from '../interpolation/numbers.js' 

// Component Functions
export function onStartClip(tweenProp) {
  if ( this.valuesEnd[tweenProp] && !KUTE[tweenProp]) { 
    KUTE[tweenProp] = (elem, a, b, v) => {
      var h = 0, cl = [];
      for (h;h<4;h++){
        var c1 = a[h].v, c2 = b[h].v, cu = b[h].u || 'px';
        cl[h] = ((numbers(c1,c2,v)*100 >> 0)/100) + cu;
      }
      elem.style.clip = `rect(${cl})`;
    }
  }
} 

// Component Base
const baseClip = {
  component: 'baseClip',
  property: 'clip',
  // defaultValue: [0,0,0,0],
  Interpolate: {numbers},
  functions: {onStart:onStartClip}
}

export default baseClip