
import KUTE from '../objects/kute.js'
import TweenBase from './tweenBase.js'
import connect from '../objects/connect.js'
import add from '../core/add.js'
import remove from '../core/remove.js'
import defaultOptions from '../objects/defaultOptions.js'
import crossCheck from '../objects/crossCheck.js'
import prepareObject from '../process/prepareObject.js'
import getStartValues from '../process/getStartValues.js'
import {Tick,Ticker} from '../core/render.js'
import queueStart from '../core/queueStart.js'

defaultOptions.repeat = 0
defaultOptions.repeatDelay = 0
defaultOptions.yoyo = false
defaultOptions.resetStart = false

// no need to set defaults for callbacks
// defaultOptions.onPause = undefined
// defaultOptions.onResume = undefined

// the constructor that supports to, allTo methods
export default class Tween extends TweenBase {
  constructor(...args) {
    super(...args) // this calls the constructor of TweenBase

    // reset interpolation values
    this.valuesStart = {}
    this.valuesEnd = {}

    let startObject = args[1]
    let endObject = args[2]

    // set valuesEnd
    prepareObject.call(this,endObject,'end');
    
    // set valuesStart
    if ( this._resetStart ) { 
      this.valuesStart = startObject; 
    } else { 
      prepareObject.call(this,startObject,'start'); 
    }
    
    // ready for crossCheck
    if (!this._resetStart) {
      for ( const component in crossCheck ) {
        for ( const checkProp in crossCheck[component] ) {
           crossCheck[component][checkProp].call(this,checkProp);
        }
      }
    }    

    // set paused state
    this.paused = false;
    this._pauseTime = null;    

    // additional properties and options
    let options = args[3]

    this._repeat = options.repeat || defaultOptions.repeat;
    this._repeatDelay = options.repeatDelay || defaultOptions.repeatDelay;
    this._repeatOption = this._repeat; // we cache the number of repeats to be able to put it back after all cycles finish
    
    // yoyo needs at least repeat: 1 
    this.valuesRepeat = {}; // valuesRepeat
    this._yoyo = options.yoyo || defaultOptions.yoyo;
    this._reversed = false;

    // don't load extra callbacks
    // this._onPause = options.onPause || defaultOptions.onPause
    // this._onResume = options.onResume || defaultOptions.onResume

    // chained Tweens
    // this._chain = options.chain || defaultOptions.chain; 
    return this;
  }

  // additions to start method
  start(time) {
    // on start we reprocess the valuesStart for TO() method
    if ( this._resetStart ) {
      this.valuesStart = this._resetStart;
      getStartValues.call(this);

      // this is where we do the valuesStart and valuesEnd check for fromTo() method
      for ( let component in crossCheck ) {
        for ( let prop in crossCheck[component] ) {
          crossCheck[component][prop].call(this,prop); 
        }
      }
    }
    // still not paused
    this.paused = false;

    // set yoyo values
    if (this._yoyo) {
      for ( let endProp in this.valuesEnd ) {
        this.valuesRepeat[endProp] = this.valuesStart[endProp]
      }
    }

    super.start(time);

    return this
  }
  // updates to super methods
  stop() {
    super.stop();
    if (!this.paused && this.playing) {
      this.paused = false;
      this.stopChainedTweens()
    }
    return this
  }
  close () { 
    super.close();

    if (this._repeatOption > 0) { 
      this._repeat = this._repeatOption 
    }
    if (this._yoyo && this._reversed===true) { 
      this.reverse(); 
      this._reversed = false 
    }
  
    return this 
  }

  // additions to prototype
  resume() {
    if (this.paused && this.playing) {
      this.paused = false;
      if (this._onResume !== undefined) {
        this._onResume.call(this);
      }
      // re-queue execution context
      queueStart.call(this)
      // update time and let it roll
      this._startTime += KUTE.Time() - this._pauseTime;
      add(this);
      !Tick && Ticker();  // restart ticking if stopped
    }
    return this;
  }
  pause() {
    if (!this.paused && this.playing) {
      remove(this);
      this.paused = true;
      this._pauseTime = KUTE.Time();
      if (this._onPause !== undefined) {
        this._onPause.call(this);
      }
    }
    return this;
  }  
  reverse() {
    // if (this._yoyo) {
      for (const reverseProp in this.valuesEnd) {
        const tmp = this.valuesRepeat[reverseProp];
        this.valuesRepeat[reverseProp] = this.valuesEnd[reverseProp];
        this.valuesEnd[reverseProp] = tmp;
        this.valuesStart[reverseProp] = this.valuesRepeat[reverseProp];
      }
    // }
  }
  update(time) {
    time = time !== undefined ? time : KUTE.Time();
    
    let elapsed, progress

    if ( time < this._startTime && this.playing ) { return true; }

    elapsed = (time - this._startTime) / this._duration
    elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed

    progress = this._easing(elapsed); // calculate progress

    for (const tweenProp in this.valuesEnd){ // render the update
      KUTE[tweenProp](this.element,this.valuesStart[tweenProp],this.valuesEnd[tweenProp],progress); 
    }

    // fire the updateCallback
    if (this._onUpdate) {
      this._onUpdate.call(this);
    }

    if (elapsed === 1) {
      if (this._repeat > 0) {

        if ( isFinite( this._repeat ) ) { this._repeat--; }

        this._startTime = (isFinite( this._repeat ) && this._yoyo && !this._reversed) ? time + this._repeatDelay : time; //set the right time for delay

        if (this._yoyo) { // handle yoyo
          this._reversed = !this._reversed;
          this.reverse();
        }

        return true;

      } else {

        // fire the complete callback
        if (this._onComplete) {
          this._onComplete.call(this);
        }

        // now we're sure no animation is running
        this.playing = false;

        //stop ticking when finished
        this.close();

        // start animating chained tweens
        if (this._chain !== undefined && this._chain.length){
          this._chain.map(tw=>tw.start())
        }
      }
      return false;
    }
    return true;
  }
}

// Update Tween Interface Update
connect.tween = Tween