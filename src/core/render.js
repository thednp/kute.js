import KUTE from '../objects/kute.js'
import Tweens from '../objects/tweens.js'
import globalObject from '../objects/globalObject.js'
import Interpolate from  '../objects/interpolate.js'
import onStart from  '../objects/onStart.js'

// const Time = window.performance

const Time = {}
Time.now = self.performance.now.bind(self.performance)
// export {Time}

let Tick = 0
export {Tick}

let Ticker = (time) => {
  let i = 0;
  while ( i < Tweens.length ) {
    if ( Tweens[i].update(time) ) {
      i++;
    } else {
      Tweens.splice(i, 1);
    }
  }
  Tick = requestAnimationFrame(Ticker);
}
export {Ticker}


// stop requesting animation frame
export function stop() {
  setTimeout(() => { // re-added for #81
    if (!Tweens.length && Tick) { 
      cancelAnimationFrame(Tick); 
      Tick = null;
      for (let obj in onStart) {
        if (typeof (onStart[obj]) === 'function') {
          KUTE[obj] && (delete KUTE[obj])
        } else {
          for (let prop in onStart[obj]) {
            KUTE[prop] && (delete KUTE[prop])
          }
        }
      }
      for (let i in Interpolate) {
        KUTE[i] && (delete KUTE[i])
      }
    }
  },64)
}

// KUTE.js render update functions
// ===============================
const Render = {Tick,Ticker,Tweens,Time}
for ( const blob in Render ) {
  if (!KUTE[blob]) {
    KUTE[blob] = blob === 'Time' ? Time.now : Render[blob];
  }
}
export default Render
globalObject[`_KUTE`] = KUTE