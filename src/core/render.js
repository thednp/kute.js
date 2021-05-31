import KUTE from '../objects/kute.js';
import Tweens from '../objects/tweens.js';
import globalObject from '../objects/globalObject.js';
import Interpolate from '../objects/interpolate.js';
import onStart from '../objects/onStart.js';

const Time = {};
const that = window.self || window || {};
Time.now = that.performance.now.bind(that.performance);

let Tick = 0;
export { Tick };

const Ticker = (time) => {
  let i = 0;
  while (i < Tweens.length) {
    if (Tweens[i].update(time)) {
      i += 1;
    } else {
      Tweens.splice(i, 1);
    }
  }
  Tick = requestAnimationFrame(Ticker);
};
export { Ticker };

// stop requesting animation frame
export function stop() {
  setTimeout(() => { // re-added for #81
    if (!Tweens.length && Tick) {
      cancelAnimationFrame(Tick);
      Tick = null;
      Object.keys(onStart).forEach((obj) => {
        if (typeof (onStart[obj]) === 'function') {
          if (KUTE[obj]) delete KUTE[obj];
        } else {
          Object.keys(onStart[obj]).forEach((prop) => {
            if (KUTE[prop]) delete KUTE[prop];
          });
        }
      });

      Object.keys(Interpolate).forEach((i) => {
        if (KUTE[i]) delete KUTE[i];
      });
    }
  }, 64);
}

// KUTE.js render update functions
// ===============================
const Render = {
  Tick, Ticker, Tweens, Time,
};
Object.keys(Render).forEach((blob) => {
  if (!KUTE[blob]) {
    KUTE[blob] = blob === 'Time' ? Time.now : Render[blob];
  }
});

globalObject._KUTE = KUTE;
export default Render;
