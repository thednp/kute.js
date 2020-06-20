import KUTE from '../objects/kute.js'
import Tweens from '../objects/tweens.js'
import globalObject from '../objects/globalObject.js'
import Interpolate from  '../objects/interpolate.js'
import onStart from  '../objects/onStart.js'

const Time = {}
  
// In node.js, use process.hrtime.
if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
	Time.now = function () {
		var time = process.hrtime();
		return time[0] * 1000 + time[1] / 1000000;
	};
// In a browser, use self.performance.now if it is available.
} else if (typeof (self) !== 'undefined' &&
         self.performance !== undefined &&
		 self.performance.now !== undefined) {
	Time.now = self.performance.now.bind(self.performance);
}

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