/*!
* KUTE.js Base v2.0.16 (http://thednp.github.io/kute.js)
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

  var defaultOptions = {
    duration: 700,
    delay: 0,
    easing: 'linear'
  };

  var linkProperty = {};

  var onComplete = {};

  var Objects = {
    defaultOptions: defaultOptions,
    linkProperty: linkProperty,
    onStart: onStart,
    onComplete: onComplete
  };

  var Util = {};

  var connect = {};

  var Easing = {
    linear : function (t) { return t; },
    easingQuadraticIn : function (t) { return t*t; },
    easingQuadraticOut : function (t) { return t*(2-t); },
    easingQuadraticInOut : function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; },
    easingCubicIn : function (t) { return t*t*t; },
    easingCubicOut : function (t) { return (--t)*t*t+1; },
    easingCubicInOut : function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },
    easingCircularIn : function (t) { return -(Math.sqrt(1 - (t * t)) - 1); },
    easingCircularOut : function (t) { return Math.sqrt(1 - (t = t - 1) * t); },
    easingCircularInOut : function (t) { return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); },
    easingBackIn : function (t) { var s = 1.70158; return t * t * ((s + 1) * t - s) },
    easingBackOut : function (t) { var s = 1.70158; return --t * t * ((s + 1) * t + s) + 1 },
    easingBackInOut : function (t) {
      var s = 1.70158 * 1.525;
      if ((t *= 2) < 1) { return 0.5 * (t * t * ((s + 1) * t - s)) }
      return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
    }
  };
  function processEasing(fn) {
    if ( typeof fn === 'function') {
      return fn;
    } else if ( typeof Easing[fn] === 'function' ) {
      return Easing[fn];
    } else {
      return Easing.linear
    }
  }
  connect.processEasing = processEasing;

  function add (tw) { return Tweens.push(tw); }

  function remove (tw) {
    var i = Tweens.indexOf(tw);
    i !== -1 && Tweens.splice(i, 1);
  }

  function getAll () { return Tweens; }

  function removeAll () { Tweens.length = 0; }

  var supportedProperties = {};

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

  var AnimationBase = function AnimationBase(Component){
    return this.setComponent(Component)
  };
  AnimationBase.prototype.setComponent = function setComponent (Component){
    var ComponentName = Component.component;
    var Functions = { onStart: onStart, onComplete: onComplete };
    var Category = Component.category;
    var Property = Component.property;
    supportedProperties[ComponentName] = Component.properties || Component.subProperties || Component.property;
    if (Component.defaultOptions) {
      for (var op in Component.defaultOptions) {
        defaultOptions[op] = Component.defaultOptions[op];
      }
    }
    if (Component.functions) {
      for (var fn in Functions) {
        if (fn in Component.functions) {
          if ( typeof (Component.functions[fn]) === 'function') {
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
    return {name:ComponentName}
  };

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

  function fromTo(element, startObject, endObject, optionsObj) {
    optionsObj = optionsObj || {};
    return new connect.tween(selector(element), startObject, endObject, optionsObj)
  }

  function numbers(a, b, v) {
    a = +a; b -= a; return a + b * v;
  }

  function arrays(a,b,v){
    var result = [];
    for ( var i=0, l=b.length; i<l; i++ ) {
      result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0 ) / 1000;
    }
    return result
  }

  var matrixComponent = 'transformMatrixBase';
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
  var baseMatrixTransform = {
    component: matrixComponent,
    property: 'transform',
    functions: {onStart: onStartTransform},
    Interpolate: {
      perspective: numbers,
      translate3d: arrays,
      rotate3d: arrays,
      skew: arrays,
      scale3d: arrays
    }
  };

  function boxModelOnStart(tweenProp){
    if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = (v > 0.99 || v < 0.01 ? ((numbers(a,b,v)*10)>>0)/10 : (numbers(a,b,v) ) >> 0) + "px";
      };
    }
  }
  var baseBoxProps = ['top','left','width','height'];
  var baseBoxOnStart = {};
  baseBoxProps.map(function (x){ return baseBoxOnStart[x] = boxModelOnStart; });
  var baseBoxModel = {
    component: 'baseBoxModel',
    category: 'boxModel',
    properties: baseBoxProps,
    Interpolate: {numbers: numbers},
    functions: {onStart: baseBoxOnStart}
  };

  function onStartOpacity(tweenProp){
    if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = ((numbers(a,b,v) * 1000)>>0)/1000;
      };
    }
  }
  var baseOpacity = {
    component: 'baseOpacity',
    property: 'opacity',
    Interpolate: {numbers: numbers},
    functions: {onStart: onStartOpacity}
  };

  var Transform = new AnimationBase(baseMatrixTransform);
  var BoxModel = new AnimationBase(baseBoxModel);
  var Opacity = new AnimationBase(baseOpacity);
  var indexBase = {
    Animation: AnimationBase,
    Components: {
      Transform: Transform,
      BoxModel: BoxModel,
      Opacity: Opacity,
    },
    Tween: TweenBase,
    fromTo: fromTo,
    Objects: Objects,
    Easing: Easing,
    Util: Util,
    Render: Render,
    Interpolate: Interpolate,
    Internals: Internals,
    Selector: selector,
    Version: version
  };

  return indexBase;

})));
