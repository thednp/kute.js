/*!
* KUTE.js Extra v2.0.16 (http://thednp.github.io/kute.js)
* Copyright 2015-2020 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KUTE = factory());
}(this, (function () { 'use strict';

  var version = "2.0.16";

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

  var TweenExtra = (function (Tween) {
    function TweenExtra() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      Tween.apply(this, args);
      return this;
    }
    if ( Tween ) TweenExtra.__proto__ = Tween;
    TweenExtra.prototype = Object.create( Tween && Tween.prototype );
    TweenExtra.prototype.constructor = TweenExtra;
    TweenExtra.prototype.to = function to (property,value){
    };
    TweenExtra.prototype.fromTo = function fromTo (property,value){
    };
    TweenExtra.prototype.getTotalDuration = function getTotalDuration (){
    };
    TweenExtra.prototype.on = function on (name,fn){
      if ( ['start','stop','update','complete','pause','resume'].indexOf(name) >-1 ) {
        this[("_on" + (name.charAt(0).toUpperCase() + name.slice(1)))] = fn;
      }
    };
    TweenExtra.prototype.option = function option (o,v) {
      this[("_" + o)] = v;
    };
    return TweenExtra;
  }(Tween));
  connect.tween = TweenExtra;

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

  var ProgressBar = function ProgressBar(element, tween){
    this.element = selector(element);
    this.element.tween = tween;
    this.element.tween.toolbar = this.element;
    this.element.toolbar = this;
    this.element.output = this.element.parentNode.getElementsByTagName('OUTPUT')[0];
    if (!(this.element instanceof HTMLInputElement)) { throw TypeError("Target element is not [HTMLInputElement]") }
    if (this.element.type !=='range') { throw TypeError("Target element is not a range input") }
    if (!(tween instanceof connect.tween)) { throw TypeError(("tween parameter is not [" + (connect.tween) + "]")) }
    this.element.setAttribute('value',0);
    this.element.setAttribute('min',0);
    this.element.setAttribute('max',1);
    this.element.setAttribute('step',0.0001);
    this.element.tween._onUpdate = this.updateBar;
    this.element.addEventListener('mousedown',this.downAction,false);
  };
  ProgressBar.prototype.updateBar = function updateBar (){
    var tick = 0.0001;
    var output = this.toolbar.output;
    var progress = this.paused ? this.toolbar.value
                 : (KUTE.Time() - this._startTime ) / this._duration;
    progress = progress > 1-tick ? 1 : progress < 0.01 ? 0 : progress;
    var value = !this._reversed ? progress : 1-progress;
    this.toolbar.value = value;
    output && (output.value=(value*100).toFixed(2)+'%');
  };
  ProgressBar.prototype.toggleEvents = function toggleEvents (action){
    this.element[(action + "EventListener")]('mousemove',this.moveAction,false);
    this.element[(action + "EventListener")]('mouseup',this.upAction,false);
  };
  ProgressBar.prototype.updateTween = function updateTween () {
    var progress = (!this.tween._reversed ? this.value : 1-this.value) * this.tween._duration - 0.0001;
    this.tween._startTime = 0;
    this.tween.update(progress);
  };
  ProgressBar.prototype.moveAction = function moveAction (){
    this.toolbar.updateTween.call(this);
  };
  ProgressBar.prototype.downAction = function downAction (){
    if (!this.tween.playing) {
      this.tween.start();
    }
    if ( !this.tween.paused ){
      this.tween.pause();
      this.toolbar.toggleEvents('add');
      KUTE.Tick = cancelAnimationFrame(KUTE.Ticker);
    }
  };
  ProgressBar.prototype.upAction = function upAction (){
    if ( this.tween.paused) {
      this.tween.paused && this.tween.resume();
      this.tween._startTime = (KUTE.Time() - (!this.tween._reversed ? this.value : 1 - this.value) * this.tween._duration);
      this.toolbar.toggleEvents('remove');
      KUTE.Tick = requestAnimationFrame(KUTE.Ticker);
    }
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

  var AnimationDevelopment = (function (Animation) {
    function AnimationDevelopment(){
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      Animation.apply(this, args);
    }
    if ( Animation ) AnimationDevelopment.__proto__ = Animation;
    AnimationDevelopment.prototype = Object.create( Animation && Animation.prototype );
    AnimationDevelopment.prototype.constructor = AnimationDevelopment;
    AnimationDevelopment.prototype.setComponent = function setComponent (Component){
      Animation.prototype.setComponent.call(this, Component);
      var propertyInfo = this;
      var Functions = { prepareProperty: prepareProperty,prepareStart: prepareStart,onStart: onStart,onComplete: onComplete,crossCheck: crossCheck };
      var Category = Component.category;
      var Property = Component.property;
      var Length = Component.properties && Component.properties.length || Component.subProperties && Component.subProperties.length;
      if ('defaultValue' in Component){
        propertyInfo.supports = Property + " property";
        propertyInfo.defaultValue = "" + ((Component.defaultValue+'').length?"YES":"not set or incorrect");
      } else if (Component.defaultValues) {
        propertyInfo.supports = (Length||Property) + " " + (Property||Category) + " properties";
        propertyInfo.defaultValues = Object.keys(Component.defaultValues).length === Length ? "YES" : "Not set or incomplete";
      }
      if (Component.defaultOptions) {
        propertyInfo.extends = [];
        for (var op in Component.defaultOptions) {
          propertyInfo.extends.push(op);
        }
        propertyInfo.extends.length ? propertyInfo.extends = "with <" + (propertyInfo.extends.join(', ')) + "> new option(s)" : delete propertyInfo.extends;
      }
      if (Component.functions) {
        propertyInfo.interface = [];
        propertyInfo.render = [];
        propertyInfo.warning = [];
        for (var fnf in Functions) {
          if (fnf in Component.functions) {
            fnf === 'prepareProperty' ? propertyInfo.interface.push("fromTo()") : 0;
            fnf === 'prepareStart' ? propertyInfo.interface.push("to()") : 0;
            fnf === 'onStart' ? propertyInfo.render = "can render update" : 0;
          } else {
            fnf === 'prepareProperty' ? propertyInfo.warning.push("fromTo()") : 0;
            fnf === 'prepareStart' ? propertyInfo.warning.push("to()") : 0;
            fnf === 'onStart' ? propertyInfo.render = "no function to render update" : 0;
          }
        }
        propertyInfo.interface.length ? propertyInfo.interface = (Category||Property) + " can use [" + (propertyInfo.interface.join(', ')) + "] method(s)" : delete propertyInfo.uses;
        propertyInfo.warning.length ? propertyInfo.warning = (Category||Property) + " can't use [" + (propertyInfo.warning.join(', ')) + "] method(s) because values aren't processed" : delete propertyInfo.warning;
      }
      if (Component.Interpolate) {
        propertyInfo.uses = [];
        propertyInfo.adds = [];
        for (var fni in Component.Interpolate) {
          var compIntObj = Component.Interpolate[fni];
          if ( typeof(compIntObj) === 'function' ) {
            if ( !Interpolate[fni] ) {
              propertyInfo.adds.push(("" + fni));
            }
            propertyInfo.uses.push(("" + fni));
          } else {
            for ( var sfn in compIntObj ) {
              if ( typeof(compIntObj[sfn]) === 'function' && !Interpolate[fni] ) {
                propertyInfo.adds.push(("" + sfn));
              }
              propertyInfo.uses.push(("" + sfn));
            }
          }
        }
        propertyInfo.uses.length ? propertyInfo.uses = "[" + (propertyInfo.uses.join(', ')) + "] interpolation function(s)" : delete propertyInfo.uses;
        propertyInfo.adds.length ? propertyInfo.adds = "new [" + (propertyInfo.adds.join(', ')) + "] interpolation function(s)" : delete propertyInfo.adds;
      } else {
        propertyInfo.critical = "For " + (Property||Category) + " no interpolation function[s] is set";
      }
      if (Component.Util) {
        propertyInfo.hasUtil = Object.keys(Component.Util).join(',');
      }
      return propertyInfo
    };
    return AnimationDevelopment;
  }(Animation));

  function numbers(a, b, v) {
    a = +a; b -= a; return a + b * v;
  }

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

  function onStartBgPos(prop){
    if ( this.valuesEnd[prop] && !KUTE[prop]) {
      KUTE[prop] = function (elem, a, b, v) {
        elem.style[prop] = ((numbers(a[0],b[0],v)*100>>0)/100) + "%  " + (((numbers(a[1],b[1],v)*100>>0)/100)) + "%";
      };
    }
  }

  function getBgPos(prop){
    return getStyleForProperty(this.element,prop) || defaultValues[prop];
  }
  function prepareBgPos(prop,value){
    if ( value instanceof Array ){
      var x = trueDimension(value[0]).v,
            y = trueDimension(value[1]).v;
      return [ x !== NaN ? x : 50, y !== NaN ? y : 50 ];
    } else {
      var posxy = value.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/g,50);
      posxy = posxy.split(/(\,|\s)/g);
      posxy = posxy.length === 2 ? posxy : [posxy[0],50];
      return [ trueDimension(posxy[0]).v, trueDimension(posxy[1]).v ];
    }
  }
  var bgPositionFunctions = {
    prepareStart: getBgPos,
    prepareProperty: prepareBgPos,
    onStart: onStartBgPos
  };
  var BackgroundPosition = {
    component: 'backgroundPositionProp',
    property: 'backgroundPosition',
    defaultValue: [50,50],
    Interpolate: {numbers: numbers},
    functions: bgPositionFunctions,
    Util: {trueDimension: trueDimension}
  };
  Components.BackgroundPosition = BackgroundPosition;

  function units(a, b, u, v) {
    a = +a; b -= a; return ( a + b * v ) + u;
  }

  function radiusOnStartFn(tweenProp){
    if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = units(a.v,b.v,b.u,v);
      };
    }
  }

  var radiusProps = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];
  var radiusValues = {};
  radiusProps.map(function (x) { return radiusValues[x] = 0; });
  var radiusOnStart = {};
  radiusProps.forEach(function (tweenProp) {
    radiusOnStart[tweenProp] = radiusOnStartFn;
  });
  function getRadius(tweenProp){
    return getStyleForProperty(this.element,tweenProp) || defaultValues[tweenProp];
  }
  function prepareRadius(tweenProp,value){
    return trueDimension(value);
  }
  var radiusFunctions = {
    prepareStart: getRadius,
    prepareProperty: prepareRadius,
    onStart: radiusOnStart
  };
  var BorderRadius = {
    component: 'borderRadiusProperties',
    category: 'borderRadius',
    properties: radiusProps,
    defaultValues: radiusValues,
    Interpolate: {units: units},
    functions: radiusFunctions,
    Util: {trueDimension: trueDimension}
  };
  Components.BorderRadiusProperties = BorderRadius;

  function boxModelOnStart(tweenProp){
    if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = (v > 0.99 || v < 0.01 ? ((numbers(a,b,v)*10)>>0)/10 : (numbers(a,b,v) ) >> 0) + "px";
      };
    }
  }

  var boxModelProperties = ['top', 'left', 'width', 'height', 'right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
                            'padding', 'paddingTop','paddingBottom', 'paddingLeft', 'paddingRight',
                            'margin', 'marginTop','marginBottom', 'marginLeft', 'marginRight',
                            'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'];
  var boxModelValues = {};
  boxModelProperties.map(function (x) { return boxModelValues[x] = 0; });
  function getBoxModel(tweenProp){
    return getStyleForProperty(this.element,tweenProp) || defaultValues[tweenProp];
  }
  function prepareBoxModel(tweenProp,value){
    var boxValue = trueDimension(value), offsetProp = tweenProp === 'height' ? 'offsetHeight' : 'offsetWidth';
    return boxValue.u === '%' ? boxValue.v * this.element[offsetProp] / 100 : boxValue.v;
  }
  var boxPropsOnStart = {};
  boxModelProperties.map(function (x) { return boxPropsOnStart[x] = boxModelOnStart; } );
  var boxModelFunctions = {
    prepareStart: getBoxModel,
    prepareProperty: prepareBoxModel,
    onStart: boxPropsOnStart
  };
  var boxModel = {
    component: 'boxModelProperties',
    category: 'boxModel',
    properties: boxModelProperties,
    defaultValues: boxModelValues,
    Interpolate: {numbers: numbers},
    functions: boxModelFunctions
  };
  Components.BoxModelProperties = boxModel;

  function onStartClip(tweenProp) {
    if ( this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        var h = 0, cl = [];
        for (h;h<4;h++){
          var c1 = a[h].v, c2 = b[h].v, cu = b[h].u || 'px';
          cl[h] = ((numbers(c1,c2,v)*100 >> 0)/100) + cu;
        }
        elem.style.clip = "rect(" + cl + ")";
      };
    }
  }

  function getClip(tweenProp,v){
    var currentClip = getStyleForProperty(this.element,tweenProp),
          width = getStyleForProperty(this.element,'width'),
          height = getStyleForProperty(this.element,'height');
    return !/rect/.test(currentClip) ? [0, width, height, 0] : currentClip;
  }
  function prepareClip(tweenProp,value) {
    if ( value instanceof Array ){
      return [ trueDimension(value[0]), trueDimension(value[1]), trueDimension(value[2]), trueDimension(value[3]) ];
    } else {
      var clipValue = value.replace(/rect|\(|\)/g,'');
      clipValue = /\,/g.test(clipValue) ? clipValue.split(/\,/g) : clipValue.split(/\s/g);
      return [ trueDimension(clipValue[0]),  trueDimension(clipValue[1]), trueDimension(clipValue[2]),  trueDimension(clipValue[3]) ];
    }
  }
  var clipFunctions = {
    prepareStart: getClip,
    prepareProperty: prepareClip,
    onStart: onStartClip
  };
   var clipProperty = {
    component: 'clipProperty',
    property: 'clip',
    defaultValue: [0,0,0,0],
    Interpolate: {numbers: numbers},
    functions: clipFunctions,
    Util: {trueDimension: trueDimension}
  };
  Components.ClipProperty = clipProperty;

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

  function dropShadow(a,b,v){
    var params = [], unit = 'px';
    for (var i=0; i<3; i++){
      params[i] = ((numbers(a[i],b[i],v) * 100 >>0) /100) + unit;
    }
    return ("drop-shadow(" + (params.concat( colors(a[3],b[3],v) ).join(' ')) + ")")
  }
  function onStartFilter(tweenProp) {
    if ( this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = (b.url                      ? ("url(" + (b.url) + ")") : '')
                              + (a.opacity||b.opacity       ? ("opacity(" + (((numbers(a.opacity,b.opacity,v) * 100)>>0)/100) + "%)") : '')
                              + (a.blur||b.blur             ? ("blur(" + (((numbers(a.blur,b.blur,v) * 100)>>0)/100) + "em)") : '')
                              + (a.saturate||b.saturate     ? ("saturate(" + (((numbers(a.saturate,b.saturate,v) * 100)>>0)/100) + "%)") : '')
                              + (a.invert||b.invert         ? ("invert(" + (((numbers(a.invert,b.invert,v) * 100)>>0)/100) + "%)") : '')
                              + (a.grayscale||b.grayscale   ? ("grayscale(" + (((numbers(a.grayscale,b.grayscale,v) * 100)>>0)/100) + "%)") : '')
                              + (a.hueRotate||b.hueRotate   ? ("hue-rotate(" + (((numbers(a.hueRotate,b.hueRotate,v) * 100)>>0)/100) + "deg)") : '')
                              + (a.sepia||b.sepia           ? ("sepia(" + (((numbers(a.sepia,b.sepia,v) * 100)>>0)/100) + "%)") : '')
                              + (a.brightness||b.brightness ? ("brightness(" + (((numbers(a.brightness,b.brightness,v) * 100)>>0)/100) + "%)") : '')
                              + (a.contrast||b.contrast     ? ("contrast(" + (((numbers(a.contrast,b.contrast,v) * 100)>>0)/100) + "%)") : '')
                              + (a.dropShadow||b.dropShadow ? dropShadow(a.dropShadow,b.dropShadow,v) : '');
      };
    }
  }

  function replaceDashNamespace(str){
    return str.replace('-r','R').replace('-s','S')
  }
  function parseDropShadow (shadow){
    var newShadow;
    if (shadow.length === 3) {
      newShadow = [shadow[0], shadow[1], 0, shadow[2] ];
    } else if (shadow.length === 4) {
      newShadow = [shadow[0], shadow[1], shadow[2], shadow[3]];
    }
    for (var i=0;i<3;i++){
      newShadow[i] = parseFloat(newShadow[i]);
    }
    newShadow[3] = trueColor(newShadow[3]);
    return newShadow;
  }
  function parseFilterString(currentStyle){
    var result = {};
    var fnReg = /(([a-z].*?)\(.*?\))(?=\s([a-z].*?)\(.*?\)|\s*$)/g;
    var matches = currentStyle.match(fnReg);
    var fnArray = currentStyle !== 'none' ? matches : 'none';
    if (fnArray instanceof Array) {
      for (var j=0, jl = fnArray.length; j<jl; j++){
        var p = fnArray[j].trim().split(/\((.+)/);
        var pp = replaceDashNamespace(p[0]);
        if ( pp === 'dropShadow' ) {
          var shadowColor = p[1].match(/(([a-z].*?)\(.*?\))(?=\s(.*?))/)[0];
          var params = p[1].replace(shadowColor,'').split(/\s/).map(parseFloat);
          result[pp] = params.filter(function (el){ return !isNaN(el); }).concat(shadowColor);
        } else {
          result[pp] = p[1].replace(/\'|\"|\)/g,'');
        }
      }
    }
    return result
  }
  function getFilter(tweenProp,value) {
    var currentStyle = getStyleForProperty(this.element,tweenProp),
        filterObject = parseFilterString(currentStyle), fnp;
    for (var fn in value){
      fnp = replaceDashNamespace(fn);
      if ( !filterObject[fnp] ){
        filterObject[fnp] = defaultValues[tweenProp][fn];
      }
    }
    return filterObject;
  }
  function prepareFilter(tweenProp,value) {
    var filterObject = {}, fnp;
    for (var fn in value){
      fnp = replaceDashNamespace(fn);
      if ( /hue/.test(fn) ) {
        filterObject[fnp] = parseFloat(value[fn]);
      } else if ( /drop/.test(fn)  ) {
        filterObject[fnp] = parseDropShadow(value[fn]);
      } else if ( fn === 'url' ) {
        filterObject[fn] = value[fn];
      } else {
        filterObject[fn] = parseFloat(value[fn]);
      }
    }
    return filterObject;
  }
  function crossCheckFilter(tweenProp){
    if ( this.valuesEnd[tweenProp] ) {
      for (var fn in this.valuesStart[tweenProp]){
        if (!this.valuesEnd[tweenProp][fn]){
          this.valuesEnd[tweenProp][fn] = this.valuesStart[tweenProp][fn];
        }
      }
    }
  }
  var filterFunctions = {
    prepareStart: getFilter,
    prepareProperty: prepareFilter,
    onStart: onStartFilter,
    crossCheck: crossCheckFilter
  };
  var filterEffects = {
    component: 'filterEffects',
    property: 'filter',
    defaultValue: {opacity: 100, blur: 0, saturate: 100, grayscale: 0, brightness: 100, contrast: 100, sepia: 0, invert: 0, hueRotate:0, dropShadow: [0,0,0,{r:0,g:0,b:0}], url:''},
    Interpolate: {
      opacity: numbers,
      blur: numbers,
      saturate: numbers,
      grayscale: numbers,
      brightness: numbers,
      contrast: numbers,
      sepia: numbers,
      invert: numbers,
      hueRotate: numbers,
      dropShadow: {numbers: numbers,colors: colors,dropShadow: dropShadow}
    },
    functions: filterFunctions,
    Util: {parseDropShadow: parseDropShadow,parseFilterString: parseFilterString,replaceDashNamespace: replaceDashNamespace,trueColor: trueColor}
  };
  Components.FilterEffects = filterEffects;

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
      var attribute = replaceUppercase(attr).replace(/_+[a-z]+/,''),
          currentValue = this.element.getAttribute(attribute);
      attrStartValues[attribute] = svgColors.includes(attribute) ? (currentValue || 'rgba(0,0,0,0)') : (currentValue || (/opacity/i.test(attr) ? 1 : 0));
    }
    return attrStartValues;
  }
  function prepareAttr(tweenProp,attrObj){
    var attributesObject = {};
    for ( var p in attrObj ) {
      var prop = replaceUppercase(p),
          regex = /(%|[a-z]+)$/,
          currentValue = this.element.getAttribute(prop.replace(/_+[a-z]+/,''));
      if ( !svgColors.includes(prop)) {
        if ( currentValue !== null && regex.test(currentValue) ) {
          var unit = trueDimension(currentValue).u || trueDimension(attrObj[p]).u,
              suffix = /%/.test(unit) ? '_percent' : ("_" + unit);
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
    if ('rect'===el.tagName) {
      return getRectLength(el);
    } else if ('circle'===el.tagName) {
      return getCircleLength(el);
    } else if ('ellipse'===el.tagName) {
      return getEllipseLength(el);
    } else if (['polygon,polyline'].indexOf(el.tagName)>-1) {
      return getPolyLength(el);
    } else if ('line'===el.tagName) {
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

  function pathToString(pathArray) {
    return pathArray.map(function (x){ return x[0].concat(x.slice(1).join(' ')); }).join('')
  }

  function onStartCubicMorph(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = function(elem,a,b,v){
        var curve = [], path1 = a.curve, path2 = b.curve;
        for(var i=0, l=path2.length; i<l; i++) {
          curve.push([path1[i][0]]);
          for(var j=1,l2=path1[i].length;j<l2;j++) {
            curve[i].push( (numbers(path1[i][j], path2[i][j], v) * 1000 >>0)/1000 );
          }
        }
        elem.setAttribute("d", v === 1 ? b.original : pathToString(curve) );
      };
    }
  }

  function clonePath(pathArray){
    return pathArray.map(function (x) { return Array.isArray(x)
      ? clonePath(x)
      : !isNaN(+x) ? +x : x; } )
  }

  var options = {
    origin:null,
    decimals:3,
    round:1
  };

  function roundPath(pathArray,round) {
    var decimalsOption = !isNaN(+round) ? +round :  options.decimals;
    return decimalsOption ?
      pathArray.map( function (seg) { return seg.map(function (c,i) {
        var nr = +c, dc = Math.pow(10,decimalsOption);
        return nr ? (nr % 1 === 0 ? nr : Math.round(nr*dc)/dc) : c
      }
    ); }) : clonePath(pathArray)
  }

  var paramsCount = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

  function finalizeSegment(state) {
    var pathCommand = state.pathValue[state.segmentStart],
        pathComLK = pathCommand.toLowerCase(),
        params = state.data;
    if (pathComLK === 'm' && params.length > 2) {
      state.segments.push([ pathCommand, params[0], params[1] ]);
      params = params.slice(2);
      pathComLK = 'l';
      pathCommand = (pathCommand === 'm') ? 'l' : 'L';
    }
    if (pathComLK === 'r') {
      state.segments.push([ pathCommand ].concat(params));
    } else {
      while (params.length >= paramsCount[pathComLK]) {
        state.segments.push([ pathCommand ].concat(params.splice(0, paramsCount[pathComLK])));
        if (!paramsCount[pathComLK]) {
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
    state.err = invalidPathValue + ": invalid Arc flag " + ch;
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
      state.err = invalidPathValue + ": missing param " + (state.pathValue[index]);
      return;
    }
    ch = state.pathValue.charCodeAt(index);
    if (ch === 0x2B || ch === 0x2D) {
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (!isDigit(ch) && ch !== 0x2E) {
      state.err = invalidPathValue + ": " + (state.pathValue[index]) + " not number";
      return;
    }
    if (ch !== 0x2E) {
      zeroFirst = (ch === 0x30);
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (zeroFirst && index < max) {
        if (ch && isDigit(ch)) {
          state.err = invalidPathValue + ": " + (state.pathValue[start]) + " illegal number";
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
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
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
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
        return;
      }
    }
    state.index = index;
    state.param = +state.pathValue.slice(start, index);
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

  function isPathCommand(code) {
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

  function scanSegment(state) {
    var max = state.max, cmdCode, comma_found, need_params, i;
    state.segmentStart = state.index;
    cmdCode = state.pathValue.charCodeAt(state.index);
    if (!isPathCommand(cmdCode)) {
      state.err = invalidPathValue + ": " + (state.pathValue[state.index]) + " not a path command";
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

  function isPathArray(pathArray){
    return Array.isArray(pathArray) && pathArray.every(function (seg){
      var pathCommand = seg[0].toLowerCase();
      return paramsCount[pathCommand] === seg.length - 1 && /[achlmrqstvz]/g.test(pathCommand)
    })
  }

  function parsePathString(pathString,round) {
    if ( isPathArray(pathString) ) {
      return clonePath(pathString)
    }
    var state = new SVGPathArray(pathString);
    skipSpaces(state);
    while (state.index < state.max && !state.err.length) {
      scanSegment(state);
    }
    if (state.err.length) {
      state.segments = [];
    } else if (state.segments.length) {
      if ('mM'.indexOf(state.segments[0][0]) < 0) {
        state.err = invalidPathValue + ": missing M/m";
        state.segments = [];
      } else {
        state.segments[0][0] = 'M';
      }
    }
    return roundPath(state.segments,round)
  }

  function isAbsoluteArray(pathInput){
    return isPathArray(pathInput) && pathInput.every(function (x){ return x[0] === x[0].toUpperCase(); })
  }

  function pathToAbsolute(pathArray,round) {
    if (isAbsoluteArray(pathArray)) {
      return clonePath(pathArray)
    }
    pathArray = parsePathString(pathArray);
    var resultArray = [],
        x = 0, y = 0, mx = 0, my = 0,
        start = 0, ii = pathArray.length,
        pathCommand = '', segment = [], segLength = 0,
        absoluteSegment = [];
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      resultArray[0] = ["M", x, y];
    }
    for (var i = start; i < ii; i++) {
      segment = pathArray[i];
      pathCommand = segment[0];
      resultArray.push(absoluteSegment = []);
      if (pathCommand !== pathCommand.toUpperCase()) {
        absoluteSegment[0] = pathCommand.toUpperCase();
        switch (absoluteSegment[0]) {
          case "A":
            segment.slice(1,-2)
                   .concat([+segment[6] + x, +segment[7] + y])
                   .map(function (s){ return absoluteSegment.push(s); });
            break;
          case "V":
            absoluteSegment[1] = +segment[1] + y;
            break;
          case "H":
            absoluteSegment[1] = +segment[1] + x;
            break;
          case "M":
            mx = +segment[1] + x;
            my = +segment[2] + y;
          default:
            segment.map(function (s,j){ return j && absoluteSegment.push(+s + ((j % 2) ? x : y)); });
        }
      } else {
        segment.map(function (k){ return absoluteSegment.push(k); });
      }
      segLength = absoluteSegment.length;
      switch (absoluteSegment[0]) {
        case "Z":
          x = mx;
          y = my;
          break;
        case "H":
          x = +absoluteSegment[1];
          break;
        case "V":
          y = +absoluteSegment[1];
          break;
        case "M":
          mx = +absoluteSegment[segLength - 2];
          my = +absoluteSegment[segLength - 1];
        default:
          x = +absoluteSegment[segLength - 2];
          y = +absoluteSegment[segLength - 1];
      }
    }
    return roundPath(resultArray,round)
  }

  function fixArc(pathArray, allPathCommands, i) {
    if (pathArray[i].length > 7) {
      pathArray[i].shift();
      var pi = pathArray[i];
      while (pi.length) {
        allPathCommands[i] = "A";
        pathArray.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
      }
      pathArray.splice(i, 1);
    }
  }

  function isCurveArray(pathArray){
    return isPathArray(pathArray) && pathArray.slice(1).every(function (seg){ return seg[0] === 'C'; })
  }

  function shorthandToQuad(x1,y1,qx,qy,prevCommand){
    return 'QT'.indexOf(prevCommand)>-1 ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy}
                                        : { qx: x1, qy: y1 }
  }

  function shorthandToCubic(x1,y1,x2,y2,prevCommand){
    return 'CS'.indexOf(prevCommand)>-1 ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2}
                                        : { x1: x1, y1: y1 }
  }

  function normalizeSegment(segment, params, prevCommand) {
    var nqxy, nxy;
    'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null);
    switch (segment[0]) {
      case "H":
        return ["L", segment[1], params.y1]
      case "V":
        return ["L", params.x1, segment[1]]
      case "S":
        nxy = shorthandToCubic(params.x1,params.y1, params.x2,params.y2, prevCommand);
        params.x1 = nxy.x1;
        params.y1 = nxy.y1;
        return ["C", nxy.x1, nxy.y1].concat(segment.slice(1))
      case "T":
        nqxy = shorthandToQuad(params.x1,params.y1, params.qx, params.qy, prevCommand);
        params.qx = nqxy.qx;
        params.qy = nqxy.qy;
        return ["Q", params.qx, params.qy].concat(segment.slice(1))
      case "Q":
        params.qx = segment[1];
        params.qy = segment[2];
    }
    return segment
  }

  function isNormalizedArray(pathArray){
    return Array.isArray(pathArray) && pathArray.every(function (seg){
      var pathCommand = seg[0].toLowerCase();
      return paramsCount[pathCommand] === seg.length - 1 && /[ACLMQZ]/.test(seg[0])
    })
  }

  function normalizePath(pathArray,round) {
    if (isNormalizedArray(pathArray)) {
      return clonePath(pathArray)
    }
    pathArray = pathToAbsolute(pathArray);
    var params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
        allPathCommands = [], pathCommand = '', prevCommand = '',
        ii = pathArray.length, segment, seglen;
    for (var i = 0; i < ii; i++) {
      pathCommand = pathArray[i][0];
      allPathCommands[i] = pathCommand;
      i && ( prevCommand = allPathCommands[i - 1]);
      pathArray[i] = normalizeSegment(pathArray[i], params, prevCommand);
      segment = pathArray[i];
      seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray,round)
  }

  function rotateVector(x, y, rad) {
    var X = x * Math.cos(rad) - y * Math.sin(rad),
        Y = x * Math.sin(rad) + y * Math.cos(rad);
    return {x: X, y: Y}
  }

  function arcToCubic(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (angle || 0),
        res = [], xy, f1, f2, cx, cy;
    if (!recursive) {
      xy = rotateVector(x1, y1, -rad);
      x1 = xy.x; y1 = xy.y;
      xy = rotateVector(x2, y2, -rad);
      x2 = xy.x; y2 = xy.y;
      var x = (x1 - x2) / 2,
          y = (y1 - y2) / 2,
          h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx = h * rx;
        ry = h * ry;
      }
      var rx2 = rx * rx,
          ry2 = ry * ry,
          k = (large_arc_flag == sweep_flag ? -1 : 1)
            * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
            / (rx2 * y * y + ry2 * x * x)));
      cx = k * rx * y / ry + (x1 + x2) / 2;
      cy = k * -ry * x / rx + (y1 + y2) / 2;
      f1 = Math.asin( ((y1 - cy) / ry).toFixed(9) );
      f2 = Math.asin( ((y2 - cy) / ry).toFixed(9) );
      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      f1 < 0 && (f1 = Math.PI * 2 + f1);
      f2 < 0 && (f2 = Math.PI * 2 + f2);
      if (sweep_flag && f1 > f2) {
        f1 = f1 - Math.PI * 2;
      }
      if (!sweep_flag && f2 > f1) {
        f2 = f2 - Math.PI * 2;
      }
    } else {
      f1 = recursive[0];
      f2 = recursive[1];
      cx = recursive[2];
      cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
      var f2old = f2, x2old = x2, y2old = y2;
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = arcToCubic(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return [m2, m3, m4].concat(res);
    } else {
      res = [m2, m3, m4].concat(res).join().split(",");
      return res.map(function (rz,i){ return i % 2 ? rotateVector(res[i - 1], rz, rad).y : rotateVector(rz, res[i + 1], rad).x; });
    }
  }

  function quadToCubic (x1, y1, qx, qy, x2, y2) {
    var _13 = 1 / 3, _23 = 2 / 3;
    return [
            _13 * x1 + _23 * qx,
            _13 * y1 + _23 * qy,
            _13 * x2 + _23 * qx,
            _13 * y2 + _23 * qy,
            x2, y2 ]
  }

  function getPointAtSegLength (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
    var t1 = 1 - t;
    return {
        x: Math.pow(t1, 3) * p1x + Math.pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + Math.pow(t, 3) * p2x,
        y: Math.pow(t1, 3) * p1y + Math.pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + Math.pow(t, 3) * p2y
    };
  }

  function midPoint(a, b, t) {
    var ax = a[0], ay = a[1], bx = b[0], by = b[1];
    return [ ax + (bx - ax) * t, ay + (by - ay) * t];
  }

  function lineToCubic(x1, y1, x2, y2) {
    var t = 0.5,
        p0 = [x1,y1],
        p1 = [x2,y2],
        p2 = midPoint(p0, p1, t),
        p3 = midPoint(p1, p2, t),
        p4 = midPoint(p2, p3, t),
        p5 = midPoint(p3, p4, t),
        p6 = midPoint(p4, p5, t),
        cp1 = getPointAtSegLength.apply(0, p0.concat( p2, p4, p6, t)),
        cp2 = getPointAtSegLength.apply(0, p6.concat( p5, p3, p1, 0));
    return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2]
  }

  function segmentToCubic(segment, params) {
    'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null);
    switch (segment[0]) {
      case 'M':
        params.x = segment[1];
        params.y = segment[2];
        return segment
      case 'A':
        return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
      case 'Q':
        params.qx = segment[1];
        params.qy = segment[2];
        return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
      case 'L':
        return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]))
      case 'Z':
        return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y))
    }
    return segment
  }

  function pathToCurve(pathArray,round) {
    if (isCurveArray(pathArray)){
      return clonePath(pathArray)
    }
    pathArray = normalizePath(pathArray);
    var params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
        allPathCommands = [], pathCommand = '',
        ii = pathArray.length, segment, seglen;
    for (var i = 0; i < ii; i++) {
      pathArray[i] && (pathCommand = pathArray[i][0]);
      allPathCommands[i] = pathCommand;
      pathArray[i] = segmentToCubic(pathArray[i], params);
      fixArc(pathArray,allPathCommands,i);
      ii = pathArray.length;
      segment = pathArray[i];
      seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray,round)
  }

  function reverseCurve(pathArray){
     var rotatedCurve = pathArray.slice(1)
                        .map(function (x,i,curveOnly) { return !i ? pathArray[0].slice(1).concat(x.slice(1)) : curveOnly[i-1].slice(-2).concat(x.slice(1)); })
                        .map(function (x) { return x.map(function (y,i) { return x[x.length - i - 2 * (1 - i % 2)]; } ); })
                        .reverse();
    return [ ['M'].concat( rotatedCurve[0].slice(0,2)) ]
                  .concat(rotatedCurve.map(function (x){ return ['C'].concat(x.slice(2) ); } ))
  }

  function getCubicSegArea(x0,y0, x1,y1, x2,y2, x3,y3) {
    return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
             + y1 * (x0 - x2) - x1 * (y0 - y2)
             + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
  }
  function getPathArea(pathArray) {
    var x = 0, y = 0, mx = 0, my = 0, len = 0;
    return pathToCurve(pathArray).map(function (seg) {
      var assign;
      switch (seg[0]){
        case 'M':
        case 'Z':
          mx = seg[0] === 'M' ? seg[1] : mx;
          my = seg[0] === 'M' ? seg[2] : my;
          x = mx;
          y = my;
          return 0
        default:
          len = getCubicSegArea.apply(0, [x,y].concat(seg.slice(1) ));
          (assign = seg.slice(-2), x = assign[0], y = assign[1]);
          return len
      }
    }).reduce(function (a, b) { return a + b; }, 0)
  }

  function getDrawDirection(pathArray) {
    return getPathArea(pathToCurve(pathArray)) >= 0
  }

  function splitCubic(pts,t) {
    t = t || 0.5;
    var p0 = pts.slice(0,2),
        p1 = pts.slice(2,4),
        p2 = pts.slice(4,6),
        p3 = pts.slice(6,8),
        p4 = midPoint(p0, p1, t),
        p5 = midPoint(p1, p2, t),
        p6 = midPoint(p2, p3, t),
        p7 = midPoint(p4, p5, t),
        p8 = midPoint(p5, p6, t),
        p9 = midPoint(p7, p8, t);
    return [
      ['C'].concat( p4, p7, p9),
      ['C'].concat( p8, p6, p3)
    ]
  }

  function splitPath(pathInput) {
    return pathToString(pathToAbsolute(pathInput,0))
      .replace( /(m|M)/g, "|$1")
      .split('|')
      .map(function (s){ return s.trim(); })
      .filter(function (s){ return s; })
  }

  function base3(p1, p2, p3, p4, t) {
    var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
        t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
    return t * t2 - 3 * p1 + 3 * p2;
  }
  function getSegCubicLength (x1, y1, x2, y2, x3, y3, x4, y4, z) {
    (z === null || isNaN(+z)) && (z = 1);
    z = z > 1 ? 1 : z < 0 ? 0 : z;
    var z2 = z / 2, ct = 0, xbase = 0, ybase = 0, sum = 0,
        Tvalues = [-0.1252,0.1252,-0.3678,0.3678,-0.5873,0.5873,-0.7699,0.7699,-0.9041,0.9041,-0.9816,0.9816],
        Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472];
    Tvalues.map(function (T,i){
      ct = z2 * T + z2;
      xbase = base3( x1, x2, x3, x4, ct);
      ybase = base3( y1, y2, y3, y4, ct);
      sum += Cvalues[i] * Math.sqrt(xbase * xbase + ybase * ybase);
    });
    return z2 * sum
  }

  function distanceSquareRoot(a, b) {
    return Math.sqrt(
      (a[0] - b[0]) * (a[0] - b[0]) +
      (a[1] - b[1]) * (a[1] - b[1])
    )
  }

  function getCurveArray(pathString){
    return pathToCurve(splitPath(pathToString(pathToAbsolute(pathString)))[0]).map(function (segment,i,pathArray){
      var segmentData = i && pathArray[i-1].slice(-2).concat(segment.slice(1)),
          curveLength = i ? getSegCubicLength.apply(0, segmentData ) : 0,
          subsegs = i ? (curveLength ? splitCubic( segmentData ) : [segment,segment]) : [segment];
      return {
        s: segment,
        ss: subsegs,
        l: curveLength
      }
    })
  }
  function equalizeSegments(path1,path2,TL){
    var c1 = getCurveArray(path1),
        c2 = getCurveArray(path2),
        L1 = c1.length,
        L2 = c2.length,
        l1 = c1.filter(function (x){ return x.l; }).length,
        l2 = c2.filter(function (x){ return x.l; }).length,
        m1 = c1.filter(function (x){ return x.l; }).reduce(function (a,ref){
          var l = ref.l;
          return a+l;
    },0) / l1 || 0,
        m2 = c2.filter(function (x){ return x.l; }).reduce(function (a,ref){
          var l = ref.l;
          return a+l;
    },0) / l2 || 0,
        tl = TL || Math.max(L1,L2),
        mm = [m1,m2],
        dif = [tl-L1,tl-L2],
        canSplit = 0,
        result = [c1,c2].map(function (x,i) { return x.l === tl ? x.map(function (y){ return y.s; })
               : x.map(function (y,j) {
                  canSplit = j && dif[i] && y.l >= mm[i];
                  dif[i] -= canSplit ? 1 : 0;
                  return canSplit ? y.ss : [y.s]
                }).flat(); });
    return result[0].length === result[1].length ? result : equalizeSegments(result[0],result[1],tl)
  }
  function getRotations(a) {
    var segCount = a.length, pointCount = segCount - 1;
    return a.map(function (f,idx) {
      return a.map(function (p,i){
        var oldSegIdx = idx + i, seg;
        if (i===0 || a[oldSegIdx] && a[oldSegIdx][0] === 'M') {
          seg = a[oldSegIdx];
          return ['M'].concat(seg.slice(-2))
        } else {
          if (oldSegIdx >= segCount) { oldSegIdx -= pointCount; }
          return a[oldSegIdx]
        }
      })
    })
  }
  function getRotatedCurve(a,b) {
    var segCount = a.length - 1,
        lineLengths = [],
        computedIndex = 0,
        sumLensSqrd = 0,
        rotations = getRotations(a);
    rotations.map(function (r,i){
      a.slice(1).map(function (s,j) {
        sumLensSqrd += distanceSquareRoot(a[(i+j) % segCount].slice(-2),b[j % segCount].slice(-2));
      });
      lineLengths[i] = sumLensSqrd;
      sumLensSqrd = 0;
    });
    computedIndex = lineLengths.indexOf(Math.min.apply(null,lineLengths));
    return rotations[computedIndex]
  }
  function getCubicMorph(tweenProp){
    return this.element.getAttribute('d');
  }
  function prepareCubicMorph(tweenProp,value){
    var pathObject = {},
        el = value instanceof SVGElement ? value : /^\.|^\#/.test(value) ? selector(value) : null,
        pathReg = new RegExp('\\n','ig');
    if ( typeof(value) === 'object' && value.curve ) {
      return value;
    } else if ( el && /path|glyph/.test(el.tagName) ) {
      pathObject.original = el.getAttribute('d').replace(pathReg,'');
    } else if (!el && typeof(value) === 'string') {
      pathObject.original = value.replace(pathReg,'');
    }
    return pathObject;
  }
  function crossCheckCubicMorph(tweenProp){
    if (this.valuesEnd[tweenProp]) {
      var pathCurve1 = this.valuesStart[tweenProp].curve,
          pathCurve2 = this.valuesEnd[tweenProp].curve;
      if ( !pathCurve1 || !pathCurve2 || ( pathCurve1 && pathCurve2 && pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length) ) {
        var path1 = this.valuesStart[tweenProp].original,
            path2 = this.valuesEnd[tweenProp].original,
            curves = equalizeSegments(path1,path2),
            curve0 = getDrawDirection(curves[0]) !== getDrawDirection(curves[1]) ? reverseCurve(curves[0]) : clonePath(curves[0]);
        this.valuesStart[tweenProp].curve = curve0;
        this.valuesEnd[tweenProp].curve = getRotatedCurve(curves[1],curve0);
      }
    }
  }
  var svgCubicMorphFunctions = {
    prepareStart: getCubicMorph,
    prepareProperty: prepareCubicMorph,
    onStart: onStartCubicMorph,
    crossCheck: crossCheckCubicMorph
  };
  var svgCubicMorph = {
    component: 'svgCubicMorph',
    property: 'path',
    defaultValue: [],
    Interpolate: {numbers: numbers,pathToString: pathToString},
    functions: svgCubicMorphFunctions,
    Util: {
      pathToCurve: pathToCurve, pathToAbsolute: pathToAbsolute, pathToString: pathToString, parsePathString: parsePathString,
      getRotatedCurve: getRotatedCurve, getRotations: getRotations, equalizeSegments: equalizeSegments,
      reverseCurve: reverseCurve, clonePath: clonePath, getDrawDirection: getDrawDirection,
      splitCubic: splitCubic, getCurveArray: getCurveArray
    }
  };
  Components.SVGCubicMorph = svgCubicMorph;

  function svgTransformOnStart (tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = function (l, a, b, v) {
        var x = 0;
        var y = 0;
        var tmp;
        var deg = Math.PI/180;
        var scale = 'scale' in b ? numbers(a.scale,b.scale,v) : 1;
        var rotate = 'rotate' in b ? numbers(a.rotate,b.rotate,v) : 0;
        var sin = Math.sin(rotate*deg);
        var cos = Math.cos(rotate*deg);
        var skewX = 'skewX' in b ? numbers(a.skewX,b.skewX,v) : 0;
        var skewY = 'skewY' in b ? numbers(a.skewY,b.skewY,v) : 0;
        var complex = rotate||skewX||skewY||scale!==1 || 0;
        x -= complex ? b.origin[0] : 0;y -= complex ? b.origin[1] : 0;
        x *= scale;y *= scale;
        y += skewY ? x*Math.tan(skewY*deg) : 0;x += skewX ? y*Math.tan(skewX*deg) : 0;
        tmp = cos*x - sin*y;
        y = rotate ? sin*x + cos*y : y;x = rotate ? tmp : x;
        x += 'translate' in b ? numbers(a.translate[0],b.translate[0],v) : 0;
        y += 'translate' in b ? numbers(a.translate[1],b.translate[1],v) : 0;
        x += complex ? b.origin[0] : 0;y += complex ? b.origin[1] : 0;
        l.setAttribute('transform', ( x||y ? (("translate(" + ((x*1000>>0)/1000) + (y ? (("," + ((y*1000>>0)/1000))) : '') + ")")) : '' )
                                   +( rotate ? ("rotate(" + ((rotate*1000>>0)/1000) + ")") : '' )
                                   +( skewX ? ("skewX(" + ((skewX*1000>>0)/1000) + ")") : '' )
                                   +( skewY ? ("skewY(" + ((skewY*1000>>0)/1000) + ")") : '' )
                                   +( scale !== 1 ? ("scale(" + ((scale*1000>>0)/1000) + ")") : '' ) );
      };
    }
  }

  function parseStringOrigin (origin, ref) {
    var x = ref.x;
    var width = ref.width;
    return /[a-z]/i.test(origin) && !/px/.test(origin)
      ? origin.replace(/top|left/,0).replace(/right|bottom/,100).replace(/center|middle/,50)
      : /%/.test(origin) ? (x + parseFloat(origin) * width / 100) : parseFloat(origin);
  }
  function parseTransformString (a) {
    var d = a && /\)/.test(a) ? a.substring(0, a.length-1).split(/\)\s|\)/) : 'none', c = {};
    if (d instanceof Array) {
      for (var j=0, jl = d.length; j<jl; j++){
        var p = d[j].trim().split('(');
        c[p[0]] = p[1];
      }
    }
    return c;
  }
  function parseTransformSVG (p,v){
    var svgTransformObject = {};
    var bb = this.element.getBBox();
    var cx = bb.x + bb.width/2;
    var cy = bb.y + bb.height/2;
    var origin = this._transformOrigin;
    var translation;
    origin = typeof (origin) !== 'undefined' ? (origin.constructor === Array ? origin : origin.split(/\s/)) : [cx,cy];
    origin[0] = typeof origin[0] === 'number' ? origin[0] : parseStringOrigin(origin[0],bb);
    origin[1] = typeof origin[1] === 'number' ? origin[1] : parseStringOrigin(origin[1],bb);
    svgTransformObject.origin = origin;
    for ( var i in v ) {
      if (i === 'rotate'){
        svgTransformObject[i] = typeof v[i] === 'number' ? v[i] : v[i] instanceof Array ? v[i][0] : v[i].split(/\s/)[0]*1;
      } else if (i === 'translate'){
        translation = v[i] instanceof Array ? v[i] : /\,|\s/.test(v[i]) ? v[i].split(',') : [v[i],0];
        svgTransformObject[i] = [translation[0]*1||0, translation[1]*1||0];
      } else if (/skew/.test(i)) {
        svgTransformObject[i] = v[i]*1||0;
      } else if (i === 'scale'){
        svgTransformObject[i] = parseFloat(v[i])||1;
      }
    }
    return svgTransformObject;
  }
  function prepareSvgTransform(p,v){
    return parseTransformSVG.call(this,p,v);
  }
  function getStartSvgTransform (tweenProp,value) {
    var transformObject = {};
    var currentTransform = parseTransformString(this.element.getAttribute('transform'));
    for (var j in value) {
      transformObject[j] = j in currentTransform ? currentTransform[j] : (j==='scale'?1:0);
    }
    return transformObject;
  }
  function svgTransformCrossCheck(prop) {
    if (!this._resetStart) { return; }
    if ( this.valuesEnd[prop] ) {
      var valuesStart = this.valuesStart[prop];
      var valuesEnd = this.valuesEnd[prop];
      var currentTransform = parseTransformSVG.call(this, prop, parseTransformString(this.element.getAttribute('transform')) );
      for ( var tp in currentTransform ) {
        valuesStart[tp] = currentTransform[tp];
      }
      var parentSVG = this.element.ownerSVGElement;
      var startMatrix = parentSVG.createSVGTransformFromMatrix(
        parentSVG.createSVGMatrix()
        .translate(-valuesStart.origin[0],-valuesStart.origin[1])
        .translate('translate' in valuesStart ? valuesStart.translate[0] : 0,'translate' in valuesStart ? valuesStart.translate[1] : 0)
        .rotate(valuesStart.rotate||0).skewX(valuesStart.skewX||0).skewY(valuesStart.skewY||0).scale(valuesStart.scale||1)
        .translate(+valuesStart.origin[0],+valuesStart.origin[1])
      );
      valuesStart.translate = [startMatrix.matrix.e,startMatrix.matrix.f];
      for ( var s in valuesStart) {
        if ( !(s in valuesEnd) || s==='origin') {
          valuesEnd[s] = valuesStart[s];
        }
      }
    }
  }
  var svgTransformFunctions = {
    prepareStart: getStartSvgTransform,
    prepareProperty: prepareSvgTransform,
    onStart: svgTransformOnStart,
    crossCheck: svgTransformCrossCheck
  };
  var svgTransform = {
    component: 'svgTransformProperty',
    property: 'svgTransform',
    defaultOptions: {transformOrigin:'50% 50%'},
    defaultValue: {translate:0, rotate:0, skewX:0, skewY:0, scale:1},
    Interpolate: {numbers: numbers},
    functions: svgTransformFunctions,
    Util: { parseStringOrigin: parseStringOrigin, parseTransformString: parseTransformString, parseTransformSVG: parseTransformSVG }
  };
  Components.SVGTransformProperty = svgTransform;

  var supportPassive = (function () {
    var result = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          result = true;
        }
      });
      document.addEventListener('DOMContentLoaded', function wrap(){
        document.removeEventListener('DOMContentLoaded', wrap, opts);
      }, opts);
    } catch (e) {}
    return result;
  })();

  var mouseHoverEvents = ('onmouseleave' in document) ? [ 'mouseenter', 'mouseleave'] : [ 'mouseover', 'mouseout' ];

  var supportTouch = ('ontouchstart' in window || navigator.msMaxTouchPoints) || false;

  var touchOrWheel = supportTouch ? 'touchstart' : 'mousewheel';
  var scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent) ? document.body : document.documentElement;
  var passiveHandler = supportPassive ? { passive: false } : false;
  function preventScroll(e) {
    this.scrolling && e.preventDefault();
  }
  function getScrollTargets(){
    var el = this.element;
    return el === scrollContainer ? { el: document, st: document.body } : { el: el, st: el}
  }
  function toggleScrollEvents(action,element){
    element[action](  mouseHoverEvents[0], preventScroll, passiveHandler);
    element[action](  touchOrWheel, preventScroll, passiveHandler);
  }
  function scrollIn(){
    var targets = getScrollTargets.call(this);
    if ( 'scroll' in this.valuesEnd && !targets.el.scrolling) {
      targets.el.scrolling = 1;
      toggleScrollEvents('addEventListener',targets.el);
      targets.st.style.pointerEvents = 'none';
    }
  }
  function scrollOut(){
    var targets = getScrollTargets.call(this);
    if ( 'scroll' in this.valuesEnd && targets.el.scrolling) {
      targets.el.scrolling = 0;
      toggleScrollEvents('removeEventListener',targets.el);
      targets.st.style.pointerEvents = '';
    }
  }
  function onStartScroll(tweenProp){
    if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window) ? scrollContainer : this.element;
      scrollIn.call(this);
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.scrollTop = (numbers(a,b,v))>>0;
      };
    }
  }
  function onCompleteScroll(tweenProp){
    scrollOut.call(this);
  }

  function getScroll(){
    this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window) ? scrollContainer : this.element;
    return this.element === scrollContainer ? (window.pageYOffset || scrollContainer.scrollTop) : this.element.scrollTop;
  }
  function prepareScroll(prop,value){
    return parseInt(value);
  }
  var scrollFunctions = {
    prepareStart: getScroll,
    prepareProperty: prepareScroll,
    onStart: onStartScroll,
    onComplete: onCompleteScroll
  };
  var scrollProperty = {
    component: 'scrollProperty',
    property: 'scroll',
    defaultValue: 0,
    Interpolate: {numbers: numbers},
    functions: scrollFunctions,
    Util: { preventScroll: preventScroll, scrollIn: scrollIn, scrollOut: scrollOut, getScrollTargets: getScrollTargets, toggleScrollEvents: toggleScrollEvents, supportPassive: supportPassive }
  };
  Components.ScrollProperty = scrollProperty;

  function onStartShadow(tweenProp) {
    if ( this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        var params = [], unit = 'px', sl = tweenProp === 'textShadow' ? 3 : 4,
            colA = sl === 3 ? a[3] : a[4], colB = sl === 3 ? b[3] : b[4],
            inset = a[5] && a[5] !== 'none' || b[5] && b[5] !== 'none' ? ' inset' : false;
        for (var i=0; i<sl; i++){
          params.push( ((numbers( a[i], b[i], v ) * 1000 >> 0) / 1000) + unit );
        }
        elem.style[tweenProp] = inset ? colors(colA,colB,v) + params.join(' ') + inset
                                      : colors(colA,colB,v) + params.join(' ');
      };
    }
  }

  var shadowProps = ['boxShadow','textShadow'];
  function processShadowArray (shadow,tweenProp){
    var newShadow, i;
    if (shadow.length === 3) {
      newShadow = [shadow[0], shadow[1], 0, 0, shadow[2], 'none'];
    } else if (shadow.length === 4) {
      newShadow = /inset|none/.test(shadow[3]) ? [shadow[0], shadow[1], 0, 0, shadow[2], shadow[3]] : [shadow[0], shadow[1], shadow[2], 0, shadow[3], 'none'];
    } else if (shadow.length === 5) {
      newShadow = /inset|none/.test(shadow[4]) ? [shadow[0], shadow[1], shadow[2], 0, shadow[3], shadow[4]] : [shadow[0], shadow[1], shadow[2], shadow[3], shadow[4], 'none'];
    } else if (shadow.length === 6) {
      newShadow = shadow;
    }
    for (i=0;i<4;i++){
      newShadow[i] = parseFloat(newShadow[i]);
    }
    newShadow[4] = trueColor(newShadow[4]);
    newShadow = tweenProp === 'boxShadow' ? newShadow : newShadow.filter(function (x,i){ return [0,1,2,4].indexOf(i)>-1; });
    return newShadow;
  }
  function getShadow(tweenProp,value){
    var cssShadow = getStyleForProperty(this.element,tweenProp);
    return /^none$|^initial$|^inherit$|^inset$/.test(cssShadow) ? defaultValues[tweenProp] : cssShadow;
  }
  function prepareShadow(tweenProp,value) {
    if (typeof value === 'string'){
      var currentColor, inset = 'none';
      var colRegEx = /(\s?(?:#(?:[\da-f]{3}){1,2}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))\s?)/gi;
      inset = /inset/.test(value) ? 'inset' : inset;
      value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g,'') : value;
      currentColor = value.match(colRegEx);
      value = value.replace(currentColor[0],'').split(' ').concat([currentColor[0].replace(/\s/g,'')],[inset]);
      value = processShadowArray(value,tweenProp);
    } else if (value instanceof Array){
      value = processShadowArray(value,tweenProp);
    }
    return value;
  }
  var shadowPropOnStart = {};
  shadowProps.map(function (x){ return shadowPropOnStart[x]=onStartShadow; });
  var shadowFunctions = {
    prepareStart: getShadow,
    prepareProperty: prepareShadow,
    onStart: shadowPropOnStart
  };
  var shadowProperties = {
    component: 'shadowProperties',
    properties: shadowProps,
    defaultValues: {boxShadow :'0px 0px 0px 0px rgb(0,0,0)', textShadow: '0px 0px 0px rgb(0,0,0)'},
    Interpolate: {numbers: numbers,colors: colors},
    functions: shadowFunctions,
    Util: { processShadowArray: processShadowArray, trueColor: trueColor }
  };
  Components.ShadowProperties = shadowProperties;

  function textPropOnStart(tweenProp){
    if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem,a,b,v) {
        elem.style[tweenProp] = units(a.v,b.v,b.u,v);
      };
    }
  }

  var textProps = ['fontSize','lineHeight','letterSpacing','wordSpacing'];
  var textOnStart = {};
  textProps.forEach(function (tweenProp) {
    textOnStart[tweenProp] = textPropOnStart;
  });
  function getTextProp(prop) {
    return getStyleForProperty(this.element,prop) || defaultValues[prop];
  }
  function prepareTextProp(prop,value) {
    return trueDimension(value);
  }
  var textPropFunctions = {
    prepareStart: getTextProp,
    prepareProperty: prepareTextProp,
    onStart: textOnStart
  };
  var textProperties = {
    component: 'textProperties',
    category: 'textProperties',
    properties: textProps,
    defaultValues: {fontSize:0,lineHeight:0,letterSpacing:0,wordSpacing:0},
    Interpolate: {units: units},
    functions: textPropFunctions,
    Util: {trueDimension: trueDimension}
  };
  Components.TextProperties = textProperties;

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

  function arrays(a,b,v){
    var result = [];
    for ( var i=0, l=b.length; i<l; i++ ) {
      result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0 ) / 1000;
    }
    return result
  }

  var CSS3Matrix = typeof(DOMMatrix) !== 'undefined' ? DOMMatrix
                   : typeof(WebKitCSSMatrix) !== 'undefined' ? WebKitCSSMatrix
                   : typeof(CSSMatrix) !== 'undefined' ? CSSMatrix
                   : typeof(MSCSSMatrix) !== 'undefined' ? MSCSSMatrix
                   : null;
  var onStartTransform = {
    transform : function(tweenProp) {
      if (this.valuesEnd[tweenProp] && !KUTE[tweenProp]) {
        KUTE[tweenProp] = function (elem, a, b, v) {
          var matrix = new CSS3Matrix(), transformObject = {};
          for ( var p in b ) {
            transformObject[p] = p === 'perspective' ? numbers(a[p],b[p],v) : arrays(a[p],b[p],v);
          }
          transformObject.perspective && (matrix.m34 = -1/transformObject.perspective);
          matrix = transformObject.translate3d ? (matrix.translate(transformObject.translate3d[0],transformObject.translate3d[1],transformObject.translate3d[2])) : matrix;
          matrix = transformObject.rotate3d ? (matrix.rotate(transformObject.rotate3d[0],transformObject.rotate3d[1],transformObject.rotate3d[2])) : matrix;
          if (transformObject.skew) {
            matrix = transformObject.skew[0] ? matrix.skewX(transformObject.skew[0]) : matrix;
            matrix = transformObject.skew[1] ? matrix.skewY(transformObject.skew[1]) : matrix;
          }
          matrix = transformObject.scale3d ? (matrix.scale(transformObject.scale3d[0],transformObject.scale3d[1],transformObject.scale3d[2])): matrix;
          elem.style[tweenProp] = matrix.toString();
        };
      }
    },
    CSS3Matrix: function(prop) {
      if (this.valuesEnd.transform){
        !KUTE[prop] && (KUTE[prop] = CSS3Matrix);
      }
    },
  };

  var matrixComponent = 'transformMatrix';
  function getTransform(tweenProp, value){
    var transformObject = {};
    if (this.element[matrixComponent]) {
      var currentValue = this.element[matrixComponent];
      for (var vS in currentValue) {
        transformObject[vS] = currentValue[vS];
      }
    } else {
      for (var vE in value){
        transformObject[vE] = vE === 'perspective' ? value[vE] : defaultValues.transform[vE];
      }
    }
    return transformObject
  }
  function prepareTransform(tweenProp,value){
    if ( typeof(value) === 'object' && !value.length) {
      var pv,
          transformObject = {},
          translate3dObj = {},
          rotate3dObj = {},
          scale3dObj = {},
          skewObj = {},
          axis = [{translate3d:translate3dObj},{rotate3d:rotate3dObj},{skew:skewObj},{scale3d:scale3dObj}];
      var loop = function ( prop ) {
        if ( /3d/.test(prop) && typeof(value[prop]) === 'object' && value[prop].length ){
          pv = value[prop].map( function (v) { return prop === 'scale3d' ? parseFloat(v) : parseInt(v); } );
          transformObject[prop] = prop === 'scale3d' ? [pv[0]||1, pv[1]||1, pv[2]||1] : [pv[0]||0, pv[1]||0, pv[2]||0];
        } else if ( /[XYZ]/.test(prop) ) {
          var obj = /translate/.test(prop) ? translate3dObj
                  : /rotate/.test(prop) ? rotate3dObj
                  : /scale/.test(prop) ? scale3dObj
                  : /skew/.test(prop) ? skewObj : {};
          var idx = prop.replace(/translate|rotate|scale|skew/,'').toLowerCase();
          obj[idx] = /scale/.test(prop) ? parseFloat(value[prop]) : parseInt(value[prop]);
        } else if ('skew' === prop ) {
          pv = value[prop].map(function (v) { return parseInt(v)||0; });
          transformObject[prop] = [pv[0]||0, pv[1]||0];
        } else {
          transformObject[prop] = parseInt(value[prop]);
        }
      };
      for (var prop in value) loop( prop );
      axis.map(function (o) {
        var tp = Object.keys(o)[0], tv = o[tp];
        if ( Object.keys(tv).length && !transformObject[tp]) {
          transformObject[tp] = tp === 'scale3d' ? [tv.x || 1, tv.y || 1, tv.z || 1]
                              : tp === 'skew' ? [tv.x || 0, tv.y || 0]
                              : [tv.x || 0, tv.y || 0, tv.z || 0];
        }
      });
      return transformObject;
    } else {
      console.error(("KUTE.js - \"" + value + "\" is not valid/supported transform function"));
    }
  }
  function onCompleteTransform(tweenProp){
    if (this.valuesEnd[tweenProp]) {
      this.element[matrixComponent] = {};
      for (var tf in this.valuesEnd[tweenProp]){
        this.element[matrixComponent][tf] = this.valuesEnd[tweenProp][tf];
      }
    }
  }
  function crossCheckTransform(tweenProp){
    if (this.valuesEnd[tweenProp]) {
      if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective){
        this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
      }
    }
  }
  var matrixFunctions = {
    prepareStart: getTransform,
    prepareProperty: prepareTransform,
    onStart: onStartTransform,
    onComplete: onCompleteTransform,
    crossCheck: crossCheckTransform
  };
  var matrixTransform = {
    component: matrixComponent,
    property: 'transform',
    defaultValue: {perspective:400,translate3d:[0,0,0],translateX:0,translateY:0,translateZ:0,rotate3d:[0,0,0],rotateX:0,rotateY:0,rotateZ:0,skew:[0,0],skewX:0,skewY:0,scale3d:[1,1,1],scaleX:1,scaleY:1,scaleZ:1},
    functions: matrixFunctions,
    Interpolate: {
      perspective: numbers,
      translate3d: arrays,
      rotate3d: arrays,
      skew: arrays,
      scale3d: arrays
    }
  };
  Components.TransformMatrix = matrixTransform;

  for (var component in Components) {
    var compOps = Components[component];
    Components[component] = new AnimationDevelopment(compOps);
  }
  var indexExtra = {
    Animation: AnimationDevelopment,
    Components: Components,
    Tween: TweenExtra,
    fromTo: fromTo,
    to: to,
    TweenCollection: TweenCollection,
    ProgressBar: ProgressBar,
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

  return indexExtra;

})));
