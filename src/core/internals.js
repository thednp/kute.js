// imports
import {Tweens,onStart,linkProperty,supportedProperties} from './objects.js'
import KUTE,{globalObject} from './globals.js'
import Interpolate from './interpolate.js'


// KUTE.js INTERNALS
// =================

export const add = function(tw) { Tweens.push(tw); }
export const remove = function(tw) { const i = Tweens.indexOf(tw); if (i !== -1) { Tweens.splice(i, 1); }}
export const getAll = function() { return Tweens }
export const removeAll = function() { Tweens.length = 0 }

// KUTE.js render update functions
// ===============================

export let Tick = 0
export function Ticker(time) {
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

export {Time}

// stop requesting animation frame
export function stop () {
  setTimeout(() => { // re-added for #81
    if (!Tweens.length && Tick) { 
      cancelAnimationFrame(Tick); 
      Tick = null;
      for (const obj in onStart) {
        if (typeof (onStart[obj]) === 'function') {
          KUTE[obj] && (delete KUTE[obj])
        } else {
          for (const prop in onStart[obj]) {
            KUTE[prop] && (delete KUTE[prop])
          }
        }
      }
      for (const i in Interpolate) {
        KUTE[i] && (delete KUTE[i])
      }
    }
  },64)
}

export function linkInterpolation(){
  for (const component in linkProperty){
    const componentLink = linkProperty[component]
    const componentProps = supportedProperties[component]

    for ( const fnObj in componentLink ) {
      if ( typeof(componentLink[fnObj]) === 'function' 
          && Object.keys(this.valuesEnd).some(i => componentProps.includes(i) 
          || i=== 'attr' && Object.keys(this.valuesEnd[i]).some(j => componentProps.includes(j)) ) ) 
      { // ATTR, colors, scroll, boxModel, borderRadius
        !KUTE[fnObj] && (KUTE[fnObj] = componentLink[fnObj])
      } else {

        for ( const prop in this.valuesEnd ) {
          for ( const i in this.valuesEnd[prop] ) {
            if ( typeof(componentLink[i]) === 'function' ) { // transformCSS3
              !KUTE[i] && (KUTE[i] = componentLink[i])
            } else {
              for (const j in componentLink[fnObj]){
                if (componentLink[i] && typeof(componentLink[i][j]) === 'function' ) { // transformMatrix
                  !KUTE[j] && (KUTE[j] = componentLink[i][j])
                }
              }
            } 
          }
        }
      }
    }
  }
}

export const Render = {Tick,Ticker,Tweens,Time}
for (const blob in Render ) {
  if (!KUTE[blob]) {
    KUTE[blob] = blob === 'Time' ? Time.now : Render[blob];
  }
}
globalObject[`_KUTE`] = KUTE

export default {
  add,
  remove,
  getAll,
  removeAll,
  stop,
  linkInterpolation
}