/*!
* KUTE.js Extra v2.2.4 (http://thednp.github.io/kute.js)
* Copyright 2015-2022 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KUTE = factory());
})(this, (function () { 'use strict';

  /**
   * Creates cubic-bezier easing functions for animation engines.
   * @see http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h
   * 
   *
   * @class
   */
  var CubicBezier = function CubicBezier(x1, y1, x2, y2, functionName) {
    var this$1$1 = this;

    // pre-calculate the polynomial coefficients
    // First and last control points are implied to be (0.0, 0.0) and (1.0, 1.0)
    var p1x = x1 || 0;
    var p1y = y1 || 0;
    var p2x = x2 || 1;
    var p2y = y2 || 1;
    
    /** @type {number} */
    this.cx = 3 * p1x;
    
    /** @type {number} */
    this.bx = 3 * (p2x - p1x) - this.cx;

    /** @type {number} */
    this.ax = 1 - this.cx - this.bx;
      
    /** @type {number} */
    this.cy = 3 * p1y;
    
    /** @type {number} */
    this.by = 3 * (p2y - p1y) - this.cy;
    
    /** @type {number} */
    this.ay = 1 - this.cy - this.by;
      
    /** @type {(t: number) => number} */
    var BezierEasing = function (t) { return this$1$1.sampleCurveY(this$1$1.solveCurveX(t)); };

    // this function needs a name
    Object.defineProperty(BezierEasing, 'name', { writable: true });
    BezierEasing.name = functionName || ("cubic-bezier(" + ([p1x, p1y, p2x, p2y]) + ")");

    return BezierEasing;
  };

  /**
   * @param {number} t - progress [0-1]
   * @return {number} - sampled X value
   */
  CubicBezier.prototype.sampleCurveX = function sampleCurveX (t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };

  /**
   * @param {number} t - progress [0-1]
   * @return {number} - sampled Y value
   */
  CubicBezier.prototype.sampleCurveY = function sampleCurveY (t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };

  /**
   * @param {number} t - progress [0-1]
   * @return {number} - sampled curve derivative X value
   */
  CubicBezier.prototype.sampleCurveDerivativeX = function sampleCurveDerivativeX (t) {
    return (3 * this.ax * t + 2 * this.bx) * t + this.cx;
  };

  /**
   * @param {number} x - progress [0-1]
   * @return {number} - solved curve X value
   */
  CubicBezier.prototype.solveCurveX = function solveCurveX (x) {
    // Set Precision
    var epsilon = 1e-6;

    // Skip values out of range
    if (x <= 0) { return 0; }
    if (x >= 1) { return 1; }

    var t2 = x;
    var x2 = 0;
    var d2 = 0;

    // First try a few iterations of Newton's method
    // -- usually very fast.
    for (var i = 0; i < 8; i += 1) {
      x2 = this.sampleCurveX(t2) - x;
      if (Math.abs(x2) < epsilon) { return t2; }
      d2 = this.sampleCurveDerivativeX(t2);
      /* istanbul ignore next */
      if (Math.abs(d2) < epsilon) { break; }
      t2 -= x2 / d2;
    }

    // No solution found - use bi-section
    var t0 = 0;
    var t1 = 1;
    t2 = x;

    while (t0 < t1) {
      x2 = this.sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon) { return t2; }
      if (x > x2) { t0 = t2; }
      else { t1 = t2; }

      t2 = (t1 - t0) * 0.5 + t0;
    }

    // Give up
    /* istanbul ignore next */
    return t2;
  };

  var version$1 = "1.0.1";

  /**
   * A global namespace for library version.
   * @type {string}
   */
  var Version$1 = version$1;

  /** @typedef {import('../types/index')} */

  Object.assign(CubicBezier, { Version: Version$1 });

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

  // all supported properties
  var supportedProperties = {};

  var defaultValues = {};

  var defaultOptions$1 = {
    duration: 700,
    delay: 0,
    easing: 'linear',
    repeat: 0,
    repeatDelay: 0,
    yoyo: false,
    resetStart: false,
    offset: 0,
  };

  // used in preparePropertiesObject
  var prepareProperty = {};

  // check current property value when .to() method is used
  var prepareStart = {};

  // checks for differences between the processed start and end values,
  // can be set to make sure start unit and end unit are same,
  // stack transforms, process SVG paths,
  // any type of post processing the component needs
  var crossCheck = {};

  // schedule property specific function on animation complete
  var onComplete = {};

  // link properties to interpolate functions
  var linkProperty = {};

  var Objects = {
    supportedProperties: supportedProperties,
    defaultValues: defaultValues,
    defaultOptions: defaultOptions$1,
    prepareProperty: prepareProperty,
    prepareStart: prepareStart,
    crossCheck: crossCheck,
    onStart: onStart,
    onComplete: onComplete,
    linkProperty: linkProperty,
  };

  // util - a general object for utils like rgbToHex, processEasing
  var Util = {};

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
   * getInlineStyle
   * Returns the transform style for element from
   * cssText. Used by for the `.to()` static method.
   *
   * @param {Element} el target element
   * @returns {object}
   */
  function getInlineStyle(el) {
    // if the scroll applies to `window` it returns as it has no styling
    if (!el.style) { return false; }
    // the cssText | the resulting transform object
    var css = el.style.cssText.replace(/\s/g, '').split(';');
    var transformObject = {};
    var arrayFn = ['translate3d', 'translate', 'scale3d', 'skew'];

    css.forEach(function (cs) {
      if (/transform/i.test(cs)) {
        // all transform properties
        var tps = cs.split(':')[1].split(')');
        tps.forEach(function (tpi) {
          var tpv = tpi.split('(');
          var tp = tpv[0];
          // each transform property
          var tv = tpv[1];
          if (!/matrix/.test(tp)) {
            transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
          }
        });
      }
    });

    return transformObject;
  }

  /**
   * getStyleForProperty
   *
   * Returns the computed style property for element for .to() method.
   * Used by for the `.to()` static method.
   *
   * @param {Element} elem
   * @param {string} propertyName
   * @returns {string}
   */
  function getStyleForProperty(elem, propertyName) {
    var result = defaultValues[propertyName];
    var styleAttribute = elem.style;
    var computedStyle = getComputedStyle(elem) || elem.currentStyle;
    var styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName])
      ? styleAttribute[propertyName]
      : computedStyle[propertyName];

    if (propertyName !== 'transform' && (propertyName in computedStyle || propertyName in styleAttribute)) {
      result = styleValue;
    }

    return result;
  }

  /**
   * prepareObject
   *
   * Returns all processed valuesStart / valuesEnd.
   *
   * @param {Element} obj the values start/end object
   * @param {string} fn toggles between the two
   */
  function prepareObject(obj, fn) {
    var this$1$1 = this;
   // this, props object, type: start/end
    var propertiesObject = fn === 'start' ? this.valuesStart : this.valuesEnd;

    Object.keys(prepareProperty).forEach(function (component) {
      var prepareComponent = prepareProperty[component];
      var supportComponent = supportedProperties[component];

      Object.keys(prepareComponent).forEach(function (tweenCategory) {
        var transformObject = {};

        Object.keys(obj).forEach(function (tweenProp) {
          // scroll, opacity, other components
          if (defaultValues[tweenProp] && prepareComponent[tweenProp]) {
            propertiesObject[tweenProp] = prepareComponent[tweenProp]
              .call(this$1$1, tweenProp, obj[tweenProp]);

          // transform
          } else if (!defaultValues[tweenCategory] && tweenCategory === 'transform'
            && supportComponent.includes(tweenProp)) {
            transformObject[tweenProp] = obj[tweenProp];

          // allow transformFunctions to work with preprocessed input values
          } else if (!defaultValues[tweenProp] && tweenProp === 'transform') {
            propertiesObject[tweenProp] = obj[tweenProp];

          // colors, boxModel, category
          } else if (!defaultValues[tweenCategory]
            && supportComponent && supportComponent.includes(tweenProp)) {
            propertiesObject[tweenProp] = prepareComponent[tweenCategory]
              .call(this$1$1, tweenProp, obj[tweenProp]);
          }
        });

        // we filter out older browsers by checking Object.keys
        if (Object.keys(transformObject).length) {
          propertiesObject[tweenCategory] = prepareComponent[tweenCategory]
            .call(this$1$1, tweenCategory, transformObject);
        }
      });
    });
  }

  /**
   * getStartValues
   *
   * Returns the start values for to() method.
   * Used by for the `.to()` static method.
   *
   * @this {KUTE.Tween} the tween instance
   */
  function getStartValues() {
    var this$1$1 = this;

    var startValues = {};
    var currentStyle = getInlineStyle(this.element);

    Object.keys(this.valuesStart).forEach(function (tweenProp) {
      Object.keys(prepareStart).forEach(function (component) {
        var componentStart = prepareStart[component];

        Object.keys(componentStart).forEach(function (tweenCategory) {
          // clip, opacity, scroll
          if (tweenCategory === tweenProp && componentStart[tweenProp]) {
            startValues[tweenProp] = componentStart[tweenCategory]
              .call(this$1$1, tweenProp, this$1$1.valuesStart[tweenProp]);
          // find in an array of properties
          } else if (supportedProperties[component]
            && supportedProperties[component].includes(tweenProp)) {
            startValues[tweenProp] = componentStart[tweenCategory]
              .call(this$1$1, tweenProp, this$1$1.valuesStart[tweenProp]);
          }
        });
      });
    });

    // stack transformCSS props for .to() chains
    // also add to startValues values from previous tweens
    Object.keys(currentStyle).forEach(function (current) {
      if (!(current in this$1$1.valuesStart)) {
        startValues[current] = currentStyle[current] || defaultValues[current];
      }
    });

    this.valuesStart = {};
    prepareObject.call(this, startValues, 'start');
  }

  var Process = {
    getInlineStyle: getInlineStyle,
    getStyleForProperty: getStyleForProperty,
    getStartValues: getStartValues,
    prepareObject: prepareObject,
  };

  var connect = {};
  /** @type {KUTE.TweenBase | KUTE.Tween | KUTE.TweenExtra} */
  connect.tween = null;
  connect.processEasing = null;

  var Easing = {
    linear: new CubicBezier(0, 0, 1, 1, 'linear'),
    easingSinusoidalIn: new CubicBezier(0.47, 0, 0.745, 0.715, 'easingSinusoidalIn'),
    easingSinusoidalOut: new CubicBezier(0.39, 0.575, 0.565, 1, 'easingSinusoidalOut'),
    easingSinusoidalInOut: new CubicBezier(0.445, 0.05, 0.55, 0.95, 'easingSinusoidalInOut'),

    easingQuadraticIn: new CubicBezier(0.550, 0.085, 0.680, 0.530, 'easingQuadraticIn'),
    easingQuadraticOut: new CubicBezier(0.250, 0.460, 0.450, 0.940, 'easingQuadraticOut'),
    easingQuadraticInOut: new CubicBezier(0.455, 0.030, 0.515, 0.955, 'easingQuadraticInOut'),

    easingCubicIn: new CubicBezier(0.55, 0.055, 0.675, 0.19, 'easingCubicIn'),
    easingCubicOut: new CubicBezier(0.215, 0.61, 0.355, 1, 'easingCubicOut'),
    easingCubicInOut: new CubicBezier(0.645, 0.045, 0.355, 1, 'easingCubicInOut'),

    easingQuarticIn: new CubicBezier(0.895, 0.03, 0.685, 0.22, 'easingQuarticIn'),
    easingQuarticOut: new CubicBezier(0.165, 0.84, 0.44, 1, 'easingQuarticOut'),
    easingQuarticInOut: new CubicBezier(0.77, 0, 0.175, 1, 'easingQuarticInOut'),

    easingQuinticIn: new CubicBezier(0.755, 0.05, 0.855, 0.06, 'easingQuinticIn'),
    easingQuinticOut: new CubicBezier(0.23, 1, 0.32, 1, 'easingQuinticOut'),
    easingQuinticInOut: new CubicBezier(0.86, 0, 0.07, 1, 'easingQuinticInOut'),

    easingExponentialIn: new CubicBezier(0.95, 0.05, 0.795, 0.035, 'easingExponentialIn'),
    easingExponentialOut: new CubicBezier(0.19, 1, 0.22, 1, 'easingExponentialOut'),
    easingExponentialInOut: new CubicBezier(1, 0, 0, 1, 'easingExponentialInOut'),

    easingCircularIn: new CubicBezier(0.6, 0.04, 0.98, 0.335, 'easingCircularIn'),
    easingCircularOut: new CubicBezier(0.075, 0.82, 0.165, 1, 'easingCircularOut'),
    easingCircularInOut: new CubicBezier(0.785, 0.135, 0.15, 0.86, 'easingCircularInOut'),

    easingBackIn: new CubicBezier(0.6, -0.28, 0.735, 0.045, 'easingBackIn'),
    easingBackOut: new CubicBezier(0.175, 0.885, 0.32, 1.275, 'easingBackOut'),
    easingBackInOut: new CubicBezier(0.68, -0.55, 0.265, 1.55, 'easingBackInOut'),
  };

  /**
   * Returns a valid `easingFunction`.
   *
   * @param {KUTE.easingFunction | string} fn function name or constructor name
   * @returns {KUTE.easingFunction} a valid easingfunction
   */
  function processBezierEasing(fn) {
    if (typeof fn === 'function') {
      return fn;
    } if (typeof (Easing[fn]) === 'function') {
      return Easing[fn];
    } if (/bezier/.test(fn)) {
      var bz = fn.replace(/bezier|\s|\(|\)/g, '').split(',');
      return new CubicBezier(bz[0] * 1, bz[1] * 1, bz[2] * 1, bz[3] * 1); // bezier easing
    }
    // if (/elastic|bounce/i.test(fn)) {
    //   throw TypeError(`KUTE - CubicBezier doesn't support ${fn} easing.`);
    // }
    return Easing.linear;
  }

  connect.processEasing = processBezierEasing;

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
    this._duration = options.duration || defaultOptions$1.duration; // duration option | default
    /** @type {number} */
    this._delay = options.delay || defaultOptions$1.delay; // delay option | default

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

  /**
   * The `KUTE.Tween()` constructor creates a new `Tween` object
   * for a single `HTMLElement` and returns it.
   *
   * This constructor adds additional functionality and is the default
   * Tween object constructor in KUTE.js.
   */
  var Tween = /*@__PURE__*/(function (TweenBase) {
    function Tween() {
      var this$1$1 = this;
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      TweenBase.apply(this, args); // this calls the constructor of TweenBase

      // reset interpolation values
      this.valuesStart = {};
      this.valuesEnd = {};

      // const startObject = args[1];
      // const endObject = args[2];
      var ref = args.slice(1);
      var startObject = ref[0];
      var endObject = ref[1];
      var options = ref[2];

      // set valuesEnd
      prepareObject.call(this, endObject, 'end');

      // set valuesStart
      if (this._resetStart) {
        this.valuesStart = startObject;
      } else {
        prepareObject.call(this, startObject, 'start');
      }

      // ready for crossCheck
      if (!this._resetStart) {
        Object.keys(crossCheck).forEach(function (component) {
          Object.keys(crossCheck[component]).forEach(function (checkProp) {
            crossCheck[component][checkProp].call(this$1$1, checkProp);
          });
        });
      }

      // set paused state
      /** @type {boolean} */
      this.paused = false;
      /** @type {number?} */
      this._pauseTime = null;

      // additional properties and options
      /** @type {number?} */
      this._repeat = options.repeat || defaultOptions$1.repeat;
      /** @type {number?} */
      this._repeatDelay = options.repeatDelay || defaultOptions$1.repeatDelay;
      // we cache the number of repeats to be able to put it back after all cycles finish
      /** @type {number?} */
      this._repeatOption = this._repeat;

      // yoyo needs at least repeat: 1
      /** @type {KUTE.tweenProps} */
      this.valuesRepeat = {}; // valuesRepeat
      /** @type {boolean} */
      this._yoyo = options.yoyo || defaultOptions$1.yoyo;
      /** @type {boolean} */
      this._reversed = false;

      // don't load extra callbacks
      // this._onPause = options.onPause || defaultOptions.onPause
      // this._onResume = options.onResume || defaultOptions.onResume

      // chained Tweens
      // this._chain = options.chain || defaultOptions.chain;
      return this;
    }

    if ( TweenBase ) Tween.__proto__ = TweenBase;
    Tween.prototype = Object.create( TweenBase && TweenBase.prototype );
    Tween.prototype.constructor = Tween;

    /**
     * Starts tweening, extended method
     * @param {number?} time the tween start time
     * @returns {Tween} this instance
     */
    Tween.prototype.start = function start (time) {
      var this$1$1 = this;

      // on start we reprocess the valuesStart for TO() method
      if (this._resetStart) {
        this.valuesStart = this._resetStart;
        getStartValues.call(this);

        // this is where we do the valuesStart and valuesEnd check for fromTo() method
        Object.keys(crossCheck).forEach(function (component) {
          Object.keys(crossCheck[component]).forEach(function (checkProp) {
            crossCheck[component][checkProp].call(this$1$1, checkProp);
          });
        });
      }
      // still not paused
      this.paused = false;

      // set yoyo values
      if (this._yoyo) {
        Object.keys(this.valuesEnd).forEach(function (endProp) {
          this$1$1.valuesRepeat[endProp] = this$1$1.valuesStart[endProp];
        });
      }

      TweenBase.prototype.start.call(this, time);

      return this;
    };

    /**
     * Stops tweening, extended method
     * @returns {Tween} this instance
     */
    Tween.prototype.stop = function stop () {
      TweenBase.prototype.stop.call(this);
      if (!this.paused && this.playing) {
        this.paused = false;
        this.stopChainedTweens();
      }
      return this;
    };

    /**
     * Trigger internal completion callbacks.
     */
    Tween.prototype.close = function close () {
      TweenBase.prototype.close.call(this);

      if (this._repeatOption > 0) {
        this._repeat = this._repeatOption;
      }
      if (this._yoyo && this._reversed === true) {
        this.reverse();
        this._reversed = false;
      }

      return this;
    };

    /**
     * Resume tweening
     * @returns {Tween} this instance
     */
    Tween.prototype.resume = function resume () {
      if (this.paused && this.playing) {
        this.paused = false;
        if (this._onResume !== undefined) {
          this._onResume.call(this);
        }
        // re-queue execution context
        queueStart.call(this);
        // update time and let it roll
        this._startTime += KEC.Time() - this._pauseTime;
        add(this);
        // restart ticker if stopped
        if (!Tick) { Ticker(); }
      }
      return this;
    };

    /**
     * Pause tweening
     * @returns {Tween} this instance
     */
    Tween.prototype.pause = function pause () {
      if (!this.paused && this.playing) {
        remove(this);
        this.paused = true;
        this._pauseTime = KEC.Time();
        if (this._onPause !== undefined) {
          this._onPause.call(this);
        }
      }
      return this;
    };

    /**
     * Reverses start values with end values
     */
    Tween.prototype.reverse = function reverse () {
      var this$1$1 = this;

      Object.keys(this.valuesEnd).forEach(function (reverseProp) {
        var tmp = this$1$1.valuesRepeat[reverseProp];
        this$1$1.valuesRepeat[reverseProp] = this$1$1.valuesEnd[reverseProp];
        this$1$1.valuesEnd[reverseProp] = tmp;
        this$1$1.valuesStart[reverseProp] = this$1$1.valuesRepeat[reverseProp];
      });
    };

    /**
     * Update the tween on each tick.
     * @param {number} time the tick time
     * @returns {boolean} this instance
     */
    Tween.prototype.update = function update (time) {
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
        if (this._repeat > 0) {
          if (Number.isFinite(this._repeat)) { this._repeat -= 1; }

          // set the right time for delay
          this._startTime = T;
          if (Number.isFinite(this._repeat) && this._yoyo && !this._reversed) {
            this._startTime += this._repeatDelay;
          }

          if (this._yoyo) { // handle yoyo
            this._reversed = !this._reversed;
            this.reverse();
          }

          return true;
        }

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
          this._chain.forEach(function (tw) { return tw.start(); });
        }

        return false;
      }
      return true;
    };

    return Tween;
  }(TweenBase));

  // Update Tween Interface Update
  connect.tween = Tween;

  // to do
  // * per property easing
  // * per property duration
  // * per property callback
  // * per property delay/offset
  // * new update method to work with the above
  // * other cool ideas

  /**
   * The `KUTE.TweenExtra()` constructor creates a new `Tween` object
   * for a single `HTMLElement` and returns it.
   *
   * This constructor is intended for experiments or testing of new features.
   */
  var TweenExtra = /*@__PURE__*/(function (Tween) {
    function TweenExtra() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      Tween.apply(this, args); // import constructor of TweenBase -> Tween

      return this;
    }

    if ( Tween ) TweenExtra.__proto__ = Tween;
    TweenExtra.prototype = Object.create( Tween && Tween.prototype );
    TweenExtra.prototype.constructor = TweenExtra;

    // additional methods
    // set/override property
    // to(property, value) {
    // TO DO
    // this.valuesEnd[property] = value // well that's not all
    // }

    // fromTo(property, value) {
    // TO DO
    // this.valuesEnd[property] = value // well that's not all
    // }

    // getTotalDuration() {
    // to do
    // }

    /**
     * Method to add callbacks on the fly.
     * @param {string} name callback name
     * @param {Function} fn callback function
     * @returns {TweenExtra}
     */
    TweenExtra.prototype.on = function on (name, fn) {
      if (['start', 'stop', 'update', 'complete', 'pause', 'resume'].indexOf(name) > -1) {
        this[("_on" + (name.charAt(0).toUpperCase() + name.slice(1)))] = fn;
      }
      return this;
    };

    /**
     * Method to set options on the fly.
     * * accepting [repeat,yoyo,delay,repeatDelay,easing]
     *
     * @param {string} option the tick time
     * @param {string | number | number[]} value the tick time
     * @returns {TweenExtra}
     */
    TweenExtra.prototype.option = function option (option$1, value) {
      this[("_" + option$1)] = value;
      return this;
    };

    return TweenExtra;
  }(Tween));

  // Tween Interface
  connect.tween = TweenExtra;

  /**
   * The static method creates a new `Tween` object for each `HTMLElement`
   * from and `Array`, `HTMLCollection` or `NodeList`.
   */
  var TweenCollection = function TweenCollection(els, vS, vE, Options) {
    var this$1$1 = this;

    var TweenConstructor = connect.tween;
    /** @type {KUTE.twCollection[]} */
    this.tweens = [];

    var Ops = Options || {};
    /** @type {number?} */
    Ops.delay = Ops.delay || defaultOptions$1.delay;

    // set all options
    var options = [];

    Array.from(els).forEach(function (el, i) {
      options[i] = Ops || {};
      options[i].delay = i > 0 ? Ops.delay + (Ops.offset || defaultOptions$1.offset) : Ops.delay;
      if (el instanceof Element) {
        this$1$1.tweens.push(new TweenConstructor(el, vS, vE, options[i]));
      } else {
        throw Error(("KUTE - " + el + " is not instanceof Element"));
      }
    });

    /** @type {number?} */
    this.length = this.tweens.length;
    return this;
  };

  /**
   * Starts tweening, all targets
   * @param {number?} time the tween start time
   * @returns {TweenCollection} this instance
   */
  TweenCollection.prototype.start = function start (time) {
    var T = time === undefined ? KEC.Time() : time;
    this.tweens.map(function (tween) { return tween.start(T); });
    return this;
  };

  /**
   * Stops tweening, all targets and their chains
   * @returns {TweenCollection} this instance
   */
  TweenCollection.prototype.stop = function stop () {
    this.tweens.map(function (tween) { return tween.stop(); });
    return this;
  };

  /**
   * Pause tweening, all targets
   * @returns {TweenCollection} this instance
   */
  TweenCollection.prototype.pause = function pause () {
    this.tweens.map(function (tween) { return tween.pause(); });
    return this;
  };

  /**
   * Resume tweening, all targets
   * @returns {TweenCollection} this instance
   */
  TweenCollection.prototype.resume = function resume () {
    this.tweens.map(function (tween) { return tween.resume(); });
    return this;
  };

  /**
   * Schedule another tween or collection to start after
   * this one is complete.
   * @param {number?} args the tween start time
   * @returns {TweenCollection} this instance
   */
  TweenCollection.prototype.chain = function chain (args) {
    var lastTween = this.tweens[this.length - 1];
    if (args instanceof TweenCollection) {
      lastTween.chain(args.tweens);
    } else if (args instanceof connect.tween) {
      lastTween.chain(args);
    } else {
      throw new TypeError('KUTE.js - invalid chain value');
    }
    return this;
  };

  /**
   * Check if any tween instance is playing
   * @param {number?} time the tween start time
   * @returns {TweenCollection} this instance
   */
  TweenCollection.prototype.playing = function playing () {
    return this.tweens.some(function (tw) { return tw.playing; });
  };

  /**
   * Remove all tweens in the collection
   */
  TweenCollection.prototype.removeTweens = function removeTweens () {
    this.tweens = [];
  };

  /**
   * Returns the maximum animation duration
   * @returns {number} this instance
   */
  TweenCollection.prototype.getMaxDuration = function getMaxDuration () {
    var durations = [];
    this.tweens.forEach(function (tw) {
      durations.push(tw._duration + tw._delay + tw._repeat * tw._repeatDelay);
    });
    return Math.max(durations);
  };

  /**
   * ProgressBar
   *
   * @class
   * A progress bar utility for KUTE.js that will connect
   * a target `<input type="slider">`. with a Tween instance
   * allowing it to control the progress of the Tween.
   */
  var ProgressBar = function ProgressBar(element, tween) {
    var assign;

    this.element = selector(element);
    this.element.tween = tween;
    this.element.tween.toolbar = this.element;
    this.element.toolbar = this;
    (assign = this.element.parentNode.getElementsByTagName('OUTPUT'), this.element.output = assign[0]);

    // invalidate
    if (!(this.element instanceof HTMLInputElement)) { throw TypeError('Target element is not [HTMLInputElement]'); }
    if (this.element.type !== 'range') { throw TypeError('Target element is not a range input'); }
    if (!(tween instanceof connect.tween)) { throw TypeError(("tween parameter is not [" + (connect.tween) + "]")); }

    this.element.setAttribute('value', 0);
    this.element.setAttribute('min', 0);
    this.element.setAttribute('max', 1);
    this.element.setAttribute('step', 0.0001);

    this.element.tween._onUpdate = this.updateBar;

    this.element.addEventListener('mousedown', this.downAction, false);
  };

  ProgressBar.prototype.updateBar = function updateBar () {
    var tick = 0.0001;
    var ref = this.toolbar;
      var output = ref.output;

    // let progress = this.paused ? this.toolbar.value
    // : (KEC.Time() - this._startTime) / this._duration;
    // progress = progress > 1 - tick ? 1 : progress < 0.01 ? 0 : progress;

    var progress;
    if (this.paused) {
      progress = this.toolbar.value;
    } else {
      progress = (KEC.Time() - this._startTime) / this._duration;
    }

    // progress = progress > 1 - tick ? 1 : progress < 0.01 ? 0 : progress;
    if (progress > 1 - tick) { progress = 1; }
    if (progress < 0.01) { progress = 0; }

    var value = !this._reversed ? progress : 1 - progress;
    this.toolbar.value = value;
    // eslint-disable-next-line no-bitwise
    if (output) { output.value = ((value * 10000 >> 0) / 100) + "%"; }
  };

  ProgressBar.prototype.toggleEvents = function toggleEvents (action) {
    // add passive handler ?
    this.element[(action + "EventListener")]('mousemove', this.moveAction, false);
    this.element[(action + "EventListener")]('mouseup', this.upAction, false);
  };

  ProgressBar.prototype.updateTween = function updateTween () {
    // make sure we never complete the tween
    var progress = (!this.tween._reversed ? this.value : 1 - this.value)
      * this.tween._duration - 0.0001;

    this.tween._startTime = 0;
    this.tween.update(progress);
  };

  ProgressBar.prototype.moveAction = function moveAction () {
    this.toolbar.updateTween.call(this);
  };

  ProgressBar.prototype.downAction = function downAction () {
    if (!this.tween.playing) {
      this.tween.start();
    }

    if (!this.tween.paused) {
      this.tween.pause();
      this.toolbar.toggleEvents('add');

      KEC.Tick = cancelAnimationFrame(KEC.Ticker);
    }
  };

  ProgressBar.prototype.upAction = function upAction () {
    if (this.tween.paused) {
      if (this.tween.paused) { this.tween.resume(); }

      this.tween._startTime = KEC.Time()
        - (!this.tween._reversed ? this.value : 1 - this.value) * this.tween._duration;

      this.toolbar.toggleEvents('remove');
      KEC.Tick = requestAnimationFrame(KEC.Ticker);
    }
  };

  var TweenConstructor$1 = connect.tween;

  /**
   * The `KUTE.to()` static method returns a new Tween object
   * for a single `HTMLElement` at its current state.
   *
   * @param {Element} element target element
   * @param {KUTE.tweenProps} endObject
   * @param {KUTE.tweenOptions} optionsObj tween options
   * @returns {KUTE.Tween} the resulting Tween object
   */
  function to(element, endObject, optionsObj) {
    var options = optionsObj || {};
    options.resetStart = endObject;
    return new TweenConstructor$1(selector(element), endObject, endObject, options);
  }

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

  /**
   * The `KUTE.allTo()` static method creates a new Tween object
   * for multiple `HTMLElement`s, `HTMLCollection` or `NodeListat`
   * at their current state.
   *
   * @param {Element[] | HTMLCollection | NodeList} elements target elements
   * @param {KUTE.tweenProps} endObject
   * @param {KUTE.tweenProps} optionsObj progress
   * @returns {TweenCollection} the Tween object collection
   */
  function allTo(elements, endObject, optionsObj) {
    var options = optionsObj || {};
    options.resetStart = endObject;
    return new TweenCollection(selector(elements, true), endObject, endObject, options);
  }

  /**
   * The `KUTE.allFromTo()` static method creates a new Tween object
   * for multiple `HTMLElement`s, `HTMLCollection` or `NodeListat`
   * at a given state.
   *
   * @param {Element[] | HTMLCollection | NodeList} elements target elements
   * @param {KUTE.tweenProps} startObject
   * @param {KUTE.tweenProps} endObject
   * @param {KUTE.tweenOptions} optionsObj tween options
   * @returns {TweenCollection} the Tween object collection
   */
  function allFromTo(elements, startObject, endObject, optionsObj) {
    var options = optionsObj || {};
    return new TweenCollection(selector(elements, true), startObject, endObject, options);
  }

  /**
   * Animation Class
   *
   * Registers components by populating KUTE.js objects and makes sure
   * no duplicate component / property is allowed.
   */
  var Animation = function Animation(Component) {
    try {
      if (Component.component in supportedProperties) {
        throw Error(("KUTE - " + (Component.component) + " already registered"));
      } else if (Component.property in defaultValues) {
        throw Error(("KUTE - " + (Component.property) + " already registered"));
      }
    } catch (e) {
      throw Error(e);
    }

    var propertyInfo = this;
    var ComponentName = Component.component;
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty, Util }
    var Functions = {
      prepareProperty: prepareProperty, prepareStart: prepareStart, onStart: onStart, onComplete: onComplete, crossCheck: crossCheck,
    };
    var Category = Component.category;
    var Property = Component.property;
    var Length = (Component.properties && Component.properties.length)
      || (Component.subProperties && Component.subProperties.length);

    // single property
    // {property,defaultvalue,defaultOptions,Interpolate,functions}

    // category colors, boxModel, borderRadius
    // {category,properties,defaultvalues,defaultOptions,Interpolate,functions}

    // property with multiple sub properties. Eg transform, filter
    // {property,subProperties,defaultvalues,defaultOptions,Interpolate,functions}

    // property with multiple sub properties. Eg htmlAttributes
    // {category,subProperties,defaultvalues,defaultOptions,Interpolate,functions}

    // set supported category/property
    supportedProperties[ComponentName] = Component.properties
      || Component.subProperties || Component.property;

    // set defaultValues
    if ('defaultValue' in Component) { // value 0 will invalidate
      defaultValues[Property] = Component.defaultValue;

      // minimal info
      propertyInfo.supports = Property + " property";
    } else if (Component.defaultValues) {
      Object.keys(Component.defaultValues).forEach(function (dv) {
        defaultValues[dv] = Component.defaultValues[dv];
      });

      // minimal info
      propertyInfo.supports = (Length || Property) + " " + (Property || Category) + " properties";
    }

    // set additional options
    if (Component.defaultOptions) {
      // Object.keys(Component.defaultOptions).forEach((op) => {
      // defaultOptions[op] = Component.defaultOptions[op];
      // });
      Object.assign(defaultOptions$1, Component.defaultOptions);
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
              // !Functions[fn][ofn] && (Functions[fn][ofn] = Component.functions[fn][ofn])
              if (!Functions[fn][ComponentName]) { Functions[fn][ComponentName] = {}; }
              if (!Functions[fn][ComponentName][ofn]) {
                Functions[fn][ComponentName][ofn] = Component.functions[fn][ofn];
              }
            });
          }
        }
      });
    }

    // set component interpolation functions
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

    return propertyInfo;
  };

  /**
   * Animation Development Class
   *
   * Registers components by populating KUTE.js objects and makes sure
   * no duplicate component / property is allowed.
   *
   * In addition to the default class, this one provides more component
   * information to help you with custom component development.
   */
  var AnimationDevelopment = /*@__PURE__*/(function (Animation) {
    function AnimationDevelopment(Component) {
      Animation.call(this, Component);

      var propertyInfo = this;
      // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty, Util }
      var Functions = {
        prepareProperty: prepareProperty, prepareStart: prepareStart, onStart: onStart, onComplete: onComplete, crossCheck: crossCheck,
      };
      var Category = Component.category;
      var Property = Component.property;
      var Length = (Component.properties && Component.properties.length)
        || (Component.subProperties && Component.subProperties.length);

      // set defaultValues
      if ('defaultValue' in Component) { // value 0 will invalidate
        propertyInfo.supports = Property + " property";
        propertyInfo.defaultValue = "" + ((("" + (Component.defaultValue))).length ? 'YES' : 'not set or incorrect');
      } else if (Component.defaultValues) {
        propertyInfo.supports = (Length || Property) + " " + (Property || Category) + " properties";
        propertyInfo.defaultValues = Object.keys(Component.defaultValues).length === Length ? 'YES' : 'Not set or incomplete';
      }

      // set additional options
      if (Component.defaultOptions) {
        propertyInfo.extends = [];

        Object.keys(Component.defaultOptions).forEach(function (op) {
          propertyInfo.extends.push(op);
        });

        if (propertyInfo.extends.length) {
          propertyInfo.extends = "with <" + (propertyInfo.extends.join(', ')) + "> new option(s)";
        } else {
          delete propertyInfo.extends;
        }
      }

      // set functions
      if (Component.functions) {
        propertyInfo.interface = [];
        propertyInfo.render = [];
        propertyInfo.warning = [];

        Object.keys(Functions).forEach(function (fnf) {
          if (fnf in Component.functions) {
            if (fnf === 'prepareProperty') { propertyInfo.interface.push('fromTo()'); }
            if (fnf === 'prepareStart') { propertyInfo.interface.push('to()'); }
            if (fnf === 'onStart') { propertyInfo.render = 'can render update'; }
          } else {
            if (fnf === 'prepareProperty') { propertyInfo.warning.push('fromTo()'); }
            if (fnf === 'prepareStart') { propertyInfo.warning.push('to()'); }
            if (fnf === 'onStart') { propertyInfo.render = 'no function to render update'; }
          }
        });

        if (propertyInfo.interface.length) {
          propertyInfo.interface = (Category || Property) + " can use [" + (propertyInfo.interface.join(', ')) + "] method(s)";
        } else {
          delete propertyInfo.uses;
        }

        if (propertyInfo.warning.length) {
          propertyInfo.warning = (Category || Property) + " can't use [" + (propertyInfo.warning.join(', ')) + "] method(s) because values aren't processed";
        } else {
          delete propertyInfo.warning;
        }
      }

      // register Interpolation functions
      if (Component.Interpolate) {
        propertyInfo.uses = [];
        propertyInfo.adds = [];

        Object.keys(Component.Interpolate).forEach(function (fni) {
          var compIntObj = Component.Interpolate[fni];
          // register new Interpolation functions
          if (typeof (compIntObj) === 'function') {
            if (!interpolate[fni]) {
              propertyInfo.adds.push(("" + fni));
            }
            propertyInfo.uses.push(("" + fni));
          } else {
            Object.keys(compIntObj).forEach(function (sfn) {
              if (typeof (compIntObj[sfn]) === 'function' && !interpolate[fni]) {
                propertyInfo.adds.push(("" + sfn));
              }
              propertyInfo.uses.push(("" + sfn));
            });
          }
        });

        if (propertyInfo.uses.length) {
          propertyInfo.uses = "[" + (propertyInfo.uses.join(', ')) + "] interpolation function(s)";
        } else {
          delete propertyInfo.uses;
        }

        if (propertyInfo.adds.length) {
          propertyInfo.adds = "new [" + (propertyInfo.adds.join(', ')) + "] interpolation function(s)";
        } else {
          delete propertyInfo.adds;
        }
      } else {
        propertyInfo.critical = "For " + (Property || Category) + " no interpolation function[s] is set";
      }

      // set component util
      if (Component.Util) {
        propertyInfo.hasUtil = Object.keys(Component.Util).join(',');
      }

      return propertyInfo;
    }

    if ( Animation ) AnimationDevelopment.__proto__ = Animation;
    AnimationDevelopment.prototype = Object.create( Animation && Animation.prototype );
    AnimationDevelopment.prototype.constructor = AnimationDevelopment;

    return AnimationDevelopment;
  }(Animation));

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

  /**
   * trueDimension
   *
   * Returns the string value of a specific CSS property converted into a nice
   * { v = value, u = unit } object.
   *
   * @param {string} dimValue the property string value
   * @param {boolean | number} isAngle sets the utility to investigate angles
   * @returns {{v: number, u: string}} the true {value, unit} tuple
   */
  var trueDimension = function (dimValue, isAngle) {
    var intValue = parseInt(dimValue, 10) || 0;
    var mUnits = ['px', '%', 'deg', 'rad', 'em', 'rem', 'vh', 'vw'];
    var theUnit;

    for (var mIndex = 0; mIndex < mUnits.length; mIndex += 1) {
      if (typeof dimValue === 'string' && dimValue.includes(mUnits[mIndex])) {
        theUnit = mUnits[mIndex]; break;
      }
    }
    if (theUnit === undefined) {
      theUnit = isAngle ? 'deg' : 'px';
    }

    return { v: intValue, u: theUnit };
  };

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} prop the property name
   */
  function onStartBgPos(prop) {
    if (this.valuesEnd[prop] && !KEC[prop]) {
      KEC[prop] = function (elem, a, b, v) {
        /* eslint-disable -- no-bitwise & no-param-reassign impossible to satisfy */
        elem.style[prop] = ((numbers(a[0], b[0], v) * 100 >> 0) / 100) + "%  " + (((numbers(a[1], b[1], v) * 100 >> 0) / 100)) + "%";
        /* eslint-enable -- no-bitwise & no-param-reassign impossible to satisfy */
      };
    }
  }

  // Component Functions

  /**
   * Returns the property computed style.
   * @param {string} prop the property
   * @returns {string} the property computed style
   */
  function getBgPos(prop/* , value */) {
    return getStyleForProperty(this.element, prop) || defaultValues[prop];
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {number[]} the property tween object
   */
  function prepareBgPos(/* prop, */_, value) {
    if (value instanceof Array) {
      var x = trueDimension(value[0]).v;
      var y = trueDimension(value[1]).v;
      return [!Number.isNaN(x * 1) ? x : 50, !Number.isNaN(y * 1) ? y : 50];
    }

    var posxy = value.replace(/top|left/g, 0)
      .replace(/right|bottom/g, 100)
      .replace(/center|middle/g, 50);

    posxy = posxy.split(/(,|\s)/g);
    posxy = posxy.length === 2 ? posxy : [posxy[0], 50];
    return [trueDimension(posxy[0]).v, trueDimension(posxy[1]).v];
  }

  // All Component Functions
  var bgPositionFunctions = {
    prepareStart: getBgPos,
    prepareProperty: prepareBgPos,
    onStart: onStartBgPos,
  };

  // Component Full Object
  var BackgroundPosition = {
    component: 'backgroundPositionProp',
    property: 'backgroundPosition',
    defaultValue: [50, 50],
    Interpolate: { numbers: numbers },
    functions: bgPositionFunctions,
    Util: { trueDimension: trueDimension },
  };

  /**
   * Units Interpolation Function.
   *
   * @param {number} a start value
   * @param {number} b end value
   * @param {string} u unit
   * @param {number} v progress
   * @returns {string} the interpolated value + unit string
   */
  function units(a, b, u, v) { // number1, number2, unit, progress
    var A = +a;
    var B = b - a;
    // a = +a; b -= a;
    return (A + B * v) + u;
  }

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function radiusOnStartFn(tweenProp) {
    if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        // eslint-disable-next-line no-param-reassign -- impossible to satisfy
        elem.style[tweenProp] = units(a.v, b.v, b.u, v);
      };
    }
  }

  // Component Properties
  var radiusProps = [
    'borderRadius',
    'borderTopLeftRadius', 'borderTopRightRadius',
    'borderBottomLeftRadius', 'borderBottomRightRadius'];

  var radiusValues = {};
  radiusProps.forEach(function (x) { radiusValues[x] = 0; });

  // Component Functions
  var radiusOnStart = {};
  radiusProps.forEach(function (tweenProp) {
    radiusOnStart[tweenProp] = radiusOnStartFn;
  });

  /**
   * Returns the current property computed style.
   * @param {string} tweenProp the property name
   * @returns {string} the property computed style
   */
  function getRadius(tweenProp) {
    return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
  }

  /**
   * Returns the property tween object.
   * @param {string} value the property value
   * @returns {{v: number, u: string}} the property tween object
   */
  function prepareRadius(/* tweenProp, */_, value) {
    return trueDimension(value);
  }

  // All Component Functions
  var radiusFunctions = {
    prepareStart: getRadius,
    prepareProperty: prepareRadius,
    onStart: radiusOnStart,
  };

  // Full Component
  var BorderRadius = {
    component: 'borderRadiusProperties',
    category: 'borderRadius',
    properties: radiusProps,
    defaultValues: radiusValues,
    Interpolate: { units: units },
    functions: radiusFunctions,
    Util: { trueDimension: trueDimension },
  };

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

  // Component Properties
  var boxModelProperties = ['top', 'left', 'width', 'height', 'right', 'bottom', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'outlineWidth'];

  var boxModelValues = {};
  boxModelProperties.forEach(function (x) { boxModelValues[x] = 0; });

  // Component Functions
  /**
   * Returns the current property computed style.
   * @param {string} tweenProp the property name
   * @returns {string} computed style for property
   */
  function getBoxModel(tweenProp) {
    return getStyleForProperty(this.element, tweenProp) || defaultValues[tweenProp];
  }

  /**
   * Returns the property tween object.
   * @param {string} tweenProp the property name
   * @param {string} value the property value
   * @returns {number} the property tween object
   */
  function prepareBoxModel(tweenProp, value) {
    var boxValue = trueDimension(value); var
      offsetProp = tweenProp === 'height' ? 'offsetHeight' : 'offsetWidth';
    return boxValue.u === '%' ? (boxValue.v * this.element[offsetProp]) / 100 : boxValue.v;
  }
  var boxPropsOnStart = {};
  boxModelProperties.forEach(function (x) { boxPropsOnStart[x] = boxModelOnStart; });

  // All Component Functions
  var boxModelFunctions = {
    prepareStart: getBoxModel,
    prepareProperty: prepareBoxModel,
    onStart: boxPropsOnStart,
  };

  // Component Full Component
  var BoxModel = {
    component: 'boxModelProperties',
    category: 'boxModel',
    properties: boxModelProperties,
    defaultValues: boxModelValues,
    Interpolate: { numbers: numbers },
    functions: boxModelFunctions,
  };

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartClip(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        var h = 0; var
          cl = [];
        for (h; h < 4; h += 1) {
          var c1 = a[h].v;
          var c2 = b[h].v;
          var cu = b[h].u || 'px';
          // eslint-disable-next-line no-bitwise -- impossible to satisfy
          cl[h] = ((numbers(c1, c2, v) * 100 >> 0) / 100) + cu;
        }
        // eslint-disable-next-line no-param-reassign -- impossible to satisfy
        elem.style.clip = "rect(" + cl + ")";
      };
    }
  }

  // Component Functions
  /**
   * Returns the current property computed style.
   * @param {string} tweenProp the property name
   * @returns {string | number[]} computed style for property
   */
  function getClip(tweenProp/* , value */) {
    var ref = this;
    var element = ref.element;
    var currentClip = getStyleForProperty(element, tweenProp);
    var width = getStyleForProperty(element, 'width');
    var height = getStyleForProperty(element, 'height');
    return !/rect/.test(currentClip) ? [0, width, height, 0] : currentClip;
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {number[]} the property tween object
   */
  function prepareClip(/* tweenProp, */_, value) {
    if (value instanceof Array) {
      return value.map(function (x) { return trueDimension(x); });
    }
    var clipValue = value.replace(/rect|\(|\)/g, '');
    clipValue = /,/g.test(clipValue) ? clipValue.split(',') : clipValue.split(/\s/);
    return clipValue.map(function (x) { return trueDimension(x); });
  }

  // All Component Functions
  var clipFunctions = {
    prepareStart: getClip,
    prepareProperty: prepareClip,
    onStart: onStartClip,
  };

  // Component Full
  var ClipProperty = {
    component: 'clipProperty',
    property: 'clip',
    defaultValue: [0, 0, 0, 0],
    Interpolate: { numbers: numbers },
    functions: clipFunctions,
    Util: { trueDimension: trueDimension },
  };

  /**
   * hexToRGB
   *
   * Converts a #HEX color format into RGB
   * and returns a color object {r,g,b}.
   *
   * @param {string} hex the degree angle
   * @returns {KUTE.colorObject | null} the radian angle
   */
  var hexToRGB = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var hexShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var HEX = hex.replace(hexShorthand, function (_, r, g, b) { return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(HEX);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  /**
   * trueColor
   *
   * Transform any color to rgba()/rgb() and return a nice RGB(a) object.
   *
   * @param {string} colorString the color input
   * @returns {KUTE.colorObject} the {r,g,b,a} color object
   */
  var trueColor = function (colorString) {
    var result;
    if (/rgb|rgba/.test(colorString)) { // first check if it's a rgb string
      var vrgb = colorString.replace(/\s|\)/, '').split('(')[1].split(',');
      var colorAlpha = vrgb[3] ? vrgb[3] : null;
      if (!colorAlpha) {
        result = { r: parseInt(vrgb[0], 10), g: parseInt(vrgb[1], 10), b: parseInt(vrgb[2], 10) };
      } else {
        result = {
          r: parseInt(vrgb[0], 10),
          g: parseInt(vrgb[1], 10),
          b: parseInt(vrgb[2], 10),
          a: parseFloat(colorAlpha),
        };
      }
    } if (/^#/.test(colorString)) {
      var fromHex = hexToRGB(colorString);
      result = { r: fromHex.r, g: fromHex.g, b: fromHex.b };
    } if (/transparent|none|initial|inherit/.test(colorString)) {
      result = {
        r: 0, g: 0, b: 0, a: 0,
      };
    }
    // maybe we can check for web safe colors
    // only works in a browser
    if (!/^#|^rgb/.test(colorString)) {
      var siteHead = document.getElementsByTagName('head')[0];
      siteHead.style.color = colorString;
      var webColor = getComputedStyle(siteHead, null).color;
      webColor = /rgb/.test(webColor) ? webColor.replace(/[^\d,]/g, '').split(',') : [0, 0, 0];
      siteHead.style.color = '';
      result = {
        r: parseInt(webColor[0], 10),
        g: parseInt(webColor[1], 10),
        b: parseInt(webColor[2], 10),
      };
    }
    return result;
  };

  /**
   * Color Interpolation Function.
   *
   * @param {KUTE.colorObject} a start color
   * @param {KUTE.colorObject} b end color
   * @param {number} v progress
   * @returns {string} the resulting color
   */
  function colors(a, b, v) {
    var _c = {};
    var ep = ')';
    var cm = ',';
    var rgb = 'rgb(';
    var rgba = 'rgba(';

    Object.keys(b).forEach(function (c) {
      if (c !== 'a') {
        _c[c] = numbers(a[c], b[c], v) >> 0 || 0; // eslint-disable-line no-bitwise
      } else if (a[c] && b[c]) {
        _c[c] = (numbers(a[c], b[c], v) * 100 >> 0) / 100; // eslint-disable-line no-bitwise
      }
    });

    return !_c.a
      ? rgb + _c.r + cm + _c.g + cm + _c.b + ep
      : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
  }

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartColors(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        // eslint-disable-next-line no-param-reassign
        elem.style[tweenProp] = colors(a, b, v);
      };
    }
  }

  // Component Properties
  // supported formats
  // 'hex', 'rgb', 'rgba' '#fff' 'rgb(0,0,0)' / 'rgba(0,0,0,0)' 'red' (IE9+)
  var supportedColors = [
    'color', 'backgroundColor', 'outlineColor',
    'borderColor', 'borderTopColor', 'borderRightColor',
    'borderBottomColor', 'borderLeftColor' ];

  var defaultColors = {};
  supportedColors.forEach(function (tweenProp) {
    defaultColors[tweenProp] = '#000';
  });

  // Component Functions
  var colorsOnStart = {};
  supportedColors.forEach(function (x) {
    colorsOnStart[x] = onStartColors;
  });

  /**
   * Returns the current property computed style.
   * @param {string} prop the property name
   * @returns {string} property computed style
   */
  function getColor(prop/* , value */) {
    return getStyleForProperty(this.element, prop) || defaultValues[prop];
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {KUTE.colorObject} the property tween object
   */
  function prepareColor(/* prop, */_, value) {
    return trueColor(value);
  }

  // All Component Functions
  var colorFunctions = {
    prepareStart: getColor,
    prepareProperty: prepareColor,
    onStart: colorsOnStart,
  };

  // Component Full
  var colorProperties = {
    component: 'colorProperties',
    category: 'colors',
    properties: supportedColors,
    defaultValues: defaultColors,
    Interpolate: { numbers: numbers, colors: colors },
    functions: colorFunctions,
    Util: { trueColor: trueColor },
  };

  // Component Interpolation
  /**
   * Sets the `drop-shadow` sub-property update function.
   * * disimbiguation `dropshadow` interpolation function and `dropShadow` property
   * @param {string} tweenProp the property name
   */
  function dropshadow(a, b, v) {
    var params = [];
    var unit = 'px';

    for (var i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-bitwise
      params[i] = ((numbers(a[i], b[i], v) * 100 >> 0) / 100) + unit;
    }
    return ("drop-shadow(" + (params.concat(colors(a[3], b[3], v)).join(' ')) + ")");
  }
  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartFilter(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        /* eslint-disable-next-line no-param-reassign -- impossible to satisfy */
        elem.style[tweenProp] = (b.url ? ("url(" + (b.url) + ")") : '')
                              /* eslint-disable no-bitwise -- impossible to satisfy */
                              + (a.opacity || b.opacity ? ("opacity(" + (((numbers(a.opacity, b.opacity, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.blur || b.blur ? ("blur(" + (((numbers(a.blur, b.blur, v) * 100) >> 0) / 100) + "em)") : '')
                              + (a.saturate || b.saturate ? ("saturate(" + (((numbers(a.saturate, b.saturate, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.invert || b.invert ? ("invert(" + (((numbers(a.invert, b.invert, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.grayscale || b.grayscale ? ("grayscale(" + (((numbers(a.grayscale, b.grayscale, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.hueRotate || b.hueRotate ? ("hue-rotate(" + (((numbers(a.hueRotate, b.hueRotate, v) * 100) >> 0) / 100) + "deg)") : '')
                              + (a.sepia || b.sepia ? ("sepia(" + (((numbers(a.sepia, b.sepia, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.brightness || b.brightness ? ("brightness(" + (((numbers(a.brightness, b.brightness, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.contrast || b.contrast ? ("contrast(" + (((numbers(a.contrast, b.contrast, v) * 100) >> 0) / 100) + "%)") : '')
                              + (a.dropShadow || b.dropShadow ? dropshadow(a.dropShadow, b.dropShadow, v) : '');
        /* eslint-enable no-bitwise -- impossible to satisfy */
      };
    }
  }

  /* filterEffects = {
    property: 'filter',
    subProperties: {},
    defaultValue: {},
    interpolators: {},
    functions = { prepareStart, prepareProperty, onStart, crossCheck }
  } */

  // Component Util
  /**
   * Returns camelCase filter sub-property.
   * @param {string} str source string
   * @returns {string} camelCase property name
   */
  function replaceDashNamespace(str) {
    return str.replace('-r', 'R').replace('-s', 'S');
  }

  /**
   * Returns `drop-shadow` sub-property object.
   * @param {(string | number)[]} shadow and `Array` with `drop-shadow` parameters
   * @returns {KUTE.filterList['dropShadow']} the expected `drop-shadow` values
   */
  function parseDropShadow(shadow) {
    var newShadow;

    if (shadow.length === 3) { // [h-shadow, v-shadow, color]
      newShadow = [shadow[0], shadow[1], 0, shadow[2]];
    } else if (shadow.length === 4) { // ideal [<offset-x>, <offset-y>, <blur-radius>, <color>]
      newShadow = [shadow[0], shadow[1], shadow[2], shadow[3]];
    }

    // make sure the values are ready to tween
    for (var i = 0; i < 3; i += 1) {
      newShadow[i] = parseFloat(newShadow[i]);
    }
    // also the color must be a rgb object
    newShadow[3] = trueColor(newShadow[3]);
    return newShadow;
  }

  /**
   * Returns an array with current filter sub-properties values.
   * @param {string} currentStyle the current filter computed style
   * @returns {{[x: string]: number}} the filter tuple
   */
  function parseFilterString(currentStyle) {
    var result = {};
    var fnReg = /(([a-z].*?)\(.*?\))(?=\s([a-z].*?)\(.*?\)|\s*$)/g;
    var matches = currentStyle.match(fnReg);
    var fnArray = currentStyle !== 'none' ? matches : 'none';

    if (fnArray instanceof Array) {
      for (var j = 0, jl = fnArray.length; j < jl; j += 1) {
        var p = fnArray[j].trim().split(/\((.+)/);
        var pp = replaceDashNamespace(p[0]);
        if (pp === 'dropShadow') {
          var shadowColor = p[1].match(/(([a-z].*?)\(.*?\))(?=\s(.*?))/)[0];
          var params = p[1].replace(shadowColor, '').split(/\s/).map(parseFloat);
          result[pp] = params.filter(function (el) { return !Number.isNaN(el); }).concat(shadowColor);
        } else {
          result[pp] = p[1].replace(/'|"|\)/g, '');
        }
      }
    }

    return result;
  }

  // Component Functions
  /**
   * Returns the current property computed style.
   * @param {string} tweenProp the property name
   * @param {string} value the property value
   * @returns {string} computed style for property
   */
  function getFilter(tweenProp, value) {
    var currentStyle = getStyleForProperty(this.element, tweenProp);
    var filterObject = parseFilterString(currentStyle);
    var fnp;

    Object.keys(value).forEach(function (fn) {
      fnp = replaceDashNamespace(fn);
      if (!filterObject[fnp]) {
        filterObject[fnp] = defaultValues[tweenProp][fn];
      }
    });

    return filterObject;
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property name
   * @returns {KUTE.filterList} the property tween object
   */
  function prepareFilter(/* tweenProp, */_, value) {
    var filterObject = {};
    var fnp;

    // property: range | default
    // opacity: [0-100%] | 100
    // blur: [0-Nem] | 0
    // saturate: [0-N%] | 100
    // invert: [0-100%] | 0
    // grayscale: [0-100%] | 0
    // brightness: [0-N%] | 100
    // contrast: [0-N%] | 100
    // sepia: [0-N%] | 0
    // 'hueRotate': [0-Ndeg] | 0
    // 'dropShadow': [0,0,0,(r:0,g:0,b:0)] | 0
    // url: '' | ''

    Object.keys(value).forEach(function (fn) {
      fnp = replaceDashNamespace(fn);
      if (/hue/.test(fn)) {
        filterObject[fnp] = parseFloat(value[fn]);
      } else if (/drop/.test(fn)) {
        filterObject[fnp] = parseDropShadow(value[fn]);
      } else if (fn === 'url') {
        filterObject[fn] = value[fn];
      // } else if ( /blur|opacity|grayscale|sepia/.test(fn) ) {
      } else {
        filterObject[fn] = parseFloat(value[fn]);
      }
    });

    return filterObject;
  }

  /**
   * Adds missing sub-properties in `valuesEnd` from `valuesStart`.
   * @param {string} tweenProp the property name
   */
  function crossCheckFilter(tweenProp) {
    var this$1$1 = this;

    if (this.valuesEnd[tweenProp]) {
      Object.keys(this.valuesStart[tweenProp]).forEach(function (fn) {
        if (!this$1$1.valuesEnd[tweenProp][fn]) {
          this$1$1.valuesEnd[tweenProp][fn] = this$1$1.valuesStart[tweenProp][fn];
        }
      });
    }
  }

  // All Component Functions
  var filterFunctions = {
    prepareStart: getFilter,
    prepareProperty: prepareFilter,
    onStart: onStartFilter,
    crossCheck: crossCheckFilter,
  };

  // Full Component
  var filterEffects = {
    component: 'filterEffects',
    property: 'filter',
    // opacity function interfere with opacityProperty
    // subProperties: [
    //   'blur', 'brightness','contrast','dropShadow',
    //   'hueRotate','grayscale','invert','opacity','saturate','sepia','url'
    // ],
    defaultValue: {
      opacity: 100,
      blur: 0,
      saturate: 100,
      grayscale: 0,
      brightness: 100,
      contrast: 100,
      sepia: 0,
      invert: 0,
      hueRotate: 0,
      dropShadow: [0, 0, 0, { r: 0, g: 0, b: 0 }],
      url: '',
    },
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
      dropShadow: { numbers: numbers, colors: colors, dropshadow: dropshadow },
    },
    functions: filterFunctions,
    Util: {
      parseDropShadow: parseDropShadow, parseFilterString: parseFilterString, replaceDashNamespace: replaceDashNamespace, trueColor: trueColor,
    },
  };

  // Component Special
  var attributes = {};

  var onStartAttr = {
    /**
     * onStartAttr.attr
     *
     * Sets the sub-property update function.
     * @param {string} tweenProp the property name
     */
    attr: function attr(tweenProp) {
      if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
        KEC[tweenProp] = function (elem, vS, vE, v) {
          Object.keys(vE).forEach(function (oneAttr) {
            KEC.attributes[oneAttr](elem, oneAttr, vS[oneAttr], vE[oneAttr], v);
          });
        };
      }
    },
    /**
     * onStartAttr.attributes
     *
     * Sets the update function for the property.
     * @param {string} tweenProp the property name
     */
    attributes: function attributes$1(tweenProp) {
      if (!KEC[tweenProp] && this.valuesEnd.attr) {
        KEC[tweenProp] = attributes;
      }
    },
  };

  // Component Name
  var ComponentName = 'htmlAttributes';

  // Component Properties
  var svgColors = ['fill', 'stroke', 'stop-color'];

  // Component Util
  /**
   * Returns non-camelcase property name.
   * @param {string} a the camelcase property name
   * @returns {string} the non-camelcase property name
   */
  function replaceUppercase(a) { return a.replace(/[A-Z]/g, '-$&').toLowerCase(); }

  // Component Functions
  /**
   * Returns the current attribute value.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {{[x:string]: string}} attribute value
   */
  function getAttr(/* tweenProp, */_, value) {
    var this$1$1 = this;

    var attrStartValues = {};
    Object.keys(value).forEach(function (attr) {
      // get the value for 'fill-opacity' not fillOpacity
      // also 'width' not the internal 'width_px'
      var attribute = replaceUppercase(attr).replace(/_+[a-z]+/, '');
      var currentValue = this$1$1.element.getAttribute(attribute);
      attrStartValues[attribute] = svgColors.includes(attribute)
        ? (currentValue || 'rgba(0,0,0,0)')
        : (currentValue || (/opacity/i.test(attr) ? 1 : 0));
    });

    return attrStartValues;
  }

  /**
   * Returns the property tween object.
   * @param {string} tweenProp the property name
   * @param {string} attrObj the property value
   * @returns {number} the property tween object
   */
  function prepareAttr(tweenProp, attrObj) {
    var this$1$1 = this;
   // attr (string),attrObj (object)
    var attributesObject = {};

    Object.keys(attrObj).forEach(function (p) {
      var prop = replaceUppercase(p);
      var regex = /(%|[a-z]+)$/;
      var currentValue = this$1$1.element.getAttribute(prop.replace(/_+[a-z]+/, ''));

      if (!svgColors.includes(prop)) {
        // attributes set with unit suffixes
        if (currentValue !== null && regex.test(currentValue)) {
          var unit = trueDimension(currentValue).u || trueDimension(attrObj[p]).u;
          var suffix = /%/.test(unit) ? '_percent' : ("_" + unit);

          // most "unknown" attributes cannot register into onStart, so we manually add them
          onStart[ComponentName][prop + suffix] = function (tp) {
            if (this$1$1.valuesEnd[tweenProp] && this$1$1.valuesEnd[tweenProp][tp] && !(tp in attributes)) {
              attributes[tp] = function (elem, oneAttr, a, b, v) {
                var _p = oneAttr.replace(suffix, '');
                /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
                elem.setAttribute(_p, ((numbers(a.v, b.v, v) * 1000 >> 0) / 1000) + b.u);
              };
            }
          };
          attributesObject[prop + suffix] = trueDimension(attrObj[p]);
        } else if (!regex.test(attrObj[p]) || currentValue === null
          || (currentValue && !regex.test(currentValue))) {
          // most "unknown" attributes cannot register into onStart, so we manually add them
          onStart[ComponentName][prop] = function (tp) {
            if (this$1$1.valuesEnd[tweenProp] && this$1$1.valuesEnd[tweenProp][tp] && !(tp in attributes)) {
              attributes[tp] = function (elem, oneAttr, a, b, v) {
                elem.setAttribute(oneAttr, (numbers(a, b, v) * 1000 >> 0) / 1000);
              };
            }
          };
          attributesObject[prop] = parseFloat(attrObj[p]);
        }
      } else { // colors
        // most "unknown" attributes cannot register into onStart, so we manually add them
        onStart[ComponentName][prop] = function (tp) {
          if (this$1$1.valuesEnd[tweenProp] && this$1$1.valuesEnd[tweenProp][tp] && !(tp in attributes)) {
            attributes[tp] = function (elem, oneAttr, a, b, v) {
              elem.setAttribute(oneAttr, colors(a, b, v));
            };
          }
        };
        attributesObject[prop] = trueColor(attrObj[p]) || defaultValues.htmlAttributes[p];
      }
    });

    return attributesObject;
  }

  // All Component Functions
  var attrFunctions = {
    prepareStart: getAttr,
    prepareProperty: prepareAttr,
    onStart: onStartAttr,
  };

  // Component Full
  var htmlAttributes = {
    component: ComponentName,
    property: 'attr',
    // the Animation class will need some values to validate this Object attribute
    subProperties: ['fill', 'stroke', 'stop-color', 'fill-opacity', 'stroke-opacity'],
    defaultValue: {
      fill: 'rgb(0,0,0)',
      stroke: 'rgb(0,0,0)',
      'stop-color': 'rgb(0,0,0)',
      opacity: 1,
      'stroke-opacity': 1,
      'fill-opacity': 1, // same here
    },
    Interpolate: { numbers: numbers, colors: colors },
    functions: attrFunctions,
    // export to global for faster execution
    Util: { replaceUppercase: replaceUppercase, trueColor: trueColor, trueDimension: trueDimension },
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

  // Component Functions
  /**
   * Returns the current property computed style.
   * @param {string} tweenProp the property name
   * @returns {string} computed style for property
   */
  function getOpacity(tweenProp/* , value */) {
    return getStyleForProperty(this.element, tweenProp);
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {number} the property tween object
   */
  function prepareOpacity(/* tweenProp, */_, value) {
    return parseFloat(value); // opacity always FLOAT
  }

  // All Component Functions
  var opacityFunctions = {
    prepareStart: getOpacity,
    prepareProperty: prepareOpacity,
    onStart: onStartOpacity,
  };

  // Full Component
  var OpacityProperty = {
    component: 'opacityProperty',
    property: 'opacity',
    defaultValue: 1,
    Interpolate: { numbers: numbers },
    functions: opacityFunctions,
  };

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartDraw(tweenProp) {
    if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        /* eslint-disable no-bitwise -- impossible to satisfy */
        var pathLength = (a.l * 100 >> 0) / 100;
        var start = (numbers(a.s, b.s, v) * 100 >> 0) / 100;
        var end = (numbers(a.e, b.e, v) * 100 >> 0) / 100;
        var offset = 0 - start;
        var dashOne = end + offset;
        // eslint-disable-next-line no-param-reassign -- impossible to satisfy
        elem.style.strokeDashoffset = offset + "px";
        // eslint-disable-next-line no-param-reassign -- impossible to satisfy
        elem.style.strokeDasharray = (((dashOne < 1 ? 0 : dashOne) * 100 >> 0) / 100) + "px, " + pathLength + "px";
        /* eslint-disable no-bitwise -- impossible to satisfy */
      };
    }
  }

  // Component Util
  /**
   * Convert a `<path>` length percent value to absolute.
   * @param {string} v raw value
   * @param {number} l length value
   * @returns {number} the absolute value
   */
  function percent(v, l) {
    return (parseFloat(v) / 100) * l;
  }

  /**
   * Returns the `<rect>` length.
   * It doesn't compute `rx` and / or `ry` of the element.
   * @see http://stackoverflow.com/a/30376660
   * @param {SVGRectElement} el target element
   * @returns {number} the `<rect>` length
   */
  function getRectLength(el) {
    var w = el.getAttribute('width');
    var h = el.getAttribute('height');
    return (w * 2) + (h * 2);
  }

  /**
   * Returns the `<polyline>` / `<polygon>` length.
   * @param {SVGPolylineElement | SVGPolygonElement} el target element
   * @returns {number} the element length
   */
  function getPolyLength(el) {
    var points = el.getAttribute('points').split(' ');

    var len = 0;
    if (points.length > 1) {
      var coord = function (p) {
        var c = p.split(',');
        if (c.length !== 2) { return 0; } // return undefined
        if (Number.isNaN(c[0] * 1) || Number.isNaN(c[1] * 1)) { return 0; }
        return [parseFloat(c[0]), parseFloat(c[1])];
      };

      var dist = function (c1, c2) {
        if (c1 !== undefined && c2 !== undefined) {
          return Math.sqrt(Math.pow( (c2[0] - c1[0]), 2 ) + Math.pow( (c2[1] - c1[1]), 2 ));
        }
        return 0;
      };

      if (points.length > 2) {
        for (var i = 0; i < points.length - 1; i += 1) {
          len += dist(coord(points[i]), coord(points[i + 1]));
        }
      }
      len += el.tagName === 'polygon'
        ? dist(coord(points[0]), coord(points[points.length - 1])) : 0;
    }
    return len;
  }

  /**
   * Returns the `<line>` length.
   * @param {SVGLineElement} el target element
   * @returns {number} the element length
   */
  function getLineLength(el) {
    var x1 = el.getAttribute('x1');
    var x2 = el.getAttribute('x2');
    var y1 = el.getAttribute('y1');
    var y2 = el.getAttribute('y2');
    return Math.sqrt(Math.pow( (x2 - x1), 2 ) + Math.pow( (y2 - y1), 2 ));
  }

  /**
   * Returns the `<circle>` length.
   * @param {SVGCircleElement} el target element
   * @returns {number} the element length
   */
  function getCircleLength(el) {
    var r = el.getAttribute('r');
    return 2 * Math.PI * r;
  }

  // returns the length of an ellipse
  /**
   * Returns the `<ellipse>` length.
   * @param {SVGEllipseElement} el target element
   * @returns {number} the element length
   */
  function getEllipseLength(el) {
    var rx = el.getAttribute('rx');
    var ry = el.getAttribute('ry');
    var len = 2 * rx;
    var wid = 2 * ry;
    return ((Math.sqrt(0.5 * ((len * len) + (wid * wid)))) * (Math.PI * 2)) / 2;
  }

  /**
   * Returns the shape length.
   * @param {SVGPathCommander.shapeTypes} el target element
   * @returns {number} the element length
   */
  function getTotalLength(el) {
    if (el.tagName === 'rect') {
      return getRectLength(el);
    } if (el.tagName === 'circle') {
      return getCircleLength(el);
    } if (el.tagName === 'ellipse') {
      return getEllipseLength(el);
    } if (['polygon', 'polyline'].includes(el.tagName)) {
      return getPolyLength(el);
    } if (el.tagName === 'line') {
      return getLineLength(el);
    }
    // ESLint
    return 0;
  }

  /**
   * Returns the property tween object.
   * @param {SVGPathCommander.shapeTypes} element the target element
   * @param {string | KUTE.drawObject} value the property value
   * @returns {KUTE.drawObject} the property tween object
   */
  function getDraw(element, value) {
    var length = /path|glyph/.test(element.tagName)
      ? element.getTotalLength()
      : getTotalLength(element);
    var start;
    var end;
    var dasharray;
    var offset;

    if (value instanceof Object && Object.keys(value).every(function (v) { return ['s', 'e', 'l'].includes(v); })) {
      return value;
    } if (typeof value === 'string') {
      var v = value.split(/,|\s/);
      start = /%/.test(v[0]) ? percent(v[0].trim(), length) : parseFloat(v[0]);
      end = /%/.test(v[1]) ? percent(v[1].trim(), length) : parseFloat(v[1]);
    } else if (typeof value === 'undefined') {
      offset = parseFloat(getStyleForProperty(element, 'stroke-dashoffset'));
      dasharray = getStyleForProperty(element, 'stroke-dasharray').split(',');

      start = 0 - offset;
      end = parseFloat(dasharray[0]) + start || length;
    }
    return { s: start, e: end, l: length };
  }

  /**
   * Reset CSS properties associated with the `draw` property.
   * @param {SVGPathCommander.shapeTypes} element target
   */
  function resetDraw(elem) {
    /* eslint-disable no-param-reassign -- impossible to satisfy */
    elem.style.strokeDashoffset = '';
    elem.style.strokeDasharray = '';
    /* eslint-disable no-param-reassign -- impossible to satisfy */
  }

  // Component Functions
  /**
   * Returns the property tween object.
   * @returns {KUTE.drawObject} the property tween object
   */
  function getDrawValue(/* prop, value */) {
    return getDraw(this.element);
  }
  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string | KUTE.drawObject} value the property value
   * @returns {KUTE.drawObject} the property tween object
   */
  function prepareDraw(_, value) {
    return getDraw(this.element, value);
  }

  // All Component Functions
  var svgDrawFunctions = {
    prepareStart: getDrawValue,
    prepareProperty: prepareDraw,
    onStart: onStartDraw,
  };

  // Component Full
  var SvgDrawProperty = {
    component: 'svgDraw',
    property: 'draw',
    defaultValue: '0% 0%',
    Interpolate: { numbers: numbers },
    functions: svgDrawFunctions,
    // Export to global for faster execution
    Util: {
      getRectLength: getRectLength,
      getPolyLength: getPolyLength,
      getLineLength: getLineLength,
      getCircleLength: getCircleLength,
      getEllipseLength: getEllipseLength,
      getTotalLength: getTotalLength,
      resetDraw: resetDraw,
      getDraw: getDraw,
      percent: percent,
    },
  };

  /**
   * Segment params length
   * @type {Record<string, number>}
   */
  var paramsCount = {
    a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0,
  };

  /**
   * Breaks the parsing of a pathString once a segment is finalized.
   *
   * @param {SVGPath.PathParser} path the `PathParser` instance
   */
  function finalizeSegment(path) {
    var pathCommand = path.pathValue[path.segmentStart];
    var LK = pathCommand.toLowerCase();
    var data = path.data;

    while (data.length >= paramsCount[LK]) {
      // overloaded `moveTo`
      // https://github.com/rveciana/svg-path-properties/blob/master/src/parse.ts
      if (LK === 'm' && data.length > 2) {
        path.segments.push([pathCommand ].concat( data.splice(0, 2)));
        LK = 'l';
        pathCommand = pathCommand === 'm' ? 'l' : 'L';
      } else {
        path.segments.push([pathCommand ].concat( data.splice(0, paramsCount[LK])));
      }

      if (!paramsCount[LK]) {
        break;
      }
    }
  }

  var error = 'SVGPathCommander error';

  /**
   * Validates an A (arc-to) specific path command value.
   * Usually a `large-arc-flag` or `sweep-flag`.
   *
   * @param {SVGPath.PathParser} path the `PathParser` instance
   */
  function scanFlag(path) {
    var index = path.index;
    var pathValue = path.pathValue;
    var code = pathValue.charCodeAt(index);

    if (code === 0x30/* 0 */) {
      path.param = 0;
      path.index += 1;
      return;
    }

    if (code === 0x31/* 1 */) {
      path.param = 1;
      path.index += 1;
      return;
    }

    path.err = error + ": invalid Arc flag \"" + (pathValue[index]) + "\", expecting 0 or 1 at index " + index;
  }

  /**
   * Checks if a character is a digit.
   *
   * @param {number} code the character to check
   * @returns {boolean} check result
   */
  function isDigit(code) {
    return (code >= 48 && code <= 57); // 0..9
  }

  var invalidPathValue = 'Invalid path value';

  /**
   * Validates every character of the path string,
   * every path command, negative numbers or floating point numbers.
   *
   * @param {SVGPath.PathParser} path the `PathParser` instance
   */
  function scanParam(path) {
    var max = path.max;
    var pathValue = path.pathValue;
    var start = path.index;
    var index = start;
    var zeroFirst = false;
    var hasCeiling = false;
    var hasDecimal = false;
    var hasDot = false;
    var ch;

    if (index >= max) {
      // path.err = 'SvgPath: missed param (at pos ' + index + ')';
      path.err = error + ": " + invalidPathValue + " at index " + index + ", \"pathValue\" is missing param";
      return;
    }
    ch = pathValue.charCodeAt(index);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index += 1;
      // ch = (index < max) ? pathValue.charCodeAt(index) : 0;
      ch = pathValue.charCodeAt(index);
    }

    // This logic is shamelessly borrowed from Esprima
    // https://github.com/ariya/esprimas
    if (!isDigit(ch) && ch !== 0x2E/* . */) {
      // path.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
      path.err = error + ": " + invalidPathValue + " at index " + index + ", \"" + (pathValue[index]) + "\" is not a number";
      return;
    }

    if (ch !== 0x2E/* . */) {
      zeroFirst = (ch === 0x30/* 0 */);
      index += 1;

      ch = pathValue.charCodeAt(index);

      if (zeroFirst && index < max) {
        // decimal number starts with '0' such as '09' is illegal.
        if (ch && isDigit(ch)) {
          // path.err = 'SvgPath: numbers started with `0` such as `09`
          // are illegal (at pos ' + start + ')';
          path.err = error + ": " + invalidPathValue + " at index " + start + ", \"" + (pathValue[start]) + "\" illegal number";
          return;
        }
      }

      while (index < max && isDigit(pathValue.charCodeAt(index))) {
        index += 1;
        hasCeiling = true;
      }

      ch = pathValue.charCodeAt(index);
    }

    if (ch === 0x2E/* . */) {
      hasDot = true;
      index += 1;
      while (isDigit(pathValue.charCodeAt(index))) {
        index += 1;
        hasDecimal = true;
      }

      ch = pathValue.charCodeAt(index);
    }

    if (ch === 0x65/* e */ || ch === 0x45/* E */) {
      if (hasDot && !hasCeiling && !hasDecimal) {
        path.err = error + ": " + invalidPathValue + " at index " + index + ", \"" + (pathValue[index]) + "\" invalid float exponent";
        return;
      }

      index += 1;

      ch = pathValue.charCodeAt(index);

      if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
        index += 1;
      }
      if (index < max && isDigit(pathValue.charCodeAt(index))) {
        while (index < max && isDigit(pathValue.charCodeAt(index))) {
          index += 1;
        }
      } else {
        path.err = error + ": " + invalidPathValue + " at index " + index + ", \"" + (pathValue[index]) + "\" invalid integer exponent";
        return;
      }
    }

    path.index = index;
    path.param = +path.pathValue.slice(start, index);
  }

  /**
   * Checks if the character is a space.
   *
   * @param {number} ch the character to check
   * @returns {boolean} check result
   */
  function isSpace(ch) {
    var specialSpaces = [
      0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
      0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF];
    /* istanbul ignore next */
    return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) // Line terminators
      // White spaces
      || (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0)
      || (ch >= 0x1680 && specialSpaces.includes(ch));
  }

  /**
   * Points the parser to the next character in the
   * path string every time it encounters any kind of
   * space character.
   *
   * @param {SVGPath.PathParser} path the `PathParser` instance
   */
  function skipSpaces(path) {
    var pathValue = path.pathValue;
    var max = path.max;
    while (path.index < max && isSpace(pathValue.charCodeAt(path.index))) {
      path.index += 1;
    }
  }

  /**
   * Checks if the character is a path command.
   *
   * @param {any} code the character to check
   * @returns {boolean} check result
   */
  function isPathCommand(code) {
    // eslint-disable-next-line no-bitwise -- Impossible to satisfy
    switch (code | 0x20) {
      case 0x6D/* m */:
      case 0x7A/* z */:
      case 0x6C/* l */:
      case 0x68/* h */:
      case 0x76/* v */:
      case 0x63/* c */:
      case 0x73/* s */:
      case 0x71/* q */:
      case 0x74/* t */:
      case 0x61/* a */:
      // case 0x72/* r */:
        return true;
      default:
        return false;
    }
  }

  /**
   * Checks if the character is or belongs to a number.
   * [0-9]|+|-|.
   *
   * @param {number} code the character to check
   * @returns {boolean} check result
   */
  function isDigitStart(code) {
    return (code >= 48 && code <= 57) /* 0..9 */
      || code === 0x2B /* + */
      || code === 0x2D /* - */
      || code === 0x2E; /* . */
  }

  /**
   * Checks if the character is an A (arc-to) path command.
   *
   * @param {number} code the character to check
   * @returns {boolean} check result
   */
  function isArcCommand(code) {
    // eslint-disable-next-line no-bitwise -- Impossible to satisfy
    return (code | 0x20) === 0x61;
  }

  /**
   * Scans every character in the path string to determine
   * where a segment starts and where it ends.
   *
   * @param {SVGPath.PathParser} path the `PathParser` instance
   */
  function scanSegment(path) {
    var max = path.max;
    var pathValue = path.pathValue;
    var index = path.index;
    var cmdCode = pathValue.charCodeAt(index);
    var reqParams = paramsCount[pathValue[index].toLowerCase()];

    path.segmentStart = index;

    if (!isPathCommand(cmdCode)) {
      path.err = error + ": " + invalidPathValue + " \"" + (pathValue[index]) + "\" is not a path command";
      return;
    }

    path.index += 1;
    skipSpaces(path);

    path.data = [];

    if (!reqParams) {
      // Z
      finalizeSegment(path);
      return;
    }

    for (;;) {
      for (var i = reqParams; i > 0; i -= 1) {
        if (isArcCommand(cmdCode) && (i === 3 || i === 4)) { scanFlag(path); }
        else { scanParam(path); }

        if (path.err.length) {
          return;
        }
        path.data.push(path.param);

        skipSpaces(path);

        // after ',' param is mandatory
        if (path.index < max && pathValue.charCodeAt(path.index) === 0x2C/* , */) {
          path.index += 1;
          skipSpaces(path);
        }
      }

      if (path.index >= path.max) {
        break;
      }

      // Stop on next segment
      if (!isDigitStart(pathValue.charCodeAt(path.index))) {
        break;
      }
    }

    finalizeSegment(path);
  }

  /**
   * Returns a clone of an existing `pathArray`.
   *
   * @param {SVGPath.pathArray | SVGPath.pathSegment} path the source `pathArray`
   * @returns {any} the cloned `pathArray`
   */
  function clonePath(path) {
    return path.map(function (x) { return (Array.isArray(x) ? [].concat( x ) : x); });
  }

  /**
   * The `PathParser` is used by the `parsePathString` static method
   * to generate a `pathArray`.
   *
   * @param {string} pathString
   */
  function PathParser(pathString) {
    /** @type {SVGPath.pathArray} */
    this.segments = [];
    /** @type {string} */
    this.pathValue = pathString;
    /** @type {number} */
    this.max = pathString.length;
    /** @type {number} */
    this.index = 0;
    /** @type {number} */
    this.param = 0.0;
    /** @type {number} */
    this.segmentStart = 0;
    /** @type {any} */
    this.data = [];
    /** @type {string} */
    this.err = '';
  }

  /**
   * Iterates an array to check if it's an actual `pathArray`.
   *
   * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
   * @returns {boolean} iteration result
   */
  function isPathArray(path) {
    return Array.isArray(path) && path.every(function (seg) {
      var lk = seg[0].toLowerCase();
      return paramsCount[lk] === seg.length - 1 && 'achlmqstvz'.includes(lk);
    });
  }

  /**
   * Parses a path string value and returns an array
   * of segments we like to call `pathArray`.
   *
   * @param {SVGPath.pathArray | string} pathInput the string to be parsed
   * @returns {SVGPath.pathArray | string} the resulted `pathArray` or error string
   */
  function parsePathString(pathInput) {
    if (isPathArray(pathInput)) {
      return clonePath(pathInput);
    }

    var path = new PathParser(pathInput);

    skipSpaces(path);

    while (path.index < path.max && !path.err.length) {
      scanSegment(path);
    }

    return path.err ? path.err : path.segments;
  }

  /**
   * Iterates an array to check if it's a `pathArray`
   * with all absolute values.
   *
   * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
   * @returns {boolean} iteration result
   */
  function isAbsoluteArray(path) {
    return isPathArray(path)
      // `isPathArray` also checks if it's `Array`
      && path.every(function (ref) {
        var x = ref[0];

        return x === x.toUpperCase();
    });
  }

  /**
   * Parses a path string value or object and returns an array
   * of segments, all converted to absolute values.
   *
   * @param {string | SVGPath.pathArray} pathInput the path string | object
   * @returns {SVGPath.absoluteArray} the resulted `pathArray` with absolute values
   */
  function pathToAbsolute(pathInput) {
    /* istanbul ignore else */
    if (isAbsoluteArray(pathInput)) {
      // `isAbsoluteArray` checks if it's `pathArray`
      return clonePath(pathInput);
    }

    var path = parsePathString(pathInput);
    var x = 0; var y = 0;
    var mx = 0; var my = 0;

    // the `absoluteSegment[]` is for sure an `absolutePath`
    return path.map(function (segment) {
      var assign, assign$1, assign$2;

      var values = segment.slice(1).map(Number);
      var pathCommand = segment[0];
      /** @type {SVGPath.absoluteCommand} */
      var absCommand = pathCommand.toUpperCase();

      if (pathCommand === 'M') {
        (assign = values, x = assign[0], y = assign[1]);
        mx = x;
        my = y;
        return ['M', x, y];
      }
      /** @type {SVGPath.absoluteSegment} */
      var absoluteSegment = [];

      if (pathCommand !== absCommand) {
        switch (absCommand) {
          case 'A':
            absoluteSegment = [
              absCommand, values[0], values[1], values[2],
              values[3], values[4], values[5] + x, values[6] + y];
            break;
          case 'V':
            absoluteSegment = [absCommand, values[0] + y];
            break;
          case 'H':
            absoluteSegment = [absCommand, values[0] + x];
            break;
          default: {
            // use brakets for `eslint: no-case-declaration`
            // https://stackoverflow.com/a/50753272/803358
            var absValues = values.map(function (n, j) { return n + (j % 2 ? y : x); });
            // for n, l, c, s, q, t
            absoluteSegment = [absCommand ].concat( absValues);
          }
        }
      } else {
        absoluteSegment = [absCommand ].concat( values);
      }

      var segLength = absoluteSegment.length;
      switch (absCommand) {
        case 'Z':
          x = mx;
          y = my;
          break;
        case 'H':
          (assign$1 = absoluteSegment, x = assign$1[1]);
          break;
        case 'V':
          (assign$2 = absoluteSegment, y = assign$2[1]);
          break;
        default:
          x = absoluteSegment[segLength - 2];
          y = absoluteSegment[segLength - 1];

          if (absCommand === 'M') {
            mx = x;
            my = y;
          }
      }
      return absoluteSegment;
    });
  }

  /**
   * Splits an extended A (arc-to) segment into two cubic-bezier segments.
   *
   * @param {SVGPath.pathArray} path the `pathArray` this segment belongs to
   * @param {string[]} allPathCommands all previous path commands
   * @param {number} i the segment index
   */

  function fixArc(path, allPathCommands, i) {
    if (path[i].length > 7) {
      path[i].shift();
      var segment = path[i];
      var ni = i; // ESLint
      while (segment.length) {
        // if created multiple C:s, their original seg is saved
        allPathCommands[i] = 'A';
        path.splice(ni += 1, 0, ['C' ].concat( segment.splice(0, 6)));
      }
      path.splice(i, 1);
    }
  }

  /**
   * Iterates an array to check if it's a `pathArray`
   * with all segments are in non-shorthand notation
   * with absolute values.
   *
   * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
   * @returns {boolean} iteration result
   */
  function isNormalizedArray(path) {
    // `isAbsoluteArray` also checks if it's `Array`
    return isAbsoluteArray(path) && path.every(function (ref) {
      var pc = ref[0];

      return 'ACLMQZ'.includes(pc);
    });
  }

  /**
   * Iterates an array to check if it's a `pathArray`
   * with all C (cubic bezier) segments.
   *
   * @param {string | SVGPath.pathArray} path the `Array` to be checked
   * @returns {boolean} iteration result
   */
  function isCurveArray(path) {
    // `isPathArray` also checks if it's `Array`
    return isNormalizedArray(path) && path.every(function (ref) {
      var pc = ref[0];

      return 'MC'.includes(pc);
    });
  }

  /**
   * Normalizes a single segment of a `pathArray` object.
   *
   * @param {SVGPath.pathSegment} segment the segment object
   * @param {any} params the coordinates of the previous segment
   * @returns {SVGPath.normalSegment} the normalized segment
   */
  function normalizeSegment(segment, params) {
    var pathCommand = segment[0];
    var px1 = params.x1;
    var py1 = params.y1;
    var px2 = params.x2;
    var py2 = params.y2;
    var values = segment.slice(1).map(Number);
    var result = segment;

    if (!'TQ'.includes(pathCommand)) {
      // optional but good to be cautious
      params.qx = null;
      params.qy = null;
    }

    if (pathCommand === 'H') {
      result = ['L', segment[1], py1];
    } else if (pathCommand === 'V') {
      result = ['L', px1, segment[1]];
    } else if (pathCommand === 'S') {
      var x1 = px1 * 2 - px2;
      var y1 = py1 * 2 - py2;
      params.x1 = x1;
      params.y1 = y1;
      result = ['C', x1, y1 ].concat( values);
    } else if (pathCommand === 'T') {
      var qx = px1 * 2 - params.qx;
      var qy = py1 * 2 - params.qy;
      params.qx = qx;
      params.qy = qy;
      result = ['Q', qx, qy ].concat( values);
    } else if (pathCommand === 'Q') {
      var nqx = values[0];
      var nqy = values[1];
      params.qx = nqx;
      params.qy = nqy;
    }

    return result;
  }

  /**
   * @type {SVGPath.parserParams}
   */
  var paramsParser = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
  };

  /**
   * Normalizes a `path` object for further processing:
   * * convert segments to absolute values
   * * convert shorthand path commands to their non-shorthand notation
   *
   * @param {string | SVGPath.pathArray} pathInput the string to be parsed or 'pathArray'
   * @returns {SVGPath.normalArray} the normalized `pathArray`
   */
  function normalizePath(pathInput) {
    var assign;

    if (isNormalizedArray(pathInput)) {
      return clonePath(pathInput);
    }

    /** @type {SVGPath.normalArray} */
    var path = pathToAbsolute(pathInput);
    var params = Object.assign({}, paramsParser);
    var ii = path.length;

    for (var i = 0; i < ii; i += 1) {
      (assign = path[i], assign[0]);
      path[i] = normalizeSegment(path[i], params);

      var segment = path[i];
      var seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }

    return path;
  }

  /**
   * Returns an {x,y} vector rotated by a given
   * angle in radian.
   *
   * @param {number} x the initial vector x
   * @param {number} y the initial vector y
   * @param {number} rad the radian vector angle
   * @returns {{x: number, y: number}} the rotated vector
   */
  function rotateVector(x, y, rad) {
    var X = x * Math.cos(rad) - y * Math.sin(rad);
    var Y = x * Math.sin(rad) + y * Math.cos(rad);
    return { x: X, y: Y };
  }

  /**
   * Converts A (arc-to) segments to C (cubic-bezier-to).
   *
   * For more information of where this math came from visit:
   * http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
   *
   * @param {number} X1 the starting x position
   * @param {number} Y1 the starting y position
   * @param {number} RX x-radius of the arc
   * @param {number} RY y-radius of the arc
   * @param {number} angle x-axis-rotation of the arc
   * @param {number} LAF large-arc-flag of the arc
   * @param {number} SF sweep-flag of the arc
   * @param {number} X2 the ending x position
   * @param {number} Y2 the ending y position
   * @param {number[]=} recursive the parameters needed to split arc into 2 segments
   * @return {number[]} the resulting cubic-bezier segment(s)
   */
  function arcToCubic(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, recursive) {
    var assign;

    var x1 = X1; var y1 = Y1; var rx = RX; var ry = RY; var x2 = X2; var y2 = Y2;
    // for more information of where this Math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var d120 = (Math.PI * 120) / 180;

    var rad = (Math.PI / 180) * (+angle || 0);
    /** @type {number[]} */
    var res = [];
    var xy;
    var f1;
    var f2;
    var cx;
    var cy;

    if (!recursive) {
      xy = rotateVector(x1, y1, -rad);
      x1 = xy.x;
      y1 = xy.y;
      xy = rotateVector(x2, y2, -rad);
      x2 = xy.x;
      y2 = xy.y;

      var x = (x1 - x2) / 2;
      var y = (y1 - y2) / 2;
      var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx *= h;
        ry *= h;
      }
      var rx2 = rx * rx;
      var ry2 = ry * ry;

      var k = (LAF === SF ? -1 : 1)
              * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
                  / (rx2 * y * y + ry2 * x * x)));

      cx = ((k * rx * y) / ry) + ((x1 + x2) / 2);
      cy = ((k * -ry * x) / rx) + ((y1 + y2) / 2);
      // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
      f1 = Math.asin((((y1 - cy) / ry) * (Math.pow( 10, 9 )) >> 0) / (Math.pow( 10, 9 )));
      // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
      f2 = Math.asin((((y2 - cy) / ry) * (Math.pow( 10, 9 )) >> 0) / (Math.pow( 10, 9 )));

      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      if (f1 < 0) { (f1 = Math.PI * 2 + f1); }
      if (f2 < 0) { (f2 = Math.PI * 2 + f2); }
      if (SF && f1 > f2) {
        f1 -= Math.PI * 2;
      }
      if (!SF && f2 > f1) {
        f2 -= Math.PI * 2;
      }
    } else {
      (assign = recursive, f1 = assign[0], f2 = assign[1], cx = assign[2], cy = assign[3]);
    }
    var df = f2 - f1;
    if (Math.abs(df) > d120) {
      var f2old = f2;
      var x2old = x2;
      var y2old = y2;
      f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = arcToCubic(x2, y2, rx, ry, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1);
    var s1 = Math.sin(f1);
    var c2 = Math.cos(f2);
    var s2 = Math.sin(f2);
    var t = Math.tan(df / 4);
    var hx = (4 / 3) * rx * t;
    var hy = (4 / 3) * ry * t;
    var m1 = [x1, y1];
    var m2 = [x1 + hx * s1, y1 - hy * c1];
    var m3 = [x2 + hx * s2, y2 - hy * c2];
    var m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return m2.concat( m3, m4, res);
    }
    res = m2.concat( m3, m4, res);
    var newres = [];
    for (var i = 0, ii = res.length; i < ii; i += 1) {
      newres[i] = i % 2
        ? rotateVector(res[i - 1], res[i], rad).y
        : rotateVector(res[i], res[i + 1], rad).x;
    }
    return newres;
  }

  /**
   * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
   *
   * @param {number} x1 curve start x
   * @param {number} y1 curve start y
   * @param {number} qx control point x
   * @param {number} qy control point y
   * @param {number} x2 curve end x
   * @param {number} y2 curve end y
   * @returns {number[]} the cubic-bezier segment
   */
  function quadToCubic(x1, y1, qx, qy, x2, y2) {
    var r13 = 1 / 3;
    var r23 = 2 / 3;
    return [
      r13 * x1 + r23 * qx, // cpx1
      r13 * y1 + r23 * qy, // cpy1
      r13 * x2 + r23 * qx, // cpx2
      r13 * y2 + r23 * qy, // cpy2
      x2, y2 ];
  }

  /**
   * Returns the coordinates of a specified distance
   * ratio between two points.
   *
   * @param {[number, number]} a the first point coordinates
   * @param {[number, number]} b the second point coordinates
   * @param {number} t the ratio
   * @returns {[number, number]} the midpoint coordinates
   */
  function midPoint(a, b, t) {
    var ax = a[0];
    var ay = a[1]; var bx = b[0];
    var by = b[1];
    return [ax + (bx - ax) * t, ay + (by - ay) * t];
  }

  /**
   * Returns the square root of the distance
   * between two given points.
   *
   * @param {[number, number]} a the first point coordinates
   * @param {[number, number]} b the second point coordinates
   * @returns {number} the distance value
   */
  function distanceSquareRoot(a, b) {
    return Math.sqrt(
      (a[0] - b[0]) * (a[0] - b[0])
      + (a[1] - b[1]) * (a[1] - b[1])
    );
  }

  /**
   * Returns a {x,y} point at a given length, the total length and
   * the minimum and maximum {x,y} coordinates of a line (L,V,H,Z) segment.
   *
   * @param {number} x1 the starting point X
   * @param {number} y1 the starting point Y
   * @param {number} x2 the ending point X
   * @param {number} y2 the ending point Y
   * @param {number=} distance the distance to point
   * @returns {SVGPath.lengthFactory} the segment length, point, min & max
   */
  function segmentLineFactory(x1, y1, x2, y2, distance) {
    var length = distanceSquareRoot([x1, y1], [x2, y2]);
    var point = { x: 0, y: 0 };

    /* istanbul ignore else */
    if (typeof distance === 'number') {
      if (distance <= 0) {
        point = { x: x1, y: y1 };
      } else if (distance >= length) {
        point = { x: x2, y: y2 };
      } else {
        var ref = midPoint([x1, y1], [x2, y2], distance / length);
        var x = ref[0];
        var y = ref[1];
        point = { x: x, y: y };
      }
    }

    return {
      length: length,
      point: point,
      min: {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
      },
      max: {
        x: Math.max(x1, x2),
        y: Math.max(y1, y2),
      },
    };
  }

  /**
   * Converts an L (line-to) segment to C (cubic-bezier).
   *
   * @param {number} x1 line start x
   * @param {number} y1 line start y
   * @param {number} x2 line end x
   * @param {number} y2 line end y
   * @returns {number[]} the cubic-bezier segment
   */
  function lineToCubic(x1, y1, x2, y2) {
    var t = 0.5;
    /** @type {[number, number]} */
    var p0 = [x1, y1];
    /** @type {[number, number]} */
    var p1 = [x2, y2];
    var p2 = midPoint(p0, p1, t);
    var p3 = midPoint(p1, p2, t);
    var p4 = midPoint(p2, p3, t);
    var p5 = midPoint(p3, p4, t);
    var p6 = midPoint(p4, p5, t);
    var seg1 = p0.concat( p2, p4, p6, [t]);
    var cp1 = segmentLineFactory.apply(void 0, seg1).point;
    var seg2 = p6.concat( p5, p3, p1, [0]);
    var cp2 = segmentLineFactory.apply(void 0, seg2).point;

    return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
  }

  /**
   * Converts any segment to C (cubic-bezier).
   *
   * @param {SVGPath.pathSegment} segment the source segment
   * @param {SVGPath.parserParams} params the source segment parameters
   * @returns {SVGPath.cubicSegment | SVGPath.MSegment} the cubic-bezier segment
   */
  function segmentToCubic(segment, params) {
    var pathCommand = segment[0];
    var values = segment.slice(1).map(Number);
    var x = values[0];
    var y = values[1];
    var args;
    var px1 = params.x1;
    var py1 = params.y1;
    var px = params.x;
    var py = params.y;

    if (!'TQ'.includes(pathCommand)) {
      params.qx = null;
      params.qy = null;
    }

    switch (pathCommand) {
      case 'M':
        params.x = x;
        params.y = y;
        return segment;
      case 'A':
        args = [px1, py1 ].concat( values);
        return ['C' ].concat( arcToCubic.apply(void 0, args));
      case 'Q':
        params.qx = x;
        params.qy = y;
        args = [px1, py1 ].concat( values);
        return ['C' ].concat( quadToCubic.apply(void 0, args));
      case 'L':
        return ['C' ].concat( lineToCubic(px1, py1, x, y));
      case 'Z':
        return ['C' ].concat( lineToCubic(px1, py1, px, py));
    }
    return segment;
  }

  /**
   * Parses a path string value or 'pathArray' and returns a new one
   * in which all segments are converted to cubic-bezier.
   *
   * In addition, un-necessary `Z` segment is removed if previous segment
   * extends to the `M` segment.
   *
   * @param {string | SVGPath.pathArray} pathInput the string to be parsed or 'pathArray'
   * @returns {SVGPath.curveArray} the resulted `pathArray` converted to cubic-bezier
   */
  function pathToCurve(pathInput) {
    var assign;

    /* istanbul ignore else */
    if (isCurveArray(pathInput)) {
      // `isCurveArray` checks if it's `pathArray`
      return clonePath(pathInput);
    }

    // const path = fixPath(normalizePath(pathInput));
    var path = normalizePath(pathInput);
    var params = Object.assign({}, paramsParser);
    var allPathCommands = [];
    var pathCommand = ''; // ts-lint
    var ii = path.length;

    for (var i = 0; i < ii; i += 1) {
      (assign = path[i], pathCommand = assign[0]);
      allPathCommands[i] = pathCommand;

      path[i] = segmentToCubic(path[i], params);

      fixArc(path, allPathCommands, i);
      ii = path.length;

      var segment = path[i];
      var seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }

    return path;
  }

  /**
   * SVGPathCommander default options
   * @type {SVGPath.options}
   */
  var defaultOptions = {
    origin: [0, 0, 0],
    round: 4,
  };

  /**
   * Rounds the values of a `pathArray` instance to
   * a specified amount of decimals and returns it.
   *
   * @param {SVGPath.pathArray} path the source `pathArray`
   * @param {number | 'off'} roundOption the amount of decimals to round numbers to
   * @returns {SVGPath.pathArray} the resulted `pathArray` with rounded values
   */
  function roundPath(path, roundOption) {
    var round = defaultOptions.round;
    if (roundOption === 'off' || round === 'off') { return clonePath(path); }
    // round = roundOption >= 1 ? roundOption : round;
    // allow for ZERO decimals
    round = roundOption >= 0 ? roundOption : round;
    // to round values to the power
    // the `round` value must be integer
    var pow = typeof round === 'number' && round >= 1 ? (Math.pow( 10, round )) : 1;

    return path.map(function (pi) {
      var values = pi.slice(1).map(Number)
        .map(function (n) { return (round ? (Math.round(n * pow) / pow) : Math.round(n)); });
      return [pi[0] ].concat( values);
    });
  }

  /**
   * Returns a valid `d` attribute string value created
   * by rounding values and concatenating the `pathArray` segments.
   *
   * @param {SVGPath.pathArray} path the `pathArray` object
   * @param {number | 'off'} round amount of decimals to round values to
   * @returns {string} the concatenated path string
   */
  function pathToString(path, round) {
    return roundPath(path, round)
      .map(function (x) { return x[0] + x.slice(1).join(' '); }).join('');
  }

  /**
   * Reverses all segments of a `pathArray`
   * which consists of only C (cubic-bezier) path commands.
   *
   * @param {SVGPath.curveArray} path the source `pathArray`
   * @returns {SVGPath.curveArray} the reversed `pathArray`
   */
  function reverseCurve(path) {
    var rotatedCurve = path.slice(1)
      .map(function (x, i, curveOnly) { return (!i
        ? path[0].slice(1).concat( x.slice(1))
        : curveOnly[i - 1].slice(-2).concat( x.slice(1))); })
      .map(function (x) { return x.map(function (_, i) { return x[x.length - i - 2 * (1 - (i % 2))]; }); })
      .reverse();

    return [['M' ].concat( rotatedCurve[0].slice(0, 2)) ].concat( rotatedCurve.map(function (x) { return ['C' ].concat( x.slice(2)); }));
  }

  /**
   * Returns the area of a single cubic-bezier segment.
   *
   * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
   *
   * @param {number} x1 the starting point X
   * @param {number} y1 the starting point Y
   * @param {number} c1x the first control point X
   * @param {number} c1y the first control point Y
   * @param {number} c2x the second control point X
   * @param {number} c2y the second control point Y
   * @param {number} x2 the ending point X
   * @param {number} y2 the ending point Y
   * @returns {number} the area of the cubic-bezier segment
   */
  function getCubicSegArea(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
    return (3 * ((y2 - y1) * (c1x + c2x) - (x2 - x1) * (c1y + c2y)
             + (c1y * (x1 - c2x)) - (c1x * (y1 - c2y))
             + (y2 * (c2x + x1 / 3)) - (x2 * (c2y + y1 / 3)))) / 20;
  }

  /**
   * Returns the area of a shape.
   * @author Jürg Lehni & Jonathan Puckey
   *
   * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
   *
   * @param {SVGPath.pathArray} path the shape `pathArray`
   * @returns {number} the length of the cubic-bezier segment
   */
  function getPathArea(path) {
    var x = 0; var y = 0; var len = 0;

    return pathToCurve(path).map(function (seg) {
      var assign, assign$1;

      switch (seg[0]) {
        case 'M':
          (assign = seg, x = assign[1], y = assign[2]);
          return 0;
        default:
          len = getCubicSegArea.apply(void 0, [ x, y ].concat( seg.slice(1) ));
          (assign$1 = seg.slice(-2), x = assign$1[0], y = assign$1[1]);
          return len;
      }
    }).reduce(function (a, b) { return a + b; }, 0);
  }

  /**
   * Check if a path is drawn clockwise and returns true if so,
   * false otherwise.
   *
   * @param {SVGPath.pathArray} path the path string or `pathArray`
   * @returns {boolean} true when clockwise or false if not
   */
  function getDrawDirection(path) {
    return getPathArea(pathToCurve(path)) >= 0;
  }

  /**
   * Split a cubic-bezier segment into two.
   *
   * @param {number[]} pts the cubic-bezier parameters
   * @return {SVGPath.cubicSegment[]} two new cubic-bezier segments
   */
  function splitCubic(pts/* , ratio */) {
    var t = /* ratio || */ 0.5;
    var p0 = pts.slice(0, 2);
    var p1 = pts.slice(2, 4);
    var p2 = pts.slice(4, 6);
    var p3 = pts.slice(6, 8);
    var p4 = midPoint(p0, p1, t);
    var p5 = midPoint(p1, p2, t);
    var p6 = midPoint(p2, p3, t);
    var p7 = midPoint(p4, p5, t);
    var p8 = midPoint(p5, p6, t);
    var p9 = midPoint(p7, p8, t);

    return [
      ['C' ].concat( p4, p7, p9),
      ['C' ].concat( p8, p6, p3) ];
  }

  /**
   * Split a path into an `Array` of sub-path strings.
   *
   * In the process, values are converted to absolute
   * for visual consistency.
   *
   * @param {SVGPath.pathArray} pathInput the source `pathArray`
   * @return {SVGPath.pathArray[]} an array with all sub-path strings
   */
  function splitPath(pathInput) {
    /** @type {SVGPath.pathArray[]} */
    var composite = [];
    /** @type {SVGPath.pathArray} */
    var path;
    var pi = -1;

    pathInput.forEach(function (seg) {
      if (seg[0] === 'M') {
        path = [seg];
        pi += 1;
      } else {
        path = path.concat( [seg]);
      }
      composite[pi] = path;
    });

    return composite;
  }

  /**
   * Checks a `pathArray` for an unnecessary `Z` segment
   * and returns a new `pathArray` without it.
   *
   * The `pathInput` must be a single path, without
   * sub-paths. For multi-path `<path>` elements,
   * use `splitPath` first and apply this utility on each
   * sub-path separately.
   *
   * @param {SVGPath.pathArray | string} pathInput the `pathArray` source
   * @return {SVGPath.pathArray} a fixed `pathArray`
   */
  function fixPath(pathInput) {
    var pathArray = parsePathString(pathInput);
    var normalArray = normalizePath(pathArray);
    var length = pathArray.length;
    var isClosed = normalArray.slice(-1)[0][0] === 'Z';
    var segBeforeZ = isClosed ? length - 2 : length - 1;

    var ref = normalArray[0].slice(1);
    var mx = ref[0];
    var my = ref[1];
    var ref$1 = normalArray[segBeforeZ].slice(-2);
    var x = ref$1[0];
    var y = ref$1[1];

    /* istanbul ignore else */
    if (isClosed && mx === x && my === y) {
      return pathArray.slice(0, -1);
    }
    return pathArray;
  }

  /**
   * Returns a {x,y} point at a given length, the total length and
   * the minimum and maximum {x,y} coordinates of a C (cubic-bezier) segment.
   *
   * @param {number} x1 the starting point X
   * @param {number} y1 the starting point Y
   * @param {number} c1x the first control point X
   * @param {number} c1y the first control point Y
   * @param {number} c2x the second control point X
   * @param {number} c2y the second control point Y
   * @param {number} x2 the ending point X
   * @param {number} y2 the ending point Y
   * @param {number} t a [0-1] ratio
   * @returns {{x: number, y: number}} the cubic-bezier segment length
   */
  function getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t) {
    var t1 = 1 - t;
    return {
      x: (Math.pow( t1, 3 )) * x1
        + 3 * (Math.pow( t1, 2 )) * t * c1x
        + 3 * t1 * (Math.pow( t, 2 )) * c2x
        + (Math.pow( t, 3 )) * x2,
      y: (Math.pow( t1, 3 )) * y1
        + 3 * (Math.pow( t1, 2 )) * t * c1y
        + 3 * t1 * (Math.pow( t, 2 )) * c2y
        + (Math.pow( t, 3 )) * y2,
    };
  }

  /**
   * Returns the length of a C (cubic-bezier) segment
   * or an {x,y} point at a given length.
   *
   * @param {number} x1 the starting point X
   * @param {number} y1 the starting point Y
   * @param {number} c1x the first control point X
   * @param {number} c1y the first control point Y
   * @param {number} c2x the second control point X
   * @param {number} c2y the second control point Y
   * @param {number} x2 the ending point X
   * @param {number} y2 the ending point Y
   * @param {number=} distance the point distance
   * @returns {SVGPath.lengthFactory} the segment length, point, min & max
   */
  function segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, distance) {
    var assign;

    var distanceIsNumber = typeof distance === 'number';
    var x = x1; var y = y1;
    var LENGTH = 0;
    var prev = [x, y, LENGTH];
    var cur = [x, y];
    var t = 0;
    var POINT = { x: 0, y: 0 };
    var POINTS = [{ x: x, y: y }];

    if (distanceIsNumber && distance <= 0) {
      POINT = { x: x, y: y };
    }

    var sampleSize = 300;
    for (var j = 0; j <= sampleSize; j += 1) {
      t = j / sampleSize;

      ((assign = getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t), x = assign.x, y = assign.y));
      POINTS = POINTS.concat( [{ x: x, y: y }]);
      LENGTH += distanceSquareRoot(cur, [x, y]);
      cur = [x, y];

      if (distanceIsNumber && LENGTH > distance && distance > prev[2]) {
        var dv = (LENGTH - distance) / (LENGTH - prev[2]);

        POINT = {
          x: cur[0] * (1 - dv) + prev[0] * dv,
          y: cur[1] * (1 - dv) + prev[1] * dv,
        };
      }
      prev = [x, y, LENGTH];
    }

    if (distanceIsNumber && distance >= LENGTH) {
      POINT = { x: x2, y: y2 };
    }

    return {
      length: LENGTH,
      point: POINT,
      min: {
        x: Math.min.apply(Math, POINTS.map(function (n) { return n.x; })),
        y: Math.min.apply(Math, POINTS.map(function (n) { return n.y; })),
      },
      max: {
        x: Math.max.apply(Math, POINTS.map(function (n) { return n.x; })),
        y: Math.max.apply(Math, POINTS.map(function (n) { return n.y; })),
      },
    };
  }

  // Component Functions

  /**
   * Sets the property update function.
   * @param {string} tweenProp the `path` property
   */
  function onStartCubicMorph(tweenProp) {
    if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
      KEC[tweenProp] = function updateMorph(elem, a, b, v) {
        var curve = [];
        var path1 = a.curve;
        var path2 = b.curve;
        for (var i = 0, l = path2.length; i < l; i += 1) { // each path command
          curve.push([path1[i][0]]);
          for (var j = 1, l2 = path1[i].length; j < l2; j += 1) { // each command coordinate
            /* eslint-disable-next-line no-bitwise -- impossible to satisfy */
            curve[i].push((numbers(path1[i][j], path2[i][j], v) * 1000 >> 0) / 1000);
          }
        }
        elem.setAttribute('d', v === 1 ? b.original : pathToString(curve));
      };
    }
  }

  // Component Util
  /**
   * Returns first `pathArray` from multi-paths path.
   * @param {SVGPath.pathArray | string} source the source `pathArray` or string
   * @returns {KUTE.curveSpecs[]} an `Array` with a custom tuple for `equalizeSegments`
   */
  function getCurveArray(source) {
    return pathToCurve(splitPath(pathToAbsolute(source))[0])
      .map(function (segment, i, pathArray) {
        var segmentData = i && pathArray[i - 1].slice(-2).concat( segment.slice(1));
        var curveLength = i ? segmentCubicFactory.apply(void 0, segmentData).length : 0;

        var subsegs;
        if (i) {
          // must be [segment,segment]
          subsegs = curveLength ? splitCubic(segmentData) : [segment, segment];
        } else {
          subsegs = [segment];
        }

        return {
          s: segment,
          ss: subsegs,
          l: curveLength,
        };
      });
  }

  /**
   * Returns two `curveArray` with same amount of segments.
   * @param {SVGPath.curveArray} path1 the first `curveArray`
   * @param {SVGPath.curveArray} path2 the second `curveArray`
   * @param {number} TL the maximum `curveArray` length
   * @returns {SVGPath.curveArray[]} equalized segments
   */
  function equalizeSegments(path1, path2, TL) {
    var c1 = getCurveArray(path1);
    var c2 = getCurveArray(path2);
    var L1 = c1.length;
    var L2 = c2.length;
    var l1 = c1.filter(function (x) { return x.l; }).length;
    var l2 = c2.filter(function (x) { return x.l; }).length;
    var m1 = c1.filter(function (x) { return x.l; }).reduce(function (a, ref) {
      var l = ref.l;

      return a + l;
    }, 0) / l1 || 0;
    var m2 = c2.filter(function (x) { return x.l; }).reduce(function (a, ref) {
      var l = ref.l;

      return a + l;
    }, 0) / l2 || 0;
    var tl = TL || Math.max(L1, L2);
    var mm = [m1, m2];
    var dif = [tl - L1, tl - L2];
    var canSplit = 0;
    var result = [c1, c2]
      .map(function (x, i) { return (x.l === tl
        ? x.map(function (y) { return y.s; })
        : x.map(function (y, j) {
          canSplit = j && dif[i] && y.l >= mm[i];
          dif[i] -= canSplit ? 1 : 0;
          return canSplit ? y.ss : [y.s];
        }).flat()); });

    return result[0].length === result[1].length
      ? result
      : equalizeSegments(result[0], result[1], tl);
  }

  /**
   * Returns all possible path rotations for `curveArray`.
   * @param {SVGPath.curveArray} a the source `curveArray`
   * @returns {SVGPath.curveArray[]} all rotations for source
   */
  function getRotations(a) {
    var segCount = a.length;
    var pointCount = segCount - 1;

    return a.map(function (_, idx) { return a.map(function (__, i) {
      var oldSegIdx = idx + i;
      var seg;

      if (i === 0 || (a[oldSegIdx] && a[oldSegIdx][0] === 'M')) {
        seg = a[oldSegIdx];
        return ['M' ].concat( seg.slice(-2));
      }
      if (oldSegIdx >= segCount) { oldSegIdx -= pointCount; }
      return a[oldSegIdx];
    }); });
  }

  /**
   * Returns the `curveArray` rotation for the best morphing animation.
   * @param {SVGPath.curveArray} a the target `curveArray`
   * @param {SVGPath.curveArray} b the reference `curveArray`
   * @returns {SVGPath.curveArray} the best `a` rotation
   */
  function getRotatedCurve(a, b) {
    var segCount = a.length - 1;
    var lineLengths = [];
    var computedIndex = 0;
    var sumLensSqrd = 0;
    var rotations = getRotations(a);

    rotations.forEach(function (_, i) {
      a.slice(1).forEach(function (__, j) {
        sumLensSqrd += distanceSquareRoot(a[(i + j) % segCount].slice(-2), b[j % segCount].slice(-2));
      });
      lineLengths[i] = sumLensSqrd;
      sumLensSqrd = 0;
    });

    computedIndex = lineLengths.indexOf(Math.min.apply(null, lineLengths));

    return rotations[computedIndex];
  }

  // Component Functions
  /**
   * Returns the current `d` attribute value.
   * @returns {string}
   */
  function getCubicMorph(/* tweenProp, value */) {
    return this.element.getAttribute('d');
  }

  /**
   * Returns the property tween object.
   * @see KUTE.curveObject
   *
   * @param {string} _ is the `path` property name, not needed
   * @param {string | KUTE.curveObject} value the `path` property value
   * @returns {KUTE.curveObject}
   */
  function prepareCubicMorph(/* tweenProp, */_, value) {
    // get path d attribute or create a path from string value
    var pathObject = {};
    // remove newlines, they break some JSON strings
    var pathReg = new RegExp('\\n', 'ig');

    var el = null;
    if (value instanceof SVGElement) {
      el = value;
    } else if (/^\.|^#/.test(value)) {
      el = selector(value);
    }

    // make sure to return pre-processed values
    if (typeof (value) === 'object' && value.curve) {
      return value;
    } if (el && /path|glyph/.test(el.tagName)) {
      pathObject.original = el.getAttribute('d').replace(pathReg, '');
    // maybe it's a string path already
    } else if (!el && typeof (value) === 'string') {
      pathObject.original = value.replace(pathReg, '');
    }
    return pathObject;
  }

  /**
   * Enables the `to()` method by preparing the tween object in advance.
   * @param {string} tweenProp is `path` tween property, but it's not needed
   */
  function crossCheckCubicMorph(tweenProp/** , value */) {
    if (this.valuesEnd[tweenProp]) {
      var pathCurve1 = this.valuesStart[tweenProp].curve;
      var pathCurve2 = this.valuesEnd[tweenProp].curve;

      if (!pathCurve1 || !pathCurve2
        || (pathCurve1[0][0] === 'M' && pathCurve1.length !== pathCurve2.length)) {
        var path1 = this.valuesStart[tweenProp].original;
        var path2 = this.valuesEnd[tweenProp].original;
        var curves = equalizeSegments(path1, path2);
        var curve0 = getDrawDirection(curves[0]) !== getDrawDirection(curves[1])
          ? reverseCurve(curves[0])
          : clonePath(curves[0]);

        this.valuesStart[tweenProp].curve = curve0;
        this.valuesEnd[tweenProp].curve = getRotatedCurve(curves[1], curve0);
      }
    }
  }

  // All Component Functions
  var svgCubicMorphFunctions = {
    prepareStart: getCubicMorph,
    prepareProperty: prepareCubicMorph,
    onStart: onStartCubicMorph,
    crossCheck: crossCheckCubicMorph,
  };

  // Component Full
  var svgCubicMorph = {
    component: 'svgCubicMorph',
    property: 'path',
    defaultValue: [],
    Interpolate: { numbers: numbers, pathToString: pathToString },
    functions: svgCubicMorphFunctions,
    // export utils to global for faster execution
    Util: {
      pathToCurve: pathToCurve,
      pathToAbsolute: pathToAbsolute,
      pathToString: pathToString,
      parsePathString: parsePathString,
      getRotatedCurve: getRotatedCurve,
      getRotations: getRotations,
      equalizeSegments: equalizeSegments,
      reverseCurve: reverseCurve,
      clonePath: clonePath,
      getDrawDirection: getDrawDirection,
      segmentCubicFactory: segmentCubicFactory,
      splitCubic: splitCubic,
      splitPath: splitPath,
      fixPath: fixPath,
      getCurveArray: getCurveArray,
    },
  };

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function svgTransformOnStart(tweenProp) {
    if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
      KEC[tweenProp] = function (l, a, b, v) {
        var x = 0;
        var y = 0;
        var deg = Math.PI / 180;
        var scale = 'scale' in b ? numbers(a.scale, b.scale, v) : 1;
        var rotate = 'rotate' in b ? numbers(a.rotate, b.rotate, v) : 0;
        var sin = Math.sin(rotate * deg);
        var cos = Math.cos(rotate * deg);
        var skewX = 'skewX' in b ? numbers(a.skewX, b.skewX, v) : 0;
        var skewY = 'skewY' in b ? numbers(a.skewY, b.skewY, v) : 0;
        var complex = rotate || skewX || skewY || scale !== 1 || 0;

        // start normalizing the translation, we start from last to first
        // (from last chained translation)
        // the normalized translation will handle the transformOrigin tween option
        // and makes sure to have a consistent transformation

        // we start with removing transformOrigin from translation
        x -= complex ? b.origin[0] : 0; y -= complex ? b.origin[1] : 0;
        x *= scale; y *= scale; // we now apply the scale
        // now we apply skews
        y += skewY ? x * Math.tan(skewY * deg) : 0; x += skewX ? y * Math.tan(skewX * deg) : 0;
        var cxsy = cos * x - sin * y; // apply rotation as well
        y = rotate ? sin * x + cos * y : y; x = rotate ? cxsy : x;
        // now we apply the actual translation
        x += 'translate' in b ? numbers(a.translate[0], b.translate[0], v) : 0;
        y += 'translate' in b ? numbers(a.translate[1], b.translate[1], v) : 0;
        // normalizing ends with the addition of the transformOrigin to the translation
        x += complex ? b.origin[0] : 0; y += complex ? b.origin[1] : 0;

        // finally we apply the transform attribute value
        /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
        l.setAttribute('transform', (x || y ? (("translate(" + ((x * 1000 >> 0) / 1000) + (y ? (("," + ((y * 1000 >> 0) / 1000))) : '') + ")")) : '')
                                   + (rotate ? ("rotate(" + ((rotate * 1000 >> 0) / 1000) + ")") : '')
                                   + (skewX ? ("skewX(" + ((skewX * 1000 >> 0) / 1000) + ")") : '')
                                   + (skewY ? ("skewY(" + ((skewY * 1000 >> 0) / 1000) + ")") : '')
                                   + (scale !== 1 ? ("scale(" + ((scale * 1000 >> 0) / 1000) + ")") : ''));
      };
    }
  }

  // Component Util
  /**
   * Returns a correct transform origin consistent with the shape bounding box.
   * @param {string} origin transform origin string
   * @param {SVGPathCommander.pathBBox} bbox path bounding box
   * @returns {number}
   */
  function parseStringOrigin(origin, bbox) {
    var result;
    var x = bbox.x;
    var width = bbox.width;
    if (/[a-z]/i.test(origin) && !/px/.test(origin)) {
      result = origin.replace(/top|left/, 0)
        .replace(/right|bottom/, 100)
        .replace(/center|middle/, 50);
    } else {
      result = /%/.test(origin) ? (x + (parseFloat(origin) * width) / 100) : parseFloat(origin);
    }
    return result;
  }

  /**
   * Parse SVG transform string and return an object.
   * @param {string} a transform string
   * @returns {Object<string, (string | number)>}
   */
  function parseTransformString(a) {
    var c = {};
    var d = a && /\)/.test(a)
      ? a.substring(0, a.length - 1).split(/\)\s|\)/)
      : 'none';

    if (d instanceof Array) {
      for (var j = 0, jl = d.length; j < jl; j += 1) {
        var ref = d[j].trim().split('(');
        var prop = ref[0];
        var val = ref[1];
        c[prop] = val;
      }
    }
    return c;
  }

  /**
   * Returns the SVG transform tween object.
   * @param {string} _ property name
   * @param {Object<string, (string | number)>} v property value object
   * @returns {KUTE.transformSVGObject} the SVG transform tween object
   */
  function parseTransformSVG(/* prop */_, v) {
    /** @type {KUTE.transformSVGObject} */
    var svgTransformObject = {};

    // by default the transformOrigin is "50% 50%" of the shape box
    var bb = this.element.getBBox();
    var cx = bb.x + bb.width / 2;
    var cy = bb.y + bb.height / 2;

    var origin = this._transformOrigin;
    var translation;

    if (typeof (origin) !== 'undefined') {
      origin = origin instanceof Array ? origin : origin.split(/\s/);
    } else {
      origin = [cx, cy];
    }

    origin[0] = typeof origin[0] === 'number' ? origin[0] : parseStringOrigin(origin[0], bb);
    origin[1] = typeof origin[1] === 'number' ? origin[1] : parseStringOrigin(origin[1], bb);

    svgTransformObject.origin = origin;

    // populate the valuesStart and / or valuesEnd
    Object.keys(v).forEach(function (i) {
      var assign;

      if (i === 'rotate') {
        if (typeof v[i] === 'number') {
          svgTransformObject[i] = v[i];
        } else if (v[i] instanceof Array) {
          (assign = v[i], svgTransformObject[i] = assign[0]);
        } else {
          svgTransformObject[i] = v[i].split(/\s/)[0] * 1;
        }
      } else if (i === 'translate') {
        if (v[i] instanceof Array) {
          translation = v[i];
        } else if (/,|\s/.test(v[i])) {
          translation = v[i].split(',');
        } else {
          translation = [v[i], 0];
        }
        svgTransformObject[i] = [translation[0] * 1 || 0, translation[1] * 1 || 0];
      } else if (/skew/.test(i)) {
        svgTransformObject[i] = v[i] * 1 || 0;
      } else if (i === 'scale') {
        svgTransformObject[i] = parseFloat(v[i]) || 1;
      }
    });

    return svgTransformObject;
  }

  // Component Functions
  /**
   * Returns the property tween object.
   * @param {string} prop the property name
   * @param {string} value the property value
   * @returns {KUTE.transformSVGObject} the property tween object
   */
  function prepareSvgTransform(prop, value) {
    return parseTransformSVG.call(this, prop, value);
  }

  /**
   * Returns an object with the current transform attribute value.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {string} current transform object
   */
  function getStartSvgTransform(/* tweenProp */_, value) {
    var transformObject = {};
    var currentTransform = parseTransformString(this.element.getAttribute('transform'));

    // find a value in current attribute value or add a default value
    Object.keys(value).forEach(function (j) {
      var scaleValue = j === 'scale' ? 1 : 0;
      transformObject[j] = j in currentTransform ? currentTransform[j] : scaleValue;
    });

    return transformObject;
  }

  function svgTransformCrossCheck(prop) {
    if (!this._resetStart) { return; } // fix since 1.6.1 for fromTo() method

    if (this.valuesEnd[prop]) {
      var valuesStart = this.valuesStart[prop];
      var valuesEnd = this.valuesEnd[prop];
      var currentTransform = parseTransformSVG.call(this, prop,
        parseTransformString(this.element.getAttribute('transform')));

      // populate the valuesStart first
      Object.keys(currentTransform).forEach(function (tp) {
        valuesStart[tp] = currentTransform[tp];
      });

      // now try to determine the REAL translation
      var parentSVG = this.element.ownerSVGElement;
      var startMatrix = parentSVG.createSVGTransformFromMatrix(
        parentSVG.createSVGMatrix()
          .translate(-valuesStart.origin[0], -valuesStart.origin[1]) // - origin
          .translate('translate' in valuesStart // the current translate
            ? valuesStart.translate[0] : 0, 'translate' in valuesStart ? valuesStart.translate[1]
            : 0)
          .rotate(valuesStart.rotate || 0)
          .skewX(valuesStart.skewX || 0)
          .skewY(valuesStart.skewY || 0)
          .scale(valuesStart.scale || 1)// the other functions
          .translate(+valuesStart.origin[0], +valuesStart.origin[1]) // + origin
      );
      // finally the translate we're looking for
      valuesStart.translate = [startMatrix.matrix.e, startMatrix.matrix.f];

      // copy existing and unused properties to the valuesEnd
      Object.keys(valuesStart).forEach(function (s) {
        if (!(s in valuesEnd) || s === 'origin') {
          valuesEnd[s] = valuesStart[s];
        }
      });
    }
  }

  // All Component Functions
  var svgTransformFunctions = {
    prepareStart: getStartSvgTransform,
    prepareProperty: prepareSvgTransform,
    onStart: svgTransformOnStart,
    crossCheck: svgTransformCrossCheck,
  };

  // Component Full
  var svgTransform = {
    component: 'svgTransformProperty',
    property: 'svgTransform',
    // subProperties: ['translate','rotate','skewX','skewY','scale'],
    defaultOptions: { transformOrigin: '50% 50%' },
    defaultValue: {
      translate: 0, rotate: 0, skewX: 0, skewY: 0, scale: 1,
    },
    Interpolate: { numbers: numbers },
    functions: svgTransformFunctions,

    // export utils to globals for faster execution
    Util: { parseStringOrigin: parseStringOrigin, parseTransformString: parseTransformString, parseTransformSVG: parseTransformSVG },
  };

  /**
   * A global namespace for most scroll event listeners.
   * @type {Partial<AddEventListenerOptions>}
   */
  var passiveHandler = { passive: true };

  /**
   * A global namespace for mouse hover events.
   * @type {[string, string]}
   */
  var mouseHoverEvents = ('onmouseleave' in document) ? ['mouseenter', 'mouseleave']
    : /* istanbul ignore next */['mouseover', 'mouseout'];

  /**
   * A global `boolean` for touch events support.
   * @type {boolean}
   */
  var supportTouch = 'ontouchstart' in window
    || /* istanbul ignore next */'msMaxTouchPoints' in navigator;

  // Component Util
  // events preventing scroll
  var touchOrWheel = supportTouch ? 'touchstart' : 'mousewheel';

  // true scroll container
  // very important and specific to the component
  var scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent)
    ? document.body
    : document.documentElement;

  /**
   * Prevent further scroll events until scroll animation is over.
   * @param {Event} e event object
   */
  function preventScroll(e) {
    if (this.scrolling) { e.preventDefault(); }
  }

  /**
   * Returns the scroll element / target.
   * @returns {{el: Element, st: Element}}
   */
  function getScrollTargets() {
    var el = this.element;
    return el === scrollContainer ? { el: document, st: document.body } : { el: el, st: el };
  }

  /**
   * Toggles scroll prevention callback on scroll events.
   * @param {string} action addEventListener / removeEventListener
   * @param {Element} element target
   */
  function toggleScrollEvents(action, element) {
    element[action](mouseHoverEvents[0], preventScroll, passiveHandler);
    element[action](touchOrWheel, preventScroll, passiveHandler);
  }

  /**
   * Action performed before scroll animation start.
   */
  function scrollIn() {
    var targets = getScrollTargets.call(this);

    if ('scroll' in this.valuesEnd && !targets.el.scrolling) {
      targets.el.scrolling = 1;
      toggleScrollEvents('addEventListener', targets.el);
      targets.st.style.pointerEvents = 'none';
    }
  }
  /**
   * Action performed when scroll animation ends.
   */
  function scrollOut() { // prevent scroll when tweening scroll
    var targets = getScrollTargets.call(this);

    if ('scroll' in this.valuesEnd && targets.el.scrolling) {
      targets.el.scrolling = 0;
      toggleScrollEvents('removeEventListener', targets.el);
      targets.st.style.pointerEvents = '';
    }
  }

  // Component Functions
  /**
   * * Sets the scroll target.
   * * Adds the scroll prevention event listener.
   * * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartScroll(tweenProp) {
    // checking 0 will NOT add the render function
    if (tweenProp in this.valuesEnd && !KEC[tweenProp]) {
      this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window)
        ? scrollContainer : this.element;
      scrollIn.call(this);
      KEC[tweenProp] = function (elem, a, b, v) {
        /* eslint-disable */
        elem.scrollTop = (numbers(a, b, v)) >> 0;
        /* eslint-enable */
      };
    }
  }

  /**
   * Removes the scroll prevention event listener.
   */
  function onCompleteScroll(/* tweenProp */) {
    scrollOut.call(this);
  }

  // Component Functions
  /**
   * Returns the current property computed style.
   * @returns {number} computed style for property
   */
  function getScroll() {
    this.element = ('scroll' in this.valuesEnd) && (!this.element || this.element === window)
      ? scrollContainer : this.element;

    return this.element === scrollContainer
      ? (window.pageYOffset || scrollContainer.scrollTop)
      : this.element.scrollTop;
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {number} the property tween object
   */
  function prepareScroll(/* prop, */_, value) {
    return parseInt(value, 10);
  }

  // All Component Functions
  var scrollFunctions = {
    prepareStart: getScroll,
    prepareProperty: prepareScroll,
    onStart: onStartScroll,
    onComplete: onCompleteScroll,
  };

  // Full Component
  var ScrollProperty = {
    component: 'scrollProperty',
    property: 'scroll',
    defaultValue: 0,
    Interpolate: { numbers: numbers },
    functions: scrollFunctions,
    // export stuff to global
    Util: {
      preventScroll: preventScroll, scrollIn: scrollIn, scrollOut: scrollOut, getScrollTargets: getScrollTargets, toggleScrollEvents: toggleScrollEvents,
    },
  };

  // Component Functions
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function onStartShadow(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        // let's start with the numbers | set unit | also determine inset
        var params = [];
        var unit = 'px';
        var sl = tweenProp === 'textShadow' ? 3 : 4;
        var colA = sl === 3 ? a[3] : a[4];
        var colB = sl === 3 ? b[3] : b[4];
        var inset = (a[5] && a[5] !== 'none') || (b[5] && b[5] !== 'none') ? ' inset' : false;

        for (var i = 0; i < sl; i += 1) {
          /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
          params.push(((numbers(a[i], b[i], v) * 1000 >> 0) / 1000) + unit);
        }
        // the final piece of the puzzle, the DOM update
        // eslint-disable-next-line no-param-reassign -- impossible to satisfy
        elem.style[tweenProp] = inset
          ? colors(colA, colB, v) + params.join(' ') + inset
          : colors(colA, colB, v) + params.join(' ');
      };
    }
  }

  // Component Properties
  var shadowProps = ['boxShadow', 'textShadow'];

  // Component Util

  /**
   * Return the box-shadow / text-shadow tween object.
   * * box-shadow: none | h-shadow v-shadow blur spread color inset|initial|inherit
   * * text-shadow: none | offset-x offset-y blur-radius color |initial|inherit
   * * numbers must be floats and color must be rgb object
   *
   * @param {(number | string)[]} shadow an `Array` with shadow parameters
   * @param {string} tweenProp the property name
   * @returns {KUTE.shadowObject} the property tween object
   */
  function processShadowArray(shadow, tweenProp) {
    var newShadow;

    // [h-shadow, v-shadow, color]
    if (shadow.length === 3) {
      newShadow = [shadow[0], shadow[1], 0, 0, shadow[2], 'none'];
    // [h-shadow, v-shadow, color, inset] | [h-shadow, v-shadow, blur, color]
    } else if (shadow.length === 4) {
      newShadow = /inset|none/.test(shadow[3])
        ? [shadow[0], shadow[1], 0, 0, shadow[2], shadow[3]]
        : [shadow[0], shadow[1], shadow[2], 0, shadow[3], 'none'];
    // [h-shadow, v-shadow, blur, color, inset] | [h-shadow, v-shadow, blur, spread, color]
    } else if (shadow.length === 5) {
      newShadow = /inset|none/.test(shadow[4])
        ? [shadow[0], shadow[1], shadow[2], 0, shadow[3], shadow[4]]
        : [shadow[0], shadow[1], shadow[2], shadow[3], shadow[4], 'none'];
    // ideal [h-shadow, v-shadow, blur, spread, color, inset]
    } else if (shadow.length === 6) {
      newShadow = shadow;
    }

    // make sure the values are ready to tween
    for (var i = 0; i < 4; i += 1) {
      newShadow[i] = parseFloat(newShadow[i]);
    }

    // also the color must be a rgb object
    newShadow[4] = trueColor(newShadow[4]);

    newShadow = tweenProp === 'boxShadow'
      ? newShadow
      : newShadow.filter(function (_, i) { return [0, 1, 2, 4].includes(i); });

    return newShadow;
  }

  // Component Functions
  /**
   * Returns the current property computed style.
   * @param {string} tweenProp the property name
   * @returns {string} computed style for property
   */
  function getShadow(tweenProp/* , value */) {
    var cssShadow = getStyleForProperty(this.element, tweenProp);
    // '0px 0px 0px 0px rgb(0,0,0)'
    return /^none$|^initial$|^inherit$|^inset$/.test(cssShadow)
      ? defaultValues[tweenProp]
      : cssShadow;
  }

  /**
   * Returns the property tween object.
   * @param {string} tweenProp the property name
   * @param {string} propValue the property value
   * @returns {KUTE.shadowObject} the property tween object
   */
  function prepareShadow(tweenProp, propValue) {
    // [horizontal, vertical, blur, spread, color: {r:0,g:0,b:0}, inset]
    // parseProperty for boxShadow, builds basic structure with ready to tween values
    var value = propValue;
    if (typeof value === 'string') {
      var inset = 'none';
      // a full RegEx for color strings
      var colRegEx = /(\s?(?:#(?:[\da-f]{3}){1,2}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))\s?)/gi;
      var currentColor = value.match(colRegEx);

      // make sure to always have the inset last if possible
      inset = /inset/.test(value) ? 'inset' : inset;
      value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g, '') : value;

      // also getComputedStyle often returns color first "rgb(0, 0, 0) 15px 15px 6px 0px inset"
      value = value.replace(currentColor[0], '').split(' ').concat([currentColor[0].replace(/\s/g, '')], [inset]);

      value = processShadowArray(value, tweenProp);
    } else if (value instanceof Array) {
      value = processShadowArray(value, tweenProp);
    }

    return value;
  }

  var shadowPropOnStart = {};
  shadowProps.forEach(function (x) { shadowPropOnStart[x] = onStartShadow; });

  // All Component Functions
  var shadowFunctions = {
    prepareStart: getShadow,
    prepareProperty: prepareShadow,
    onStart: shadowPropOnStart,
  };

  // Component Full
  var ShadowProperties = {
    component: 'shadowProperties',
    properties: shadowProps,
    defaultValues: {
      boxShadow: '0px 0px 0px 0px rgb(0,0,0)',
      textShadow: '0px 0px 0px rgb(0,0,0)',
    },
    Interpolate: { numbers: numbers, colors: colors },
    functions: shadowFunctions,
    Util: { processShadowArray: processShadowArray, trueColor: trueColor },
  };

  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  function textPropOnStart(tweenProp) {
    if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
      KEC[tweenProp] = function (elem, a, b, v) {
        // eslint-disable-next-line no-param-reassign -- impossible to satisfy
        elem.style[tweenProp] = units(a.v, b.v, b.u, v);
      };
    }
  }

  // Component Properties
  var textProps = ['fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing'];
  var textOnStart = {};

  // Component Functions
  textProps.forEach(function (tweenProp) {
    textOnStart[tweenProp] = textPropOnStart;
  });

  /**
   * Returns the current property computed style.
   * @param {string} prop the property name
   * @returns {string} computed style for property
   */
  function getTextProp(prop/* , value */) {
    return getStyleForProperty(this.element, prop) || defaultValues[prop];
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {number} the property tween object
   */
  function prepareTextProp(/* prop */_, value) {
    return trueDimension(value);
  }

  // All Component Functions
  var textPropFunctions = {
    prepareStart: getTextProp,
    prepareProperty: prepareTextProp,
    onStart: textOnStart,
  };

  // Component Full
  var TextProperties = {
    component: 'textProperties',
    category: 'textProperties',
    properties: textProps,
    defaultValues: {
      fontSize: 0, lineHeight: 0, letterSpacing: 0, wordSpacing: 0,
    },
    Interpolate: { units: units },
    functions: textPropFunctions,
    Util: { trueDimension: trueDimension },
  };

  // Component Values
  var lowerCaseAlpha = String('abcdefghijklmnopqrstuvwxyz').split(''); // lowercase
  var upperCaseAlpha = String('abcdefghijklmnopqrstuvwxyz').toUpperCase().split(''); // uppercase
  var nonAlpha = String("~!@#$%^&*()_+{}[];'<>,./?=-").split(''); // symbols
  var numeric = String('0123456789').split(''); // numeric
  var alphaNumeric = lowerCaseAlpha.concat(upperCaseAlpha, numeric); // alpha numeric
  var allTypes = alphaNumeric.concat(nonAlpha); // all caracters

  var charSet = {
    alpha: lowerCaseAlpha, // lowercase
    upper: upperCaseAlpha, // uppercase
    symbols: nonAlpha, // symbols
    numeric: numeric,
    alphanumeric: alphaNumeric,
    all: allTypes,
  };

  // Component Functions
  var onStartWrite = {
    /**
     * onStartWrite.text
     *
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    text: function text(tweenProp) {
      if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
        var chars = this._textChars;
        var charsets = charSet[defaultOptions$1.textChars];

        if (chars in charSet) {
          charsets = charSet[chars];
        } else if (chars && chars.length) {
          charsets = chars;
        }

        KEC[tweenProp] = function (elem, a, b, v) {
          var initialText = '';
          var endText = '';
          var finalText = b === '' ? ' ' : b;
          var firstLetterA = a.substring(0);
          var firstLetterB = b.substring(0);
          /* eslint-disable */
          var pointer = charsets[(Math.random() * charsets.length) >> 0];

          if (a === ' ') {
            endText = firstLetterB
              .substring(Math.min(v * firstLetterB.length, firstLetterB.length) >> 0, 0);
            elem.innerHTML = v < 1 ? ((endText + pointer)) : finalText;
          } else if (b === ' ') {
            initialText = firstLetterA
              .substring(0, Math.min((1 - v) * firstLetterA.length, firstLetterA.length) >> 0);
            elem.innerHTML = v < 1 ? ((initialText + pointer)) : finalText;
          } else {
            initialText = firstLetterA
              .substring(firstLetterA.length,
                Math.min(v * firstLetterA.length, firstLetterA.length) >> 0);
            endText = firstLetterB
              .substring(0, Math.min(v * firstLetterB.length, firstLetterB.length) >> 0);
            elem.innerHTML = v < 1 ? ((endText + pointer + initialText)) : finalText;
          }
          /* eslint-enable */
        };
      }
    },
    /**
     * onStartWrite.number
     *
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    number: function number(tweenProp) {
      if (tweenProp in this.valuesEnd && !KEC[tweenProp]) { // numbers can be 0
        KEC[tweenProp] = function (elem, a, b, v) {
          /* eslint-disable */
          elem.innerHTML = numbers(a, b, v) >> 0;
          /* eslint-enable */
        };
      }
    },
  };

  // Component Util
  // utility for multi-child targets
  // wrapContentsSpan returns an [Element] with the SPAN.tagName and a desired class
  function wrapContentsSpan(el, classNAME) {
    var assign;

    var textWriteWrapper;
    var newElem;
    if (typeof (el) === 'string') {
      newElem = document.createElement('SPAN');
      newElem.innerHTML = el;
      newElem.className = classNAME;
      return newElem;
    }
    if (!el.children.length || (el.children.length && el.children[0].className !== classNAME)) {
      var elementInnerHTML = el.innerHTML;
      textWriteWrapper = document.createElement('SPAN');
      textWriteWrapper.className = classNAME;
      textWriteWrapper.innerHTML = elementInnerHTML;
      /* eslint-disable no-param-reassign -- impossible to satisfy */
      el.appendChild(textWriteWrapper);
      el.innerHTML = textWriteWrapper.outerHTML;
      /* eslint-enable no-param-reassign -- impossible to satisfy */
    } else if (el.children.length && el.children[0].className === classNAME) {
      (assign = el.children, textWriteWrapper = assign[0]);
    }
    return textWriteWrapper;
  }

  function getTextPartsArray(el, classNAME) {
    var elementsArray = [];
    var len = el.children.length;
    if (len) {
      var textParts = [];
      var remainingMarkup = el.innerHTML;
      var wrapperParts;

      for (var i = 0, currentChild = (void 0), childOuter = (void 0), unTaggedContent = (void 0); i < len; i += 1) {
        currentChild = el.children[i];
        childOuter = currentChild.outerHTML;
        wrapperParts = remainingMarkup.split(childOuter);

        if (wrapperParts[0] !== '') {
          unTaggedContent = wrapContentsSpan(wrapperParts[0], classNAME);
          textParts.push(unTaggedContent);
          remainingMarkup = remainingMarkup.replace(wrapperParts[0], '');
        } else if (wrapperParts[1] !== '') {
          unTaggedContent = wrapContentsSpan(wrapperParts[1].split('<')[0], classNAME);
          textParts.push(unTaggedContent);
          remainingMarkup = remainingMarkup.replace(wrapperParts[0].split('<')[0], '');
        }

        if (!currentChild.classList.contains(classNAME)) { currentChild.classList.add(classNAME); }
        textParts.push(currentChild);
        remainingMarkup = remainingMarkup.replace(childOuter, '');
      }

      if (remainingMarkup !== '') {
        var unTaggedRemaining = wrapContentsSpan(remainingMarkup, classNAME);
        textParts.push(unTaggedRemaining);
      }

      elementsArray = elementsArray.concat(textParts);
    } else {
      elementsArray = elementsArray.concat([wrapContentsSpan(el, classNAME)]);
    }
    return elementsArray;
  }

  function setSegments(target, newText) {
    var oldTargetSegs = getTextPartsArray(target, 'text-part');
    var newTargetSegs = getTextPartsArray(wrapContentsSpan(newText), 'text-part');

    /* eslint-disable no-param-reassign */
    target.innerHTML = '';
    target.innerHTML += oldTargetSegs.map(function (s) { s.className += ' oldText'; return s.outerHTML; }).join('');
    target.innerHTML += newTargetSegs.map(function (s) { s.className += ' newText'; return s.outerHTML.replace(s.innerHTML, ''); }).join('');
    /* eslint-enable no-param-reassign */

    return [oldTargetSegs, newTargetSegs];
  }

  function createTextTweens(target, newText, ops) {
    if (target.playing) { return false; }

    var options = ops || {};
    options.duration = 1000;

    if (ops.duration === 'auto') {
      options.duration = 'auto';
    } else if (Number.isFinite(ops.duration * 1)) {
      options.duration = ops.duration * 1;
    }

    var TweenContructor = connect.tween;
    var segs = setSegments(target, newText);
    var oldTargetSegs = segs[0];
    var newTargetSegs = segs[1];
    var oldTargets = [].slice.call(target.getElementsByClassName('oldText')).reverse();
    var newTargets = [].slice.call(target.getElementsByClassName('newText'));

    var textTween = [];
    var totalDelay = 0;

    textTween = textTween.concat(oldTargets.map(function (el, i) {
      options.duration = options.duration === 'auto'
        ? oldTargetSegs[i].innerHTML.length * 75
        : options.duration;
      options.delay = totalDelay;
      options.onComplete = null;

      totalDelay += options.duration;
      return new TweenContructor(el, { text: el.innerHTML }, { text: '' }, options);
    }));
    textTween = textTween.concat(newTargets.map(function (el, i) {
      function onComplete() {
        /* eslint-disable no-param-reassign */
        target.innerHTML = newText;
        target.playing = false;
        /* eslint-enable no-param-reassign */
      }

      options.duration = options.duration === 'auto' ? newTargetSegs[i].innerHTML.length * 75 : options.duration;
      options.delay = totalDelay;
      options.onComplete = i === newTargetSegs.length - 1 ? onComplete : null;
      totalDelay += options.duration;

      return new TweenContructor(el, { text: '' }, { text: newTargetSegs[i].innerHTML }, options);
    }));

    textTween.start = function startTweens() {
      if (!target.playing) {
        textTween.forEach(function (tw) { return tw.start(); });
        // eslint-disable-next-line no-param-reassign
        target.playing = true;
      }
    };

    return textTween;
  }

  // Component Functions
  /**
   * Returns the current element `innerHTML`.
   * @returns {string} computed style for property
   */
  function getWrite(/* tweenProp, value */) {
    return this.element.innerHTML;
  }

  /**
   * Returns the property tween object.
   * @param {string} tweenProp the property name
   * @param {string} value the property value
   * @returns {number | string} the property tween object
   */
  function prepareText(tweenProp, value) {
    if (tweenProp === 'number') {
      return parseFloat(value);
    }
    // empty strings crash the update function
    return value === '' ? ' ' : value;
  }

  // All Component Functions
  var textWriteFunctions = {
    prepareStart: getWrite,
    prepareProperty: prepareText,
    onStart: onStartWrite,
  };

  // Full Component
  var TextWrite = {
    component: 'textWriteProperties',
    category: 'textWrite',
    properties: ['text', 'number'],
    defaultValues: { text: ' ', number: '0' },
    defaultOptions: { textChars: 'alpha' },
    Interpolate: { numbers: numbers },
    functions: textWriteFunctions,
    // export to global for faster execution
    Util: { charSet: charSet, createTextTweens: createTextTweens },
  };

  /**
   * Array Interpolation Function.
   *
   * @param {number[]} a start array
   * @param {number[]} b end array
   * @param {number} v progress
   * @returns {number[]} the resulting array
   */
  function arrays(a, b, v) {
    var result = []; var length = b.length;
    for (var i = 0; i < length; i += 1) {
      // eslint-disable-next-line no-bitwise
      result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0) / 1000;
    }
    return result;
  }

  // Component special
  // this component is restricted to modern browsers only
  var CSS3Matrix = typeof (DOMMatrix) !== 'undefined' ? DOMMatrix : null;

  // Component Functions
  var onStartTransform = {
  /**
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
    transform: function transform(tweenProp) {
      if (CSS3Matrix && this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
        KEC[tweenProp] = function (elem, a, b, v) {
          var matrix = new CSS3Matrix();
          var tObject = {};

          Object.keys(b).forEach(function (p) {
            tObject[p] = p === 'perspective' ? numbers(a[p], b[p], v) : arrays(a[p], b[p], v);
          });

          // set perspective
          if (tObject.perspective) { matrix.m34 = -1 / tObject.perspective; }

          // set translate
          matrix = tObject.translate3d
            ? matrix.translate(tObject.translate3d[0], tObject.translate3d[1], tObject.translate3d[2])
            : matrix;

          // set rotation
          matrix = tObject.rotate3d
            ? matrix.rotate(tObject.rotate3d[0], tObject.rotate3d[1], tObject.rotate3d[2])
            : matrix;

          // set skew
          if (tObject.skew) {
            matrix = tObject.skew[0] ? matrix.skewX(tObject.skew[0]) : matrix;
            matrix = tObject.skew[1] ? matrix.skewY(tObject.skew[1]) : matrix;
          }

          // set scale
          matrix = tObject.scale3d
            ? matrix.scale(tObject.scale3d[0], tObject.scale3d[1], tObject.scale3d[2])
            : matrix;

          // set element style
          // eslint-disable-next-line no-param-reassign
          elem.style[tweenProp] = matrix.toString();
        };
      }
    },
    /**
     * onStartTransform.CSS3Matrix
     *
     * Sets the update function for the property.
     * @param {string} prop the property name
     */
    CSS3Matrix: function CSS3Matrix$1(prop) {
      if (CSS3Matrix && this.valuesEnd.transform) {
        if (!KEC[prop]) { KEC[prop] = CSS3Matrix; }
      }
    },
  };

  // Component name
  var matrixComponent = 'transformMatrix';

  // Component Functions
  /**
   * Returns the current transform object.
   * @param {string} _ the property name
   * @param {string} value the property value
   * @returns {KUTE.transformMObject} transform object
   */
  function getTransform(/* tweenProp, */_, value) {
    var transformObject = {};
    var currentValue = this.element[matrixComponent];

    if (currentValue) {
      Object.keys(currentValue).forEach(function (vS) {
        transformObject[vS] = currentValue[vS];
      });
    } else {
      Object.keys(value).forEach(function (vE) {
        transformObject[vE] = vE === 'perspective' ? value[vE] : defaultValues.transform[vE];
      });
    }
    return transformObject;
  }

  /**
   * Returns the property tween object.
   * @param {string} _ the property name
   * @param {Object<string, string | number | (string | number)[]>} obj the property value
   * @returns {KUTE.transformMObject} the property tween object
   */
  function prepareTransform(/* tweenProp, */_, value) {
    if (typeof (value) === 'object' && !value.length) {
      var pv;
      var transformObject = {};
      var translate3dObj = {};
      var rotate3dObj = {};
      var scale3dObj = {};
      var skewObj = {};
      var axis = [{ translate3d: translate3dObj },
        { rotate3d: rotate3dObj },
        { skew: skewObj },
        { scale3d: scale3dObj }];

      Object.keys(value).forEach(function (prop) {
        if (/3d/.test(prop) && typeof (value[prop]) === 'object' && value[prop].length) {
          pv = value[prop].map(function (v) { return (prop === 'scale3d' ? parseFloat(v) : parseInt(v, 10)); });
          transformObject[prop] = prop === 'scale3d' ? [pv[0] || 1, pv[1] || 1, pv[2] || 1] : [pv[0] || 0, pv[1] || 0, pv[2] || 0];
        } else if (/[XYZ]/.test(prop)) {
          var obj = {};
          if (/translate/.test(prop)) {
            obj = translate3dObj;
          } else if (/rotate/.test(prop)) {
            obj = rotate3dObj;
          } else if (/scale/.test(prop)) {
            obj = scale3dObj;
          } else if (/skew/.test(prop)) {
            obj = skewObj;
          }
          var idx = prop.replace(/translate|rotate|scale|skew/, '').toLowerCase();
          obj[idx] = /scale/.test(prop) ? parseFloat(value[prop]) : parseInt(value[prop], 10);
        } else if (prop === 'skew') {
          pv = value[prop].map(function (v) { return parseInt(v, 10) || 0; });
          transformObject[prop] = [pv[0] || 0, pv[1] || 0];
        } else { // perspective
          transformObject[prop] = parseInt(value[prop], 10);
        }
      });

      axis.forEach(function (o) {
        var tp = Object.keys(o)[0];
        var tv = o[tp];
        if (Object.keys(tv).length && !transformObject[tp]) {
          if (tp === 'scale3d') {
            transformObject[tp] = [tv.x || 1, tv.y || 1, tv.z || 1];
          } else if (tp === 'skew') {
            transformObject[tp] = [tv.x || 0, tv.y || 0];
          } else { // translate | rotate
            transformObject[tp] = [tv.x || 0, tv.y || 0, tv.z || 0];
          }
        }
      });
      return transformObject;
    } // string | array
    // if ( typeof (value) === 'object' && value.length ) {
    // } else if ( typeof (value) === string && value.includes('matrix')) {
    // decompose matrix to object
    throw Error(("KUTE.js - \"" + value + "\" is not valid/supported transform function"));
  }

  /**
   * Sets the end values for the next `to()` method call.
   * @param {string} tweenProp the property name
   */
  function onCompleteTransform(tweenProp) {
    if (this.valuesEnd[tweenProp]) {
      this.element[matrixComponent] = Object.assign({}, this.valuesEnd[tweenProp]);
    }
  }

  /**
   * Prepare tween object in advance for `to()` method.
   * @param {string} tweenProp the property name
   */
  function crossCheckTransform(tweenProp) {
    if (this.valuesEnd[tweenProp]) {
      if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective) {
        this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
      }
    }
  }

  // All Component Functions
  var matrixFunctions = {
    prepareStart: getTransform,
    prepareProperty: prepareTransform,
    onStart: onStartTransform,
    onComplete: onCompleteTransform,
    crossCheck: crossCheckTransform,
  };

  // Component Full Object
  var matrixTransform = {
    component: matrixComponent,
    property: 'transform',
    /* subProperties: [
      'perspective', 'translate3d', 'translateX', 'translateY', 'translateZ',
      'rotate3d', 'rotateX', 'rotateY', 'rotateZ',
      'skew','skewX','skewY',
      'scale3d', 'scaleX', 'scaleY', 'scaleZ'], */
    defaultValue: {
      perspective: 400,
      translate3d: [0, 0, 0],
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      rotate3d: [0, 0, 0],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      skew: [0, 0],
      skewX: 0,
      skewY: 0,
      scale3d: [1, 1, 1],
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    },
    functions: matrixFunctions,
    Interpolate: {
      perspective: numbers,
      translate3d: arrays,
      rotate3d: arrays,
      skew: arrays,
      scale3d: arrays,
    },
  };

  var Components = {
    BackgroundPosition: BackgroundPosition,
    BorderRadius: BorderRadius,
    BoxModel: BoxModel,
    ClipProperty: ClipProperty,
    ColorProperties: colorProperties,
    FilterEffects: filterEffects,
    HTMLAttributes: htmlAttributes,
    OpacityProperty: OpacityProperty,
    SVGDraw: SvgDrawProperty,
    SVGCubicMorph: svgCubicMorph,
    SVGTransform: svgTransform,
    ScrollProperty: ScrollProperty,
    ShadowProperties: ShadowProperties,
    TextProperties: TextProperties,
    TextWriteProperties: TextWrite,
    MatrixTransform: matrixTransform,
  };

  // init components
  Object.keys(Components).forEach(function (component) {
    var compOps = Components[component];
    Components[component] = new AnimationDevelopment(compOps);
  });

  var version = "2.2.4";

  // @ts-ignore

  /**
   * A global namespace for library version.
   * @type {string}
   */
  var Version = version;

  var indexExtra = {
    Animation: AnimationDevelopment,
    Components: Components,

    // Tween Interface
    Tween: TweenExtra,
    fromTo: fromTo,
    to: to,
    // Tween Collection
    TweenCollection: TweenCollection,
    ProgressBar: ProgressBar,
    allFromTo: allFromTo,
    allTo: allTo,
    // Tween Interface

    Objects: Objects,
    Util: Util,
    Easing: Easing,
    CubicBezier: CubicBezier,
    Render: Render,
    Interpolate: interpolate,
    Process: Process,
    Internals: internals,
    Selector: selector,
    Version: Version,
  };

  return indexExtra;

}));
