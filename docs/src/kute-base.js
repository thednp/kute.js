/*!
* KUTE.js Base v2.2.4 (http://thednp.github.io/kute.js)
* Copyright 2015-2022 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KUTE = factory());
})(this, (function () { 'use strict';

  /**
   * The KUTE.js Execution Context
   */
  var KEC = {};

  var Tweens = [];

  var gl0bal;

  if (typeof global !== 'undefined') { gl0bal = global; }
  else if (typeof window !== 'undefined') { gl0bal = window.self; }
  else { gl0bal = {}; }

  var globalObject = gl0bal;

  // KUTE.js INTERPOLATE FUNCTIONS
  // =============================
  var interpolate = {};

  // schedule property specific function on animation start
  // link property update function to KUTE.js execution context
  var onStart = {};

  // Include a performance.now polyfill.
  // source https://github.com/tweenjs/tween.js/blob/master/src/Now.ts
  var performanceNow;

  // In node.js, use process.hrtime.
  // eslint-disable-next-line
  // @ts-ignore
  if (typeof self === 'undefined' && typeof process !== 'undefined' && process.hrtime) {
    performanceNow = function () {
      // eslint-disable-next-line
  		// @ts-ignore
      var time = process.hrtime();

      // Convert [seconds, nanoseconds] to milliseconds.
      return time[0] * 1000 + time[1] / 1000000;
    };
  } else if (typeof self !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
    // In a browser, use self.performance.now if it is available.
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    performanceNow = self.performance.now.bind(self.performance);
  } else if (typeof Date !== 'undefined' && Date.now) {
    // Use Date.now if it is available.
    performanceNow = Date.now;
  } else {
    // Otherwise, use 'new Date().getTime()'.
    performanceNow = function () { return new Date().getTime(); };
  }

  var now = performanceNow;

  var Time = {};
  Time.now = now;

  // eslint-disable-next-line import/no-mutable-exports -- impossible to satisfy
  var Tick = 0;

  /**
   *
   * @param {number | Date} time
   */
  var Ticker = function (time) {
    var i = 0;
    while (i < Tweens.length) {
      if (Tweens[i].update(time)) {
        i += 1;
      } else {
        Tweens.splice(i, 1);
      }
    }
    Tick = requestAnimationFrame(Ticker);
  };

  // stop requesting animation frame
  function stop() {
    setTimeout(function () { // re-added for #81
      if (!Tweens.length && Tick) {
        cancelAnimationFrame(Tick);
        Tick = null;
        Object.keys(onStart).forEach(function (obj) {
          if (typeof (onStart[obj]) === 'function') {
            if (KEC[obj]) { delete KEC[obj]; }
          } else {
            Object.keys(onStart[obj]).forEach(function (prop) {
              if (KEC[prop]) { delete KEC[prop]; }
            });
          }
        });

        Object.keys(interpolate).forEach(function (i) {
          if (KEC[i]) { delete KEC[i]; }
        });
      }
    }, 64);
  }

  // render update functions
  // =======================
  var Render = {
    Tick: Tick, Ticker: Ticker, Tweens: Tweens, Time: Time,
  };
  Object.keys(Render).forEach(function (blob) {
    if (!KEC[blob]) {
      KEC[blob] = blob === 'Time' ? Time.now : Render[blob];
    }
  });

  globalObject._KUTE = KEC;

  var defaultOptions = {
    duration: 700,
    delay: 0,
    easing: 'linear',
    repeat: 0,
    repeatDelay: 0,
    yoyo: false,
    resetStart: false,
    offset: 0,
  };

  // link properties to interpolate functions
  var linkProperty = {};

  // schedule property specific function on animation complete
  var onComplete = {};

  var Objects = {
    defaultOptions: defaultOptions,
    linkProperty: linkProperty,
    onStart: onStart,
    onComplete: onComplete,
  };

  // util - a general object for utils like rgbToHex, processEasing
  var Util = {};

  var connect = {};
  /** @type {KUTE.TweenBase | KUTE.Tween | KUTE.TweenExtra} */
  connect.tween = null;
  connect.processEasing = null;

  // Select Robert Penner's Easing Functions
  // updated for ESLint
  var Easing = {
    /** @type {KUTE.easingFunction} */
    linear: function (t) { return t; },
    /** @type {KUTE.easingFunction} */
    easingQuadraticIn: function (t) { return t * t; },
    /** @type {KUTE.easingFunction} */
    easingQuadraticOut: function (t) { return t * (2 - t); },
    /** @type {KUTE.easingFunction} */
    easingQuadraticInOut: function (t) { return (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); },
    /** @type {KUTE.easingFunction} */
    easingCubicIn: function (t) { return t * t * t; },
    /** @type {KUTE.easingFunction} */
    easingCubicOut: function (t0) { var t = t0 - 1; return t * t * t + 1; },
    /** @type {KUTE.easingFunction} */
    easingCubicInOut: function (t) { return (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1); },
    /** @type {KUTE.easingFunction} */
    easingCircularIn: function (t) { return -(Math.sqrt(1 - (t * t)) - 1); },
    /** @type {KUTE.easingFunction} */
    easingCircularOut: function (t0) { var t = t0 - 1; return Math.sqrt(1 - t * t); },
    /** @type {KUTE.easingFunction} */
    easingCircularInOut: function (t0) {
      var t = t0 * 2;
      if (t < 1) { return -0.5 * (Math.sqrt(1 - t * t) - 1); }
      t -= 2; return 0.5 * (Math.sqrt(1 - t * t) + 1);
    },
    /** @type {KUTE.easingFunction} */
    easingBackIn: function (t) { var s = 1.70158; return t * t * ((s + 1) * t - s); },
    /** @type {KUTE.easingFunction} */
    easingBackOut: function (t0) {
      var s = 1.70158;
      var t = t0 - 1;
      return t * t * ((s + 1) * t + s) + 1;
    },
    /** @type {KUTE.easingFunction} */
    easingBackInOut: function (t0) {
      var s = 1.70158 * 1.525;
      var t = t0 * 2;
      if (t < 1) { return 0.5 * (t * t * ((s + 1) * t - s)); }
      t -= 2; return 0.5 * (t * t * ((s + 1) * t + s) + 2);
    },
  };

  /**
   * Returns a valid `easingFunction`.
   *
   * @param {KUTE.easingFunction | string} fn function name or constructor name
   * @returns {KUTE.easingFunction} a valid easing function
   */
  function processEasing(fn) {
    if (typeof fn === 'function') {
      return fn;
    } if (typeof Easing[fn] === 'function') {
      return Easing[fn]; // regular Robert Penner Easing Functions
    }
    return Easing.linear;
  }

  connect.processEasing = processEasing;

  /**
   * KUTE.add(Tween)
   *
   * @param {KUTE.Tween} tw a new tween to add
   */
  var add = function (tw) { return Tweens.push(tw); };

  /**
   * KUTE.remove(Tween)
   *
   * @param {KUTE.Tween} tw a new tween to add
   */
  var remove = function (tw) {
    var i = Tweens.indexOf(tw);
    if (i !== -1) { Tweens.splice(i, 1); }
  };

  /**
   * KUTE.add(Tween)
   *
   * @return {KUTE.Tween[]} tw a new tween to add
   */
  var getAll = function () { return Tweens; };

  /**
   * KUTE.removeAll()
   */
  var removeAll = function () { Tweens.length = 0; };

  // all supported properties
  var supportedProperties = {};

  /**
   * linkInterpolation
   * @this {KUTE.Tween}
   */
  function linkInterpolation() {
    var this$1$1 = this;
   // DON'T change
    Object.keys(linkProperty).forEach(function (component) {
      var componentLink = linkProperty[component];
      var componentProps = supportedProperties[component];

      Object.keys(componentLink).forEach(function (fnObj) {
        if (typeof (componentLink[fnObj]) === 'function' // ATTR, colors, scroll, boxModel, borderRadius
            && Object.keys(this$1$1.valuesEnd).some(function (i) { return (componentProps && componentProps.includes(i))
            || (i === 'attr' && Object.keys(this$1$1.valuesEnd[i]).some(function (j) { return componentProps && componentProps.includes(j); })); })) {
          if (!KEC[fnObj]) { KEC[fnObj] = componentLink[fnObj]; }
        } else {
          Object.keys(this$1$1.valuesEnd).forEach(function (prop) {
            var propObject = this$1$1.valuesEnd[prop];
            if (propObject instanceof Object) {
              Object.keys(propObject).forEach(function (i) {
                if (typeof (componentLink[i]) === 'function') { // transformCSS3
                  if (!KEC[i]) { KEC[i] = componentLink[i]; }
                } else {
                  Object.keys(componentLink[fnObj]).forEach(function (j) {
                    if (componentLink[i] && typeof (componentLink[i][j]) === 'function') { // transformMatrix
                      if (!KEC[j]) { KEC[j] = componentLink[i][j]; }
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  var internals = {
    add: add,
    remove: remove,
    getAll: getAll,
    removeAll: removeAll,
    stop: stop,
    linkInterpolation: linkInterpolation,
  };

  /**
   * selector
   *
   * A selector utility for KUTE.js.
   *
   * @param {KUTE.selectorType} el target(s) or string selector
   * @param {boolean | number} multi when true returns an array/collection of elements
   * @returns {Element | Element[] | null}
   */
  function selector(el, multi) {
    try {
      var requestedElem;
      var itemsArray;
      if (multi) {
        itemsArray = el instanceof Array && el.every(function (x) { return x instanceof Element; });
        requestedElem = el instanceof HTMLCollection || el instanceof NodeList || itemsArray
          ? el : document.querySelectorAll(el);
      } else {
        requestedElem = el instanceof Element || el === window // scroll
          ? el : document.querySelector(el);
      }
      return requestedElem;
    } catch (e) {
      throw TypeError(("KUTE.js - Element(s) not found: " + el + "."));
    }
  }

  /**
   * Animation Base Class
   *
   * Registers components by populating KUTE.js objects and makes sure
   * no duplicate component / property is allowed.
   *
   * This class only registers the minimal amount of component information
   * required to enable components animation, which means value processing
   * as well as `to()` and `allTo()` methods are not supported.
   */
  var AnimationBase = function AnimationBase(Component) {
    var ComponentName = Component.component;
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty }
    var Functions = { onStart: onStart, onComplete: onComplete };
    var Category = Component.category;
    var Property = Component.property;
    // ESLint
    this._ = 0;

    // set supported category/property
    supportedProperties[ComponentName] = Component.properties
      || Component.subProperties || Component.property;

    // set additional options
    if (Component.defaultOptions) {
      // Object.keys(Component.defaultOptions).forEach((op) => {
      // defaultOptions[op] = Component.defaultOptions[op];
      // });
      Object.assign(defaultOptions, Component.defaultOptions);
    }

    // set functions
    if (Component.functions) {
      Object.keys(Functions).forEach(function (fn) {
        if (fn in Component.functions) {
          if (typeof (Component.functions[fn]) === 'function') {
            // if (!Functions[fn][ Category||Property ]) {
            // Functions[fn][ Category||Property ] = Component.functions[fn];
            // }
            if (!Functions[fn][ComponentName]) { Functions[fn][ComponentName] = {}; }
            if (!Functions[fn][ComponentName][Category || Property]) {
              Functions[fn][ComponentName][Category || Property] = Component.functions[fn];
            }
          } else {
            Object.keys(Component.functions[fn]).forEach(function (ofn) {
              // if (!Functions[fn][ofn]) Functions[fn][ofn] = Component.functions[fn][ofn];
              if (!Functions[fn][ComponentName]) { Functions[fn][ComponentName] = {}; }
              if (!Functions[fn][ComponentName][ofn]) {
                Functions[fn][ComponentName][ofn] = Component.functions[fn][ofn];
              }
            });
          }
        }
      });
    }

    // set interpolate
    if (Component.Interpolate) {
      Object.keys(Component.Interpolate).forEach(function (fni) {
        var compIntObj = Component.Interpolate[fni];
        if (typeof (compIntObj) === 'function' && !interpolate[fni]) {
          interpolate[fni] = compIntObj;
        } else {
          Object.keys(compIntObj).forEach(function (sfn) {
            if (typeof (compIntObj[sfn]) === 'function' && !interpolate[fni]) {
              interpolate[fni] = compIntObj[sfn];
            }
          });
        }
      });

      linkProperty[ComponentName] = Component.Interpolate;
    }

    // set component util
    if (Component.Util) {
      Object.keys(Component.Util).forEach(function (fnu) {
        if (!Util[fnu]) { Util[fnu] = Component.Util[fnu]; }
      });
    }

    return { name: ComponentName };
  };

  /**
   * Perspective Interpolation Function.
   *
   * @param {number} a start value
   * @param {number} b end value
   * @param {string} u unit
   * @param {number} v progress
   * @returns {string} the perspective function in string format
   */
  function perspective(a, b, u, v) {
    // eslint-disable-next-line no-bitwise
    return ("perspective(" + (((a + (b - a) * v) * 1000 >> 0) / 1000) + u + ")");
  }

  /**
   * Translate 3D Interpolation Function.
   *
   * @param {number[]} a start [x,y,z] position
   * @param {number[]} b end [x,y,z] position
   * @param {string} u unit, usually `px` degrees
   * @param {number} v progress
   * @returns {string} the interpolated 3D translation string
   */
  function translate3d(a, b, u, v) {
    var translateArray = [];
    for (var ax = 0; ax < 3; ax += 1) {
      translateArray[ax] = (a[ax] || b[ax]
        // eslint-disable-next-line no-bitwise
        ? ((a[ax] + (b[ax] - a[ax]) * v) * 1000 >> 0) / 1000 : 0) + u;
    }
    return ("translate3d(" + (translateArray.join(',')) + ")");
  }

  /**
   * 3D Rotation Interpolation Function.
   *
   * @param {number} a start [x,y,z] angles
   * @param {number} b end [x,y,z] angles
   * @param {string} u unit, usually `deg` degrees
   * @param {number} v progress
   * @returns {string} the interpolated 3D rotation string
   */
  function rotate3d(a, b, u, v) {
    var rotateStr = '';
    // eslint-disable-next-line no-bitwise
    rotateStr += a[0] || b[0] ? ("rotateX(" + (((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u + ")") : '';
    // eslint-disable-next-line no-bitwise
    rotateStr += a[1] || b[1] ? ("rotateY(" + (((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u + ")") : '';
    // eslint-disable-next-line no-bitwise
    rotateStr += a[2] || b[2] ? ("rotateZ(" + (((a[2] + (b[2] - a[2]) * v) * 1000 >> 0) / 1000) + u + ")") : '';
    return rotateStr;
  }

  /**
   * Translate 2D Interpolation Function.
   *
   * @param {number[]} a start [x,y] position
   * @param {number[]} b end [x,y] position
   * @param {string} u unit, usually `px` degrees
   * @param {number} v progress
   * @returns {string} the interpolated 2D translation string
   */
  function translate(a, b, u, v) {
    var translateArray = [];
    // eslint-disable-next-line no-bitwise
    translateArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u;
    // eslint-disable-next-line no-bitwise
    translateArray[1] = a[1] || b[1] ? ((a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u) : '0';
    return ("translate(" + (translateArray.join(',')) + ")");
  }

  /**
   * 2D Rotation Interpolation Function.
   *
   * @param {number} a start angle
   * @param {number} b end angle
   * @param {string} u unit, usually `deg` degrees
   * @param {number} v progress
   * @returns {string} the interpolated rotation
   */
  function rotate(a, b, u, v) {
    // eslint-disable-next-line no-bitwise
    return ("rotate(" + (((a + (b - a) * v) * 1000 >> 0) / 1000) + u + ")");
  }

  /**
   * Scale Interpolation Function.
   *
   * @param {number} a start scale
   * @param {number} b end scale
   * @param {number} v progress
   * @returns {string} the interpolated scale
   */
  function scale(a, b, v) {
    // eslint-disable-next-line no-bitwise
    return ("scale(" + (((a + (b - a) * v) * 1000 >> 0) / 1000) + ")");
  }

  /**
   * Skew Interpolation Function.
   *
   * @param {number} a start {x,y} angles
   * @param {number} b end {x,y} angles
   * @param {string} u unit, usually `deg` degrees
   * @param {number} v progress
   * @returns {string} the interpolated string value of skew(s)
   */
  function skew(a, b, u, v) {
    var skewArray = [];
    // eslint-disable-next-line no-bitwise
    skewArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u;
    // eslint-disable-next-line no-bitwise
    skewArray[1] = a[1] || b[1] ? ((a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u) : '0';
    return ("skew(" + (skewArray.join(',')) + ")");
  }

  // Component Functions
  /**
   * Sets the property update function.
   * * same to svgTransform, htmlAttributes
   * @param {string} tweenProp the property name
   */
  function onStartTransform(tweenProp) {
    if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        // eslint-disable-next-line no-param-reassign
        elem.style[tweenProp] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, 'px', v) : '') // one side might be 0
          + (a.translate3d ? translate3d(a.translate3d, b.translate3d, 'px', v) : '') // array [x,y,z]
          + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, 'deg', v) : '') // array [x,y,z]
          + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
          + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
      };
    }
  }

  // Base Component
  var TransformFunctionsBase = {
    component: 'baseTransform',
    property: 'transform',
    functions: { onStart: onStartTransform },
    Interpolate: {
      perspective: perspective,
      translate3d: translate3d,
      rotate3d: rotate3d,
      translate: translate,
      rotate: rotate,
      scale: scale,
      skew: skew,
    },
  };

  /**
   * Numbers Interpolation Function.
   *
   * @param {number} a start value
   * @param {number} b end value
   * @param {number} v progress
   * @returns {number} the interpolated number
   */
  function numbers(a, b, v) {
    var A = +a;
    var B = b - a;
    // a = +a; b -= a;
    return A + B * v;
  }

  // Component Functions
  /**
   * Sets the update function for the property.
   * @param {string} tweenProp the property name
   */
  function boxModelOnStart(tweenProp) {
    if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        /* eslint-disable no-param-reassign -- impossible to satisfy */
        /* eslint-disable no-bitwise -- impossible to satisfy */
        elem.style[tweenProp] = (v > 0.99 || v < 0.01
          ? ((numbers(a, b, v) * 10) >> 0) / 10
          : (numbers(a, b, v)) >> 0) + "px";
        /* eslint-enable no-bitwise */
        /* eslint-enable no-param-reassign */
      };
    }
  }

  // Component Base Props
  var baseBoxProps = ['top', 'left', 'width', 'height'];
  var baseBoxOnStart = {};
  baseBoxProps.forEach(function (x) { baseBoxOnStart[x] = boxModelOnStart; });

  // Component Base
  var BoxModelBase = {
    component: 'baseBoxModel',
    category: 'boxModel',
    properties: baseBoxProps,
    Interpolate: { numbers: numbers },
    functions: { onStart: baseBoxOnStart },
  };

  /* opacityProperty = {
    property: 'opacity',
    defaultValue: 1,
    interpolators: {numbers},
    functions = { prepareStart, prepareProperty, onStart }
  } */

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartOpacity(tweenProp/* , value */) {
    // opacity could be 0 sometimes, we need to check regardless
    if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        /* eslint-disable */
        elem.style[tweenProp] = ((numbers(a, b, v) * 1000) >> 0) / 1000;
        /* eslint-enable */
      };
    }
  }

  // Base Component
  var OpacityPropertyBase = {
    component: 'baseOpacity',
    property: 'opacity',
    // defaultValue: 1,
    Interpolate: { numbers: numbers },
    functions: { onStart: onStartOpacity },
  };

  // import {baseCrossBrowserMove} from '../components/crossBrowserMove'
  // support for kute-base ends here

  var Components = {
    Transform: new AnimationBase(TransformFunctionsBase),
    BoxModel: new AnimationBase(BoxModelBase),
    Opacity: new AnimationBase(OpacityPropertyBase),
  };

  function queueStart() {
    var this$1$1 = this;

    // fire onStart actions
    Object.keys(onStart).forEach(function (obj) {
      if (typeof (onStart[obj]) === 'function') {
        onStart[obj].call(this$1$1, obj); // easing functions
      } else {
        Object.keys(onStart[obj]).forEach(function (prop) {
          onStart[obj][prop].call(this$1$1, prop);
        });
      }
    });

    // add interpolations
    linkInterpolation.call(this);
  }

  /**
   * The `TweenBase` constructor creates a new `Tween` object
   * for a single `HTMLElement` and returns it.
   *
   * `TweenBase` is meant to be used with pre-processed values.
   */
  var TweenBase = function TweenBase(targetElement, startObject, endObject, opsObject) {
    var this$1$1 = this;

    // element animation is applied to
    this.element = targetElement;

    /** @type {boolean} */
    this.playing = false;
    /** @type {number?} */
    this._startTime = null;
    /** @type {boolean} */
    this._startFired = false;

    // type is set via KUTE.tweenProps
    this.valuesEnd = endObject;
    this.valuesStart = startObject;

    // OPTIONS
    var options = opsObject || {};
    // internal option to process inline/computed style at start instead of init
    // used by to() method and expects object : {} / false
    this._resetStart = options.resetStart || 0;
    // you can only set a core easing function as default
    /** @type {KUTE.easingOption} */
    this._easing = typeof (options.easing) === 'function' ? options.easing : connect.processEasing(options.easing);
    /** @type {number} */
    this._duration = options.duration || defaultOptions.duration; // duration option | default
    /** @type {number} */
    this._delay = options.delay || defaultOptions.delay; // delay option | default

    // set other options
    Object.keys(options).forEach(function (op) {
      var internalOption = "_" + op;
      if (!(internalOption in this$1$1)) { this$1$1[internalOption] = options[op]; }
    });

    // callbacks should not be set as undefined
    // this._onStart = options.onStart
    // this._onUpdate = options.onUpdate
    // this._onStop = options.onStop
    // this._onComplete = options.onComplete

    // queue the easing
    var easingFnName = this._easing.name;
    if (!onStart[easingFnName]) {
      onStart[easingFnName] = function easingFn(prop) {
        if (!KEC[prop] && prop === this._easing.name) { KEC[prop] = this._easing; }
      };
    }

    return this;
  };

  /**
   * Starts tweening
   * @param {number?} time the tween start time
   * @returns {TweenBase} this instance
   */
  TweenBase.prototype.start = function start (time) {
    // now it's a good time to start
    add(this);
    this.playing = true;

    this._startTime = typeof time !== 'undefined' ? time : KEC.Time();
    this._startTime += this._delay;

    if (!this._startFired) {
      if (this._onStart) {
        this._onStart.call(this);
      }

      queueStart.call(this);

      this._startFired = true;
    }

    if (!Tick) { Ticker(); }
    return this;
  };

  /**
   * Stops tweening
   * @returns {TweenBase} this instance
   */
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

  /**
   * Trigger internal completion callbacks.
   */
  TweenBase.prototype.close = function close () {
      var this$1$1 = this;

    // scroll|transformMatrix need this
    Object.keys(onComplete).forEach(function (component) {
      Object.keys(onComplete[component]).forEach(function (toClose) {
        onComplete[component][toClose].call(this$1$1, toClose);
      });
    });
    // when all animations are finished, stop ticking after ~3 frames
    this._startFired = false;
    stop.call(this);
  };

  /**
   * Schedule another tween instance to start once this one completes.
   * @param {KUTE.chainOption} args the tween animation start time
   * @returns {TweenBase} this instance
   */
  TweenBase.prototype.chain = function chain (args) {
    this._chain = [];
    this._chain = args.length ? args : this._chain.concat(args);
    return this;
  };

  /**
   * Stop tweening the chained tween instances.
   */
  TweenBase.prototype.stopChainedTweens = function stopChainedTweens () {
    if (this._chain && this._chain.length) { this._chain.forEach(function (tw) { return tw.stop(); }); }
  };

  /**
   * Update the tween on each tick.
   * @param {number} time the tick time
   * @returns {boolean} this instance
   */
  TweenBase.prototype.update = function update (time) {
      var this$1$1 = this;

    var T = time !== undefined ? time : KEC.Time();

    var elapsed;

    if (T < this._startTime && this.playing) { return true; }

    elapsed = (T - this._startTime) / this._duration;
    elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

    // calculate progress
    var progress = this._easing(elapsed);

    // render the update
    Object.keys(this.valuesEnd).forEach(function (tweenProp) {
      KEC[tweenProp](this$1$1.element,
        this$1$1.valuesStart[tweenProp],
        this$1$1.valuesEnd[tweenProp],
        progress);
    });

    // fire the updateCallback
    if (this._onUpdate) {
      this._onUpdate.call(this);
    }

    if (elapsed === 1) {
      // fire the complete callback
      if (this._onComplete) {
        this._onComplete.call(this);
      }

      // now we're sure no animation is running
      this.playing = false;

      // stop ticking when finished
      this.close();

      // start animating chained tweens
      if (this._chain !== undefined && this._chain.length) {
        this._chain.map(function (tw) { return tw.start(); });
      }

      return false;
    }

    return true;
  };

  // Update Tween Interface
  connect.tween = TweenBase;

  var TweenConstructor = connect.tween;

  /**
   * The `KUTE.fromTo()` static method returns a new Tween object
   * for a single `HTMLElement` at a given state.
   *
   * @param {Element} element target element
   * @param {KUTE.tweenProps} startObject
   * @param {KUTE.tweenProps} endObject
   * @param {KUTE.tweenOptions} optionsObj tween options
   * @returns {KUTE.Tween} the resulting Tween object
   */
  function fromTo(element, startObject, endObject, optionsObj) {
    var options = optionsObj || {};
    return new TweenConstructor(selector(element), startObject, endObject, options);
  }

  var version = "2.2.4";

  // @ts-ignore

  /**
   * A global namespace for library version.
   * @type {string}
   */
  var Version = version;

  var indexBase = {
    Animation: AnimationBase,
    Components: Components,

    Tween: TweenBase,
    fromTo: fromTo,

    Objects: Objects,
    Easing: Easing,
    Util: Util,
    Render: Render,
    Interpolate: interpolate,
    Internals: internals,
    Selector: selector,
    Version: Version,
  };

  return indexBase;

}));
