import KEC from '../objects/kute';
import Tweens from '../objects/tweens';
import globalObject from '../objects/globalObject';
import Interpolate from '../objects/interpolate';
import onStart from '../objects/onStart';
import now from '../util/now';

const Time = {};
Time.now = now;

// eslint-disable-next-line import/no-mutable-exports -- impossible to satisfy
let Tick = 0;
export { Tick };

/**
 *
 * @param {number | Date} time
 */
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
          if (KEC[obj]) delete KEC[obj];
        } else {
          Object.keys(onStart[obj]).forEach((prop) => {
            if (KEC[prop]) delete KEC[prop];
          });
        }
      });

      Object.keys(Interpolate).forEach((i) => {
        if (KEC[i]) delete KEC[i];
      });
    }
  }, 64);
}

// render update functions
// =======================
const Render = {
  Tick, Ticker, Tweens, Time,
};
Object.keys(Render).forEach((blob) => {
  if (!KEC[blob]) {
    KEC[blob] = blob === 'Time' ? Time.now : Render[blob];
  }
});

globalObject._KUTE = KEC;
export default Render;
