/*!
* KUTE.js Base v2.1.3 (http://thednp.github.io/kute.js)
* Copyright 2015-2021 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KUTE = factory());
})(this, (function () { 'use strict';

  var KUTE = {};

  var Tweens = [];

  var globalObject;

  if (typeof global !== 'undefined') { globalObject = global; }
  else if (typeof window !== 'undefined') { globalObject = window.self; }
  else { globalObject = {}; }

  var globalObject$1 = globalObject;

  // KUTE.js INTERPOLATE FUNCTIONS
  // =============================
  var Interpolate = {};

  // schedule property specific function on animation start
  // link property update function to KUTE.js execution context
  var onStart = {};

  var now;

  // Include a performance.now polyfill.
  // source https://github.com/tweenjs/tween.js/blob/master/src/Now.ts
  // In node.js, use process.hrtime.
  // eslint-disable-next-line
  // @ts-ignore
  if (typeof self === 'undefined' && typeof process !== 'undefined' && process.hrtime) {
    now = function () {
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
    now = self.performance.now.bind(self.performance);
  } else if (typeof Date !== 'undefined' && Date.now) {
    // Use Date.now if it is available.
    now = Date.now;
  } else {
    // Otherwise, use 'new Date().getTime()'.
    now = function () { return new Date().getTime(); };
  }

  var now$1 = now;

  var Time = {};
  Time.now = now$1;
  // const that = window.self || window || {};
  // Time.now = that.performance.now.bind(that.performance);

  var Tick = 0;

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
            if (KUTE[obj]) { delete KUTE[obj]; }
          } else {
            Object.keys(onStart[obj]).forEach(function (prop) {
              if (KUTE[prop]) { delete KUTE[prop]; }
            });
          }
        });

        Object.keys(Interpolate).forEach(function (i) {
          if (KUTE[i]) { delete KUTE[i]; }
        });
      }
    }, 64);
  }

  // KUTE.js render update functions
  // ===============================
  var Render = {
    Tick: Tick, Ticker: Ticker, Tweens: Tweens, Time: Time,
  };
  Object.keys(Render).forEach(function (blob) {
    if (!KUTE[blob]) {
      KUTE[blob] = blob === 'Time' ? Time.now : Render[blob];
    }
  });

  globalObject$1._KUTE = KUTE;

  var defaultOptions = {
    duration: 700,
    delay: 0,
    easing: 'linear',
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

  // Select Robert Penner's Easing Functions
  // updated for ESLint
  var Easing = {
    linear: function (t) { return t; },
    easingQuadraticIn: function (t) { return t * t; },
    easingQuadraticOut: function (t) { return t * (2 - t); },
    easingQuadraticInOut: function (t) { return (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); },
    easingCubicIn: function (t) { return t * t * t; },
    easingCubicOut: function (t0) { var t = t0 - 1; return t * t * t + 1; },
    easingCubicInOut: function (t) { return (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1); },
    easingCircularIn: function (t) { return -(Math.sqrt(1 - (t * t)) - 1); },
    easingCircularOut: function (t0) { var t = t0 - 1; return Math.sqrt(1 - t * t); },
    easingCircularInOut: function (t0) {
      var t = t0 * 2;
      if (t < 1) { return -0.5 * (Math.sqrt(1 - t * t) - 1); }
      t -= 2; return 0.5 * (Math.sqrt(1 - t * t) + 1);
    },
    easingBackIn: function (t) { var s = 1.70158; return t * t * ((s + 1) * t - s); },
    easingBackOut: function (t0) {
      var s = 1.70158;
      var t = t0 - 1;
      return t * t * ((s + 1) * t + s) + 1;
    },
    easingBackInOut: function (t0) {
      var s = 1.70158 * 1.525;
      var t = t0 * 2;
      if (t < 1) { return 0.5 * (t * t * ((s + 1) * t - s)); }
      t -= 2; return 0.5 * (t * t * ((s + 1) * t + s) + 2);
    },
  };

  function processEasing(fn) {
    if (typeof fn === 'function') {
      return fn;
    } if (typeof Easing[fn] === 'function') {
      return Easing[fn]; // regular Robert Penner Easing Functions
    }
    return Easing.linear;
  }

  connect.processEasing = processEasing;

  function add (tw) { return Tweens.push(tw); }

  function remove (tw) {
    var i = Tweens.indexOf(tw);
    if (i !== -1) { Tweens.splice(i, 1); }
  }

  function getAll () { return Tweens; }

  function removeAll () { Tweens.length = 0; }

  var supportedProperties = {};

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
          if (!KUTE[fnObj]) { KUTE[fnObj] = componentLink[fnObj]; }
        } else {
          Object.keys(this$1$1.valuesEnd).forEach(function (prop) {
            var propObject = this$1$1.valuesEnd[prop];
            if (propObject instanceof Object) {
              Object.keys(propObject).forEach(function (i) {
                if (typeof (componentLink[i]) === 'function') { // transformCSS3
                  if (!KUTE[i]) { KUTE[i] = componentLink[i]; }
                } else {
                  Object.keys(componentLink[fnObj]).forEach(function (j) {
                    if (componentLink[i] && typeof (componentLink[i][j]) === 'function') { // transformMatrix
                      if (!KUTE[j]) { KUTE[j] = componentLink[i][j]; }
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

  var Internals = {
    add: add,
    remove: remove,
    getAll: getAll,
    removeAll: removeAll,
    stop: stop,
    linkInterpolation: linkInterpolation,
  };

  // a public selector utility
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

  // Animation class
  var AnimationBase = function AnimationBase(Component) {
    return this.setComponent(Component);
  };

  AnimationBase.prototype.setComponent = function setComponent (Component) {
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
      Object.keys(Component.defaultOptions).forEach(function (op) {
        defaultOptions[op] = Component.defaultOptions[op];
      });
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
        if (typeof (compIntObj) === 'function' && !Interpolate[fni]) {
          Interpolate[fni] = compIntObj;
        } else {
          Object.keys(compIntObj).forEach(function (sfn) {
            if (typeof (compIntObj[sfn]) === 'function' && !Interpolate[fni]) {
              Interpolate[fni] = compIntObj[sfn];
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

  function perspective(a, b, u, v) {
    return ("perspective(" + (((a + (b - a) * v) * 1000 >> 0) / 1000) + u + ")");
  }

  function translate3d(a, b, u, v) {
    var translateArray = [];
    for (var ax = 0; ax < 3; ax += 1) {
      translateArray[ax] = (a[ax] || b[ax]
        ? ((a[ax] + (b[ax] - a[ax]) * v) * 1000 >> 0) / 1000 : 0) + u;
    }
    return ("translate3d(" + (translateArray.join(',')) + ")");
  }

  function rotate3d(a, b, u, v) {
    var rotateStr = '';
    rotateStr += a[0] || b[0] ? ("rotateX(" + (((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u + ")") : '';
    rotateStr += a[1] || b[1] ? ("rotateY(" + (((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u + ")") : '';
    rotateStr += a[2] || b[2] ? ("rotateZ(" + (((a[2] + (b[2] - a[2]) * v) * 1000 >> 0) / 1000) + u + ")") : '';
    return rotateStr;
  }

  function translate(a, b, u, v) {
    var translateArray = [];
    translateArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u;
    translateArray[1] = a[1] || b[1] ? ((a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u) : '0';
    return ("translate(" + (translateArray.join(',')) + ")");
  }

  function rotate(a, b, u, v) {
    return ("rotate(" + (((a + (b - a) * v) * 1000 >> 0) / 1000) + u + ")");
  }

  function scale(a, b, v) {
    return ("scale(" + (((a + (b - a) * v) * 1000 >> 0) / 1000) + ")");
  }

  function skew(a, b, u, v) {
    var skewArray = [];
    skewArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u;
    skewArray[1] = a[1] || b[1] ? ((a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u) : '0';
    return ("skew(" + (skewArray.join(',')) + ")");
  }

  /* transformFunctions = {
    property: 'transform',
    subProperties,
    defaultValues,
    Interpolate: {translate,rotate,skew,scale},
    functions } */

  // same to svg transform, attr

  // Component Functions
  function onStartTransform(tweenProp) {
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, 'px', v) : '') // one side might be 0
          + (a.translate3d ? translate3d(a.translate3d, b.translate3d, 'px', v) : '') // array [x,y,z]
          + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, 'deg', v) : '') // array [x,y,z]
          + (a.skew ? skew(a.skew, b.skew, 'deg', v) : '') // array [x,y]
          + (a.scale || b.scale ? scale(a.scale, b.scale, v) : ''); // one side might be 0
      };
    }
  }

  // Base Component
  var BaseTransform = {
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

  function numbers(a, b, v) { // number1, number2, progress
    var A = +a;
    var B = b - a;
    // a = +a; b -= a;
    return A + B * v;
  }

  // Component Functions
  function boxModelOnStart(tweenProp) {
    if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = (v > 0.99 || v < 0.01
          ? ((numbers(a, b, v) * 10) >> 0) / 10
          : (numbers(a, b, v)) >> 0) + "px";
      };
    }
  }

  // Component Base Props
  var baseBoxProps = ['top', 'left', 'width', 'height'];
  var baseBoxOnStart = {};
  baseBoxProps.forEach(function (x) { baseBoxOnStart[x] = boxModelOnStart; });

  // Component Base
  var baseBoxModel = {
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
  function onStartOpacity(tweenProp/* , value */) {
    // opacity could be 0 sometimes, we need to check regardless
    if (tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
      KUTE[tweenProp] = function (elem, a, b, v) {
        elem.style[tweenProp] = ((numbers(a, b, v) * 1000) >> 0) / 1000;
      };
    }
  }

  // Base Component
  var baseOpacity = {
    component: 'baseOpacity',
    property: 'opacity',
    // defaultValue: 1,
    Interpolate: { numbers: numbers },
    functions: { onStart: onStartOpacity },
  };

  // import {baseCrossBrowserMove} from '../components/crossBrowserMove.js'
  // support for kute-base.js ends here

  var Components = {
    Transform: new AnimationBase(BaseTransform),
    BoxModel: new AnimationBase(baseBoxModel),
    Opacity: new AnimationBase(baseOpacity),
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

  // single Tween object construct
  // TweenBase is meant to be use for pre-processed values
  var TweenBase = function TweenBase(targetElement, startObject, endObject, opsObject) {
    var this$1$1 = this;

    // element animation is applied to
    this.element = targetElement;

    this.playing = false;

    this._startTime = null;
    this._startFired = false;

    this.valuesEnd = endObject; // valuesEnd
    this.valuesStart = startObject; // valuesStart

    // OPTIONS
    var options = opsObject || {};
    // internal option to process inline/computed style at start instead of init
    // used by to() method and expects object : {} / false
    this._resetStart = options.resetStart || 0;
    // you can only set a core easing function as default
    this._easing = typeof (options.easing) === 'function' ? options.easing : connect.processEasing(options.easing);
    this._duration = options.duration || defaultOptions.duration; // duration option | default
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
        if (!KUTE[prop] && prop === this._easing.name) { KUTE[prop] = this._easing; }
      };
    }

    return this;
  };

  // tween prototype
  // queue tween object to main frame update
  // move functions that use the ticker outside the prototype to be in the same scope with it
  TweenBase.prototype.start = function start (time) {
    // now it's a good time to start
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

    if (!Tick) { Ticker(); }
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

  TweenBase.prototype.chain = function chain (args) {
    this._chain = [];
    this._chain = args.length ? args : this._chain.concat(args);
    return this;
  };

  TweenBase.prototype.stopChainedTweens = function stopChainedTweens () {
    if (this._chain && this._chain.length) { this._chain.forEach(function (tw) { return tw.stop(); }); }
  };

  TweenBase.prototype.update = function update (time) {
      var this$1$1 = this;

    var T = time !== undefined ? time : KUTE.Time();

    var elapsed;

    if (T < this._startTime && this.playing) { return true; }

    elapsed = (T - this._startTime) / this._duration;
    elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

    // calculate progress
    var progress = this._easing(elapsed);

    // render the update
    Object.keys(this.valuesEnd).forEach(function (tweenProp) {
      KUTE[tweenProp](this$1$1.element,
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

  function fromTo(element, startObject, endObject, optionsObj) {
    var options = optionsObj || {};
    var TweenConstructor = connect.tween;
    return new TweenConstructor(selector(element), startObject, endObject, options);
  }

  var version = "2.1.3";

  var indexBase = {
    Animation: AnimationBase,
    Components: Components,

    Tween: TweenBase,
    fromTo: fromTo,

    Objects: Objects,
    Easing: Easing,
    Util: Util,
    Render: Render,
    Interpolate: Interpolate,
    Internals: Internals,
    Selector: selector,
    Version: version,
  };

  return indexBase;

}));
