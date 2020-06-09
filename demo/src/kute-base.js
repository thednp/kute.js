/*!
* KUTE.js Base v2.0.0 (http://thednp.github.io/kute.js)
* Copyright 2015-2020 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.KUTE = factory());
}(this, (function () { 'use strict';

  var version = "2.0.0";

  var Tweens = [];
  var supportedProperties = {};
  var defaultOptions = {
    duration: 700,
    delay: 0,
    easing: 'linear'
  };
  var crossCheck = {};
  var onComplete = {};
  var onStart = {};
  var linkProperty = {};
  var Util = {};
  var BaseObjects = {
    defaultOptions: defaultOptions,
    linkProperty: linkProperty,
    onComplete: onComplete,
    onStart: onStart,
    supportedProperties: supportedProperties
  };

  function linear (t) { return t; }
  function easingQuadraticIn (t) { return t*t; }
  function easingQuadraticOut (t) { return t*(2-t); }
  function easingQuadraticInOut (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; }
  function easingCubicIn (t) { return t*t*t; }
  function easingCubicOut (t) { return (--t)*t*t+1; }
  function easingCubicInOut (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }
  function easingCircularIn (t) { return -(Math.sqrt(1 - (t * t)) - 1); }
  function easingCircularOut (t) { return Math.sqrt(1 - (t = t - 1) * t); }
  function easingCircularInOut (t) {  return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); }
  function easingBackIn (t) { var s = 1.70158; return t * t * ((s + 1) * t - s); }
  function easingBackOut (t) { var s = 1.70158; return --t * t * ((s + 1) * t + s) + 1; }
  function easingBackInOut (t) { var s = 1.70158 * 1.525;  if ((t *= 2) < 1) { return 0.5 * (t * t * ((s + 1) * t - s)); }  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2); }
  var Easing = {
    linear : linear,
    easingQuadraticIn : easingQuadraticIn,
    easingQuadraticOut : easingQuadraticOut,
    easingQuadraticInOut : easingQuadraticInOut,
    easingCubicIn : easingCubicIn,
    easingCubicOut : easingCubicOut,
    easingCubicInOut : easingCubicInOut,
    easingCircularIn : easingCircularIn,
    easingCircularOut : easingCircularOut,
    easingCircularInOut : easingCircularInOut,
    easingBackIn : easingBackIn,
    easingBackOut : easingBackOut,
    easingBackInOut : easingBackInOut
  };
  function processEasing(fn) {
    if ( typeof fn === 'function') {
      return fn;
    } else if ( typeof fn === 'string' ) {
      return Easing[fn];
    } else {
      return Easing.linear
    }
  }
  Util.processEasing = processEasing;

  var globalObject = typeof (global) !== 'undefined' ? global
                            : typeof(self) !== 'undefined' ? self
                            : typeof(window) !== 'undefined' ? window : {};
  var TweenConstructor = {};
  var KUTE = {};

  function numbers(a, b, v) {
    a = +a; b -= a; return a + b * v;
  }
  function units(a, b, u, v) {
    a = +a; b -= a; return ( a + b * v ) + u;
  }
  function arrays(a,b,v){
    var result = [];
    for ( var i=0, l=b.length; i<l; i++ ) {
      result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0 ) / 1000;
    }
    return result
  }
  var Interpolate = {
    numbers: numbers,
    units: units,
    arrays: arrays
  };

  var add = function(tw) { Tweens.push(tw); };
  var remove = function(tw) { var i = Tweens.indexOf(tw); if (i !== -1) { Tweens.splice(i, 1); }};
  var getAll = function() { return Tweens };
  var removeAll = function() { Tweens.length = 0; };
  var Tick = 0;
  function Ticker(time) {
    var i = 0;
    while ( i < Tweens.length ) {
      if ( Tweens[i].update(time) ) {
        i++;
      } else {
        Tweens.splice(i, 1);
      }
    }
    Tick = requestAnimationFrame(Ticker);
  }
  var Time = {};
  if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
  	Time.now = function () {
  		var time = process.hrtime();
  		return time[0] * 1000 + time[1] / 1000000;
  	};
  } else if (typeof (self) !== 'undefined' &&
           self.performance !== undefined &&
  		 self.performance.now !== undefined) {
  	Time.now = self.performance.now.bind(self.performance);
  }
  function stop () {
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
  function linkInterpolation(){
    var this$1 = this;
    var loop = function ( component ) {
      var componentLink = linkProperty[component];
      var componentProps = supportedProperties[component];
      for ( var fnObj in componentLink ) {
        if ( typeof(componentLink[fnObj]) === 'function'
            && Object.keys(this$1.valuesEnd).some(function (i) { return componentProps.includes(i)
            || i=== 'attr' && Object.keys(this$1.valuesEnd[i]).some(function (j) { return componentProps.includes(j); }); } ) )
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
  var Render = {Tick: Tick,Ticker: Ticker,Tweens: Tweens,Time: Time};
  for (var blob in Render ) {
    if (!KUTE[blob]) {
      KUTE[blob] = blob === 'Time' ? Time.now : Render[blob];
    }
  }
  globalObject["_KUTE"] = KUTE;
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
                     || el instanceof Array && el[0] instanceof Element
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
    this.Component = Component;
    return this.setComponent()
  };
  AnimationBase.prototype.setComponent = function setComponent (){
    var Component = this.Component;
    var ComponentName = Component.component;
    var Functions = { onStart: onStart, onComplete: onComplete, crossCheck: crossCheck };
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
        if (fn in Component.functions && ['onStart','onComplete'].includes(fn)) {
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
      for (var fn$1 in Component.Interpolate) {
        if (!Interpolate[fn$1]) {
          Interpolate[fn$1] = Component.Interpolate[fn$1];
        }
      }
      linkProperty[ComponentName] = Component.Interpolate;
    }
    if (Component.Util) {
      for (var fn$2 in Component.Util){
        !Util[fn$2] && (Util[fn$2] = Component.Util[fn$2]);
      }
    }
    return {name:ComponentName}
  };

  var TweenBase = function TweenBase(targetElement, startObject, endObject, options){
    this.element = targetElement;
    this.playing = false;
    this._startTime = null;
    this._startFired = false;
    this.valuesEnd = endObject;
    this.valuesStart = startObject;
    options = options || {};
    this._resetStart = options.resetStart || 0;
    this._easing = typeof (options.easing) === 'function' ? options.easing : Util.processEasing(options.easing);
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
    this._startTime = time || KUTE.Time();
    this._startTime += this._delay;
    if (!this._startFired) {
      if (this._onStart) {
        this._onStart.call(this);
      }
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
      return false;
    }
    return true;
  };
  TweenConstructor.Tween = TweenBase;

  var TC = TweenConstructor.Tween;
  function fromTo(element, startObject, endObject, optionsObj) {
    optionsObj = optionsObj || {};
    return new TC(selector(element), startObject, endObject, optionsObj)
  }

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
  function skew(a, b, u, v) {
    var skewArray = [];
    skewArray[0] = ( a[0]===b[0] ? b[0] : ( (a[0] + ( b[0] - a[0] ) * v ) * 1000 >> 0 ) / 1000 ) + u;
    skewArray[1] = a[1]||b[1] ? (( a[1]===b[1] ? b[1] : ( (a[1] + ( b[1] - a[1] ) * v ) * 1000 >> 0 ) / 1000 ) + u) : '0';
    return ("skew(" + (skewArray.join(',')) + ")");
  }
  function scale (a, b, v) {
    return ("scale(" + (((a + (b - a) * v) * 1000 >> 0 ) / 1000) + ")");
  }
  function onStartTransform(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] =
            (a.perspective||b.perspective ? perspective(a.perspective,b.perspective,'px',v) : '')
          + (a.translate3d ? translate3d(a.translate3d,b.translate3d,'px',v):'')
          + (a.translate ? translate(a.translate,b.translate,'px',v):'')
          + (a.rotate3d ? rotate3d(a.rotate3d,b.rotate3d,'deg',v):'')
          + (a.rotate||b.rotate ? rotate(a.rotate,b.rotate,'deg',v):'')
          + (a.skew ? skew(a.skew,b.skew,'deg',v):'')
          + (a.scale||b.scale ? scale(a.scale,b.scale,v):'');
      };
    }
  }
  var supportedTransformProperties = [
    'perspective',
    'translate3d', 'translateX', 'translateY', 'translateZ', 'translate',
    'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'rotate',
    'skewX', 'skewY', 'skew',
    'scale'
  ];
  var baseTransformOps = {
    component: 'transformFunctions',
    property: 'transform',
    subProperties: supportedTransformProperties,
    functions: {onStart: onStartTransform},
    Interpolate: {
      perspective: perspective,
      translate3d: translate3d,
      rotate3d: rotate3d,
      translate: translate, rotate: rotate, scale: scale, skew: skew
    },
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
  var baseBoxModelOps = {
    component: 'boxModelProps',
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
  var baseOpacityOps = {
    component: 'opacityProperty',
    property: 'opacity',
    Interpolate: {numbers: numbers},
    functions: {onStart: onStartOpacity}
  };

  function on (element, event, handler, options) {
    options = options || false;
    element.addEventListener(event, handler, options);
  }

  function off (element, event, handler, options) {
    options = options || false;
    element.removeEventListener(event, handler, options);
  }

  function one (element, event, handler, options) {
    on(element, event, function handlerWrapper(e){
      if (e.target === element) {
        handler(e);
        off(element, event, handlerWrapper, options);
      }
    }, options);
  }

  var supportPassive = (function () {
    var result = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          result = true;
        }
      });
      one(document, 'DOMContentLoaded', function (){}, opts);
    } catch (e) {}
    return result;
  })();

  var mouseHoverEvents = ('onmouseleave' in document) ? [ 'mouseenter', 'mouseleave'] : [ 'mouseover', 'mouseout' ];

  var canTouch = ('ontouchstart' in window || navigator && navigator.msMaxTouchPoints) || false;
  var touchOrWheel = canTouch ? 'touchstart' : 'mousewheel';
  var scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent) ? document.body : document.getElementsByTagName('HTML')[0];
  var passiveHandler = supportPassive ? { passive: false } : false;
  function preventScroll(e) {
    this.scrolling && e.preventDefault();
  }
  function getScrollTargets(){
    var el = this.element;
    return el === scrollContainer ? { el: document, st: document.body } : { el: el, st: el}
  }
  function scrollIn(){
    var targets = getScrollTargets.call(this);
    if ( 'scroll' in this.valuesEnd && !targets.el.scrolling) {
      targets.el.scrolling = 1;
      on( targets.el, mouseHoverEvents[0], preventScroll, passiveHandler);
      on( targets.el, touchOrWheel, preventScroll, passiveHandler);
      targets.st.style.pointerEvents = 'none';
    }
  }
  function scrollOut(){
    var targets = getScrollTargets.call(this);
    if ( 'scroll' in this.valuesEnd && targets.el.scrolling) {
      targets.el.scrolling = 0;
      off( targets.el, mouseHoverEvents[0], preventScroll, passiveHandler);
      off( targets.el, touchOrWheel, preventScroll, passiveHandler);
      targets.st.style.pointerEvents = '';
    }
  }
  function onStartScroll(tweenProp){
    if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.scrollTop = (numbers(a,b,v))>>0;
      };
    }
  }
  function onCompleteScroll(tweenProp){
    scrollOut.call(this);
  }
  var baseScrollOps = {
    component: 'scrollProperty',
    property: 'scroll',
    Interpolate: {numbers: numbers},
    functions: {
      onStart: onStartScroll,
      onComplete: onCompleteScroll
    },
    Util: { preventScroll: preventScroll, scrollIn: scrollIn, scrollOut: scrollOut, scrollContainer: scrollContainer, passiveHandler: passiveHandler, getScrollTargets: getScrollTargets }
  };

  var BaseTransform = new AnimationBase(baseTransformOps);
  var BaseBoxModel = new AnimationBase(baseBoxModelOps);
  var BaseOpacity = new AnimationBase(baseOpacityOps);
  var BaseScroll = new AnimationBase(baseScrollOps);
  var indexBase = {
    Animation: AnimationBase,
    Components: {
      BaseTransform: BaseTransform,
      BaseBoxModel: BaseBoxModel,
      BaseScroll: BaseScroll,
      BaseOpacity: BaseOpacity,
    },
    TweenBase: TweenBase,
    fromTo: fromTo,
    Objects: BaseObjects,
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
