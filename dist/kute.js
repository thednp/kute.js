/*!
* KUTE.js Standard v2.0.14 (http://thednp.github.io/kute.js)
* Copyright 2015-2020 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KUTE = factory());
}(this, (function () { 'use strict';

  var version = "2.0.14";

  var KUTE = {};

  var Tweens = [];

  var globalObject = typeof (global) !== 'undefined' ? global
                    : typeof(self) !== 'undefined' ? self
                    : typeof(window) !== 'undefined' ? window : {};

  var Interpolate = {};

  var onStart = {};

  var Time = {};
  Time.now = self.performance.now.bind(self.performance);
  var Tick = 0;
  var Ticker = function (time) {
    var i = 0;
    while ( i < Tweens.length ) {
      if ( Tweens[i].update(time) ) {
        i++;
      } else {
        Tweens.splice(i, 1);
      }
    }
    Tick = requestAnimationFrame(Ticker);
  };
  function stop() {
    setTimeout(function () {
      if (!Tweens.length && Tick) {
        cancelAnimationFrame(Tick);
        Tick = null;
        for (var obj in onStart) {
          if (typeof (onStart[obj]) === 'function') {
            KUTE[obj] && (delete KUTE[obj]);
          } else {
            for (var prop in onStart[obj]) {
              KUTE[prop] && (delete KUTE[prop]);
            }
          }
        }
        for (var i in Interpolate) {
          KUTE[i] && (delete KUTE[i]);
        }
      }
    },64);
  }
  var Render = {Tick: Tick,Ticker: Ticker,Tweens: Tweens,Time: Time};
  for ( var blob in Render ) {
    if (!KUTE[blob]) {
      KUTE[blob] = blob === 'Time' ? Time.now : Render[blob];
    }
  }
  globalObject["_KUTE"] = KUTE;

  var supportedProperties = {};

  var defaultValues = {};

  var defaultOptions = {
    duration: 700,
    delay: 0,
    easing: 'linear'
  };

  var prepareProperty = {};

  var prepareStart = {};

  var crossCheck = {};

  var onComplete = {};

  var linkProperty = {};

  var Objects = {
    supportedProperties: supportedProperties,
    defaultValues: defaultValues,
    defaultOptions: defaultOptions,
    prepareProperty: prepareProperty,
    prepareStart: prepareStart,
    crossCheck: crossCheck,
    onStart: onStart,
    onComplete: onComplete,
    linkProperty: linkProperty
  };

  var Util = {};

  var Components = {};

  function add (tw) { return Tweens.push(tw); }

  function remove (tw) {
    var i = Tweens.indexOf(tw);
    i !== -1 && Tweens.splice(i, 1);
  }

  function getAll () { return Tweens; }

  function removeAll () { Tweens.length = 0; }

  function linkInterpolation() {
    var this$1 = this;
    var loop = function ( component ) {
      var componentLink = linkProperty[component];
      var componentProps = supportedProperties[component];
      for ( var fnObj in componentLink ) {
        if ( typeof(componentLink[fnObj]) === 'function'
            && Object.keys(this$1.valuesEnd).some(function (i) { return componentProps && componentProps.includes(i)
            || i=== 'attr' && Object.keys(this$1.valuesEnd[i]).some(function (j) { return componentProps && componentProps.includes(j); }); } ) )
        {
          !KUTE[fnObj] && (KUTE[fnObj] = componentLink[fnObj]);
        } else {
          for ( var prop in this$1.valuesEnd ) {
            for ( var i in this$1.valuesEnd[prop] ) {
              if ( typeof(componentLink[i]) === 'function' ) {
                !KUTE[i] && (KUTE[i] = componentLink[i]);
              } else {
                for (var j in componentLink[fnObj]){
                  if (componentLink[i] && typeof(componentLink[i][j]) === 'function' ) {
                    !KUTE[j] && (KUTE[j] = componentLink[i][j]);
                  }
                }
              }
            }
          }
        }
      }
    };
    for (var component in linkProperty)loop( component );
  }

  var Internals = {
    add: add,
    remove: remove,
    getAll: getAll,
    removeAll: removeAll,
    stop: stop,
    linkInterpolation: linkInterpolation
  };

  function getInlineStyle(el) {
    if ( !el.style ) { return; }
    var css = el.style.cssText.replace(/\s/g,'').split(';'),
        transformObject = {},
        arrayFn = ['translate3d','translate','scale3d','skew'];
    css.map(function (cs) {
      if ( /transform/i.test(cs)) {
        var tps = cs.split(':')[1].split(')');
        tps.map(function (tpi) {
          var tpv = tpi.split('('), tp = tpv[0], tv = tpv[1];
          if ( !/matrix/.test(tp) ){
            transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
          }
        });
      }
    });
    return transformObject;
  }

  function getStyleForProperty(elem, propertyName) {
    var styleAttribute = elem.style,
        computedStyle = getComputedStyle(elem) || elem.currentStyle,
        styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName])
                    ? styleAttribute[propertyName]
                    : computedStyle[propertyName];
    if ( propertyName !== 'transform' && (propertyName in computedStyle || propertyName in styleAttribute) ) {
      return styleValue ? styleValue : defaultValues[propertyName];
    }
  }

  function prepareObject (obj, fn) {
    var propertiesObject = fn === 'start' ? this.valuesStart : this.valuesEnd;
    for ( var component in prepareProperty ) {
      var prepareComponent = prepareProperty[component],
          supportComponent = supportedProperties[component];
      for ( var tweenCategory in prepareComponent ) {
        var transformObject = {};
        for (var tweenProp in obj) {
          if ( defaultValues[tweenProp] && prepareComponent[tweenProp] ) {
            propertiesObject[tweenProp] = prepareComponent[tweenProp].call(this,tweenProp,obj[tweenProp]);
          } else if ( !defaultValues[tweenCategory] && tweenCategory === 'transform' && supportComponent.includes(tweenProp) ) {
            transformObject[tweenProp] = obj[tweenProp];
          } else if (!defaultValues[tweenProp] && tweenProp === 'transform') {
            propertiesObject[tweenProp] = obj[tweenProp];
          } else if ( !defaultValues[tweenCategory] && supportComponent && supportComponent.includes(tweenProp) ) {
            propertiesObject[tweenProp] = prepareComponent[tweenCategory].call(this,tweenProp,obj[tweenProp]);
          }
        }
        if (Object.keys && Object.keys(transformObject).length){
          propertiesObject[tweenCategory] = prepareComponent[tweenCategory].call(this,tweenCategory,transformObject);
        }
      }
    }
  }

  function getStartValues () {
    var startValues = {},
          currentStyle = getInlineStyle(this.element);
    for (var tweenProp in this.valuesStart) {
      for ( var component in prepareStart) {
        var componentStart = prepareStart[component];
        for ( var tweenCategory in componentStart) {
          if ( tweenCategory === tweenProp && componentStart[tweenProp] ) {
            startValues[tweenProp] = componentStart[tweenCategory].call(this,tweenProp,this.valuesStart[tweenProp]);
          } else if ( supportedProperties[component] && supportedProperties[component].includes(tweenProp) ) {
            startValues[tweenProp] = componentStart[tweenCategory].call(this,tweenProp,this.valuesStart[tweenProp]);
          }
        }
      }
    }
    for ( var current in currentStyle ){
      if ( !( current in this.valuesStart ) ) {
        startValues[current] = currentStyle[current] || defaultValues[current];
      }
    }
    this.valuesStart = {};
    prepareObject.call(this,startValues,'start');
  }

  var Process = {
    getInlineStyle: getInlineStyle,
    getStyleForProperty: getStyleForProperty,
    getStartValues: getStartValues,
    prepareObject: prepareObject
  };

  var CubicBezier = function CubicBezier(p1x, p1y, p2x, p2y, functionName) {
    var this$1 = this;
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx -this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
    var BezierEasing = function (t) { return this$1.sampleCurveY( this$1.solveCurveX(t) ); };
    Object.defineProperty(BezierEasing, 'name', { writable: true });
    BezierEasing.name = functionName ? functionName :("cubic-bezier(" + ([p1x, p1y, p2x, p2y]) + ")");
    return BezierEasing
  };
  CubicBezier.prototype.sampleCurveX = function sampleCurveX (t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };
  CubicBezier.prototype.sampleCurveY = function sampleCurveY (t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };
  CubicBezier.prototype.sampleCurveDerivativeX = function sampleCurveDerivativeX (t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  };
  CubicBezier.prototype.solveCurveX = function solveCurveX (x) {
    var t0, t1, t2, x2, d2, i, epsilon = 1e-5;
    for (t2 = x, i = 0; i < 32; i++) {
      x2 = this.sampleCurveX(t2) - x;
      if (Math.abs (x2) < epsilon)
        { return t2; }
      d2 = this.sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < epsilon)
        { break; }
      t2 = t2 - x2 / d2;
    }
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;
    if (t2 < t0) { return t0; }
    if (t2 > t1) { return t1; }
    while (t0 < t1) {
      x2 = this.sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon)
        { return t2; }
      if (x > x2) { t0 = t2; }
      else { t1 = t2; }
      t2 = (t1 - t0) * .5 + t0;
    }
    return t2;
  };

  var connect = {};

  var Easing = {
    linear :  new CubicBezier(0, 0, 1, 1,'linear'),
    easingSinusoidalIn : new CubicBezier(0.47, 0, 0.745, 0.715,'easingSinusoidalIn'),
    easingSinusoidalOut : new CubicBezier(0.39, 0.575, 0.565, 1,'easingSinusoidalOut'),
    easingSinusoidalInOut : new CubicBezier(0.445, 0.05, 0.55, 0.95,'easingSinusoidalInOut'),
    easingQuadraticIn : new CubicBezier(0.550, 0.085, 0.680, 0.530,'easingQuadraticIn'),
    easingQuadraticOut : new CubicBezier(0.250, 0.460, 0.450, 0.940,'easingQuadraticOut'),
    easingQuadraticInOut : new CubicBezier(0.455, 0.030, 0.515, 0.955,'easingQuadraticInOut'),
    easingCubicIn : new CubicBezier(0.55, 0.055, 0.675, 0.19,'easingCubicIn'),
    easingCubicOut : new CubicBezier(0.215, 0.61, 0.355, 1,'easingCubicOut'),
    easingCubicInOut : new CubicBezier(0.645, 0.045, 0.355, 1,'easingCubicInOut'),
    easingQuarticIn : new CubicBezier(0.895, 0.03, 0.685, 0.22,'easingQuarticIn'),
    easingQuarticOut : new CubicBezier(0.165, 0.84, 0.44, 1,'easingQuarticOut'),
    easingQuarticInOut : new CubicBezier(0.77, 0, 0.175, 1,'easingQuarticInOut'),
    easingQuinticIn : new CubicBezier(0.755, 0.05, 0.855, 0.06,'easingQuinticIn'),
    easingQuinticOut : new CubicBezier(0.23, 1, 0.32, 1,'easingQuinticOut'),
    easingQuinticInOut : new CubicBezier(0.86, 0, 0.07, 1,'easingQuinticInOut'),
    easingExponentialIn : new CubicBezier(0.95, 0.05, 0.795, 0.035,'easingExponentialIn'),
    easingExponentialOut : new CubicBezier(0.19, 1, 0.22, 1,'easingExponentialOut'),
    easingExponentialInOut : new CubicBezier(1, 0, 0, 1,'easingExponentialInOut'),
    easingCircularIn : new CubicBezier(0.6, 0.04, 0.98, 0.335,'easingCircularIn'),
    easingCircularOut : new CubicBezier(0.075, 0.82, 0.165, 1,'easingCircularOut'),
    easingCircularInOut : new CubicBezier(0.785, 0.135, 0.15, 0.86,'easingCircularInOut'),
    easingBackIn : new CubicBezier(0.6, -0.28, 0.735, 0.045,'easingBackIn'),
    easingBackOut : new CubicBezier(0.175, 0.885, 0.32, 1.275,'easingBackOut'),
    easingBackInOut : new CubicBezier(0.68, -0.55, 0.265, 1.55,'easingBackInOut')
  };
  function processBezierEasing(fn) {
    if ( typeof fn === 'function') {
      return fn;
    } else if (typeof(Easing[fn]) === 'function') {
      return Easing[fn];
    } else if ( /bezier/.test(fn) ) {
      var bz = fn.replace(/bezier|\s|\(|\)/g,'').split(',');
      return new CubicBezier( bz[0]*1,bz[1]*1,bz[2]*1,bz[3]*1 );
    } else {
      if ( /elastic|bounce/i.test(fn) ) {
        console.warn(("KUTE.js - CubicBezier doesn't support " + fn + " easing."));
      }
      return Easing.linear
    }
  }
  connect.processEasing = processBezierEasing;

  function selector(el, multi) {
    try{
      var requestedElem;
      if (multi){
        requestedElem = el instanceof HTMLCollection
                     || el instanceof NodeList
                     || el instanceof Array && el.every(function (x) { return x instanceof Element; })
                      ? el : document.querySelectorAll(el);
      } else {
        requestedElem = el instanceof Element
                     || el === window
                      ? el : document.querySelector(el);
      }
      return requestedElem;
    } catch(e){
      console.error(("KUTE.js - Element(s) not found: " + el + "."));
    }
  }

  function queueStart(){
    for (var obj in onStart) {
      if (typeof (onStart[obj]) === 'function') {
        onStart[obj].call(this,obj);
      } else {
        for (var prop in onStart[obj]) {
          onStart[obj][prop].call(this,prop);
        }
      }
    }
    linkInterpolation.call(this);
  }

  var TweenBase = function TweenBase(targetElement, startObject, endObject, options){
    this.element = targetElement;
    this.playing = false;
    this._startTime = null;
    this._startFired = false;
    this.valuesEnd = endObject;
    this.valuesStart = startObject;
    options = options || {};
    this._resetStart = options.resetStart || 0;
    this._easing = typeof (options.easing) === 'function' ? options.easing : connect.processEasing(options.easing);
    this._duration = options.duration || defaultOptions.duration;
    this._delay = options.delay || defaultOptions.delay;
    for (var op in options) {
      var internalOption = "_" + op;
      if( !(internalOption in this ) ) { this[internalOption] = options[op]; }
    }
    var easingFnName = this._easing.name;
    if (!onStart[easingFnName]) {
      onStart[easingFnName] = function(prop){
        !KUTE[prop] && prop === this._easing.name && (KUTE[prop] = this._easing);
      };
    }
    return this;
  };
  TweenBase.prototype.start = function start (time) {
    add(this);
    this.playing = true;
    this._startTime = typeof time !== 'undefined' ? time : KUTE.Time();
    this._startTime += this._delay;
    if (!this._startFired) {
      if (this._onStart) {
        this._onStart.call(this);
      }
      queueStart.call(this);
      this._startFired = true;
    }
    !Tick && Ticker();
    return this;
  };
  TweenBase.prototype.stop = function stop () {
    if (this.playing) {
      remove(this);
      this.playing = false;
      if (this._onStop) {
        this._onStop.call(this);
      }
      this.close();
    }
    return this;
  };
  TweenBase.prototype.close = function close () {
    for (var component in onComplete){
      for (var toClose in onComplete[component]){
        onComplete[component][toClose].call(this,toClose);
      }
    }
    this._startFired = false;
    stop.call(this);
  };
  TweenBase.prototype.chain = function chain (args) {
    this._chain = [];
    this._chain = args.length ? args : this._chain.concat(args);
    return this;
  };
  TweenBase.prototype.stopChainedTweens = function stopChainedTweens () {
    this._chain && this._chain.length && this._chain.map(function (tw){ return tw.stop(); });
  };
  TweenBase.prototype.update = function update (time) {
    time = time !== undefined ? time : KUTE.Time();
    var elapsed, progress;
    if ( time < this._startTime && this.playing ) { return true; }
    elapsed = (time - this._startTime) / this._duration;
    elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;
    progress = this._easing(elapsed);
    for (var tweenProp in this.valuesEnd){
      KUTE[tweenProp](this.element,this.valuesStart[tweenProp],this.valuesEnd[tweenProp],progress);
    }
    if (this._onUpdate) {
      this._onUpdate.call(this);
    }
    if (elapsed === 1) {
      if (this._onComplete) {
        this._onComplete.call(this);
      }
      this.playing = false;
      this.close();
      if (this._chain !== undefined && this._chain.length){
        this._chain.map(function (tw){ return tw.start(); });
      }
      return false;
    }
    return true;
  };
  connect.tween = TweenBase;

  defaultOptions.repeat = 0;
  defaultOptions.repeatDelay = 0;
  defaultOptions.yoyo = false;
  defaultOptions.resetStart = false;
  var Tween = (function (TweenBase) {
    function Tween() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      TweenBase.apply(this, args);
      this.valuesStart = {};
      this.valuesEnd = {};
      var startObject = args[1];
      var endObject = args[2];
      prepareObject.call(this,endObject,'end');
      if ( this._resetStart ) {
        this.valuesStart = startObject;
      } else {
        prepareObject.call(this,startObject,'start');
      }
      if (!this._resetStart) {
        for ( var component in crossCheck ) {
          for ( var checkProp in crossCheck[component] ) {
             crossCheck[component][checkProp].call(this,checkProp);
          }
        }
      }
      this.paused = false;
      this._pauseTime = null;
      var options = args[3];
      this._repeat = options.repeat || defaultOptions.repeat;
      this._repeatDelay = options.repeatDelay || defaultOptions.repeatDelay;
      this._repeatOption = this._repeat;
      this.valuesRepeat = {};
      this._yoyo = options.yoyo || defaultOptions.yoyo;
      this._reversed = false;
      return this;
    }
    if ( TweenBase ) Tween.__proto__ = TweenBase;
    Tween.prototype = Object.create( TweenBase && TweenBase.prototype );
    Tween.prototype.constructor = Tween;
    Tween.prototype.start = function start (time) {
      if ( this._resetStart ) {
        this.valuesStart = this._resetStart;
        getStartValues.call(this);
        for ( var component in crossCheck ) {
          for ( var prop in crossCheck[component] ) {
            crossCheck[component][prop].call(this,prop);
          }
        }
      }
      this.paused = false;
      if (this._yoyo) {
        for ( var endProp in this.valuesEnd ) {
          this.valuesRepeat[endProp] = this.valuesStart[endProp];
        }
      }
      TweenBase.prototype.start.call(this, time);
      return this
    };
    Tween.prototype.stop = function stop () {
      TweenBase.prototype.stop.call(this);
      if (!this.paused && this.playing) {
        this.paused = false;
        this.stopChainedTweens();
      }
      return this
    };
    Tween.prototype.close = function close () {
      TweenBase.prototype.close.call(this);
      if (this._repeatOption > 0) {
        this._repeat = this._repeatOption;
      }
      if (this._yoyo && this._reversed===true) {
        this.reverse();
        this._reversed = false;
      }
      return this
    };
    Tween.prototype.resume = function resume () {
      if (this.paused && this.playing) {
        this.paused = false;
        if (this._onResume !== undefined) {
          this._onResume.call(this);
        }
        queueStart.call(this);
        this._startTime += KUTE.Time() - this._pauseTime;
        add(this);
        !Tick && Ticker();
      }
      return this;
    };
    Tween.prototype.pause = function pause () {
      if (!this.paused && this.playing) {
        remove(this);
        this.paused = true;
        this._pauseTime = KUTE.Time();
        if (this._onPause !== undefined) {
          this._onPause.call(this);
        }
      }
      return this;
    };
    Tween.prototype.reverse = function reverse () {
        for (var reverseProp in this.valuesEnd) {
          var tmp = this.valuesRepeat[reverseProp];
          this.valuesRepeat[reverseProp] = this.valuesEnd[reverseProp];
          this.valuesEnd[reverseProp] = tmp;
          this.valuesStart[reverseProp] = this.valuesRepeat[reverseProp];
        }
    };
    Tween.prototype.update = function update (time) {
      time = time !== undefined ? time : KUTE.Time();
      var elapsed, progress;
      if ( time < this._startTime && this.playing ) { return true; }
      elapsed = (time - this._startTime) / this._duration;
      elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;
      progress = this._easing(elapsed);
      for (var tweenProp in this.valuesEnd){
        KUTE[tweenProp](this.element,this.valuesStart[tweenProp],this.valuesEnd[tweenProp],progress);
      }
      if (this._onUpdate) {
        this._onUpdate.call(this);
      }
      if (elapsed === 1) {
        if (this._repeat > 0) {
          if ( isFinite( this._repeat ) ) { this._repeat--; }
          this._startTime = (isFinite( this._repeat ) && this._yoyo && !this._reversed) ? time + this._repeatDelay : time;
          if (this._yoyo) {
            this._reversed = !this._reversed;
            this.reverse();
          }
          return true;
        } else {
          if (this._onComplete) {
            this._onComplete.call(this);
          }
          this.playing = false;
          this.close();
          if (this._chain !== undefined && this._chain.length){
            this._chain.map(function (tw){ return tw.start(); });
          }
        }
        return false;
      }
      return true;
    };
    return Tween;
  }(TweenBase));
  connect.tween = Tween;

  var TweenCollection = function TweenCollection(els,vS,vE,Ops){
    var this$1 = this;
    this.tweens = [];
    !('offset' in defaultOptions) && (defaultOptions.offset = 0);
    Ops = Ops || {};
    Ops.delay = Ops.delay || defaultOptions.delay;
    var options = [];
    Array.from(els).map(function (el,i) {
      options[i] = Ops || {};
      options[i].delay = i > 0 ? Ops.delay + (Ops.offset||defaultOptions.offset) : Ops.delay;
      if (el instanceof Element) {
        this$1.tweens.push( new connect.tween(el, vS, vE, options[i]) );
      } else {
        console.error(("KUTE.js - " + el + " not instanceof [Element]"));
      }
    });
    this.length = this.tweens.length;
    return this
  };
  TweenCollection.prototype.start = function start (time) {
    time = time === undefined ? KUTE.Time() : time;
    this.tweens.map(function (tween) { return tween.start(time); });
    return this
  };
  TweenCollection.prototype.stop = function stop () {
    this.tweens.map(function (tween) { return tween.stop(time); });
    return this
  };
  TweenCollection.prototype.pause = function pause () {
    this.tweens.map(function (tween) { return tween.pause(time); });
    return this
  };
  TweenCollection.prototype.resume = function resume () {
    this.tweens.map(function (tween) { return tween.resume(time); });
    return this
  };
  TweenCollection.prototype.chain = function chain (args) {
    var lastTween = this.tweens[this.length-1];
    if (args instanceof TweenCollection){
      lastTween.chain(args.tweens);
    } else if (args instanceof connect.tween){
      lastTween.chain(args);
    } else {
      throw new TypeError('KUTE.js - invalid chain value')
    }
    return this
  };
  TweenCollection.prototype.playing = function playing () {
    return this.tweens.some(function (tw){ return tw.playing; });
  };
  TweenCollection.prototype.removeTweens = function removeTweens (){
    this.tweens = [];
  };
  TweenCollection.prototype.getMaxDuration = function getMaxDuration (){
    var durations = [];
    this.tweens.forEach(function(tw){
      durations.push(tw._duration + tw._delay + tw._repeat * tw._repeatDelay);
    });
    return Math.max(durations)
  };

  function to(element, endObject, optionsObj) {
    optionsObj = optionsObj || {};
    optionsObj.resetStart = endObject;
    return new connect.tween(selector(element), endObject, endObject, optionsObj)
  }

  function fromTo(element, startObject, endObject, optionsObj) {
    optionsObj = optionsObj || {};
    return new connect.tween(selector(element), startObject, endObject, optionsObj)
  }

  function allTo(elements, endObject, optionsObj) {
    optionsObj = optionsObj || {};
    optionsObj.resetStart = endObject;
    return new TweenCollection(selector(elements,true), endObject, endObject, optionsObj)
  }

  function allFromTo(elements, startObject, endObject, optionsObj) {
    optionsObj = optionsObj || {};
    return new TweenCollection(selector(elements,true), startObject, endObject, optionsObj)
  }

  var Animation = function Animation(Component){
    try {
      if ( Component.component in supportedProperties ) {
        console.error(("KUTE.js - " + (Component.component) + " already registered"));
      } else if ( Component.property in defaultValues) {
        console.error(("KUTE.js - " + (Component.property) + " already registered"));
      } else {
        this.setComponent(Component);
      }
    } catch(e){
      console.error(e);
    }
  };
  Animation.prototype.setComponent = function setComponent (Component){
    var propertyInfo = this;
    var ComponentName = Component.component;
    var Functions = { prepareProperty: prepareProperty, prepareStart: prepareStart, onStart: onStart, onComplete: onComplete, crossCheck: crossCheck };
    var Category = Component.category;
    var Property = Component.property;
    var Length = Component.properties && Component.properties.length || Component.subProperties && Component.subProperties.length;
    supportedProperties[ComponentName] = Component.properties || Component.subProperties || Component.property;
    if ('defaultValue' in Component){
      defaultValues[ Property ] = Component.defaultValue;
      propertyInfo.supports = Property + " property";
    } else if (Component.defaultValues) {
      for (var dv in Component.defaultValues) {
        defaultValues[dv] = Component.defaultValues[dv];
      }
      propertyInfo.supports = (Length||Property) + " " + (Property||Category) + " properties";
    }
    if (Component.defaultOptions) {
      for (var op in Component.defaultOptions) {
        defaultOptions[op] = Component.defaultOptions[op];
      }
    }
    if (Component.functions) {
      for (var fn in Functions) {
        if (fn in Component.functions) {
          if (typeof (Component.functions[fn]) === 'function' ) {
            !Functions[fn][ComponentName] && (Functions[fn][ComponentName] = {});
            !Functions[fn][ComponentName][ Category||Property ] && (Functions[fn][ComponentName][ Category||Property ] = Component.functions[fn]);
          } else {
            for ( var ofn in Component.functions[fn] ){
              !Functions[fn][ComponentName] && (Functions[fn][ComponentName] = {});
              !Functions[fn][ComponentName][ofn] && (Functions[fn][ComponentName][ofn] = Component.functions[fn][ofn]);
            }
          }
        }
      }
    }
    if (Component.Interpolate) {
      for (var fni in Component.Interpolate) {
        var compIntObj = Component.Interpolate[fni];
        if ( typeof(compIntObj) === 'function' && !Interpolate[fni] ) {
          Interpolate[fni] = compIntObj;
        } else {
          for ( var sfn in compIntObj ) {
            if ( typeof(compIntObj[sfn]) === 'function' && !Interpolate[fni] ) {
              Interpolate[fni] = compIntObj[sfn];
            }
          }
        }
      }
      linkProperty[ComponentName] = Component.Interpolate;
    }
    if (Component.Util) {
      for (var fnu in Component.Util){
        !Util[fnu] && (Util[fnu] = Component.Util[fnu]);
      }
    }
    return propertyInfo
  };

  function trueDimension (dimValue, isAngle) {
    var intValue = parseInt(dimValue) || 0;
    var mUnits = ['px','%','deg','rad','em','rem','vh','vw'];
    var theUnit;
    for (var mIndex=0; mIndex<mUnits.length; mIndex++) {
      if ( typeof dimValue === 'string' && dimValue.includes(mUnits[mIndex]) ) {
        theUnit = mUnits[mIndex]; break;
      }
    }
    theUnit = theUnit !== undefined ? theUnit : (isAngle ? 'deg' : 'px');
    return { v: intValue, u: theUnit };
  }

  function numbers(a, b, v) {
    a = +a; b -= a; return a + b * v;
  }

  function boxModelOnStart(tweenProp){
    if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = (v > 0.99 || v < 0.01 ? ((numbers(a,b,v)*10)>>0)/10 : (numbers(a,b,v) ) >> 0) + "px";
      };
    }
  }

  function getBoxModel(tweenProp){
    return getStyleForProperty(this.element,tweenProp) || defaultValues[tweenProp];
  }
  function prepareBoxModel(tweenProp,value){
    var boxValue = trueDimension(value), offsetProp = tweenProp === 'height' ? 'offsetHeight' : 'offsetWidth';
    return boxValue.u === '%' ? boxValue.v * this.element[offsetProp] / 100 : boxValue.v;
  }
  var essentialBoxProps = ['top','left','width','height'];
  var essentialBoxPropsValues = {top:0,left:0,width:0,height:0};
  var essentialBoxOnStart = {};
  essentialBoxProps.map(function (x){ return essentialBoxOnStart[x] = boxModelOnStart; });
  var essentialBoxModelFunctions = {
    prepareStart: getBoxModel,
    prepareProperty: prepareBoxModel,
    onStart: essentialBoxOnStart
  };
  var essentialBoxModel = {
    component: 'essentialBoxModel',
    category: 'boxModel',
    properties: essentialBoxProps,
    defaultValues: essentialBoxPropsValues,
    Interpolate: {numbers: numbers},
    functions: essentialBoxModelFunctions,
    Util:{trueDimension: trueDimension}
  };
  Components.BoxModelEssential = essentialBoxModel;

  function hexToRGB (hex) {
    var hexShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(hexShorthand, function (m, r, g, b) { return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function trueColor (colorString) {
    if (/rgb|rgba/.test(colorString)) {
      var vrgb = colorString.replace(/\s|\)/,'').split('(')[1].split(','),
          colorAlpha = vrgb[3] ? vrgb[3] : null;
      if (!colorAlpha) {
        return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]) };
      } else {
        return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]), a: parseFloat(colorAlpha) };
      }
    } else if (/^#/.test(colorString)) {
      var fromHex = hexToRGB(colorString); return { r: fromHex.r, g: fromHex.g, b: fromHex.b };
    } else if (/transparent|none|initial|inherit/.test(colorString)) {
      return { r: 0, g: 0, b: 0, a: 0 };
    } else if (!/^#|^rgb/.test(colorString) ) {
      var siteHead = document.getElementsByTagName('head')[0]; siteHead.style.color = colorString;
      var webColor = getComputedStyle(siteHead,null).color; webColor = /rgb/.test(webColor) ? webColor.replace(/[^\d,]/g, '').split(',') : [0,0,0];
      siteHead.style.color = ''; return { r: parseInt(webColor[0]), g: parseInt(webColor[1]), b: parseInt(webColor[2]) };
    }
  }

  function colors(a, b, v) {
    var _c = {},
        c,
        ep = ')',
        cm =',',
        rgb = 'rgb(',
        rgba = 'rgba(';
    for (c in b) { _c[c] = c !== 'a' ? (numbers(a[c],b[c],v)>>0 || 0) : (a[c] && b[c]) ? (numbers(a[c],b[c],v) * 100 >> 0 )/100 : null; }
    return !_c.a ? rgb + _c.r + cm + _c.g + cm + _c.b + ep : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
  }

  function onStartColors(tweenProp){
    if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = colors(a,b,v);
      };
    }
  }

  var supportedColors = ['color', 'backgroundColor','borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'];
  var defaultColors = {};
  supportedColors.map(function (tweenProp) {
    defaultColors[tweenProp] = '#000';
  });
  var colorsOnStart = {};
  supportedColors.map(function (x) { return colorsOnStart[x] = onStartColors; });
  function getColor(prop,value) {
    return getStyleForProperty(this.element,prop) || defaultValues[prop];
  }
  function prepareColor(prop,value) {
    return trueColor(value);
  }
  var colorFunctions = {
    prepareStart: getColor,
    prepareProperty: prepareColor,
    onStart: colorsOnStart
  };
  var colorProperties = {
    component: 'colorProperties',
    category: 'colors',
    properties: supportedColors,
    defaultValues: defaultColors,
    Interpolate: {numbers: numbers,colors: colors},
    functions: colorFunctions,
    Util: {trueColor: trueColor}
  };
  Components.ColorProperties = colorProperties;

  var attributes = {};
  var onStartAttr = {
    attr : function(tweenProp){
      if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
        KUTE[tweenProp] = function (elem, vS, vE, v) {
          for ( var oneAttr in vE ){
            KUTE.attributes[oneAttr](elem,oneAttr,vS[oneAttr],vE[oneAttr],v);
          }
        };
      }
    },
    attributes : function(tweenProp){
      if (!KUTE[tweenProp] && this.valuesEnd.attr) {
        KUTE[tweenProp] = attributes;
      }
    }
  };

  var ComponentName = 'htmlAttributes';
  var svgColors = ['fill','stroke','stop-color'];
  function replaceUppercase (a) { return a.replace(/[A-Z]/g, "-$&").toLowerCase(); }
  function getAttr(tweenProp,value){
    var attrStartValues = {};
    for (var attr in value){
      var attribute = replaceUppercase(attr).replace(/_+[a-z]+/,'');
      var currentValue = this.element.getAttribute(attribute);
      attrStartValues[attribute] = svgColors.includes(attribute) ? (currentValue || 'rgba(0,0,0,0)') : (currentValue || (/opacity/i.test(attr) ? 1 : 0));
    }
    return attrStartValues;
  }
  function prepareAttr(tweenProp,attrObj){
    var attributesObject = {};
    for ( var p in attrObj ) {
      var prop = replaceUppercase(p);
      var regex = /(%|[a-z]+)$/;
      var currentValue = this.element.getAttribute(prop.replace(/_+[a-z]+/,''));
      if ( !svgColors.includes(prop)) {
        if ( currentValue !== null && regex.test(currentValue) ) {
          var unit = trueDimension(currentValue).u || trueDimension(attrObj[p]).u;
          var suffix = /%/.test(unit) ? '_percent' : ("_" + unit);
          onStart[ComponentName][prop+suffix] = function(tp) {
            if ( this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes) ) {
              attributes[tp] = function (elem, p, a, b, v) {
                var _p = p.replace(suffix,'');
                elem.setAttribute(_p, ( (numbers(a.v,b.v,v)*1000>>0)/1000) + b.u );
              };
            }
          };
          attributesObject[prop+suffix] = trueDimension(attrObj[p]);
        } else if ( !regex.test(attrObj[p]) || currentValue === null || currentValue !== null && !regex.test(currentValue) ) {
          onStart[ComponentName][prop] = function(tp) {
            if ( this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes) ) {
              attributes[tp] = function (elem, oneAttr, a, b, v) {
                elem.setAttribute(oneAttr, (numbers(a,b,v) * 1000 >> 0) / 1000 );
              };
            }
          };
          attributesObject[prop] = parseFloat(attrObj[p]);
        }
      } else {
        onStart[ComponentName][prop] = function(tp) {
          if ( this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes) ) {
            attributes[tp] = function (elem, oneAttr, a, b, v) {
              elem.setAttribute(oneAttr, colors(a,b,v));
            };
          }
        };
        attributesObject[prop] = trueColor(attrObj[p]) || defaultValues.htmlAttributes[p];
      }
    }
    return attributesObject;
  }
  var attrFunctions = {
    prepareStart: getAttr,
    prepareProperty: prepareAttr,
    onStart: onStartAttr
  };
  var htmlAttributes = {
    component: ComponentName,
    property: 'attr',
    subProperties: ['fill','stroke','stop-color','fill-opacity','stroke-opacity'],
    defaultValue: {fill : 'rgb(0,0,0)', stroke: 'rgb(0,0,0)', 'stop-color': 'rgb(0,0,0)', opacity: 1, 'stroke-opacity': 1,'fill-opacity': 1},
    Interpolate: { numbers: numbers,colors: colors },
    functions: attrFunctions,
    Util: { replaceUppercase: replaceUppercase, trueColor: trueColor, trueDimension: trueDimension }
  };
  Components.HTMLAttributes = htmlAttributes;

  function onStartOpacity(tweenProp){
    if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = ((numbers(a,b,v) * 1000)>>0)/1000;
      };
    }
  }

  function getOpacity(tweenProp){
    return getStyleForProperty(this.element,tweenProp)
  }
  function prepareOpacity(tweenProp,value){
    return parseFloat(value);
  }
  var opacityFunctions = {
    prepareStart: getOpacity,
    prepareProperty: prepareOpacity,
    onStart: onStartOpacity
  };
  var opacityProperty = {
    component: 'opacityProperty',
    property: 'opacity',
    defaultValue: 1,
    Interpolate: {numbers: numbers},
    functions: opacityFunctions
  };
  Components.OpacityProperty = opacityProperty;

  var lowerCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").split(""),
      upperCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").toUpperCase().split(""),
      nonAlpha = String("~!@#$%^&*()_+{}[];'<>,./?\=-").split(""),
      numeric = String("0123456789").split(""),
      alphaNumeric = lowerCaseAlpha.concat(upperCaseAlpha,numeric),
      allTypes = alphaNumeric.concat(nonAlpha);
  var charSet = {
    alpha: lowerCaseAlpha,
    upper: upperCaseAlpha,
    symbols: nonAlpha,
    numeric: numeric,
    alphanumeric: alphaNumeric,
    all: allTypes,
  };
  var onStartWrite = {
    text: function(tweenProp){
      if ( !KUTE[tweenProp] && this.valuesEnd[tweenProp] ) {
        var chars = this._textChars,
            charsets = chars in charSet ? charSet[chars]
                    : chars && chars.length ? chars
                    : charSet[defaultOptions.textChars];
        KUTE[tweenProp] = function(elem,a,b,v) {
          var initialText = '',
              endText = '',
              firstLetterA = a.substring(0),
              firstLetterB = b.substring(0),
              pointer = charsets[(Math.random() * charsets.length)>>0];
          if (a === ' ') {
            endText         = firstLetterB.substring(Math.min(v * firstLetterB.length, firstLetterB.length)>>0, 0 );
            elem.innerHTML = v < 1 ? ( ( endText + pointer  ) ) : (b === '' ? ' ' : b);
          } else if (b === ' ') {
            initialText     = firstLetterA.substring(0, Math.min((1-v) * firstLetterA.length, firstLetterA.length)>>0 );
            elem.innerHTML = v < 1 ? ( ( initialText + pointer  ) ) : (b === '' ? ' ' : b);
          } else {
            initialText     = firstLetterA.substring(firstLetterA.length, Math.min(v * firstLetterA.length, firstLetterA.length)>>0 );
            endText         = firstLetterB.substring(0,                   Math.min(v * firstLetterB.length, firstLetterB.length)>>0 );
            elem.innerHTML = v < 1 ? ( (endText + pointer + initialText) ) : (b === '' ? ' ' : b);
          }
        };
      }
    },
    number: function(tweenProp) {
      if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
        KUTE[tweenProp] = function (elem, a, b, v) {
          elem.innerHTML = numbers(a, b, v)>>0;
        };
      }
    }
  };

  function wrapContentsSpan(el,classNAME){
    var textWriteWrapper;
    var newElem;
    if ( typeof(el) === 'string' ) {
      newElem = document.createElement('SPAN');
      newElem.innerHTML = el;
      newElem.className = classNAME;
      return newElem
    } else if (!el.children.length || el.children.length && el.children[0].className !== classNAME ) {
      var elementInnerHTML = el.innerHTML;
      textWriteWrapper = document.createElement('SPAN');
      textWriteWrapper.className = classNAME;
      textWriteWrapper.innerHTML = elementInnerHTML;
      el.appendChild(textWriteWrapper);
      el.innerHTML = textWriteWrapper.outerHTML;
    } else if (el.children.length && el.children[0].className === classNAME){
      textWriteWrapper = el.children[0];
    }
    return textWriteWrapper
  }
  function getTextPartsArray(el,classNAME){
    var elementsArray = [];
    if (el.children.length) {
      var textParts = [];
      var remainingMarkup = el.innerHTML;
      var wrapperParts;
      for ( var i=0, l = el.children.length, currentChild = (void 0), childOuter = (void 0), unTaggedContent = (void 0); i<l; i++) {
        currentChild = el.children[i];
        childOuter = currentChild.outerHTML;
        wrapperParts = remainingMarkup.split(childOuter);
        if (wrapperParts[0] !== '') {
          unTaggedContent = wrapContentsSpan(wrapperParts[0],classNAME);
          textParts.push( unTaggedContent );
          remainingMarkup = remainingMarkup.replace(wrapperParts[0],'');
        } else if (wrapperParts[1] !== '') {
          unTaggedContent = wrapContentsSpan(wrapperParts[1].split('<')[0],classNAME);
          textParts.push( unTaggedContent );
          remainingMarkup = remainingMarkup.replace(wrapperParts[0].split('<')[0],'');
        }
        !currentChild.classList.contains(classNAME) && currentChild.classList.add(classNAME);
        textParts.push( currentChild );
        remainingMarkup = remainingMarkup.replace(childOuter,'');
      }
      if (remainingMarkup!==''){
        var unTaggedRemaining = wrapContentsSpan(remainingMarkup,classNAME);
        textParts.push( unTaggedRemaining );
      }
      elementsArray = elementsArray.concat(textParts);
    } else {
      elementsArray = elementsArray.concat([wrapContentsSpan(el,classNAME)]);
    }
    return elementsArray
  }
  function setSegments(target,newText){
    var oldTargetSegs = getTextPartsArray( target,'text-part');
    var newTargetSegs = getTextPartsArray( wrapContentsSpan( newText ), 'text-part' );
    target.innerHTML = '';
    target.innerHTML += oldTargetSegs.map(function (s){ s.className += ' oldText'; return s.outerHTML }).join('');
    target.innerHTML += newTargetSegs.map(function (s){ s.className += ' newText'; return s.outerHTML.replace(s.innerHTML,'') }).join('');
    return [oldTargetSegs,newTargetSegs]
  }
  function createTextTweens(target,newText,options){
    if (target.playing) { return; }
    options = options || {};
    options.duration = options.duration === 'auto' ? 'auto' : isFinite(options.duration*1) ? options.duration*1 : 1000;
    var segs = setSegments(target,newText);
    var oldTargetSegs = segs[0];
    var newTargetSegs = segs[1];
    var oldTargets = [].slice.call(target.getElementsByClassName('oldText')).reverse();
    var newTargets = [].slice.call(target.getElementsByClassName('newText'));
    var textTween = [], totalDelay = 0;
    textTween = textTween.concat(oldTargets.map(function (el,i) {
      options.duration = options.duration === 'auto' ? oldTargetSegs[i].innerHTML.length * 75 : options.duration;
      options.delay = totalDelay;
      options.onComplete = null;
      totalDelay += options.duration;
      return new connect.tween(el, {text:el.innerHTML}, {text:''}, options );
    }));
    textTween = textTween.concat(newTargets.map(function (el,i){
      var onComplete = function () {target.innerHTML = newText, target.playing = false;};
      options.duration = options.duration === 'auto' ? newTargetSegs[i].innerHTML.length * 75 : options.duration;
      options.delay = totalDelay;
      options.onComplete = i === newTargetSegs.length-1 ? onComplete : null;
      totalDelay += options.duration;
      return new connect.tween(el, {text:''}, {text:newTargetSegs[i].innerHTML}, options );
    }));
    textTween.start = function(){
      !target.playing && textTween.map(function (tw){ return tw.start(); }) && (target.playing = true);
    };
    return textTween
  }
  function getWrite(tweenProp,value){
    return this.element.innerHTML;
  }
  function prepareText(tweenProp,value) {
    if( tweenProp === 'number' ) {
      return parseFloat(value)
    } else {
      return value === '' ? ' ' : value
    }
  }
  var textWriteFunctions = {
    prepareStart: getWrite,
    prepareProperty: prepareText,
    onStart: onStartWrite
  };
  var textWrite = {
    component: 'textWriteProperties',
    category: 'textWrite',
    properties: ['text','number'],
    defaultValues: {text: ' ',numbers:'0'},
    defaultOptions: { textChars: 'alpha' },
    Interpolate: {numbers: numbers},
    functions: textWriteFunctions,
    Util: { charSet: charSet, createTextTweens: createTextTweens }
  };
  Components.TextWriteProperties = textWrite;

  function perspective(a, b, u, v) {
    return ("perspective(" + (((a + (b - a) * v) * 1000 >> 0 ) / 1000) + u + ")")
  }

  function translate3d(a, b, u, v) {
    var translateArray = [];
    for (var ax=0; ax<3; ax++){
      translateArray[ax] = ( a[ax]||b[ax] ? ( (a[ax] + ( b[ax] - a[ax] ) * v ) * 1000 >> 0 ) / 1000 : 0 ) + u;
    }
    return ("translate3d(" + (translateArray.join(',')) + ")");
  }

  function rotate3d(a, b, u, v) {
    var rotateStr = '';
    rotateStr += a[0]||b[0] ? ("rotateX(" + (((a[0] + (b[0] - a[0]) * v) * 1000 >> 0 ) / 1000) + u + ")") : '';
    rotateStr += a[1]||b[1] ? ("rotateY(" + (((a[1] + (b[1] - a[1]) * v) * 1000 >> 0 ) / 1000) + u + ")") : '';
    rotateStr += a[2]||b[2] ? ("rotateZ(" + (((a[2] + (b[2] - a[2]) * v) * 1000 >> 0 ) / 1000) + u + ")") : '';
    return rotateStr
  }

  function translate(a, b, u, v) {
    var translateArray = [];
    translateArray[0] = ( a[0]===b[0] ? b[0] : ( (a[0] + ( b[0] - a[0] ) * v ) * 1000 >> 0 ) / 1000 ) + u;
    translateArray[1] = a[1]||b[1] ? (( a[1]===b[1] ? b[1] : ( (a[1] + ( b[1] - a[1] ) * v ) * 1000 >> 0 ) / 1000 ) + u) : '0';
    return ("translate(" + (translateArray.join(',')) + ")");
  }

  function rotate(a, b, u, v) {
    return ("rotate(" + (((a + (b - a) * v) * 1000 >> 0 ) / 1000) + u + ")")
  }

  function scale(a, b, v) {
    return ("scale(" + (((a + (b - a) * v) * 1000 >> 0 ) / 1000) + ")");
  }

  function skew(a, b, u, v) {
    var skewArray = [];
    skewArray[0] = ( a[0]===b[0] ? b[0] : ( (a[0] + ( b[0] - a[0] ) * v ) * 1000 >> 0 ) / 1000 ) + u;
    skewArray[1] = a[1]||b[1] ? (( a[1]===b[1] ? b[1] : ( (a[1] + ( b[1] - a[1] ) * v ) * 1000 >> 0 ) / 1000 ) + u) : '0';
    return ("skew(" + (skewArray.join(',')) + ")");
  }

  function onStartTransform(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] =
            (a.perspective||b.perspective ? perspective(a.perspective,b.perspective,'px',v) : '')
          + (a.translate3d ? translate3d(a.translate3d,b.translate3d,'px',v):'')
          + (a.rotate3d ? rotate3d(a.rotate3d,b.rotate3d,'deg',v):'')
          + (a.skew ? skew(a.skew,b.skew,'deg',v):'')
          + (a.scale||b.scale ? scale(a.scale,b.scale,v):'');
      };
    }
  }

  function getTransform(tweenProperty,value){
    var currentStyle = getInlineStyle(this.element);
    return currentStyle[tweenProperty] ? currentStyle[tweenProperty] : defaultValues[tweenProperty];
  }
  function prepareTransform(prop,obj){
    var prepAxis = ['X', 'Y', 'Z'],
        transformObject = {},
        translateArray = [], rotateArray = [], skewArray = [],
        arrayFunctions = ['translate3d','translate','rotate3d','skew'];
    for (var x in obj) {
      var pv = typeof obj[x] === 'object' && obj[x].length ? obj[x].map(function (v){ return parseInt(v); }) : parseInt(obj[x]);
      if (arrayFunctions.includes(x)) {
        var propId = x === 'translate' || x === 'rotate' ? (x + "3d") : x;
        transformObject[propId] = x === 'skew' ? (pv.length ? [pv[0]||0, pv[1]||0] : [pv||0,0] )
                                : x === 'translate' ? (pv.length ? [pv[0]||0, pv[1]||0, pv[2]||0] : [pv||0,0,0] )
                                : [pv[0]||0, pv[1]||0,pv[2]||0];
      } else if ( /[XYZ]/.test(x) ) {
        var fn = x.replace(/[XYZ]/,''),
            fnId = fn === 'skew' ? fn : (fn + "3d"),
            fnLen = fn === 'skew' ? 2 : 3,
            fnArray = fn === 'translate' ? translateArray
                    : fn === 'rotate' ? rotateArray
                    : fn === 'skew' ? skewArray : {};
        for (var fnIndex = 0; fnIndex < fnLen; fnIndex++) {
          var fnAxis = prepAxis[fnIndex];
          fnArray[fnIndex] = (("" + fn + fnAxis) in obj) ? parseInt(obj[("" + fn + fnAxis)]) : 0;
        }
        transformObject[fnId] = fnArray;
      } else if (x==='rotate') {
        transformObject['rotate3d'] = [0,0,pv];
      } else {
        transformObject[x] = x === 'scale' ? parseFloat(obj[x]) : pv;
      }
    }
    return transformObject;
  }
  function crossCheckTransform(tweenProp){
    if (this.valuesEnd[tweenProp]) {
      if ( this.valuesEnd[tweenProp] ) {
        if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective){
          this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
        }
      }
    }
  }
  var transformFunctions = {
    prepareStart: getTransform,
    prepareProperty: prepareTransform,
    onStart: onStartTransform,
    crossCheck: crossCheckTransform
  };
  var supportedTransformProperties = [
    'perspective',
    'translate3d', 'translateX', 'translateY', 'translateZ', 'translate',
    'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'rotate',
    'skewX', 'skewY', 'skew',
    'scale'
  ];
  var defaultTransformValues = {
    perspective: 400,
    translate3d : [0,0,0], translateX : 0, translateY : 0, translateZ : 0, translate : [0,0],
    rotate3d: [0,0,0], rotateX : 0, rotateY : 0, rotateZ : 0, rotate : 0,
    skewX : 0, skewY : 0, skew: [0,0],
    scale : 1
  };
  var transformFunctionsComponent = {
    component: 'transformFunctions',
    property: 'transform',
    subProperties: supportedTransformProperties,
    defaultValues: defaultTransformValues,
    functions: transformFunctions,
    Interpolate: {
      perspective: perspective,
      translate3d: translate3d,
      rotate3d: rotate3d,
      translate: translate, rotate: rotate, scale: scale, skew: skew
    }
  };
  Components.TransformFunctions = transformFunctionsComponent;

  function onStartDraw(tweenProp){
    if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem,a,b,v) {
        var pathLength = (a.l*100>>0)/100,
          start = (numbers(a.s,b.s,v)*100>>0)/100,
          end = (numbers(a.e,b.e,v)*100>>0)/100,
          offset = 0 - start,
          dashOne = end+offset;
        elem.style.strokeDashoffset = offset + "px";
        elem.style.strokeDasharray = (((dashOne <1 ? 0 : dashOne)*100>>0)/100) + "px, " + pathLength + "px";
      };
    }
  }

  function percent (v,l) {
    return parseFloat(v) / 100 * l
  }
  function getRectLength(el) {
    var w = el.getAttribute('width'),
        h = el.getAttribute('height');
    return (w*2)+(h*2);
  }
  function getPolyLength(el) {
    var points = el.getAttribute('points').split(' ');
    var len = 0;
    if (points.length > 1) {
      var coord = function (p) {
        var c = p.split(',');
        if (c.length != 2) { return; }
        if (isNaN(c[0]) || isNaN(c[1])) { return; }
        return [parseFloat(c[0]), parseFloat(c[1])];
      };
      var dist = function (c1, c2) {
        if (c1 != undefined && c2 != undefined) {
          return Math.sqrt(Math.pow( (c2[0] - c1[0]), 2 ) + Math.pow( (c2[1] - c1[1]), 2 ));
        }
        return 0;
      };
      if (points.length > 2) {
        for (var i=0; i<points.length-1; i++) {
          len += dist(coord(points[i]), coord(points[i+1]));
        }
      }
      len += el.tagName === 'polygon' ? dist(coord(points[0]), coord(points[points.length - 1])) : 0;
    }
    return len;
  }
  function getLineLength(el) {
    var x1 = el.getAttribute('x1');
    var x2 = el.getAttribute('x2');
    var y1 = el.getAttribute('y1');
    var y2 = el.getAttribute('y2');
    return Math.sqrt(Math.pow( (x2 - x1), 2 )+Math.pow( (y2 - y1), 2 ));
  }
  function getCircleLength(el) {
    var r = el.getAttribute('r');
    return 2 * Math.PI * r;
  }
  function getEllipseLength(el) {
    var rx = el.getAttribute('rx'), ry = el.getAttribute('ry'), len = 2*rx, wid = 2*ry;
    return ((Math.sqrt(.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
  }
  function getTotalLength(el) {
    if (/rect/.test(el.tagName)) {
      return getRectLength(el);
    } else if (/circle/.test(el.tagName)) {
      return getCircleLength(el);
    } else if (/ellipse/.test(el.tagName)) {
      return getEllipseLength(el);
    } else if (/polygon|polyline/.test(el.tagName)) {
      return getPolyLength(el);
    } else if (/line/.test(el.tagName)) {
      return getLineLength(el);
    }
  }
  function getDraw(e,v) {
    var length = /path|glyph/.test(e.tagName) ? e.getTotalLength() : getTotalLength(e),
        start, end, d, o;
    if ( v instanceof Object ) {
      return v;
    } else if (typeof v === 'string') {
      v = v.split(/\,|\s/);
      start = /%/.test(v[0]) ? percent(v[0].trim(),length) : parseFloat(v[0]);
      end = /%/.test(v[1]) ? percent(v[1].trim(),length) : parseFloat(v[1]);
    } else if (typeof v === 'undefined') {
      o = parseFloat(getStyleForProperty(e,'stroke-dashoffset'));
      d = getStyleForProperty(e,'stroke-dasharray').split(/\,/);
      start = 0-o;
      end = parseFloat(d[0]) + start || length;
    }
    return { s: start, e: end, l: length };
  }
  function resetDraw(elem) {
    elem.style.strokeDashoffset = "";
    elem.style.strokeDasharray = "";
  }
  function getDrawValue(){
    return getDraw(this.element);
  }
  function prepareDraw(a,o){
    return getDraw(this.element,o);
  }
  var svgDrawFunctions = {
    prepareStart: getDrawValue,
    prepareProperty: prepareDraw,
    onStart: onStartDraw
  };
  var svgDraw = {
    component: 'svgDraw',
    property: 'draw',
    defaultValue: '0% 0%',
    Interpolate: {numbers: numbers},
    functions: svgDrawFunctions,
    Util: {
      getRectLength: getRectLength,
      getPolyLength: getPolyLength,
      getLineLength: getLineLength,
      getCircleLength: getCircleLength,
      getEllipseLength: getEllipseLength,
      getTotalLength: getTotalLength,
      resetDraw: resetDraw,
      getDraw: getDraw,
      percent: percent
    }
  };
  Components.SVGDraw = svgDraw;

  function coords(a, b, l, v) {
    var points = [];
    for(var i=0;i<l;i++) {
      points[i] = [];
      for(var j=0;j<2;j++) {
        points[i].push( ((a[i][j]+(b[i][j]-a[i][j])*v) * 1000 >> 0)/1000 );
      }
    }
    return points;
  }

  function onStartSVGMorph(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        var path1 = a.pathArray, path2 = b.pathArray, len = path2.length;
        elem.setAttribute("d", (v === 1 ? b.original : ("M" + (coords( path1, path2, len, v ).join('L')) + "Z")) );
      };
    }
  }

  function clonePath(pathArray){
    return pathArray.map(function (x) { return Array.isArray(x) ? clonePath(x) : !isNaN(+x) ? +x : x; } )
  }

  var SVGPathCommanderOptions = {
    decimals:3,
    round:1
  };

  function roundPath(pathArray) {
    return     pathArray.map( function (seg) { return seg.map(function (c,i) {
          var nr = +c, dc = Math.pow(10,SVGPathCommanderOptions.decimals);
          return i ? (nr % 1 === 0 ? nr : (nr*dc>>0)/dc) : c
        }
      ); }) 
  }

  function SVGPathArray(pathString){
    this.segments = [];
    this.pathValue = pathString;
    this.max = pathString.length;
    this.index  = 0;
    this.param = 0.0;
    this.segmentStart = 0;
    this.data = [];
    this.err = '';
    return this
  }

  var paramsCount = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

  function finalizeSegment(state) {
    var cmd = state.pathValue[state.segmentStart], cmdLC = cmd.toLowerCase(), params = state.data;
    if (cmdLC === 'm' && params.length > 2) {
      state.segments.push([ cmd, params[0], params[1] ]);
      params = params.slice(2);
      cmdLC = 'l';
      cmd = (cmd === 'm') ? 'l' : 'L';
    }
    if (cmdLC === 'r') {
      state.segments.push([ cmd ].concat(params));
    } else {
      while (params.length >= paramsCount[cmdLC]) {
        state.segments.push([ cmd ].concat(params.splice(0, paramsCount[cmdLC])));
        if (!paramsCount[cmdLC]) {
          break;
        }
      }
    }
  }

  var invalidPathValue = 'Invalid path value';

  function scanFlag(state) {
    var ch = state.pathValue.charCodeAt(state.index);
    if (ch === 0x30) {
      state.param = 0;
      state.index++;
      return;
    }
    if (ch === 0x31) {
      state.param = 1;
      state.index++;
      return;
    }
    state.err = invalidPathValue;
  }

  function isDigit(code) {
    return (code >= 48 && code <= 57);
  }

  function scanParam(state) {
    var start = state.index,
        index = start,
        max = state.max,
        zeroFirst = false,
        hasCeiling = false,
        hasDecimal = false,
        hasDot = false,
        ch;
    if (index >= max) {
      state.err = invalidPathValue;
      return;
    }
    ch = state.pathValue.charCodeAt(index);
    if (ch === 0x2B || ch === 0x2D) {
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (!isDigit(ch) && ch !== 0x2E) {
      state.err = invalidPathValue;
      return;
    }
    if (ch !== 0x2E) {
      zeroFirst = (ch === 0x30);
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (zeroFirst && index < max) {
        if (ch && isDigit(ch)) {
          state.err = invalidPathValue;
          return;
        }
      }
      while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        index++;
        hasCeiling = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (ch === 0x2E) {
      hasDot = true;
      index++;
      while (isDigit(state.pathValue.charCodeAt(index))) {
        index++;
        hasDecimal = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (ch === 0x65 || ch === 0x45) {
      if (hasDot && !hasCeiling && !hasDecimal) {
        state.err = invalidPathValue;
        return;
      }
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (ch === 0x2B || ch === 0x2D) {
        index++;
      }
      if (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
          index++;
        }
      } else {
        state.err = invalidPathValue;
        return;
      }
    }
    state.index = index;
    state.param = +state.pathValue.slice(start, index);
  }

  function isCommand(code) {
    switch (code | 0x20) {
      case 0x6D:
      case 0x7A:
      case 0x6C:
      case 0x68:
      case 0x76:
      case 0x63:
      case 0x73:
      case 0x71:
      case 0x74:
      case 0x61:
      case 0x72:
        return true;
    }
    return false;
  }

  function isDigitStart(code) {
    return (code >= 48 && code <= 57) ||
            code === 0x2B ||
            code === 0x2D ||
            code === 0x2E;
  }

  function isArcCommand(code) {
    return (code | 0x20) === 0x61;
  }

  function isSpace(ch) {
    var specialSpaces = [
      0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
      0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF ];
    return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) ||
      (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
      (ch >= 0x1680 && specialSpaces.indexOf(ch) >= 0);
  }

  function skipSpaces(state) {
    while (state.index < state.max && isSpace(state.pathValue.charCodeAt(state.index))) {
      state.index++;
    }
  }

  function scanSegment(state) {
    var max = state.max, cmdCode, comma_found, need_params, i;
    state.segmentStart = state.index;
    cmdCode = state.pathValue.charCodeAt(state.index);
    if (!isCommand(cmdCode)) {
      state.err = invalidPathValue;
      return;
    }
    need_params = paramsCount[state.pathValue[state.index].toLowerCase()];
    state.index++;
    skipSpaces(state);
    state.data = [];
    if (!need_params) {
      finalizeSegment(state);
      return;
    }
    comma_found = false;
    for (;;) {
      for (i = need_params; i > 0; i--) {
        if (isArcCommand(cmdCode) && (i === 3 || i === 4)) { scanFlag(state); }
        else { scanParam(state); }
        if (state.err.length) {
          return;
        }
        state.data.push(state.param);
        skipSpaces(state);
        comma_found = false;
        if (state.index < max && state.pathValue.charCodeAt(state.index) === 0x2C) {
          state.index++;
          skipSpaces(state);
          comma_found = true;
        }
      }
      if (comma_found) {
        continue;
      }
      if (state.index >= state.max) {
        break;
      }
      if (!isDigitStart(state.pathValue.charCodeAt(state.index))) {
        break;
      }
    }
    finalizeSegment(state);
  }

  function isPathArray(pathArray){
    return Array.isArray(pathArray) && pathArray.every(function (x){
      var pathCommand = x[0].toLowerCase();
      return paramsCount[pathCommand] === x.length - 1 && /[achlmrqstvz]/g.test(pathCommand)
    })
  }

  function parsePathString(pathString) {
    if ( isPathArray(pathString) ) {
      return clonePath(pathString)
    }
    var state = new SVGPathArray(pathString), max = state.max;
    skipSpaces(state);
    while (state.index < max && !state.err.length) {
      scanSegment(state);
    }
    if (state.err.length) {
      state.segments = [];
    } else if (state.segments.length) {
      if ('mM'.indexOf(state.segments[0][0]) < 0) {
        state.err = invalidPathValue;
        state.segments = [];
      } else {
        state.segments[0][0] = 'M';
      }
    }
    return roundPath(state.segments)
  }

  function catmullRom2bezier(crp, z) {
    var d = [];
    for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
      var p = [
                {x: +crp[i - 2], y: +crp[i - 1]},
                {x: +crp[i],     y: +crp[i + 1]},
                {x: +crp[i + 2], y: +crp[i + 3]},
                {x: +crp[i + 4], y: +crp[i + 5]}
              ];
      if (z) {
        if (!i) {
          p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
        } else if (iLen - 4 == i) {
          p[3] = {x: +crp[0], y: +crp[1]};
        } else if (iLen - 2 == i) {
          p[2] = {x: +crp[0], y: +crp[1]};
          p[3] = {x: +crp[2], y: +crp[3]};
        }
      } else {
        if (iLen - 4 == i) {
          p[3] = p[2];
        } else if (!i) {
          p[0] = {x: +crp[i], y: +crp[i + 1]};
        }
      }
      d.push([
        "C",
        (-p[0].x + 6 * p[1].x + p[2].x) / 6,
        (-p[0].y + 6 * p[1].y + p[2].y) / 6,
        (p[1].x + 6 * p[2].x - p[3].x) / 6,
        (p[1].y + 6*p[2].y - p[3].y) / 6,
        p[2].x,
        p[2].y
      ]);
    }
    return d
  }

  function ellipsePath(x, y, rx, ry, a) {
    if (a == null && ry == null) {
      ry = rx;
    }
    x = +x;
    y = +y;
    rx = +rx;
    ry = +ry;
    var res;
    if (a != null) {
      var rad = Math.PI / 180,
          x1 = x + rx * Math.cos(-ry * rad),
          x2 = x + rx * Math.cos(-a * rad),
          y1 = y + rx * Math.sin(-ry * rad),
          y2 = y + rx * Math.sin(-a * rad);
      res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
    } else {
      res = [
          ["M", x, y],
          ["m", 0, -ry],
          ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
          ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
          ["z"]
      ];
    }
    return res;
  }

  function isAbsoluteArray(pathInput){
    return isPathArray(pathInput) && pathInput.every(function (x){ return x[0] === x[0].toUpperCase(); })
  }

  function pathToAbsolute(pathArray) {
    if (isAbsoluteArray(pathArray)) {
      return clonePath(pathArray)
    }
    pathArray = parsePathString(pathArray);
    var resultArray = [],
        x = 0, y = 0, mx = 0, my = 0,
        start = 0, ii = pathArray.length,
        crz = pathArray.length === 3 &&
              pathArray[0][0] === "M" &&
              pathArray[1][0].toUpperCase() === "R" &&
              pathArray[2][0].toUpperCase() === "Z";
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      resultArray[0] = ["M", x, y];
    }
    var loop = function ( i ) {
      var r = [], pa = pathArray[i], pa0 = pa[0], dots = [];
      resultArray.push(r = []);
      if (pa0 !== pa0.toUpperCase()) {
        r[0] = pa0.toUpperCase();
        switch (r[0]) {
          case "A":
            r[1] = pa[1];
            r[2] = pa[2];
            r[3] = pa[3];
            r[4] = pa[4];
            r[5] = pa[5];
            r[6] = +pa[6] + x;
            r[7] = +pa[7] + y;
            break;
          case "V":
            r[1] = +pa[1] + y;
            break;
          case "H":
            r[1] = +pa[1] + x;
            break;
          case "R":
            dots = [x, y].concat(pa.slice(1));
            for (var j = 2, jj = dots.length; j < jj; j++) {
              dots[j] = +dots[j] + x;
              dots[++j] = +dots[j] + y;
            }
            resultArray.pop();
            resultArray = resultArray.concat(catmullRom2bezier(dots, crz));
            break;
          case "O":
            resultArray.pop();
            dots = ellipsePath(x, y, +pa[1], +pa[2]);
            dots.push(dots[0]);
            resultArray = resultArray.concat(dots);
            break;
          case "U":
            resultArray.pop();
            resultArray = resultArray.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
            r = ["U"].concat(resultArray[resultArray.length - 1].slice(-2));
            break;
          case "M":
            mx = +pa[1] + x;
            my = +pa[2] + y;
          default:
            for (var k = 1, kk = pa.length; k < kk; k++) {
              r[k] = +pa[k] + ((k % 2) ? x : y);
            }
        }
      } else if (pa0 === "R") {
        dots = [x, y].concat(pa.slice(1));
        resultArray.pop();
        resultArray = resultArray.concat(catmullRom2bezier(dots, crz));
        r = ["R"].concat(pa.slice(-2));
      } else if (pa0 === "O") {
        resultArray.pop();
        dots = ellipsePath(x, y, +pa[1], +pa[2]);
        dots.push(dots[0]);
        resultArray = resultArray.concat(dots);
      } else if (pa0 === "U") {
        resultArray.pop();
        resultArray = resultArray.concat(ellipsePath(x, y, +pa[1], +pa[2], +pa[3]));
        r = ["U"].concat(resultArray[resultArray.length - 1].slice(-2));
      } else {
        pa.map(function (k){ return r.push(k); });
      }
      pa0 = pa0.toUpperCase();
      if (pa0 !== "O") {
        switch (r[0]) {
          case "Z":
            x = mx;
            y = my;
            break;
          case "H":
            x = +r[1];
            break;
          case "V":
            y = +r[1];
            break;
          case "M":
            mx = +r[r.length - 2];
            my = +r[r.length - 1];
          default:
            x = +r[r.length - 2];
            y = +r[r.length - 1];
        }
      }
    };
    for (var i = start; i < ii; i++) loop( i );
    return roundPath(resultArray)
  }

  function pathToString(pathArray) {
    return pathArray.map(function (x){ return x[0].concat(x.slice(1).join(' ')); }).join(' ')
  }

  function splitPath(pathString) {
    return pathString
      .replace( /(m|M)/g, "|$1")
      .split('|')
      .map(function (s){ return s.trim(); })
      .filter(function (s){ return s; })
  }

  function createPath(path) {
    var np = document.createElementNS('http://www.w3.org/2000/svg','path'),
        d = path instanceof SVGElement && ['path','glyph'].indexOf(path.tagName) > -1 ? path.getAttribute('d') : path;
    np.setAttribute('d',d);
    return np
  }

  function polygonArea(polygon) {
    var i = -1,
        n = polygon.length,
        a,
        b = polygon[n - 1],
        area = 0;
    while (++i < n) {
      a = b;
      b = polygon[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area / 2;
  }

  function polygonLength(polygon) {
    var i = -1,
        n = polygon.length,
        b = polygon[n - 1],
        xa,
        ya,
        xb = b[0],
        yb = b[1],
        perimeter = 0;
    while (++i < n) {
      xa = xb;
      ya = yb;
      b = polygon[i];
      xb = b[0];
      yb = b[1];
      xa -= xb;
      ya -= yb;
      perimeter += Math.hypot(xa, ya);
    }
    return perimeter;
  }

  function isFiniteNumber(number) {
    return typeof number === "number" && isFinite(number);
  }
  function distanceSquareRoot(a, b) {
    return Math.sqrt(
      (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
    );
  }
  function pointAlong(a, b, pct) {
    return [a[0] + (b[0] - a[0]) * pct, a[1] + (b[1] - a[1]) * pct];
  }
  function samePoint(a, b) {
    return distanceSquareRoot(a, b) < 1e-9;
  }
  function pathStringToRing(str, maxSegmentLength) {
    var parsed = pathToAbsolute(str);
    return exactRing(parsed) || approximateRing(parsed, maxSegmentLength);
  }
  function exactRing(segments) {
    var ring = [];
    if (!segments.length || segments[0][0] !== "M") {
      return false;
    }
    for (var i = 0; i < segments.length; i++) {
      var ref = segments[i];
      var command = ref[0];
      var x = ref[1];
      var y = ref[2];
      if ((command === "M" && i) || command === "Z") {
        break;
      } else if (command === "M" || command === "L") {
        ring.push([x, y]);
      } else if (command === "H") {
        ring.push([x, ring[ring.length - 1][1]]);
      } else if (command === "V") {
        ring.push([ring[ring.length - 1][0], x]);
      } else {
        return false;
      }
    }
    return ring.length ? { ring: ring } : false;
  }
  function approximateRing(parsed, maxSegmentLength) {
    var ringPath = splitPath(pathToString(parsed))[0],
        ring = [], len, testPath, numPoints = 3;
    if (!ringPath) {
      throw (invalidPathValue);
    }
    testPath = createPath(ringPath);
    len = testPath.getTotalLength();
    if (
      maxSegmentLength &&
      isFiniteNumber(maxSegmentLength) &&
      maxSegmentLength > 0
    ) {
      numPoints = Math.max(numPoints, Math.ceil(len / maxSegmentLength));
    }
    for (var i = 0; i < numPoints; i++) {
      var p = testPath.getPointAtLength((len * i) / numPoints);
      ring.push([p.x, p.y]);
    }
    return {
      ring: ring,
      skipBisect: true
    };
  }
  function rotateRing(ring, vs) {
    var len = ring.length, min = Infinity, bestOffset, sumOfSquares, spliced;
    var loop = function ( offset ) {
      sumOfSquares = 0;
      vs.forEach(function(p, i) {
        var d = distanceSquareRoot(ring[(offset + i) % len], p);
        sumOfSquares += d * d;
      });
      if (sumOfSquares < min) {
        min = sumOfSquares;
        bestOffset = offset;
      }
    };
    for (var offset = 0; offset < len; offset++) loop( offset );
    if (bestOffset) {
      spliced = ring.splice(0, bestOffset);
      ring.splice.apply(ring, [ ring.length, 0 ].concat( spliced ));
    }
  }
  function addPoints(ring, numPoints) {
    var desiredLength = ring.length + numPoints,
          step = polygonLength(ring) / numPoints;
    var i = 0, cursor = 0, insertAt = step / 2;
    while (ring.length < desiredLength) {
      var a = ring[i], b = ring[(i + 1) % ring.length], segment = distanceSquareRoot(a, b);
      if (insertAt <= cursor + segment) {
        ring.splice( i + 1, 0, segment ? pointAlong(a, b, (insertAt - cursor) / segment) : a.slice(0) );
        insertAt += step;
        continue;
      }
      cursor += segment;
      i++;
    }
  }
  function bisect(ring, maxSegmentLength) {
    if ( maxSegmentLength === void 0 ) maxSegmentLength = Infinity;
    for (var i = 0; i < ring.length; i++) {
      var a = ring[i], b = i === ring.length - 1 ? ring[0] : ring[i + 1];
      while (distanceSquareRoot(a, b) > maxSegmentLength) {
        b = pointAlong(a, b, 0.5);
        ring.splice(i + 1, 0, b);
      }
    }
  }
  function normalizeRing(ring, maxSegmentLength) {
    var points, area, skipBisect;
    if (typeof ring === "string") {
      var converted = pathStringToRing(ring, maxSegmentLength);
      ring = converted.ring;
      skipBisect = converted.skipBisect;
    } else if (!Array.isArray(ring)) {
      throw (invalidPathValue);
    }
    points = ring.slice(0);
    if (!validRing(points)) {
      throw (invalidPathValue);
    }
    if (points.length > 1 && samePoint(points[0], points[points.length - 1])) {
      points.pop();
    }
    area = polygonArea(points);
    if (area > 0) {
      points.reverse();
    }
    if (
      !skipBisect &&
      maxSegmentLength &&
      isFiniteNumber(maxSegmentLength) &&
      maxSegmentLength > 0
    ) {
      bisect(points, maxSegmentLength);
    }
    return points;
  }
  function validRing(ring) {
    return ring.every(function(point) {
      return (
        Array.isArray(point) &&
        point.length >= 2 &&
        isFiniteNumber(point[0]) &&
        isFiniteNumber(point[1])
      );
    });
  }
  function getInterpolationPoints(pathArray1, pathArray2, morphPrecision) {
    morphPrecision = morphPrecision || defaultOptions.morphPrecision;
    var fromRing = normalizeRing(pathArray1, morphPrecision),
        toRing = normalizeRing(pathArray2, morphPrecision),
        diff = fromRing.length - toRing.length;
    addPoints(fromRing, diff < 0 ? diff * -1 : 0);
    addPoints(toRing, diff > 0 ? diff : 0);
    rotateRing(fromRing, toRing);
    return [fromRing,toRing]
  }
  function getSVGMorph(tweenProp){
    return this.element.getAttribute('d');
  }
  function prepareSVGMorph(tweenProp,value){
    var pathObject = {}, elem = value instanceof SVGElement ? value : /^\.|^\#/.test(value) ? selector(value) : null,
        pathReg = new RegExp('\\n','ig');
    if ( typeof(value) === 'object' && value.pathArray ) {
      return value;
    } else if ( elem && /path|glyph/.test(elem.tagName) ) {
      pathObject.original = elem.getAttribute('d').replace(pathReg,'');
    } else if ( !elem && typeof(value) === 'string' ) {
      pathObject.original = value.replace(pathReg,'');
    }
    return pathObject;
  }
  function crossCheckSVGMorph(prop){
    if ( this.valuesEnd[prop]){
      var pathArray1 = this.valuesStart[prop].pathArray,
          pathArray2 = this.valuesEnd[prop].pathArray;
      if ( !pathArray1 || !pathArray2 || pathArray1 && pathArray2 && pathArray1.length !== pathArray2.length ) {
        var p1 = this.valuesStart[prop].original,
            p2 = this.valuesEnd[prop].original,
            morphPrecision = this._morphPrecision ? parseInt(this._morphPrecision) : defaultOptions.morphPrecision,
            paths = getInterpolationPoints(p1,p2,morphPrecision);
        this.valuesStart[prop].pathArray = paths[0];
        this.valuesEnd[prop].pathArray = paths[1];
      }
    }
  }
  var svgMorphFunctions = {
    prepareStart: getSVGMorph,
    prepareProperty: prepareSVGMorph,
    onStart: onStartSVGMorph,
    crossCheck: crossCheckSVGMorph
  };
  var svgMorph = {
    component: 'svgMorph',
    property: 'path',
    defaultValue: [],
    Interpolate: coords,
    defaultOptions: {morphPrecision : 10, morphIndex:0},
    functions: svgMorphFunctions,
    Util: {
      addPoints: addPoints,bisect: bisect,normalizeRing: normalizeRing,validRing: validRing,
      getInterpolationPoints: getInterpolationPoints,pathStringToRing: pathStringToRing,
      isFiniteNumber: isFiniteNumber,distanceSquareRoot: distanceSquareRoot,pointAlong: pointAlong,samePoint: samePoint,
      exactRing: exactRing,approximateRing: approximateRing,createPath: createPath,rotateRing: rotateRing,
      pathToAbsolute: pathToAbsolute,pathToString: pathToString,
      polygonLength: polygonLength,polygonArea: polygonArea
    }
  };
  Components.SVGMorph = svgMorph;

  for (var component in Components) {
    var compOps = Components[component];
    Components[component] = new Animation(compOps);
  }
  var index = {
    Animation: Animation,
    Components: Components,
    Tween: Tween,
    fromTo: fromTo,
    to: to,
    TweenCollection: TweenCollection,
    allFromTo: allFromTo,
    allTo: allTo,
    Objects: Objects,
    Util: Util,
    Easing: Easing,
    CubicBezier: CubicBezier,
    Render: Render,
    Interpolate: Interpolate,
    Process: Process,
    Internals: Internals,
    Selector: selector,
    Version: version
  };

  return index;

})));
