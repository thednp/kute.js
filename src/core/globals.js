export const globalObject = typeof (global) !== 'undefined' ? global 
                          : typeof(self) !== 'undefined' ? self
                          : typeof(window) !== 'undefined' ? window : {}
export let TweenConstructor = {}
export default {}