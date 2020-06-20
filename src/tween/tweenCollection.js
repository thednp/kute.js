import KUTE from '../objects/kute.js'
import defaultOptions from '../objects/defaultOptions.js'
import connect from '../objects/connect.js'

// KUTE.js Tween Collection
// ========================

export default class TweenCollection {
  constructor(els,vS,vE,Ops){
    this.tweens = []

    // set default offset
    !('offset' in defaultOptions) && (defaultOptions.offset = 0);

    Ops = Ops || {}
    Ops.delay = Ops.delay || defaultOptions.delay;

    // set all options
    const options = [];

    Array.from(els).map((el,i) => {
      options[i] = Ops || {}; 
      options[i].delay = i > 0 ? Ops.delay + (Ops.offset||defaultOptions.offset) : Ops.delay;
      if (el instanceof Element) {
        this.tweens.push( new connect.tween(el, vS, vE, options[i]) );
      } else {
        console.error(`KUTE.js - ${el} not instanceof [Element]`)
      }
    })
    
    this.length = this.tweens.length
    return this
  }
  start(time) {
    time = time === undefined ? KUTE.Time() : time
    this.tweens.map((tween) => tween.start(time))
    return this
  }
  stop() { 
    this.tweens.map((tween) => tween.stop(time))
    return this
  }
  pause() { 
    this.tweens.map((tween) => tween.pause(time))
    return this
  }
  resume() {
    this.tweens.map((tween) => tween.resume(time))
    return this
  }
  chain(args) {
    let lastTween = this.tweens[this.length-1]
    if (args instanceof TweenCollection){
      lastTween.chain(args.tweens); 
    } else if (args instanceof connect.tween){
      lastTween.chain(args); 
    } else {
      throw new TypeError('KUTE.js - invalid chain value')
    }
    return this
  }
  playing() {
    return this.tweens.some(tw=>tw.playing); 
  }
  removeTweens(){
    this.tweens = []
  }
  getMaxDuration(){
    let durations = [];
    this.tweens.forEach(function(tw){
      durations.push(tw._duration + tw._delay + tw._repeat * tw._repeatDelay);
    })
    return Math.max(durations)
  }
}