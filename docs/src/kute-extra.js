/*!
* KUTE.js Extra v2.2.5 (http://thednp.github.io/kute.js)
* Copyright 2015-2026 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports =  factory() :
  typeof define === 'function' && define.amd ? define([], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.KUTE = factory()));
})(this, function() {

//#region node_modules/.pnpm/@thednp+bezier-easing@1.0.11/node_modules/@thednp/bezier-easing/dist/bezier-easing.mjs
	var y$1 = class {
		cx;
		bx;
		ax;
		cy;
		by;
		ay;
		constructor(e, n, t, s, a) {
			const i = e || 0, r = n || 0, h = t || 1, u = s || 1, b = (c) => typeof c == "number", o = [
				e,
				n,
				t,
				s
			].every(b), p = a || (o ? `cubic-bezier(${[
				i,
				r,
				h,
				u
			].join(",")})` : "linear");
			this.cx = 3 * i, this.bx = 3 * (h - i) - this.cx, this.ax = 1 - this.cx - this.bx, this.cy = 3 * r, this.by = 3 * (u - r) - this.cy, this.ay = 1 - this.cy - this.by;
			const l = (c) => this.sampleCurveY(this.solveCurveX(c));
			return Object.defineProperty(l, "name", { writable: !0 }), l.name = p, l;
		}
		sampleCurveX(e) {
			return ((this.ax * e + this.bx) * e + this.cx) * e;
		}
		sampleCurveY(e) {
			return ((this.ay * e + this.by) * e + this.cy) * e;
		}
		sampleCurveDerivativeX(e) {
			return (3 * this.ax * e + 2 * this.bx) * e + this.cx;
		}
		solveCurveX(e) {
			if (e <= 0) return 0;
			if (e >= 1) return 1;
			let t = e, s = 0, a = 0;
			for (let h = 0; h < 8; h += 1) {
				if (s = this.sampleCurveX(t) - e, Math.abs(s) < 1e-6) return t;
				if (a = this.sampleCurveDerivativeX(t), Math.abs(a) < 1e-6) break;
				t -= s / a;
			}
			let i = 0, r = 1;
			for (t = e; i < r;) {
				if (s = this.sampleCurveX(t), Math.abs(s - e) < 1e-6) return t;
				e > s ? i = t : r = t, t = (r - i) * .5 + i;
			}
			return t;
		}
	};

//#endregion
//#region src/objects/kute.js
/**
	* The KUTE.js Execution Context
	*/
	const KEC = {};
	var kute_default = KEC;

//#endregion
//#region src/objects/tweens.js
	const Tweens = [];
	var tweens_default = Tweens;

//#endregion
//#region src/objects/globalObject.js
	let gl0bal;
	if (typeof globalThis !== "undefined") gl0bal = globalThis;
	else if (typeof window !== "undefined") gl0bal = globalThis.self;
	else gl0bal = {};
	const globalObject = gl0bal;
	var globalObject_default = globalObject;

//#endregion
//#region src/objects/interpolate.js
	const interpolate = {};
	var interpolate_default = interpolate;

//#endregion
//#region src/objects/onStart.js
	const onStart = {};
	var onStart_default = onStart;

//#endregion
//#region src/util/now.js
	let performanceNow = () => performance.now();
	if (typeof window === "undefined") performanceNow = () => (/* @__PURE__ */ new Date()).getTime();
	const now = performanceNow;
	var now_default = now;

//#endregion
//#region src/core/render.js
	const Time = {};
	Time.now = now_default;
	let Tick = 0;
	/**
	* @param {number | Date} time
	*/
	const Ticker = (time) => {
		let i = 0;
		while (i < tweens_default.length) if (tweens_default[i].update(time)) i += 1;
		else tweens_default.splice(i, 1);
		Tick = requestAnimationFrame(Ticker);
	};
	function stop() {
		setTimeout(() => {
			if (!tweens_default.length && Tick) {
				cancelAnimationFrame(Tick);
				Tick = null;
				Object.keys(onStart_default).forEach((obj) => {
					if (typeof onStart_default[obj] === "function") {
						if (kute_default[obj]) delete kute_default[obj];
					} else Object.keys(onStart_default[obj]).forEach((prop) => {
						if (kute_default[prop]) delete kute_default[prop];
					});
				});
				Object.keys(interpolate_default).forEach((i) => {
					if (kute_default[i]) delete kute_default[i];
				});
			}
		}, 64);
	}
	const Render = {
		Tick,
		Ticker,
		Tweens: tweens_default,
		Time
	};
	Object.keys(Render).forEach((blob) => {
		if (!kute_default[blob]) kute_default[blob] = blob === "Time" ? Time.now : Render[blob];
	});
	globalObject_default._KUTE = kute_default;
	var render_default = Render;

//#endregion
//#region src/objects/supportedProperties.js
	const supportedProperties = {};
	var supportedProperties_default = supportedProperties;

//#endregion
//#region src/objects/defaultValues.js
	const defaultValues = {};
	var defaultValues_default = defaultValues;

//#endregion
//#region src/objects/defaultOptions.js
	const defaultOptions = {
		duration: 700,
		delay: 0,
		easing: "linear",
		repeat: 0,
		repeatDelay: 0,
		yoyo: false,
		resetStart: false,
		offset: 0
	};
	var defaultOptions_default = defaultOptions;

//#endregion
//#region src/objects/prepareProperty.js
	const prepareProperty = {};
	var prepareProperty_default = prepareProperty;

//#endregion
//#region src/objects/prepareStart.js
	const prepareStart = {};
	var prepareStart_default = prepareStart;

//#endregion
//#region src/objects/crossCheck.js
	const crossCheck = {};
	var crossCheck_default = crossCheck;

//#endregion
//#region src/objects/onComplete.js
	const onComplete = {};
	var onComplete_default = onComplete;

//#endregion
//#region src/objects/linkProperty.js
	const linkProperty = {};
	var linkProperty_default = linkProperty;

//#endregion
//#region src/objects/objects.js
	const Objects = {
		supportedProperties: supportedProperties_default,
		defaultValues: defaultValues_default,
		defaultOptions: defaultOptions_default,
		prepareProperty: prepareProperty_default,
		prepareStart: prepareStart_default,
		crossCheck: crossCheck_default,
		onStart: onStart_default,
		onComplete: onComplete_default,
		linkProperty: linkProperty_default
	};
	var objects_default = Objects;

//#endregion
//#region src/objects/util.js
	const Util = {};
	var util_default = Util;

//#endregion
//#region src/core/add.js
/**
	* KUTE.add(Tween)
	*
	* @param {KUTE.Tween} tw a new tween to add
	*/
	const add = (tw) => tweens_default.push(tw);
	var add_default = add;

//#endregion
//#region src/core/remove.js
/**
	* KUTE.remove(Tween)
	*
	* @param {KUTE.Tween} tw a new tween to add
	*/
	const remove = (tw) => {
		const i = tweens_default.indexOf(tw);
		if (i !== -1) tweens_default.splice(i, 1);
	};
	var remove_default = remove;

//#endregion
//#region src/core/getAll.js
/**
	* KUTE.add(Tween)
	*
	* @return {KUTE.Tween[]} tw a new tween to add
	*/
	const getAll = () => tweens_default;
	var getAll_default = getAll;

//#endregion
//#region src/core/removeAll.js
/**
	* KUTE.removeAll()
	*/
	const removeAll = () => {
		tweens_default.length = 0;
	};
	var removeAll_default = removeAll;

//#endregion
//#region src/core/linkInterpolation.js
/**
	* linkInterpolation
	* @this {KUTE.Tween}
	*/
	function linkInterpolation() {
		Object.keys(linkProperty_default).forEach((component) => {
			const componentLink = linkProperty_default[component];
			const componentProps = supportedProperties_default[component];
			Object.keys(componentLink).forEach((fnObj) => {
				if (typeof componentLink[fnObj] === "function" && Object.keys(this.valuesEnd).some((i) => componentProps && componentProps.includes(i) || i === "attr" && Object.keys(this.valuesEnd[i]).some((j) => componentProps && componentProps.includes(j)))) {
					if (!kute_default[fnObj]) kute_default[fnObj] = componentLink[fnObj];
				} else Object.keys(this.valuesEnd).forEach((prop) => {
					const propObject = this.valuesEnd[prop];
					if (propObject instanceof Object) Object.keys(propObject).forEach((i) => {
						if (typeof componentLink[i] === "function") {
							if (!kute_default[i]) kute_default[i] = componentLink[i];
						} else Object.keys(componentLink[fnObj]).forEach((j) => {
							if (componentLink[i] && typeof componentLink[i][j] === "function") {
								if (!kute_default[j]) kute_default[j] = componentLink[i][j];
							}
						});
					});
				});
			});
		});
	}

//#endregion
//#region src/core/internals.js
	const internals = {
		add: add_default,
		remove: remove_default,
		getAll: getAll_default,
		removeAll: removeAll_default,
		stop,
		linkInterpolation
	};
	var internals_default = internals;

//#endregion
//#region src/process/getInlineStyle.js
/**
	* getInlineStyle
	* Returns the transform style for element from
	* cssText. Used by for the `.to()` static method.
	*
	* @param {Element} el target element
	* @returns {object}
	*/
	function getInlineStyle(el) {
		if (!el.style) return false;
		const css = el.style.cssText.replace(/\s/g, "").split(";");
		const transformObject = {};
		const arrayFn = [
			"translate3d",
			"translate",
			"scale3d",
			"skew"
		];
		css.forEach((cs) => {
			if (/transform/i.test(cs)) cs.split(":")[1].split(")").forEach((tpi) => {
				const tpv = tpi.split("(");
				const tp = tpv[0];
				const tv = tpv[1];
				if (!/matrix/.test(tp)) transformObject[tp] = arrayFn.includes(tp) ? tv.split(",") : tv;
			});
		});
		return transformObject;
	}

//#endregion
//#region src/process/getStyleForProperty.js
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
		let result = defaultValues_default[propertyName];
		const styleAttribute = elem.style;
		const computedStyle = getComputedStyle(elem) || elem.currentStyle;
		const styleValue = styleAttribute[propertyName] && !/auto|initial|none|unset/.test(styleAttribute[propertyName]) ? styleAttribute[propertyName] : computedStyle[propertyName];
		if (propertyName !== "transform" && (propertyName in computedStyle || propertyName in styleAttribute)) result = styleValue;
		return result;
	}

//#endregion
//#region src/process/prepareObject.js
/**
	* prepareObject
	*
	* Returns all processed valuesStart / valuesEnd.
	*
	* @param {Element} obj the values start/end object
	* @param {string} fn toggles between the two
	*/
	function prepareObject(obj, fn) {
		const propertiesObject = fn === "start" ? this.valuesStart : this.valuesEnd;
		Object.keys(prepareProperty_default).forEach((component) => {
			const prepareComponent = prepareProperty_default[component];
			const supportComponent = supportedProperties_default[component];
			Object.keys(prepareComponent).forEach((tweenCategory) => {
				const transformObject = {};
				Object.keys(obj).forEach((tweenProp) => {
					if (defaultValues_default[tweenProp] && prepareComponent[tweenProp]) propertiesObject[tweenProp] = prepareComponent[tweenProp].call(this, tweenProp, obj[tweenProp]);
					else if (!defaultValues_default[tweenCategory] && tweenCategory === "transform" && supportComponent.includes(tweenProp)) transformObject[tweenProp] = obj[tweenProp];
					else if (!defaultValues_default[tweenProp] && tweenProp === "transform") propertiesObject[tweenProp] = obj[tweenProp];
					else if (!defaultValues_default[tweenCategory] && supportComponent && supportComponent.includes(tweenProp)) propertiesObject[tweenProp] = prepareComponent[tweenCategory].call(this, tweenProp, obj[tweenProp]);
				});
				if (Object.keys(transformObject).length) propertiesObject[tweenCategory] = prepareComponent[tweenCategory].call(this, tweenCategory, transformObject);
			});
		});
	}

//#endregion
//#region src/process/getStartValues.js
/**
	* getStartValues
	*
	* Returns the start values for to() method.
	* Used by for the `.to()` static method.
	*
	* @this {KUTE.Tween} the tween instance
	*/
	function getStartValues() {
		const startValues = {};
		const currentStyle = getInlineStyle(this.element);
		Object.keys(this.valuesStart).forEach((tweenProp) => {
			Object.keys(prepareStart_default).forEach((component) => {
				const componentStart = prepareStart_default[component];
				Object.keys(componentStart).forEach((tweenCategory) => {
					if (tweenCategory === tweenProp && componentStart[tweenProp]) startValues[tweenProp] = componentStart[tweenCategory].call(this, tweenProp, this.valuesStart[tweenProp]);
					else if (supportedProperties_default[component] && supportedProperties_default[component].includes(tweenProp)) startValues[tweenProp] = componentStart[tweenCategory].call(this, tweenProp, this.valuesStart[tweenProp]);
				});
			});
		});
		Object.keys(currentStyle).forEach((current) => {
			if (!(current in this.valuesStart)) startValues[current] = currentStyle[current] || defaultValues_default[current];
		});
		this.valuesStart = {};
		prepareObject.call(this, startValues, "start");
	}

//#endregion
//#region src/process/process.js
	var process_default = {
		getInlineStyle,
		getStyleForProperty,
		getStartValues,
		prepareObject
	};

//#endregion
//#region src/objects/connect.js
	const connect = {};
	/** @type {KUTE.TweenBase | KUTE.Tween | KUTE.TweenExtra} */
	connect.tween = null;
	connect.processEasing = null;
	var connect_default = connect;

//#endregion
//#region src/easing/easing-bezier.js
	const Easing = {
		linear: new y$1(0, 0, 1, 1, "linear"),
		easingSinusoidalIn: new y$1(.47, 0, .745, .715, "easingSinusoidalIn"),
		easingSinusoidalOut: new y$1(.39, .575, .565, 1, "easingSinusoidalOut"),
		easingSinusoidalInOut: new y$1(.445, .05, .55, .95, "easingSinusoidalInOut"),
		easingQuadraticIn: new y$1(.55, .085, .68, .53, "easingQuadraticIn"),
		easingQuadraticOut: new y$1(.25, .46, .45, .94, "easingQuadraticOut"),
		easingQuadraticInOut: new y$1(.455, .03, .515, .955, "easingQuadraticInOut"),
		easingCubicIn: new y$1(.55, .055, .675, .19, "easingCubicIn"),
		easingCubicOut: new y$1(.215, .61, .355, 1, "easingCubicOut"),
		easingCubicInOut: new y$1(.645, .045, .355, 1, "easingCubicInOut"),
		easingQuarticIn: new y$1(.895, .03, .685, .22, "easingQuarticIn"),
		easingQuarticOut: new y$1(.165, .84, .44, 1, "easingQuarticOut"),
		easingQuarticInOut: new y$1(.77, 0, .175, 1, "easingQuarticInOut"),
		easingQuinticIn: new y$1(.755, .05, .855, .06, "easingQuinticIn"),
		easingQuinticOut: new y$1(.23, 1, .32, 1, "easingQuinticOut"),
		easingQuinticInOut: new y$1(.86, 0, .07, 1, "easingQuinticInOut"),
		easingExponentialIn: new y$1(.95, .05, .795, .035, "easingExponentialIn"),
		easingExponentialOut: new y$1(.19, 1, .22, 1, "easingExponentialOut"),
		easingExponentialInOut: new y$1(1, 0, 0, 1, "easingExponentialInOut"),
		easingCircularIn: new y$1(.6, .04, .98, .335, "easingCircularIn"),
		easingCircularOut: new y$1(.075, .82, .165, 1, "easingCircularOut"),
		easingCircularInOut: new y$1(.785, .135, .15, .86, "easingCircularInOut"),
		easingBackIn: new y$1(.6, -.28, .735, .045, "easingBackIn"),
		easingBackOut: new y$1(.175, .885, .32, 1.275, "easingBackOut"),
		easingBackInOut: new y$1(.68, -.55, .265, 1.55, "easingBackInOut")
	};
	/**
	* Returns a valid `easingFunction`.
	*
	* @param {KUTE.easingFunction | string} fn function name or constructor name
	* @returns {KUTE.easingFunction} a valid easingfunction
	*/
	function processBezierEasing(fn) {
		if (typeof fn === "function") return fn;
		if (typeof Easing[fn] === "function") return Easing[fn];
		if (/bezier/.test(fn)) {
			const bz = fn.replace(/bezier|\s|\(|\)/g, "").split(",");
			return new y$1(bz[0] * 1, bz[1] * 1, bz[2] * 1, bz[3] * 1);
		}
		return Easing.linear;
	}
	connect_default.processEasing = processBezierEasing;
	var easing_bezier_default = Easing;

//#endregion
//#region src/util/selector.js
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
			let requestedElem;
			let itemsArray;
			if (multi) {
				itemsArray = el instanceof Array && el.every((x) => x instanceof Element);
				requestedElem = el instanceof HTMLCollection || el instanceof NodeList || itemsArray ? el : document.querySelectorAll(el);
			} else requestedElem = el instanceof Element || el === window ? el : document.querySelector(el);
			return requestedElem;
		} catch (e) {
			throw TypeError(`KUTE.js - Element(s) not found: ${el}.\n`, String(e));
		}
	}

//#endregion
//#region src/core/queueStart.js
	function queueStart() {
		Object.keys(onStart_default).forEach((obj) => {
			if (typeof onStart_default[obj] === "function") onStart_default[obj].call(this, obj);
			else Object.keys(onStart_default[obj]).forEach((prop) => {
				onStart_default[obj][prop].call(this, prop);
			});
		});
		linkInterpolation.call(this);
	}

//#endregion
//#region src/tween/tweenBase.js
/**
	* The `TweenBase` constructor creates a new `Tween` object
	* for a single `HTMLElement` and returns it.
	*
	* `TweenBase` is meant to be used with pre-processed values.
	*/
	var TweenBase = class {
		/**
		* @param {Element} targetElement the target element
		* @param {KUTE.tweenProps} startObject the start values
		* @param {KUTE.tweenProps} endObject the end values
		* @param {KUTE.tweenOptions} opsObject the end values
		* @returns {TweenBase} the resulting Tween object
		*/
		constructor(targetElement, startObject, endObject, opsObject) {
			this.element = targetElement;
			/** @type {boolean} */
			this.playing = false;
			/** @type {number?} */
			this._startTime = null;
			/** @type {boolean} */
			this._startFired = false;
			this.valuesEnd = endObject;
			this.valuesStart = startObject;
			const options = opsObject || {};
			this._resetStart = options.resetStart || 0;
			/** @type {KUTE.easingOption} */
			this._easing = typeof options.easing === "function" ? options.easing : connect_default.processEasing(options.easing);
			/** @type {number} */
			this._duration = options.duration || defaultOptions_default.duration;
			/** @type {number} */
			this._delay = options.delay || defaultOptions_default.delay;
			Object.keys(options).forEach((op) => {
				const internalOption = `_${op}`;
				if (!(internalOption in this)) this[internalOption] = options[op];
			});
			const easingFnName = this._easing.name;
			if (!onStart_default[easingFnName]) onStart_default[easingFnName] = function easingFn(prop) {
				if (!kute_default[prop] && prop === this._easing.name) kute_default[prop] = this._easing;
			};
			return this;
		}
		/**
		* Starts tweening
		* @param {number?} time the tween start time
		* @returns {TweenBase} this instance
		*/
		start(time) {
			add_default(this);
			this.playing = true;
			this._startTime = typeof time !== "undefined" ? time : kute_default.Time();
			this._startTime += this._delay;
			if (!this._startFired) {
				if (this._onStart) this._onStart.call(this);
				queueStart.call(this);
				this._startFired = true;
			}
			if (!Tick) Ticker();
			return this;
		}
		/**
		* Stops tweening
		* @returns {TweenBase} this instance
		*/
		stop() {
			if (this.playing) {
				remove_default(this);
				this.playing = false;
				if (this._onStop) this._onStop.call(this);
				this.close();
			}
			return this;
		}
		/**
		* Trigger internal completion callbacks.
		*/
		close() {
			Object.keys(onComplete_default).forEach((component) => {
				Object.keys(onComplete_default[component]).forEach((toClose) => {
					onComplete_default[component][toClose].call(this, toClose);
				});
			});
			this._startFired = false;
			stop.call(this);
		}
		/**
		* Schedule another tween instance to start once this one completes.
		* @param {KUTE.chainOption} args the tween animation start time
		* @returns {TweenBase} this instance
		*/
		chain(args) {
			this._chain = [];
			this._chain = args.length ? args : this._chain.concat(args);
			return this;
		}
		/**
		* Stop tweening the chained tween instances.
		*/
		stopChainedTweens() {
			if (this._chain && this._chain.length) this._chain.forEach((tw) => tw.stop());
		}
		/**
		* Update the tween on each tick.
		* @param {number} time the tick time
		* @returns {boolean} this instance
		*/
		update(time) {
			const T = time !== void 0 ? time : kute_default.Time();
			let elapsed;
			if (T < this._startTime && this.playing) return true;
			elapsed = (T - this._startTime) / this._duration;
			elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;
			const progress = this._easing(elapsed);
			Object.keys(this.valuesEnd).forEach((tweenProp) => {
				kute_default[tweenProp](this.element, this.valuesStart[tweenProp], this.valuesEnd[tweenProp], progress);
			});
			if (this._onUpdate) this._onUpdate.call(this);
			if (elapsed === 1) {
				if (this._onComplete) this._onComplete.call(this);
				this.playing = false;
				this.close();
				if (this._chain !== void 0 && this._chain.length) this._chain.map((tw) => tw.start());
				return false;
			}
			return true;
		}
	};
	connect_default.tween = TweenBase;

//#endregion
//#region src/tween/tween.js
/**
	* The `KUTE.Tween()` constructor creates a new `Tween` object
	* for a single `HTMLElement` and returns it.
	*
	* This constructor adds additional functionality and is the default
	* Tween object constructor in KUTE.js.
	*/
	var Tween = class extends TweenBase {
		/**
		* @param {KUTE.tweenParams} args (*target*, *startValues*, *endValues*, *options*)
		* @returns {Tween} the resulting Tween object
		*/
		constructor(...args) {
			super(...args);
			this.valuesStart = {};
			this.valuesEnd = {};
			const [startObject, endObject, options] = args.slice(1);
			prepareObject.call(this, endObject, "end");
			if (this._resetStart) this.valuesStart = startObject;
			else prepareObject.call(this, startObject, "start");
			if (!this._resetStart) Object.keys(crossCheck_default).forEach((component) => {
				Object.keys(crossCheck_default[component]).forEach((checkProp) => {
					crossCheck_default[component][checkProp].call(this, checkProp);
				});
			});
			/** @type {boolean} */
			this.paused = false;
			/** @type {number?} */
			this._pauseTime = null;
			/** @type {number?} */
			this._repeat = options.repeat || defaultOptions_default.repeat;
			/** @type {number?} */
			this._repeatDelay = options.repeatDelay || defaultOptions_default.repeatDelay;
			/** @type {number?} */
			this._repeatOption = this._repeat;
			/** @type {KUTE.tweenProps} */
			this.valuesRepeat = {};
			/** @type {boolean} */
			this._yoyo = options.yoyo || defaultOptions_default.yoyo;
			/** @type {boolean} */
			this._reversed = false;
			return this;
		}
		/**
		* Starts tweening, extended method
		* @param {number?} time the tween start time
		* @returns {Tween} this instance
		*/
		start(time) {
			if (this._resetStart) {
				this.valuesStart = this._resetStart;
				getStartValues.call(this);
				Object.keys(crossCheck_default).forEach((component) => {
					Object.keys(crossCheck_default[component]).forEach((checkProp) => {
						crossCheck_default[component][checkProp].call(this, checkProp);
					});
				});
			}
			this.paused = false;
			if (this._yoyo) Object.keys(this.valuesEnd).forEach((endProp) => {
				this.valuesRepeat[endProp] = this.valuesStart[endProp];
			});
			super.start(time);
			return this;
		}
		/**
		* Stops tweening, extended method
		* @returns {Tween} this instance
		*/
		stop() {
			super.stop();
			if (!this.paused && this.playing) {
				this.paused = false;
				this.stopChainedTweens();
			}
			return this;
		}
		/**
		* Trigger internal completion callbacks.
		*/
		close() {
			super.close();
			if (this._repeatOption > 0) this._repeat = this._repeatOption;
			if (this._yoyo && this._reversed === true) {
				this.reverse();
				this._reversed = false;
			}
			return this;
		}
		/**
		* Resume tweening
		* @returns {Tween} this instance
		*/
		resume() {
			if (this.paused && this.playing) {
				this.paused = false;
				if (this._onResume !== void 0) this._onResume.call(this);
				queueStart.call(this);
				this._startTime += kute_default.Time() - this._pauseTime;
				add_default(this);
				if (!Tick) Ticker();
			}
			return this;
		}
		/**
		* Pause tweening
		* @returns {Tween} this instance
		*/
		pause() {
			if (!this.paused && this.playing) {
				remove_default(this);
				this.paused = true;
				this._pauseTime = kute_default.Time();
				if (this._onPause !== void 0) this._onPause.call(this);
			}
			return this;
		}
		/**
		* Reverses start values with end values
		*/
		reverse() {
			Object.keys(this.valuesEnd).forEach((reverseProp) => {
				const tmp = this.valuesRepeat[reverseProp];
				this.valuesRepeat[reverseProp] = this.valuesEnd[reverseProp];
				this.valuesEnd[reverseProp] = tmp;
				this.valuesStart[reverseProp] = this.valuesRepeat[reverseProp];
			});
		}
		/**
		* Update the tween on each tick.
		* @param {number} time the tick time
		* @returns {boolean} this instance
		*/
		update(time) {
			const T = time !== void 0 ? time : kute_default.Time();
			let elapsed;
			if (T < this._startTime && this.playing) return true;
			elapsed = (T - this._startTime) / this._duration;
			elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;
			const progress = this._easing(elapsed);
			Object.keys(this.valuesEnd).forEach((tweenProp) => {
				kute_default[tweenProp](this.element, this.valuesStart[tweenProp], this.valuesEnd[tweenProp], progress);
			});
			if (this._onUpdate) this._onUpdate.call(this);
			if (elapsed === 1) {
				if (this._repeat > 0) {
					if (Number.isFinite(this._repeat)) this._repeat -= 1;
					this._startTime = T;
					if (Number.isFinite(this._repeat) && this._yoyo && !this._reversed) this._startTime += this._repeatDelay;
					if (this._yoyo) {
						this._reversed = !this._reversed;
						this.reverse();
					}
					return true;
				}
				if (this._onComplete) this._onComplete.call(this);
				this.playing = false;
				this.close();
				if (this._chain !== void 0 && this._chain.length) this._chain.forEach((tw) => tw.start());
				return false;
			}
			return true;
		}
	};
	connect_default.tween = Tween;

//#endregion
//#region src/tween/tweenExtra.js
/**
	* The `KUTE.TweenExtra()` constructor creates a new `Tween` object
	* for a single `HTMLElement` and returns it.
	*
	* This constructor is intended for experiments or testing of new features.
	*/
	var TweenExtra = class extends Tween {
		/**
		* @param {KUTE.tweenParams} args (*target*, *startValues*, *endValues*, *options*)
		* @returns {TweenExtra} the resulting Tween object
		*/
		constructor(...args) {
			super(...args);
			return this;
		}
		/**
		* Method to add callbacks on the fly.
		* @param {string} name callback name
		* @param {Function} fn callback function
		* @returns {TweenExtra}
		*/
		on(name, fn) {
			if ([
				"start",
				"stop",
				"update",
				"complete",
				"pause",
				"resume"
			].indexOf(name) > -1) this[`_on${name.charAt(0).toUpperCase() + name.slice(1)}`] = fn;
			return this;
		}
		/**
		* Method to set options on the fly.
		* * accepting [repeat,yoyo,delay,repeatDelay,easing]
		*
		* @param {string} option the tick time
		* @param {string | number | number[]} value the tick time
		* @returns {TweenExtra}
		*/
		option(option, value) {
			this[`_${option}`] = value;
			return this;
		}
	};
	connect_default.tween = TweenExtra;

//#endregion
//#region src/tween/tweenCollection.js
/**
	* The static method creates a new `Tween` object for each `HTMLElement`
	* from and `Array`, `HTMLCollection` or `NodeList`.
	*/
	var TweenCollection = class TweenCollection {
		/**
		* @param {Element[] | HTMLCollection | NodeList} els target elements
		* @param {KUTE.tweenProps} vS the start values
		* @param {KUTE.tweenProps} vE the end values
		* @param {KUTE.tweenOptions} Options tween options
		* @returns {TweenCollection} the Tween object collection
		*/
		constructor(els, vS, vE, Options) {
			const TweenConstructor = connect_default.tween;
			/** @type {KUTE.twCollection[]} */
			this.tweens = [];
			const Ops = Options || {};
			/** @type {number?} */
			Ops.delay = Ops.delay || defaultOptions_default.delay;
			const options = [];
			Array.from(els).forEach((el, i) => {
				options[i] = Ops || {};
				options[i].delay = i > 0 ? Ops.delay + (Ops.offset || defaultOptions_default.offset) : Ops.delay;
				if (el instanceof Element) this.tweens.push(new TweenConstructor(el, vS, vE, options[i]));
				else throw Error(`KUTE - ${el} is not instanceof Element`);
			});
			/** @type {number?} */
			this.length = this.tweens.length;
			return this;
		}
		/**
		* Starts tweening, all targets
		* @param {number?} time the tween start time
		* @returns {TweenCollection} this instance
		*/
		start(time) {
			const T = time === void 0 ? kute_default.Time() : time;
			this.tweens.map((tween) => tween.start(T));
			return this;
		}
		/**
		* Stops tweening, all targets and their chains
		* @returns {TweenCollection} this instance
		*/
		stop() {
			this.tweens.map((tween) => tween.stop());
			return this;
		}
		/**
		* Pause tweening, all targets
		* @returns {TweenCollection} this instance
		*/
		pause() {
			this.tweens.map((tween) => tween.pause());
			return this;
		}
		/**
		* Resume tweening, all targets
		* @returns {TweenCollection} this instance
		*/
		resume() {
			this.tweens.map((tween) => tween.resume());
			return this;
		}
		/**
		* Schedule another tween or collection to start after
		* this one is complete.
		* @param {number?} args the tween start time
		* @returns {TweenCollection} this instance
		*/
		chain(args) {
			const lastTween = this.tweens[this.length - 1];
			if (args instanceof TweenCollection) lastTween.chain(args.tweens);
			else if (args instanceof connect_default.tween) lastTween.chain(args);
			else throw new TypeError("KUTE.js - invalid chain value");
			return this;
		}
		/**
		* Check if any tween instance is playing
		* @param {number?} time the tween start time
		* @returns {TweenCollection} this instance
		*/
		playing() {
			return this.tweens.some((tw) => tw.playing);
		}
		/**
		* Remove all tweens in the collection
		*/
		removeTweens() {
			this.tweens = [];
		}
		/**
		* Returns the maximum animation duration
		* @returns {number} this instance
		*/
		getMaxDuration() {
			const durations = [];
			this.tweens.forEach((tw) => {
				durations.push(tw._duration + tw._delay + tw._repeat * tw._repeatDelay);
			});
			return Math.max(durations);
		}
	};

//#endregion
//#region src/util/progressBar.js
/**
	* ProgressBar
	*
	* @class
	* A progress bar utility for KUTE.js that will connect
	* a target `<input type="slider">`. with a Tween instance
	* allowing it to control the progress of the Tween.
	*/
	var ProgressBar = class {
		/**
		* @constructor
		* @param {HTMLElement} el target or string selector
		* @param {KUTE.Tween} multi when true returns an array of elements
		*/
		constructor(element, tween) {
			this.element = selector(element);
			this.element.tween = tween;
			this.element.tween.toolbar = this.element;
			this.element.toolbar = this;
			[this.element.output] = this.element.parentNode.getElementsByTagName("OUTPUT");
			if (!(this.element instanceof HTMLInputElement)) throw TypeError("Target element is not [HTMLInputElement]");
			if (this.element.type !== "range") throw TypeError("Target element is not a range input");
			if (!(tween instanceof connect_default.tween)) throw TypeError(`tween parameter is not [${connect_default.tween}]`);
			this.element.setAttribute("value", 0);
			this.element.setAttribute("min", 0);
			this.element.setAttribute("max", 1);
			this.element.setAttribute("step", 1e-4);
			this.element.tween._onUpdate = this.updateBar;
			this.element.addEventListener("mousedown", this.downAction, false);
		}
		updateBar() {
			const tick = 1e-4;
			const { output } = this.toolbar;
			let progress;
			if (this.paused) progress = this.toolbar.value;
			else progress = (kute_default.Time() - this._startTime) / this._duration;
			if (progress > 1 - tick) progress = 1;
			if (progress < .01) progress = 0;
			const value = !this._reversed ? progress : 1 - progress;
			this.toolbar.value = value;
			if (output) output.value = `${(value * 1e4 >> 0) / 100}%`;
		}
		toggleEvents(action) {
			this.element[`${action}EventListener`]("mousemove", this.moveAction, false);
			this.element[`${action}EventListener`]("mouseup", this.upAction, false);
		}
		updateTween() {
			const progress = (!this.tween._reversed ? this.value : 1 - this.value) * this.tween._duration - 1e-4;
			this.tween._startTime = 0;
			this.tween.update(progress);
		}
		moveAction() {
			this.toolbar.updateTween.call(this);
		}
		downAction() {
			if (!this.tween.playing) this.tween.start();
			if (!this.tween.paused) {
				this.tween.pause();
				this.toolbar.toggleEvents("add");
				kute_default.Tick = cancelAnimationFrame(kute_default.Ticker);
			}
		}
		upAction() {
			if (this.tween.paused) {
				if (this.tween.paused) this.tween.resume();
				this.tween._startTime = kute_default.Time() - (!this.tween._reversed ? this.value : 1 - this.value) * this.tween._duration;
				this.toolbar.toggleEvents("remove");
				kute_default.Tick = requestAnimationFrame(kute_default.Ticker);
			}
		}
	};

//#endregion
//#region src/interface/to.js
	const { tween: TweenConstructor$1 } = connect_default;
	/**
	* The `KUTE.to()` static method returns a new Tween object
	* for a single `HTMLElement` at its current state.
	*
	* @param {Element} element target element
	* @param {KUTE.tweenProps} endObject
	* @param {KUTE.tweenOptions} optionsObj tween options
	* @returns {KUTE.Tween} the resulting Tween object
	*/
	function to$1(element, endObject, optionsObj) {
		const options = optionsObj || {};
		options.resetStart = endObject;
		return new TweenConstructor$1(selector(element), endObject, endObject, options);
	}

//#endregion
//#region src/interface/fromTo.js
	const { tween: TweenConstructor } = connect_default;
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
		const options = optionsObj || {};
		return new TweenConstructor(selector(element), startObject, endObject, options);
	}

//#endregion
//#region src/interface/allTo.js
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
		const options = optionsObj || {};
		options.resetStart = endObject;
		return new TweenCollection(selector(elements, true), endObject, endObject, options);
	}

//#endregion
//#region src/interface/allFromTo.js
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
		const options = optionsObj || {};
		return new TweenCollection(selector(elements, true), startObject, endObject, options);
	}

//#endregion
//#region src/animation/animation.js
/**
	* Animation Class
	*
	* Registers components by populating KUTE.js objects and makes sure
	* no duplicate component / property is allowed.
	*/
	var Animation = class {
		/**
		* @constructor
		* @param {KUTE.fullComponent} Component
		*/
		constructor(Component) {
			try {
				if (Component.component in supportedProperties_default) throw Error(`KUTE - ${Component.component} already registered`);
				else if (Component.property in defaultValues_default) throw Error(`KUTE - ${Component.property} already registered`);
			} catch (e) {
				throw Error(e);
			}
			const ComponentName = Component.component;
			const Functions = {
				prepareProperty: prepareProperty_default,
				prepareStart: prepareStart_default,
				onStart: onStart_default,
				onComplete: onComplete_default,
				crossCheck: crossCheck_default
			};
			const Category = Component.category;
			const Property = Component.property;
			const Length = Component.properties && Component.properties.length || Component.subProperties && Component.subProperties.length;
			supportedProperties_default[ComponentName] = Component.properties || Component.subProperties || Component.property;
			if ("defaultValue" in Component) {
				defaultValues_default[Property] = Component.defaultValue;
				this.supports = `${Property} property`;
			} else if (Component.defaultValues) {
				Object.keys(Component.defaultValues).forEach((dv) => {
					defaultValues_default[dv] = Component.defaultValues[dv];
				});
				this.supports = `${Length || Property} ${Property || Category} properties`;
			}
			if (Component.defaultOptions) Object.assign(defaultOptions_default, Component.defaultOptions);
			if (Component.functions) Object.keys(Functions).forEach((fn) => {
				if (fn in Component.functions) if (typeof Component.functions[fn] === "function") {
					if (!Functions[fn][ComponentName]) Functions[fn][ComponentName] = {};
					if (!Functions[fn][ComponentName][Category || Property]) Functions[fn][ComponentName][Category || Property] = Component.functions[fn];
				} else Object.keys(Component.functions[fn]).forEach((ofn) => {
					if (!Functions[fn][ComponentName]) Functions[fn][ComponentName] = {};
					if (!Functions[fn][ComponentName][ofn]) Functions[fn][ComponentName][ofn] = Component.functions[fn][ofn];
				});
			});
			if (Component.Interpolate) {
				Object.keys(Component.Interpolate).forEach((fni) => {
					const compIntObj = Component.Interpolate[fni];
					if (typeof compIntObj === "function" && !interpolate_default[fni]) interpolate_default[fni] = compIntObj;
					else Object.keys(compIntObj).forEach((sfn) => {
						if (typeof compIntObj[sfn] === "function" && !interpolate_default[fni]) interpolate_default[fni] = compIntObj[sfn];
					});
				});
				linkProperty_default[ComponentName] = Component.Interpolate;
			}
			if (Component.Util) Object.keys(Component.Util).forEach((fnu) => {
				if (!util_default[fnu]) util_default[fnu] = Component.Util[fnu];
			});
			return this;
		}
	};

//#endregion
//#region src/animation/animationDevelopment.js
/**
	* Animation Development Class
	*
	* Registers components by populating KUTE.js objects and makes sure
	* no duplicate component / property is allowed.
	*
	* In addition to the default class, this one provides more component
	* information to help you with custom component development.
	*/
	var AnimationDevelopment = class extends Animation {
		/**
		* @param  {KUTE.fullComponent} args
		*/
		constructor(Component) {
			super(Component);
			const Functions = {
				prepareProperty: prepareProperty_default,
				prepareStart: prepareStart_default,
				onStart: onStart_default,
				onComplete: onComplete_default,
				crossCheck: crossCheck_default
			};
			const Category = Component.category;
			const Property = Component.property;
			const Length = Component.properties && Component.properties.length || Component.subProperties && Component.subProperties.length;
			if ("defaultValue" in Component) {
				this.supports = `${Property} property`;
				this.defaultValue = `${`${Component.defaultValue}`.length ? "YES" : "not set or incorrect"}`;
			} else if (Component.defaultValues) {
				this.supports = `${Length || Property} ${Property || Category} properties`;
				this.defaultValues = Object.keys(Component.defaultValues).length === Length ? "YES" : "Not set or incomplete";
			}
			if (Component.defaultOptions) {
				this.extends = [];
				Object.keys(Component.defaultOptions).forEach((op) => {
					this.extends.push(op);
				});
				if (this.extends.length) this.extends = `with <${this.extends.join(", ")}> new option(s)`;
				else delete this.extends;
			}
			if (Component.functions) {
				this.interface = [];
				this.render = [];
				this.warning = [];
				Object.keys(Functions).forEach((fnf) => {
					if (fnf in Component.functions) {
						if (fnf === "prepareProperty") this.interface.push("fromTo()");
						if (fnf === "prepareStart") this.interface.push("to()");
						if (fnf === "onStart") this.render = "can render update";
					} else {
						if (fnf === "prepareProperty") this.warning.push("fromTo()");
						if (fnf === "prepareStart") this.warning.push("to()");
						if (fnf === "onStart") this.render = "no function to render update";
					}
				});
				if (this.interface.length) this.interface = `${Category || Property} can use [${this.interface.join(", ")}] method(s)`;
				else delete this.uses;
				if (this.warning.length) this.warning = `${Category || Property} can't use [${this.warning.join(", ")}] method(s) because values aren't processed`;
				else delete this.warning;
			}
			if (Component.Interpolate) {
				this.uses = [];
				this.adds = [];
				Object.keys(Component.Interpolate).forEach((fni) => {
					const compIntObj = Component.Interpolate[fni];
					if (typeof compIntObj === "function") {
						if (!interpolate_default[fni]) this.adds.push(`${fni}`);
						this.uses.push(`${fni}`);
					} else Object.keys(compIntObj).forEach((sfn) => {
						if (typeof compIntObj[sfn] === "function" && !interpolate_default[fni]) this.adds.push(`${sfn}`);
						this.uses.push(`${sfn}`);
					});
				});
				if (this.uses.length) this.uses = `[${this.uses.join(", ")}] interpolation function(s)`;
				else delete this.uses;
				if (this.adds.length) this.adds = `new [${this.adds.join(", ")}] interpolation function(s)`;
				else delete this.adds;
			} else this.critical = `For ${Property || Category} no interpolation function[s] is set`;
			if (Component.Util) this.hasUtil = Object.keys(Component.Util).join(",");
			return this;
		}
	};

//#endregion
//#region src/interpolation/numbers.js
/**
	* Numbers Interpolation Function.
	*
	* @param {number} a start value
	* @param {number} b end value
	* @param {number} v progress
	* @returns {number} the interpolated number
	*/
	function numbers(a, b, v) {
		return +a + (b - a) * v;
	}

//#endregion
//#region src/util/trueDimension.js
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
	const trueDimension = (dimValue, isAngle) => {
		const intValue = parseInt(dimValue, 10) || 0;
		const mUnits = [
			"px",
			"%",
			"deg",
			"rad",
			"em",
			"rem",
			"vh",
			"vw"
		];
		let theUnit;
		for (let mIndex = 0; mIndex < mUnits.length; mIndex += 1) if (typeof dimValue === "string" && dimValue.includes(mUnits[mIndex])) {
			theUnit = mUnits[mIndex];
			break;
		}
		if (theUnit === void 0) theUnit = isAngle ? "deg" : "px";
		return {
			v: intValue,
			u: theUnit
		};
	};
	var trueDimension_default = trueDimension;

//#endregion
//#region src/components/backgroundPositionBase.js
/**
	* Sets the property update function.
	* @param {string} prop the property name
	*/
	function onStartBgPos(prop) {
		if (this.valuesEnd[prop] && !kute_default[prop]) kute_default[prop] = (elem, a, b, v) => {
			elem.style[prop] = `${(numbers(a[0], b[0], v) * 100 >> 0) / 100}%  ${(numbers(a[1], b[1], v) * 100 >> 0) / 100}%`;
		};
	}

//#endregion
//#region src/components/backgroundPosition.js
/**
	* Returns the property computed style.
	* @param {string} prop the property
	* @returns {string} the property computed style
	*/
	function getBgPos(prop) {
		return getStyleForProperty(this.element, prop) || defaultValues_default[prop];
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {number[]} the property tween object
	*/
	function prepareBgPos(_, value) {
		if (value instanceof Array) {
			const x = trueDimension_default(value[0]).v;
			const y = trueDimension_default(value[1]).v;
			return [!Number.isNaN(x * 1) ? x : 50, !Number.isNaN(y * 1) ? y : 50];
		}
		let posxy = value.replace(/top|left/g, 0).replace(/right|bottom/g, 100).replace(/center|middle/g, 50);
		posxy = posxy.split(/(,|\s)/g);
		posxy = posxy.length === 2 ? posxy : [posxy[0], 50];
		return [trueDimension_default(posxy[0]).v, trueDimension_default(posxy[1]).v];
	}
	const BackgroundPosition = {
		component: "backgroundPositionProp",
		property: "backgroundPosition",
		defaultValue: [50, 50],
		Interpolate: { numbers },
		functions: {
			prepareStart: getBgPos,
			prepareProperty: prepareBgPos,
			onStart: onStartBgPos
		},
		Util: { trueDimension: trueDimension_default }
	};
	var backgroundPosition_default = BackgroundPosition;

//#endregion
//#region src/interpolation/units.js
/**
	* Units Interpolation Function.
	*
	* @param {number} a start value
	* @param {number} b end value
	* @param {string} u unit
	* @param {number} v progress
	* @returns {string} the interpolated value + unit string
	*/
	function units(a, b, u, v) {
		return +a + (b - a) * v + u;
	}

//#endregion
//#region src/components/borderRadiusBase.js
	const radiusProps$1 = [
		"borderRadius",
		"borderTopLeftRadius",
		"borderTopRightRadius",
		"borderBottomLeftRadius",
		"borderBottomRightRadius"
	];
	/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function radiusOnStartFn(tweenProp) {
		if (tweenProp in this.valuesEnd && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			elem.style[tweenProp] = units(a.v, b.v, b.u, v);
		};
	}
	const radiusOnStart$1 = {};
	radiusProps$1.forEach((tweenProp) => {
		radiusOnStart$1[tweenProp] = radiusOnStartFn;
	});

//#endregion
//#region src/components/borderRadius.js
	const radiusProps = [
		"borderRadius",
		"borderTopLeftRadius",
		"borderTopRightRadius",
		"borderBottomLeftRadius",
		"borderBottomRightRadius"
	];
	const radiusValues = {};
	radiusProps.forEach((x) => {
		radiusValues[x] = 0;
	});
	const radiusOnStart = {};
	radiusProps.forEach((tweenProp) => {
		radiusOnStart[tweenProp] = radiusOnStartFn;
	});
	/**
	* Returns the current property computed style.
	* @param {string} tweenProp the property name
	* @returns {string} the property computed style
	*/
	function getRadius(tweenProp) {
		return getStyleForProperty(this.element, tweenProp) || defaultValues_default[tweenProp];
	}
	/**
	* Returns the property tween object.
	* @param {string} value the property value
	* @returns {{v: number, u: string}} the property tween object
	*/
	function prepareRadius(_, value) {
		return trueDimension_default(value);
	}
	const radiusFunctions = {
		prepareStart: getRadius,
		prepareProperty: prepareRadius,
		onStart: radiusOnStart
	};
	const BorderRadius = {
		component: "borderRadiusProperties",
		category: "borderRadius",
		properties: radiusProps,
		defaultValues: radiusValues,
		Interpolate: { units },
		functions: radiusFunctions,
		Util: { trueDimension: trueDimension_default }
	};
	var borderRadius_default = BorderRadius;

//#endregion
//#region src/components/boxModelBase.js
/**
	* Sets the update function for the property.
	* @param {string} tweenProp the property name
	*/
	function boxModelOnStart(tweenProp) {
		if (tweenProp in this.valuesEnd && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			elem.style[tweenProp] = `${v > .99 || v < .01 ? (numbers(a, b, v) * 10 >> 0) / 10 : numbers(a, b, v) >> 0}px`;
		};
	}
	const baseBoxProps = [
		"top",
		"left",
		"width",
		"height"
	];
	const baseBoxOnStart = {};
	baseBoxProps.forEach((x) => {
		baseBoxOnStart[x] = boxModelOnStart;
	});

//#endregion
//#region src/components/boxModel.js
	const boxModelProperties = [
		"top",
		"left",
		"width",
		"height",
		"right",
		"bottom",
		"minWidth",
		"minHeight",
		"maxWidth",
		"maxHeight",
		"padding",
		"paddingTop",
		"paddingBottom",
		"paddingLeft",
		"paddingRight",
		"margin",
		"marginTop",
		"marginBottom",
		"marginLeft",
		"marginRight",
		"borderWidth",
		"borderTopWidth",
		"borderRightWidth",
		"borderBottomWidth",
		"borderLeftWidth",
		"outlineWidth"
	];
	const boxModelValues = {};
	boxModelProperties.forEach((x) => {
		boxModelValues[x] = 0;
	});
	/**
	* Returns the current property computed style.
	* @param {string} tweenProp the property name
	* @returns {string} computed style for property
	*/
	function getBoxModel(tweenProp) {
		return getStyleForProperty(this.element, tweenProp) || defaultValues_default[tweenProp];
	}
	/**
	* Returns the property tween object.
	* @param {string} tweenProp the property name
	* @param {string} value the property value
	* @returns {number} the property tween object
	*/
	function prepareBoxModel(tweenProp, value) {
		const boxValue = trueDimension_default(value);
		const offsetProp = tweenProp === "height" ? "offsetHeight" : "offsetWidth";
		return boxValue.u === "%" ? boxValue.v * this.element[offsetProp] / 100 : boxValue.v;
	}
	const boxPropsOnStart = {};
	boxModelProperties.forEach((x) => {
		boxPropsOnStart[x] = boxModelOnStart;
	});
	const BoxModel = {
		component: "boxModelProperties",
		category: "boxModel",
		properties: boxModelProperties,
		defaultValues: boxModelValues,
		Interpolate: { numbers },
		functions: {
			prepareStart: getBoxModel,
			prepareProperty: prepareBoxModel,
			onStart: boxPropsOnStart
		}
	};
	var boxModel_default = BoxModel;

//#endregion
//#region src/components/clipPropertyBase.js
/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartClip(tweenProp) {
		if (this.valuesEnd[tweenProp] && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			let h = 0;
			const cl = [];
			for (; h < 4; h += 1) {
				const c1 = a[h].v;
				const c2 = b[h].v;
				const cu = b[h].u || "px";
				cl[h] = (numbers(c1, c2, v) * 100 >> 0) / 100 + cu;
			}
			elem.style.clip = `rect(${cl})`;
		};
	}

//#endregion
//#region src/components/clipProperty.js
/**
	* Returns the current property computed style.
	* @param {string} tweenProp the property name
	* @returns {string | number[]} computed style for property
	*/
	function getClip(tweenProp) {
		const { element } = this;
		const currentClip = getStyleForProperty(element, tweenProp);
		const width = getStyleForProperty(element, "width");
		const height = getStyleForProperty(element, "height");
		return !/rect/.test(currentClip) ? [
			0,
			width,
			height,
			0
		] : currentClip;
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {number[]} the property tween object
	*/
	function prepareClip(_, value) {
		if (value instanceof Array) return value.map((x) => trueDimension_default(x));
		let clipValue = value.replace(/rect|\(|\)/g, "");
		clipValue = /,/g.test(clipValue) ? clipValue.split(",") : clipValue.split(/\s/);
		return clipValue.map((x) => trueDimension_default(x));
	}
	const ClipProperty = {
		component: "clipProperty",
		property: "clip",
		defaultValue: [
			0,
			0,
			0,
			0
		],
		Interpolate: { numbers },
		functions: {
			prepareStart: getClip,
			prepareProperty: prepareClip,
			onStart: onStartClip
		},
		Util: { trueDimension: trueDimension_default }
	};
	var clipProperty_default = ClipProperty;

//#endregion
//#region src/util/hexToRGB.js
/**
	* hexToRGB
	*
	* Converts a #HEX color format into RGB
	* and returns a color object {r,g,b}.
	*
	* @param {string} hex the degree angle
	* @returns {KUTE.colorObject | null} the radian angle
	*/
	const hexToRGB = (hex) => {
		const HEX = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(HEX);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};
	var hexToRGB_default = hexToRGB;

//#endregion
//#region src/util/trueColor.js
/**
	* trueColor
	*
	* Transform any color to rgba()/rgb() and return a nice RGB(a) object.
	*
	* @param {string} colorString the color input
	* @returns {KUTE.colorObject} the {r,g,b,a} color object
	*/
	const trueColor = (colorString) => {
		let result;
		if (/rgb|rgba/.test(colorString)) {
			const vrgb = colorString.replace(/\s|\)/, "").split("(")[1].split(",");
			const colorAlpha = vrgb[3] ? vrgb[3] : null;
			if (!colorAlpha) result = {
				r: parseInt(vrgb[0], 10),
				g: parseInt(vrgb[1], 10),
				b: parseInt(vrgb[2], 10)
			};
			else result = {
				r: parseInt(vrgb[0], 10),
				g: parseInt(vrgb[1], 10),
				b: parseInt(vrgb[2], 10),
				a: parseFloat(colorAlpha)
			};
		}
		if (/^#/.test(colorString)) {
			const fromHex = hexToRGB_default(colorString);
			result = {
				r: fromHex.r,
				g: fromHex.g,
				b: fromHex.b
			};
		}
		if (/transparent|none|initial|inherit/.test(colorString)) result = {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		};
		if (!/^#|^rgb/.test(colorString)) {
			const siteHead = document.getElementsByTagName("head")[0];
			siteHead.style.color = colorString;
			let webColor = getComputedStyle(siteHead, null).color;
			webColor = /rgb/.test(webColor) ? webColor.replace(/[^\d,]/g, "").split(",") : [
				0,
				0,
				0
			];
			siteHead.style.color = "";
			result = {
				r: parseInt(webColor[0], 10),
				g: parseInt(webColor[1], 10),
				b: parseInt(webColor[2], 10)
			};
		}
		return result;
	};
	var trueColor_default = trueColor;

//#endregion
//#region src/interpolation/colors.js
/**
	* Color Interpolation Function.
	*
	* @param {KUTE.colorObject} a start color
	* @param {KUTE.colorObject} b end color
	* @param {number} v progress
	* @returns {string} the resulting color
	*/
	function colors(a, b, v) {
		const _c = {};
		const ep = ")";
		const cm = ",";
		const rgb = "rgb(";
		const rgba = "rgba(";
		Object.keys(b).forEach((c) => {
			if (c !== "a") _c[c] = numbers(a[c], b[c], v) >> 0 || 0;
			else if (a[c] && b[c]) _c[c] = (numbers(a[c], b[c], v) * 100 >> 0) / 100;
		});
		return !_c.a ? rgb + _c.r + cm + _c.g + cm + _c.b + ep : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
	}

//#endregion
//#region src/components/colorPropertiesBase.js
	const supportedColors$1 = [
		"color",
		"backgroundColor",
		"outlineColor",
		"borderColor",
		"borderTopColor",
		"borderRightColor",
		"borderBottomColor",
		"borderLeftColor"
	];
	/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartColors(tweenProp) {
		if (this.valuesEnd[tweenProp] && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			elem.style[tweenProp] = colors(a, b, v);
		};
	}
	const colorsOnStart$1 = {};
	supportedColors$1.forEach((x) => {
		colorsOnStart$1[x] = onStartColors;
	});

//#endregion
//#region src/components/colorProperties.js
	const supportedColors = [
		"color",
		"backgroundColor",
		"outlineColor",
		"borderColor",
		"borderTopColor",
		"borderRightColor",
		"borderBottomColor",
		"borderLeftColor"
	];
	const defaultColors = {};
	supportedColors.forEach((tweenProp) => {
		defaultColors[tweenProp] = "#000";
	});
	const colorsOnStart = {};
	supportedColors.forEach((x) => {
		colorsOnStart[x] = onStartColors;
	});
	/**
	* Returns the current property computed style.
	* @param {string} prop the property name
	* @returns {string} property computed style
	*/
	function getColor(prop) {
		return getStyleForProperty(this.element, prop) || defaultValues_default[prop];
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {KUTE.colorObject} the property tween object
	*/
	function prepareColor(_, value) {
		return trueColor_default(value);
	}
	const colorProperties = {
		component: "colorProperties",
		category: "colors",
		properties: supportedColors,
		defaultValues: defaultColors,
		Interpolate: {
			numbers,
			colors
		},
		functions: {
			prepareStart: getColor,
			prepareProperty: prepareColor,
			onStart: colorsOnStart
		},
		Util: { trueColor: trueColor_default }
	};
	var colorProperties_default = colorProperties;

//#endregion
//#region src/components/filterEffectsBase.js
/**
	* Sets the `drop-shadow` sub-property update function.
	* * disimbiguation `dropshadow` interpolation function and `dropShadow` property
	* @param {string} tweenProp the property name
	*/
	function dropshadow(a, b, v) {
		const params = [];
		const unit = "px";
		for (let i = 0; i < 3; i += 1) params[i] = (numbers(a[i], b[i], v) * 100 >> 0) / 100 + unit;
		return `drop-shadow(${params.concat(colors(a[3], b[3], v)).join(" ")})`;
	}
	/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartFilter(tweenProp) {
		if (this.valuesEnd[tweenProp] && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			elem.style[tweenProp] = (b.url ? `url(${b.url})` : "") + (a.opacity || b.opacity ? `opacity(${(numbers(a.opacity, b.opacity, v) * 100 >> 0) / 100}%)` : "") + (a.blur || b.blur ? `blur(${(numbers(a.blur, b.blur, v) * 100 >> 0) / 100}em)` : "") + (a.saturate || b.saturate ? `saturate(${(numbers(a.saturate, b.saturate, v) * 100 >> 0) / 100}%)` : "") + (a.invert || b.invert ? `invert(${(numbers(a.invert, b.invert, v) * 100 >> 0) / 100}%)` : "") + (a.grayscale || b.grayscale ? `grayscale(${(numbers(a.grayscale, b.grayscale, v) * 100 >> 0) / 100}%)` : "") + (a.hueRotate || b.hueRotate ? `hue-rotate(${(numbers(a.hueRotate, b.hueRotate, v) * 100 >> 0) / 100}deg)` : "") + (a.sepia || b.sepia ? `sepia(${(numbers(a.sepia, b.sepia, v) * 100 >> 0) / 100}%)` : "") + (a.brightness || b.brightness ? `brightness(${(numbers(a.brightness, b.brightness, v) * 100 >> 0) / 100}%)` : "") + (a.contrast || b.contrast ? `contrast(${(numbers(a.contrast, b.contrast, v) * 100 >> 0) / 100}%)` : "") + (a.dropShadow || b.dropShadow ? dropshadow(a.dropShadow, b.dropShadow, v) : "");
		};
	}

//#endregion
//#region src/components/filterEffects.js
/**
	* Returns camelCase filter sub-property.
	* @param {string} str source string
	* @returns {string} camelCase property name
	*/
	function replaceDashNamespace(str) {
		return str.replace("-r", "R").replace("-s", "S");
	}
	/**
	* Returns `drop-shadow` sub-property object.
	* @param {(string | number)[]} shadow and `Array` with `drop-shadow` parameters
	* @returns {KUTE.filterList['dropShadow']} the expected `drop-shadow` values
	*/
	function parseDropShadow(shadow) {
		let newShadow;
		if (shadow.length === 3) newShadow = [
			shadow[0],
			shadow[1],
			0,
			shadow[2]
		];
		else if (shadow.length === 4) newShadow = [
			shadow[0],
			shadow[1],
			shadow[2],
			shadow[3]
		];
		for (let i = 0; i < 3; i += 1) newShadow[i] = parseFloat(newShadow[i]);
		newShadow[3] = trueColor_default(newShadow[3]);
		return newShadow;
	}
	/**
	* Returns an array with current filter sub-properties values.
	* @param {string} currentStyle the current filter computed style
	* @returns {{[x: string]: number}} the filter tuple
	*/
	function parseFilterString(currentStyle) {
		const result = {};
		const matches = currentStyle.match(/(([a-z].*?)\(.*?\))(?=\s([a-z].*?)\(.*?\)|\s*$)/g);
		const fnArray = currentStyle !== "none" ? matches : "none";
		if (fnArray instanceof Array) for (let j = 0, jl = fnArray.length; j < jl; j += 1) {
			const p = fnArray[j].trim().split(/\((.+)/);
			const pp = replaceDashNamespace(p[0]);
			if (pp === "dropShadow") {
				const shadowColor = p[1].match(/(([a-z].*?)\(.*?\))(?=\s(.*?))/)[0];
				result[pp] = p[1].replace(shadowColor, "").split(/\s/).map(parseFloat).filter((el) => !Number.isNaN(el)).concat(shadowColor);
			} else result[pp] = p[1].replace(/'|"|\)/g, "");
		}
		return result;
	}
	/**
	* Returns the current property computed style.
	* @param {string} tweenProp the property name
	* @param {string} value the property value
	* @returns {string} computed style for property
	*/
	function getFilter(tweenProp, value) {
		const filterObject = parseFilterString(getStyleForProperty(this.element, tweenProp));
		let fnp;
		Object.keys(value).forEach((fn) => {
			fnp = replaceDashNamespace(fn);
			if (!filterObject[fnp]) filterObject[fnp] = defaultValues_default[tweenProp][fn];
		});
		return filterObject;
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property name
	* @returns {KUTE.filterList} the property tween object
	*/
	function prepareFilter(_, value) {
		const filterObject = {};
		let fnp;
		Object.keys(value).forEach((fn) => {
			fnp = replaceDashNamespace(fn);
			if (/hue/.test(fn)) filterObject[fnp] = parseFloat(value[fn]);
			else if (/drop/.test(fn)) filterObject[fnp] = parseDropShadow(value[fn]);
			else if (fn === "url") filterObject[fn] = value[fn];
			else filterObject[fn] = parseFloat(value[fn]);
		});
		return filterObject;
	}
	/**
	* Adds missing sub-properties in `valuesEnd` from `valuesStart`.
	* @param {string} tweenProp the property name
	*/
	function crossCheckFilter(tweenProp) {
		if (this.valuesEnd[tweenProp]) Object.keys(this.valuesStart[tweenProp]).forEach((fn) => {
			if (!this.valuesEnd[tweenProp][fn]) this.valuesEnd[tweenProp][fn] = this.valuesStart[tweenProp][fn];
		});
	}
	const filterEffects = {
		component: "filterEffects",
		property: "filter",
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
			dropShadow: [
				0,
				0,
				0,
				{
					r: 0,
					g: 0,
					b: 0
				}
			],
			url: ""
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
			dropShadow: {
				numbers,
				colors,
				dropshadow
			}
		},
		functions: {
			prepareStart: getFilter,
			prepareProperty: prepareFilter,
			onStart: onStartFilter,
			crossCheck: crossCheckFilter
		},
		Util: {
			parseDropShadow,
			parseFilterString,
			replaceDashNamespace,
			trueColor: trueColor_default
		}
	};
	var filterEffects_default = filterEffects;

//#endregion
//#region src/components/htmlAttributesBase.js
	const attributes = {};
	const onStartAttr = {
		attr(tweenProp) {
			if (!kute_default[tweenProp] && this.valuesEnd[tweenProp]) kute_default[tweenProp] = (elem, vS, vE, v) => {
				Object.keys(vE).forEach((oneAttr) => {
					kute_default.attributes[oneAttr](elem, oneAttr, vS[oneAttr], vE[oneAttr], v);
				});
			};
		},
		attributes(tweenProp) {
			if (!kute_default[tweenProp] && this.valuesEnd.attr) kute_default[tweenProp] = attributes;
		}
	};

//#endregion
//#region src/components/htmlAttributes.js
	const ComponentName = "htmlAttributes";
	const svgColors = [
		"fill",
		"stroke",
		"stop-color"
	];
	/**
	* Returns non-camelcase property name.
	* @param {string} a the camelcase property name
	* @returns {string} the non-camelcase property name
	*/
	function replaceUppercase(a) {
		return a.replace(/[A-Z]/g, "-$&").toLowerCase();
	}
	/**
	* Returns the current attribute value.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {{[x:string]: string}} attribute value
	*/
	function getAttr(_, value) {
		const attrStartValues = {};
		Object.keys(value).forEach((attr) => {
			const attribute = replaceUppercase(attr).replace(/_+[a-z]+/, "");
			const currentValue = this.element.getAttribute(attribute);
			attrStartValues[attribute] = svgColors.includes(attribute) ? currentValue || "rgba(0,0,0,0)" : currentValue || (/opacity/i.test(attr) ? 1 : 0);
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
		const attributesObject = {};
		Object.keys(attrObj).forEach((p) => {
			const prop = replaceUppercase(p);
			const regex = /(%|[a-z]+)$/;
			const currentValue = this.element.getAttribute(prop.replace(/_+[a-z]+/, ""));
			if (!svgColors.includes(prop)) {
				if (currentValue !== null && regex.test(currentValue)) {
					const unit = trueDimension_default(currentValue).u || trueDimension_default(attrObj[p]).u;
					const suffix = /%/.test(unit) ? "_percent" : `_${unit}`;
					onStart_default[ComponentName][prop + suffix] = (tp) => {
						if (this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes)) attributes[tp] = (elem, oneAttr, a, b, v) => {
							const _p = oneAttr.replace(suffix, "");
							elem.setAttribute(_p, (numbers(a.v, b.v, v) * 1e3 >> 0) / 1e3 + b.u);
						};
					};
					attributesObject[prop + suffix] = trueDimension_default(attrObj[p]);
				} else if (!regex.test(attrObj[p]) || currentValue === null || currentValue && !regex.test(currentValue)) {
					onStart_default[ComponentName][prop] = (tp) => {
						if (this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes)) attributes[tp] = (elem, oneAttr, a, b, v) => {
							elem.setAttribute(oneAttr, (numbers(a, b, v) * 1e3 >> 0) / 1e3);
						};
					};
					attributesObject[prop] = parseFloat(attrObj[p]);
				}
			} else {
				onStart_default[ComponentName][prop] = (tp) => {
					if (this.valuesEnd[tweenProp] && this.valuesEnd[tweenProp][tp] && !(tp in attributes)) attributes[tp] = (elem, oneAttr, a, b, v) => {
						elem.setAttribute(oneAttr, colors(a, b, v));
					};
				};
				attributesObject[prop] = trueColor_default(attrObj[p]) || defaultValues_default.htmlAttributes[p];
			}
		});
		return attributesObject;
	}
	const attrFunctions = {
		prepareStart: getAttr,
		prepareProperty: prepareAttr,
		onStart: onStartAttr
	};
	const htmlAttributes = {
		component: ComponentName,
		property: "attr",
		subProperties: [
			"fill",
			"stroke",
			"stop-color",
			"fill-opacity",
			"stroke-opacity"
		],
		defaultValue: {
			fill: "rgb(0,0,0)",
			stroke: "rgb(0,0,0)",
			"stop-color": "rgb(0,0,0)",
			opacity: 1,
			"stroke-opacity": 1,
			"fill-opacity": 1
		},
		Interpolate: {
			numbers,
			colors
		},
		functions: attrFunctions,
		Util: {
			replaceUppercase,
			trueColor: trueColor_default,
			trueDimension: trueDimension_default
		}
	};
	var htmlAttributes_default = htmlAttributes;

//#endregion
//#region src/components/opacityPropertyBase.js
/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartOpacity(tweenProp) {
		if (tweenProp in this.valuesEnd && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			elem.style[tweenProp] = (numbers(a, b, v) * 1e3 >> 0) / 1e3;
		};
	}

//#endregion
//#region src/components/opacityProperty.js
/**
	* Returns the current property computed style.
	* @param {string} tweenProp the property name
	* @returns {string} computed style for property
	*/
	function getOpacity(tweenProp) {
		return getStyleForProperty(this.element, tweenProp);
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {number} the property tween object
	*/
	function prepareOpacity(_, value) {
		return parseFloat(value);
	}
	const OpacityProperty = {
		component: "opacityProperty",
		property: "opacity",
		defaultValue: 1,
		Interpolate: { numbers },
		functions: {
			prepareStart: getOpacity,
			prepareProperty: prepareOpacity,
			onStart: onStartOpacity
		}
	};
	var opacityProperty_default = OpacityProperty;

//#endregion
//#region src/components/svgDrawBase.js
/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartDraw(tweenProp) {
		if (tweenProp in this.valuesEnd && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			const pathLength = (a.l * 100 >> 0) / 100;
			const start = (numbers(a.s, b.s, v) * 100 >> 0) / 100;
			const end = (numbers(a.e, b.e, v) * 100 >> 0) / 100;
			const offset = 0 - start;
			const dashOne = end + offset;
			elem.style.strokeDashoffset = `${offset}px`;
			elem.style.strokeDasharray = `${((dashOne < 1 ? 0 : dashOne) * 100 >> 0) / 100}px, ${pathLength}px`;
		};
	}

//#endregion
//#region src/components/svgDraw.js
/**
	* Convert a `<path>` length percent value to absolute.
	* @param {string} v raw value
	* @param {number} l length value
	* @returns {number} the absolute value
	*/
	function percent(v, l) {
		return parseFloat(v) / 100 * l;
	}
	/**
	* Returns the `<rect>` length.
	* It doesn't compute `rx` and / or `ry` of the element.
	* @see http://stackoverflow.com/a/30376660
	* @param {SVGRectElement} el target element
	* @returns {number} the `<rect>` length
	*/
	function getRectLength(el) {
		const w = el.getAttribute("width");
		const h = el.getAttribute("height");
		return w * 2 + h * 2;
	}
	/**
	* Returns the `<polyline>` / `<polygon>` length.
	* @param {SVGPolylineElement | SVGPolygonElement} el target element
	* @returns {number} the element length
	*/
	function getPolyLength(el) {
		const points = el.getAttribute("points").split(" ");
		let len = 0;
		if (points.length > 1) {
			const coord = (p) => {
				const c = p.split(",");
				if (c.length !== 2) return 0;
				if (Number.isNaN(c[0] * 1) || Number.isNaN(c[1] * 1)) return 0;
				return [parseFloat(c[0]), parseFloat(c[1])];
			};
			const dist = (c1, c2) => {
				if (c1 !== void 0 && c2 !== void 0) return Math.sqrt((c2[0] - c1[0]) ** 2 + (c2[1] - c1[1]) ** 2);
				return 0;
			};
			if (points.length > 2) for (let i = 0; i < points.length - 1; i += 1) len += dist(coord(points[i]), coord(points[i + 1]));
			len += el.tagName === "polygon" ? dist(coord(points[0]), coord(points[points.length - 1])) : 0;
		}
		return len;
	}
	/**
	* Returns the `<line>` length.
	* @param {SVGLineElement} el target element
	* @returns {number} the element length
	*/
	function getLineLength(el) {
		const x1 = el.getAttribute("x1");
		const x2 = el.getAttribute("x2");
		const y1 = el.getAttribute("y1");
		const y2 = el.getAttribute("y2");
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}
	/**
	* Returns the `<circle>` length.
	* @param {SVGCircleElement} el target element
	* @returns {number} the element length
	*/
	function getCircleLength(el) {
		const r = el.getAttribute("r");
		return 2 * Math.PI * r;
	}
	/**
	* Returns the `<ellipse>` length.
	* @param {SVGEllipseElement} el target element
	* @returns {number} the element length
	*/
	function getEllipseLength(el) {
		const rx = el.getAttribute("rx");
		const ry = el.getAttribute("ry");
		const len = 2 * rx;
		const wid = 2 * ry;
		return Math.sqrt(.5 * (len * len + wid * wid)) * (Math.PI * 2) / 2;
	}
	/**
	* Returns the shape length.
	* @param {SVGPathCommander.shapeTypes} el target element
	* @returns {number} the element length
	*/
	function getTotalLength(el) {
		if (el.tagName === "rect") return getRectLength(el);
		if (el.tagName === "circle") return getCircleLength(el);
		if (el.tagName === "ellipse") return getEllipseLength(el);
		if (["polygon", "polyline"].includes(el.tagName)) return getPolyLength(el);
		if (el.tagName === "line") return getLineLength(el);
		return 0;
	}
	/**
	* Returns the property tween object.
	* @param {SVGPathCommander.shapeTypes} element the target element
	* @param {string | KUTE.drawObject} value the property value
	* @returns {KUTE.drawObject} the property tween object
	*/
	function getDraw(element, value) {
		const length = /path|glyph/.test(element.tagName) ? element.getTotalLength() : getTotalLength(element);
		let start;
		let end;
		let dasharray;
		let offset;
		if (value instanceof Object && Object.keys(value).every((v) => [
			"s",
			"e",
			"l"
		].includes(v))) return value;
		if (typeof value === "string") {
			const v = value.split(/,|\s/);
			start = /%/.test(v[0]) ? percent(v[0].trim(), length) : parseFloat(v[0]);
			end = /%/.test(v[1]) ? percent(v[1].trim(), length) : parseFloat(v[1]);
		} else if (typeof value === "undefined") {
			offset = parseFloat(getStyleForProperty(element, "stroke-dashoffset"));
			dasharray = getStyleForProperty(element, "stroke-dasharray").split(",");
			start = 0 - offset;
			end = parseFloat(dasharray[0]) + start || length;
		}
		return {
			s: start,
			e: end,
			l: length
		};
	}
	/**
	* Reset CSS properties associated with the `draw` property.
	* @param {SVGPathCommander.shapeTypes} element target
	*/
	function resetDraw(elem) {
		elem.style.strokeDashoffset = "";
		elem.style.strokeDasharray = "";
	}
	/**
	* Returns the property tween object.
	* @returns {KUTE.drawObject} the property tween object
	*/
	function getDrawValue() {
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
	const SvgDrawProperty = {
		component: "svgDraw",
		property: "draw",
		defaultValue: "0% 0%",
		Interpolate: { numbers },
		functions: {
			prepareStart: getDrawValue,
			prepareProperty: prepareDraw,
			onStart: onStartDraw
		},
		Util: {
			getRectLength,
			getPolyLength,
			getLineLength,
			getCircleLength,
			getEllipseLength,
			getTotalLength,
			resetDraw,
			getDraw,
			percent
		}
	};
	var svgDraw_default = SvgDrawProperty;

//#endregion
//#region node_modules/.pnpm/@thednp+dommatrix@2.0.12/node_modules/@thednp/dommatrix/dist/dommatrix.mjs
	var Z$2 = Object.defineProperty;
	var z$1 = (s, t, e) => t in s ? Z$2(s, t, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: e
	}) : s[t] = e;
	var p = (s, t, e) => z$1(s, typeof t != "symbol" ? t + "" : t, e);
	const $$1 = {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		e: 0,
		f: 0,
		m11: 1,
		m12: 0,
		m13: 0,
		m14: 0,
		m21: 0,
		m22: 1,
		m23: 0,
		m24: 0,
		m31: 0,
		m32: 0,
		m33: 1,
		m34: 0,
		m41: 0,
		m42: 0,
		m43: 0,
		m44: 1,
		is2D: !0,
		isIdentity: !0
	}, E$2 = (s) => (s instanceof Float64Array || s instanceof Float32Array || Array.isArray(s) && s.every((t) => typeof t == "number")) && [6, 16].some((t) => s.length === t), P$1 = (s) => s instanceof DOMMatrix || s instanceof y || typeof s == "object" && Object.keys($$1).every((t) => s && t in s), g = (s) => {
		const t = new y(), e = Array.from(s);
		if (!E$2(e)) throw TypeError(`CSSMatrix: "${e.join(",")}" must be an array with 6/16 numbers.`);
		// istanbul ignore else @preserve
		if (e.length === 16) {
			const [n, i, r, a, l, m, h, c, u, f, w, o, d, A, M, b] = e;
			t.m11 = n, t.a = n, t.m21 = l, t.c = l, t.m31 = u, t.m41 = d, t.e = d, t.m12 = i, t.b = i, t.m22 = m, t.d = m, t.m32 = f, t.m42 = A, t.f = A, t.m13 = r, t.m23 = h, t.m33 = w, t.m43 = M, t.m14 = a, t.m24 = c, t.m34 = o, t.m44 = b;
		} else if (e.length === 6) {
			const [n, i, r, a, l, m] = e;
			t.m11 = n, t.a = n, t.m12 = i, t.b = i, t.m21 = r, t.c = r, t.m22 = a, t.d = a, t.m41 = l, t.e = l, t.m42 = m, t.f = m;
		}
		return t;
	}, X$2 = (s) => {
		if (P$1(s)) return g([
			s.m11,
			s.m12,
			s.m13,
			s.m14,
			s.m21,
			s.m22,
			s.m23,
			s.m24,
			s.m31,
			s.m32,
			s.m33,
			s.m34,
			s.m41,
			s.m42,
			s.m43,
			s.m44
		]);
		throw TypeError(`CSSMatrix: "${JSON.stringify(s)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
	}, O$2 = (s) => {
		if (typeof s != "string") throw TypeError(`CSSMatrix: "${JSON.stringify(s)}" is not a string.`);
		const t = String(s).replace(/\s/g, "");
		let e = new y();
		const n = `CSSMatrix: invalid transform string "${s}"`;
		return t.split(")").filter((i) => i).forEach((i) => {
			const [r, a] = i.split("(");
			if (!a) throw TypeError(n);
			const l = a.split(",").map((o) => o.includes("rad") ? parseFloat(o) * (180 / Math.PI) : parseFloat(o)), [m, h, c, u] = l, f = [
				m,
				h,
				c
			], w = [
				m,
				h,
				c,
				u
			];
			if (r === "perspective" && m && [h, c].every((o) => o === void 0)) e.m34 = -1 / m;
			else if (r.includes("matrix") && [6, 16].includes(l.length) && l.every((o) => !Number.isNaN(+o))) {
				const o = l.map((d) => Math.abs(d) < 1e-6 ? 0 : d);
				e = e.multiply(g(o));
			} else if (r === "translate3d" && f.every((o) => !Number.isNaN(+o))) e = e.translate(m, h, c);
			else if (r === "translate" && m && c === void 0) e = e.translate(m, h || 0, 0);
			else if (r === "rotate3d" && w.every((o) => !Number.isNaN(+o)) && u) e = e.rotateAxisAngle(m, h, c, u);
			else if (r === "rotate" && m && [h, c].every((o) => o === void 0)) e = e.rotate(0, 0, m);
			else if (r === "scale3d" && f.every((o) => !Number.isNaN(+o)) && f.some((o) => o !== 1)) e = e.scale(m, h, c);
			else if (r === "scale" && !Number.isNaN(m) && (m !== 1 || h !== 1) && c === void 0) {
				const d = Number.isNaN(+h) ? m : h;
				e = e.scale(m, d, 1);
			} else if (r === "skew" && (m || !Number.isNaN(m) && h) && c === void 0) e = e.skew(m, h || 0);
			else if ([
				"translate",
				"rotate",
				"scale",
				"skew"
			].some((o) => r.includes(o)) && /[XYZ]/.test(r) && m && [h, c].every((o) => o === void 0)) if (r === "skewX" || r === "skewY") e = e[r](m);
			else {
				const o = r.replace(/[XYZ]/, ""), d = r.replace(o, ""), A = [
					"X",
					"Y",
					"Z"
				].indexOf(d), M = o === "scale" ? 1 : 0, b = [
					A === 0 ? m : M,
					A === 1 ? m : M,
					A === 2 ? m : M
				];
				e = e[o](...b);
			}
			else throw TypeError(n);
		}), e;
	}, x = (s, t) => t ? [
		s.a,
		s.b,
		s.c,
		s.d,
		s.e,
		s.f
	] : [
		s.m11,
		s.m12,
		s.m13,
		s.m14,
		s.m21,
		s.m22,
		s.m23,
		s.m24,
		s.m31,
		s.m32,
		s.m33,
		s.m34,
		s.m41,
		s.m42,
		s.m43,
		s.m44
	], Y$1 = (s, t, e) => {
		const n = new y();
		return n.m41 = s, n.e = s, n.m42 = t, n.f = t, n.m43 = e, n;
	}, F$2 = (s, t, e) => {
		const n = new y(), i = Math.PI / 180, r = s * i, a = t * i, l = e * i, m = Math.cos(r), h = -Math.sin(r), c = Math.cos(a), u = -Math.sin(a), f = Math.cos(l), w = -Math.sin(l), o = c * f, d = -c * w;
		n.m11 = o, n.a = o, n.m12 = d, n.b = d, n.m13 = u;
		const A = h * u * f + m * w;
		n.m21 = A, n.c = A;
		const M = m * f - h * u * w;
		return n.m22 = M, n.d = M, n.m23 = -h * c, n.m31 = h * w - m * u * f, n.m32 = h * f + m * u * w, n.m33 = m * c, n;
	}, T$2 = (s, t, e, n) => {
		const i = new y(), r = Math.sqrt(s * s + t * t + e * e);
		if (r === 0) return i;
		const a = s / r, l = t / r, m = e / r, h = n * (Math.PI / 360), c = Math.sin(h), u = Math.cos(h), f = c * c, w = a * a, o = l * l, d = m * m, A = 1 - 2 * (o + d) * f;
		i.m11 = A, i.a = A;
		const M = 2 * (a * l * f + m * c * u);
		i.m12 = M, i.b = M, i.m13 = 2 * (a * m * f - l * c * u);
		const b = 2 * (l * a * f - m * c * u);
		i.m21 = b, i.c = b;
		const k = 1 - 2 * (d + w) * f;
		return i.m22 = k, i.d = k, i.m23 = 2 * (l * m * f + a * c * u), i.m31 = 2 * (m * a * f + l * c * u), i.m32 = 2 * (m * l * f - a * c * u), i.m33 = 1 - 2 * (w + o) * f, i;
	}, I = (s, t, e) => {
		const n = new y();
		return n.m11 = s, n.a = s, n.m22 = t, n.d = t, n.m33 = e, n;
	}, v$1 = (s, t) => {
		const e = new y();
		if (s) {
			const n = s * Math.PI / 180, i = Math.tan(n);
			e.m21 = i, e.c = i;
		}
		if (t) {
			const n = t * Math.PI / 180, i = Math.tan(n);
			e.m12 = i, e.b = i;
		}
		return e;
	}, R$2 = (s) => v$1(s, 0), D = (s) => v$1(0, s), N$1 = (s, t) => {
		return g([
			t.m11 * s.m11 + t.m12 * s.m21 + t.m13 * s.m31 + t.m14 * s.m41,
			t.m11 * s.m12 + t.m12 * s.m22 + t.m13 * s.m32 + t.m14 * s.m42,
			t.m11 * s.m13 + t.m12 * s.m23 + t.m13 * s.m33 + t.m14 * s.m43,
			t.m11 * s.m14 + t.m12 * s.m24 + t.m13 * s.m34 + t.m14 * s.m44,
			t.m21 * s.m11 + t.m22 * s.m21 + t.m23 * s.m31 + t.m24 * s.m41,
			t.m21 * s.m12 + t.m22 * s.m22 + t.m23 * s.m32 + t.m24 * s.m42,
			t.m21 * s.m13 + t.m22 * s.m23 + t.m23 * s.m33 + t.m24 * s.m43,
			t.m21 * s.m14 + t.m22 * s.m24 + t.m23 * s.m34 + t.m24 * s.m44,
			t.m31 * s.m11 + t.m32 * s.m21 + t.m33 * s.m31 + t.m34 * s.m41,
			t.m31 * s.m12 + t.m32 * s.m22 + t.m33 * s.m32 + t.m34 * s.m42,
			t.m31 * s.m13 + t.m32 * s.m23 + t.m33 * s.m33 + t.m34 * s.m43,
			t.m31 * s.m14 + t.m32 * s.m24 + t.m33 * s.m34 + t.m34 * s.m44,
			t.m41 * s.m11 + t.m42 * s.m21 + t.m43 * s.m31 + t.m44 * s.m41,
			t.m41 * s.m12 + t.m42 * s.m22 + t.m43 * s.m32 + t.m44 * s.m42,
			t.m41 * s.m13 + t.m42 * s.m23 + t.m43 * s.m33 + t.m44 * s.m43,
			t.m41 * s.m14 + t.m42 * s.m24 + t.m43 * s.m34 + t.m44 * s.m44
		]);
	};
	var y = class {
		/**
		* @constructor
		* @param init accepts all parameter configurations:
		* * valid CSS transform string,
		* * CSSMatrix/DOMMatrix instance,
		* * a 6/16 elements *Array*.
		*/
		constructor(t) {
			return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, t ? this.setMatrixValue(t) : this;
		}
		/**
		* A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
		* matrix is one in which every value is 0 except those on the main diagonal from top-left
		* to bottom-right corner (in other words, where the offsets in each direction are equal).
		*
		* @return the current property value
		*/
		get isIdentity() {
			return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
		}
		/**
		* A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
		* and `false` if the matrix is 3D.
		*
		* @return the current property value
		*/
		get is2D() {
			return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
		}
		/**
		* The `setMatrixValue` method replaces the existing matrix with one computed
		* in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
		*
		* The method accepts any *Array* values, the result of
		* `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
		* or `CSSMatrix` instance method `toArray()`.
		*
		* This method expects valid *matrix()* / *matrix3d()* string values, as well
		* as other transform functions like *translateX(10px)*.
		*
		* @param source
		* @return the matrix instance
		*/
		setMatrixValue(t) {
			return typeof t == "string" && t.length && t !== "none" ? O$2(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? g(t) : typeof t == "object" ? X$2(t) : this;
		}
		/**
		* Returns a *Float32Array* containing elements which comprise the matrix.
		* The method can return either the 16 elements or the 6 elements
		* depending on the value of the `is2D` parameter.
		*
		* @param is2D *Array* representation of the matrix
		* @return an *Array* representation of the matrix
		*/
		toFloat32Array(t) {
			return Float32Array.from(x(this, t));
		}
		/**
		* Returns a *Float64Array* containing elements which comprise the matrix.
		* The method can return either the 16 elements or the 6 elements
		* depending on the value of the `is2D` parameter.
		*
		* @param is2D *Array* representation of the matrix
		* @return an *Array* representation of the matrix
		*/
		toFloat64Array(t) {
			return Float64Array.from(x(this, t));
		}
		/**
		* Creates and returns a string representation of the matrix in `CSS` matrix syntax,
		* using the appropriate `CSS` matrix notation.
		*
		* matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
		* matrix *matrix(a, b, c, d, e, f)*
		*
		* @return a string representation of the matrix
		*/
		toString() {
			const { is2D: t } = this, e = this.toFloat64Array(t).join(", ");
			return `${t ? "matrix" : "matrix3d"}(${e})`;
		}
		/**
		* Returns a JSON representation of the `CSSMatrix` instance, a standard *Object*
		* that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties as well
		* as the `is2D` & `isIdentity` properties.
		*
		* The result can also be used as a second parameter for the `fromMatrix` static method
		* to load values into another matrix instance.
		*
		* @return an *Object* with all matrix values.
		*/
		toJSON() {
			const { is2D: t, isIdentity: e } = this;
			return {
				...this,
				is2D: t,
				isIdentity: e
			};
		}
		/**
		* The Multiply method returns a new CSSMatrix which is the result of this
		* matrix multiplied by the passed matrix, with the passed matrix to the right.
		* This matrix is not modified.
		*
		* @param m2 CSSMatrix
		* @return The resulted matrix.
		*/
		multiply(t) {
			return N$1(this, t);
		}
		/**
		* The translate method returns a new matrix which is this matrix post
		* multiplied by a translation matrix containing the passed values. If the z
		* component is undefined, a 0 value is used in its place. This matrix is not
		* modified.
		*
		* @param x X component of the translation value.
		* @param y Y component of the translation value.
		* @param z Z component of the translation value.
		* @return The resulted matrix
		*/
		translate(t, e, n) {
			const i = t;
			let r = e, a = n;
			return typeof r > "u" && (r = 0), typeof a > "u" && (a = 0), N$1(this, Y$1(i, r, a));
		}
		/**
		* The scale method returns a new matrix which is this matrix post multiplied by
		* a scale matrix containing the passed values. If the z component is undefined,
		* a 1 value is used in its place. If the y component is undefined, the x
		* component value is used in its place. This matrix is not modified.
		*
		* @param x The X component of the scale value.
		* @param y The Y component of the scale value.
		* @param z The Z component of the scale value.
		* @return The resulted matrix
		*/
		scale(t, e, n) {
			const i = t;
			let r = e, a = n;
			return typeof r > "u" && (r = t), typeof a > "u" && (a = 1), N$1(this, I(i, r, a));
		}
		/**
		* The rotate method returns a new matrix which is this matrix post multiplied
		* by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
		* If the y and z components are undefined, the x value is used to rotate the
		* object about the z axis, as though the vector (0,0,x) were passed. All
		* rotation values are in degrees. This matrix is not modified.
		*
		* @param rx The X component of the rotation, or Z if Y and Z are null.
		* @param ry The (optional) Y component of the rotation value.
		* @param rz The (optional) Z component of the rotation value.
		* @return The resulted matrix
		*/
		rotate(t, e, n) {
			let i = t, r = e || 0, a = n || 0;
			return typeof t == "number" && typeof e > "u" && typeof n > "u" && (a = i, i = 0, r = 0), N$1(this, F$2(i, r, a));
		}
		/**
		* The rotateAxisAngle method returns a new matrix which is this matrix post
		* multiplied by a rotation matrix with the given axis and `angle`. The right-hand
		* rule is used to determine the direction of rotation. All rotation values are
		* in degrees. This matrix is not modified.
		*
		* @param x The X component of the axis vector.
		* @param y The Y component of the axis vector.
		* @param z The Z component of the axis vector.
		* @param angle The angle of rotation about the axis vector, in degrees.
		* @return The resulted matrix
		*/
		rotateAxisAngle(t, e, n, i) {
			if ([
				t,
				e,
				n,
				i
			].some((r) => Number.isNaN(+r))) throw new TypeError("CSSMatrix: expecting 4 values");
			return N$1(this, T$2(t, e, n, i));
		}
		/**
		* Specifies a skew transformation along the `x-axis` by the given angle.
		* This matrix is not modified.
		*
		* @param angle The angle amount in degrees to skew.
		* @return The resulted matrix
		*/
		skewX(t) {
			return N$1(this, R$2(t));
		}
		/**
		* Specifies a skew transformation along the `y-axis` by the given angle.
		* This matrix is not modified.
		*
		* @param angle The angle amount in degrees to skew.
		* @return The resulted matrix
		*/
		skewY(t) {
			return N$1(this, D(t));
		}
		/**
		* Specifies a skew transformation along both the `x-axis` and `y-axis`.
		* This matrix is not modified.
		*
		* @param angleX The X-angle amount in degrees to skew.
		* @param angleY The angle amount in degrees to skew.
		* @return The resulted matrix
		*/
		skew(t, e) {
			return N$1(this, v$1(t, e));
		}
		/**
		* Transforms a specified vector using the matrix, returning a new
		* {x,y,z,w} Tuple *Object* comprising the transformed vector.
		* Neither the matrix nor the original vector are altered.
		*
		* The method is equivalent with `transformPoint()` method
		* of the `DOMMatrix` constructor.
		*
		* @param t Tuple with `{x,y,z,w}` components
		* @return the resulting Tuple
		*/
		transformPoint(t) {
			const e = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, n = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, i = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, r = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
			return t instanceof DOMPoint ? new DOMPoint(e, n, i, r) : {
				x: e,
				y: n,
				z: i,
				w: r
			};
		}
	};
	p(y, "Translate", Y$1), p(y, "Rotate", F$2), p(y, "RotateAxisAngle", T$2), p(y, "Scale", I), p(y, "SkewX", R$2), p(y, "SkewY", D), p(y, "Skew", v$1), p(y, "Multiply", N$1), p(y, "fromArray", g), p(y, "fromMatrix", X$2), p(y, "fromString", O$2), p(y, "toArray", x), p(y, "isCompatibleArray", E$2), p(y, "isCompatibleObject", P$1);

//#endregion
//#region node_modules/.pnpm/svg-path-commander@2.1.11/node_modules/svg-path-commander/dist/svg-path-commander.mjs
	var Bt$1 = (t, e, n) => {
		let [o, r] = t, [s, a] = e;
		return [o + (s - o) * n, r + (a - r) * n];
	}, E$1 = Bt$1;
	var $t$1 = (t, e) => Math.sqrt((t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1])), re$1 = $t$1;
	var lt$1 = [
		-.06405689286260563,
		.06405689286260563,
		-.1911188674736163,
		.1911188674736163,
		-.3150426796961634,
		.3150426796961634,
		-.4337935076260451,
		.4337935076260451,
		-.5454214713888396,
		.5454214713888396,
		-.6480936519369755,
		.6480936519369755,
		-.7401241915785544,
		.7401241915785544,
		-.820001985973903,
		.820001985973903,
		-.8864155270044011,
		.8864155270044011,
		-.9382745520027328,
		.9382745520027328,
		-.9747285559713095,
		.9747285559713095,
		-.9951872199970213,
		.9951872199970213
	], zt$1 = [
		.12793819534675216,
		.12793819534675216,
		.1258374563468283,
		.1258374563468283,
		.12167047292780339,
		.12167047292780339,
		.1155056680537256,
		.1155056680537256,
		.10744427011596563,
		.10744427011596563,
		.09761865210411388,
		.09761865210411388,
		.08619016153195327,
		.08619016153195327,
		.0733464814110803,
		.0733464814110803,
		.05929858491543678,
		.05929858491543678,
		.04427743881741981,
		.04427743881741981,
		.028531388628933663,
		.028531388628933663,
		.0123412297999872,
		.0123412297999872
	], Vt$1 = (t) => {
		let e = [];
		for (let n = t, o = n.length, r = o - 1; o > 1; o -= 1, r -= 1) {
			let s = [];
			for (let a = 0; a < r; a += 1) s.push({
				x: r * (n[a + 1].x - n[a].x),
				y: r * (n[a + 1].y - n[a].y),
				t: 0
			});
			e.push(s), n = s;
		}
		return e;
	}, Rt$1 = (t, e) => {
		if (e === 0) return t[0].t = 0, t[0];
		let n = t.length - 1;
		if (e === 1) return t[n].t = 1, t[n];
		let o = 1 - e, r = t;
		if (n === 0) return t[0].t = e, t[0];
		if (n === 1) return {
			x: o * r[0].x + e * r[1].x,
			y: o * r[0].y + e * r[1].y,
			t: e
		};
		let s = o * o, a = e * e, i = 0, m = 0, u = 0, l = 0;
		return n === 2 ? (r = [
			r[0],
			r[1],
			r[2],
			{
				x: 0,
				y: 0
			}
		], i = s, m = o * e * 2, u = a) : n === 3 && (i = s * o, m = s * e * 3, u = o * a * 3, l = e * a), {
			x: i * r[0].x + m * r[1].x + u * r[2].x + l * r[3].x,
			y: i * r[0].y + m * r[1].y + u * r[2].y + l * r[3].y,
			t: e
		};
	}, kt$1 = (t, e) => {
		let n = t(e), o = n.x * n.x + n.y * n.y;
		return Math.sqrt(o);
	}, qt$1 = (t) => {
		let n = lt$1.length, o = 0;
		for (let r = 0, s; r < n; r++) s = .5 * lt$1[r] + .5, o += zt$1[r] * kt$1(t, s);
		return .5 * o;
	}, fe = (t) => {
		let e = [];
		for (let o = 0, r = t.length, s = 2; o < r; o += s) e.push({
			x: t[o],
			y: t[o + 1]
		});
		let n = Vt$1(e);
		return qt$1((o) => Rt$1(n[0], o));
	}, Qt$1 = 1e-8, Ne = ([t, e, n]) => {
		let o = Math.min(t, n), r = Math.max(t, n);
		if (e >= t ? n >= e : n <= e) return [o, r];
		let s = (t * n - e * e) / (t - 2 * e + n);
		return s < o ? [s, r] : [o, s];
	}, Ue$1 = ([t, e, n, o]) => {
		let r = t - 3 * e + 3 * n - o;
		if (Math.abs(r) < Qt$1) return t === o && t === e ? [t, o] : Ne([
			t,
			-.5 * t + 1.5 * e,
			t - 3 * e + 3 * n
		]);
		let s = -t * n + t * o - e * n - e * o + e * e + n * n;
		if (s <= 0) return [Math.min(t, o), Math.max(t, o)];
		let a = Math.sqrt(s), i = Math.min(t, o), m = Math.max(t, o), u = t - 2 * e + n;
		for (let l = (u + a) / r, c = 1; c <= 2; l = (u - a) / r, c++) if (l > 0 && l < 1) {
			let f = t * (1 - l) * (1 - l) * (1 - l) + e * 3 * (1 - l) * (1 - l) * l + n * 3 * (1 - l) * l * l + o * l * l * l;
			f < i && (i = f), f > m && (m = f);
		}
		return [i, m];
	}, ct$1 = {
		bezierLength: qt$1,
		calculateBezier: kt$1,
		CBEZIER_MINMAX_EPSILON: Qt$1,
		computeBezier: Rt$1,
		Cvalues: zt$1,
		deriveBezier: Vt$1,
		getBezierLength: fe,
		minmaxC: Ue$1,
		minmaxQ: Ne,
		Tvalues: lt$1
	};
	var Dt$1 = ([t, e, n, o, r, s, a, i], m) => {
		let u = 1 - m;
		return {
			x: u ** 3 * t + 3 * u ** 2 * m * n + 3 * u * m ** 2 * r + m ** 3 * a,
			y: u ** 3 * e + 3 * u ** 2 * m * o + 3 * u * m ** 2 * s + m ** 3 * i
		};
	}, Pe$1 = (t, e, n, o, r, s, a, i) => fe([
		t,
		e,
		n,
		o,
		r,
		s,
		a,
		i
	]), pt$1 = (t, e, n, o, r, s, a, i, m) => {
		let u = typeof m == "number", l = {
			x: t,
			y: e
		};
		if (u) {
			let c = fe([
				t,
				e,
				n,
				o,
				r,
				s,
				a,
				i
			]);
			m <= 0 || (m >= c ? l = {
				x: a,
				y: i
			} : l = Dt$1([
				t,
				e,
				n,
				o,
				r,
				s,
				a,
				i
			], m / c));
		}
		return l;
	}, Fe$1 = (t, e, n, o, r, s, a, i) => {
		let m = Ue$1([
			t,
			n,
			r,
			a
		]), u = Ue$1([
			e,
			o,
			s,
			i
		]);
		return [
			m[0],
			u[0],
			m[1],
			u[1]
		];
	}, ft$1 = {
		getCubicBBox: Fe$1,
		getCubicLength: Pe$1,
		getPointAtCubicLength: pt$1,
		getPointAtCubicSegmentLength: Dt$1
	};
	var Zt$1 = (t, e, n) => {
		let { sin: o, cos: r } = Math;
		return {
			x: t * r(n) - e * o(n),
			y: t * o(n) + e * r(n)
		};
	}, ne$1 = Zt$1;
	var Gt$1 = (t, e) => {
		let n = e >= 1 ? 10 ** e : 1;
		return e > 0 ? Math.round(t * n) / n : Math.round(t);
	}, M$1 = Gt$1;
	var O$1 = {
		origin: [
			0,
			0,
			0
		],
		round: 4
	};
	var Z$1 = {
		a: 7,
		c: 6,
		h: 1,
		l: 2,
		m: 2,
		r: 4,
		q: 4,
		s: 4,
		t: 2,
		v: 1,
		z: 0
	};
	var Ft$1 = (t) => {
		let e = t.pathValue[t.segmentStart], n = e.toLowerCase(), { data: o } = t;
		for (; o.length >= Z$1[n] && (n === "m" && o.length > 2 ? (t.segments.push([e].concat(o.splice(0, 2))), n = "l", e = e === "m" ? "l" : "L") : t.segments.push([e].concat(o.splice(0, Z$1[n]))), !!Z$1[n]););
	}, Se = Ft$1;
	var R$1 = "SVGPathCommander Error";
	var Jt$1 = (t) => {
		let { index: e, pathValue: n } = t, o = n.charCodeAt(e);
		if (o === 48) {
			t.param = 0, t.index += 1;
			return;
		}
		if (o === 49) {
			t.param = 1, t.index += 1;
			return;
		}
		t.err = `${R$1}: invalid Arc flag "${n[e]}", expecting 0 or 1 at index ${e}`;
	}, we = Jt$1;
	var Wt$1 = (t) => t >= 48 && t <= 57, B = Wt$1;
	var $ = "Invalid path value";
	var Yt$1 = (t) => {
		let { max: e, pathValue: n, index: o } = t, r = o, s = !1, a = !1, i = !1, m = !1, u;
		if (r >= e) {
			t.err = `${R$1}: ${$} at index ${r}, "pathValue" is missing param`;
			return;
		}
		if (u = n.charCodeAt(r), (u === 43 || u === 45) && (r += 1, u = n.charCodeAt(r)), !B(u) && u !== 46) {
			t.err = `${R$1}: ${$} at index ${r}, "${n[r]}" is not a number`;
			return;
		}
		if (u !== 46) {
			if (s = u === 48, r += 1, u = n.charCodeAt(r), s && r < e && u && B(u)) {
				t.err = `${R$1}: ${$} at index ${o}, "${n[o]}" illegal number`;
				return;
			}
			for (; r < e && B(n.charCodeAt(r));) r += 1, a = !0;
			u = n.charCodeAt(r);
		}
		if (u === 46) {
			for (m = !0, r += 1; B(n.charCodeAt(r));) r += 1, i = !0;
			u = n.charCodeAt(r);
		}
		if (u === 101 || u === 69) {
			if (m && !a && !i) {
				t.err = `${R$1}: ${$} at index ${r}, "${n[r]}" invalid float exponent`;
				return;
			}
			if (r += 1, u = n.charCodeAt(r), (u === 43 || u === 45) && (r += 1), r < e && B(n.charCodeAt(r))) for (; r < e && B(n.charCodeAt(r));) r += 1;
			else {
				t.err = `${R$1}: ${$} at index ${r}, "${n[r]}" invalid integer exponent`;
				return;
			}
		}
		t.index = r, t.param = +t.pathValue.slice(o, r);
	}, ze$1 = Yt$1;
	var er = (t) => [
		5760,
		6158,
		8192,
		8193,
		8194,
		8195,
		8196,
		8197,
		8198,
		8199,
		8200,
		8201,
		8202,
		8239,
		8287,
		12288,
		65279,
		10,
		13,
		8232,
		8233,
		32,
		9,
		11,
		12,
		160
	].includes(t), Ve$1 = er;
	var tr = (t) => {
		let { pathValue: e, max: n } = t;
		for (; t.index < n && Ve$1(e.charCodeAt(t.index));) t.index += 1;
	}, G$1 = tr;
	var rr = (t) => {
		switch (t | 32) {
			case 109:
			case 122:
			case 108:
			case 104:
			case 118:
			case 99:
			case 115:
			case 113:
			case 116:
			case 97: return !0;
			default: return !1;
		}
	}, Re$1 = rr;
	var nr = (t) => B(t) || t === 43 || t === 45 || t === 46, ke = nr;
	var or = (t) => (t | 32) === 97, qe$1 = or;
	var ar = (t) => {
		switch (t | 32) {
			case 109:
			case 77: return !0;
			default: return !1;
		}
	}, Qe$1 = ar;
	var sr = (t) => {
		let { max: e, pathValue: n, index: o, segments: r } = t, s = n.charCodeAt(o), a = Z$1[n[o].toLowerCase()];
		if (t.segmentStart = o, !Re$1(s)) {
			t.err = `${R$1}: ${$} "${n[o]}" is not a path command at index ${o}`;
			return;
		}
		let i = r[r.length - 1];
		if (!Qe$1(s) && i?.[0]?.toLocaleLowerCase() === "z") {
			t.err = `${R$1}: ${$} "${n[o]}" is not a MoveTo path command at index ${o}`;
			return;
		}
		if (t.index += 1, G$1(t), t.data = [], !a) {
			Se(t);
			return;
		}
		for (;;) {
			for (let m = a; m > 0; m -= 1) {
				if (qe$1(s) && (m === 3 || m === 4) ? we(t) : ze$1(t), t.err.length) return;
				t.data.push(t.param), G$1(t), t.index < e && n.charCodeAt(t.index) === 44 && (t.index += 1, G$1(t));
			}
			if (t.index >= t.max || !ke(n.charCodeAt(t.index))) break;
		}
		Se(t);
	}, ge = sr;
	var F$1 = class {
		constructor(e) {
			this.segments = [], this.pathValue = e, this.max = e.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
		}
	};
	var mr = (t) => {
		if (typeof t != "string") return t.slice(0);
		let e = new F$1(t);
		for (G$1(e); e.index < e.max && !e.err.length;) ge(e);
		if (!e.err.length) e.segments.length && (e.segments[0][0] = "M");
		else throw TypeError(e.err);
		return e.segments;
	}, L$1 = mr;
	var ir = (t, e, n, o) => {
		let [r] = t, s = r.toUpperCase();
		if (e === 0 || s === r) return t;
		if (s === "A") return [
			s,
			t[1],
			t[2],
			t[3],
			t[4],
			t[5],
			t[6] + n,
			t[7] + o
		];
		if (s === "V") return [s, t[1] + o];
		if (s === "H") return [s, t[1] + n];
		if (s === "L") return [
			s,
			t[1] + n,
			t[2] + o
		];
		{
			let i = [], m = t.length;
			for (let u = 1; u < m; u += 1) i.push(t[u] + (u % 2 ? n : o));
			return [s].concat(i);
		}
	}, _ = ir;
	var ur = (t, e) => {
		let n = t.length, o, r = "M", s = "M", a = !1, i = 0, m = 0, u = 0, l = 0, c = 0;
		for (let f = 0; f < n; f += 1) {
			o = t[f], [r] = o, c = o.length, s = r.toUpperCase(), a = s !== r;
			let g = e(o, f, i, m);
			if (g === !1) break;
			s === "Z" ? (i = u, m = l) : s === "H" ? i = o[1] + (a ? i : 0) : s === "V" ? m = o[1] + (a ? m : 0) : (i = o[c - 2] + (a ? i : 0), m = o[c - 1] + (a ? m : 0), s === "M" && (u = i, l = m)), g && (t[f] = g, g[0] === "C" && (n = t.length));
		}
		return t;
	}, T$1 = ur;
	var lr = (t) => {
		return T$1(L$1(t), _);
	}, oe$1 = lr;
	var Ot$1 = (t, e, n, o, r, s, a, i, m, u) => {
		let l = t, c = e, f = n, g = o, p = i, h = m, y = Math.PI * 120 / 180, S = Math.PI / 180 * (+r || 0), A = [], d, b, P, C, V;
		if (u) [b, P, C, V] = u;
		else {
			d = ne$1(l, c, -S), l = d.x, c = d.y, d = ne$1(p, h, -S), p = d.x, h = d.y;
			let N = (l - p) / 2, D = (c - h) / 2, z = N * N / (f * f) + D * D / (g * g);
			z > 1 && (z = Math.sqrt(z), f *= z, g *= z);
			let rt = f * f, nt = g * g, wt = (s === a ? -1 : 1) * Math.sqrt(Math.abs((rt * nt - rt * D * D - nt * N * N) / (rt * D * D + nt * N * N)));
			C = wt * f * D / g + (l + p) / 2, V = wt * -g * N / f + (c + h) / 2, b = Math.asin(((c - V) / g * 10 ** 9 >> 0) / 10 ** 9), P = Math.asin(((h - V) / g * 10 ** 9 >> 0) / 10 ** 9), b = l < C ? Math.PI - b : b, P = p < C ? Math.PI - P : P, b < 0 && (b = Math.PI * 2 + b), P < 0 && (P = Math.PI * 2 + P), a && b > P && (b -= Math.PI * 2), !a && P > b && (P -= Math.PI * 2);
		}
		let k = P - b;
		if (Math.abs(k) > y) {
			let N = P, D = p, z = h;
			P = b + y * (a && P > b ? 1 : -1), p = C + f * Math.cos(P), h = V + g * Math.sin(P), A = Ot$1(p, h, f, g, r, 0, a, D, z, [
				P,
				N,
				C,
				V
			]);
		}
		k = P - b;
		let w = Math.cos(b), v = Math.sin(b), j = Math.cos(P), ue = Math.sin(P), q = Math.tan(k / 4), x = 4 / 3 * f * q, Q = 4 / 3 * g * q, H = [l, c], I = [l + x * v, c - Q * w], W = [p + x * ue, h - Q * j], ye = [p, h];
		if (I[0] = 2 * H[0] - I[0], I[1] = 2 * H[1] - I[1], u) return [
			I[0],
			I[1],
			W[0],
			W[1],
			ye[0],
			ye[1]
		].concat(A);
		A = [
			I[0],
			I[1],
			W[0],
			W[1],
			ye[0],
			ye[1]
		].concat(A);
		let le = [];
		for (let N = 0, D = A.length; N < D; N += 1) le[N] = N % 2 ? ne$1(A[N - 1], A[N], S).y : ne$1(A[N], A[N + 1], S).x;
		return le;
	}, be = Ot$1;
	var fr = (t, e, n, o, r, s) => {
		let a = .3333333333333333, i = 2 / 3;
		return [
			a * t + i * n,
			a * e + i * o,
			a * r + i * n,
			a * s + i * o,
			r,
			s
		];
	}, De$1 = fr;
	var gr = (t, e, n, o) => {
		let r = E$1([t, e], [n, o], .3333333333333333), s = E$1([t, e], [n, o], 2 / 3);
		return [
			r[0],
			r[1],
			s[0],
			s[1],
			n,
			o
		];
	}, Ae = gr;
	var hr = (t, e) => {
		let [n] = t, o = t.slice(1).map(Number), [r, s] = o, { x1: a, y1: i, x: m, y: u } = e;
		return "TQ".includes(n) || (e.qx = null, e.qy = null), n === "M" ? (e.x = r, e.y = s, t) : n === "A" ? ["C"].concat(be(a, i, o[0], o[1], o[2], o[3], o[4], o[5], o[6])) : n === "Q" ? (e.qx = r, e.qy = s, ["C"].concat(De$1(a, i, o[0], o[1], o[2], o[3]))) : n === "L" ? ["C"].concat(Ae(a, i, r, s)) : n === "Z" ? ["C"].concat(Ae(a, i, m, u)) : t;
	}, Ee = hr;
	var br = (t, e) => {
		let [n] = t, o = n.toUpperCase(), r = n !== o, { x1: s, y1: a, x2: i, y2: m, x: u, y: l } = e, c = t.slice(1), f = c.map((g, p) => g + (r ? p % 2 ? l : u : 0));
		"TQ".includes(o) || (e.qx = null, e.qy = null);
		if (o === "A") return f = c.slice(0, -2).concat(c[5] + (r ? u : 0), c[6] + (r ? l : 0)), ["A"].concat(f);
		if (o === "H") return [
			"L",
			t[1] + (r ? u : 0),
			a
		];
		if (o === "V") return [
			"L",
			s,
			t[1] + (r ? l : 0)
		];
		if (o === "L") return [
			"L",
			t[1] + (r ? u : 0),
			t[2] + (r ? l : 0)
		];
		if (o === "M") return [
			"M",
			t[1] + (r ? u : 0),
			t[2] + (r ? l : 0)
		];
		if (o === "C") return ["C"].concat(f);
		if (o === "S") {
			let g = s * 2 - i, p = a * 2 - m;
			return e.x1 = g, e.y1 = p, [
				"C",
				g,
				p
			].concat(f);
		} else if (o === "T") {
			let g = s * 2 - (e.qx ? e.qx : 0), p = a * 2 - (e.qy ? e.qy : 0);
			return e.qx = g, e.qy = p, [
				"Q",
				g,
				p
			].concat(f);
		} else if (o === "Q") {
			let [g, p] = f;
			return e.qx = g, e.qy = p, ["Q"].concat(f);
		} else if (o === "Z") return ["Z"];
		return t;
	}, X$1 = br;
	var U$1 = {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 0,
		x: 0,
		y: 0,
		qx: null,
		qy: null
	};
	var yr = (t) => {
		let e = { ...U$1 }, n = L$1(t);
		return T$1(n, (o, r, s, a) => {
			e.x = s, e.y = a;
			let m = Ee(X$1(o, e), e);
			m[0] === "C" && m.length > 7 && (n.splice(r + 1, 0, ["C"].concat(m.slice(7))), m = m.slice(0, 7));
			let l = m.length;
			return e.x1 = +m[l - 2], e.y1 = +m[l - 1], e.x2 = +m[l - 4] || e.x1, e.y2 = +m[l - 3] || e.y1, m;
		});
	}, ae$1 = yr;
	var Pr = (t, e) => {
		let n = t.length, { round: o } = O$1, r = t[0], s = "";
		o = e === "off" || typeof e == "number" && e >= 0 ? e : typeof o == "number" && o >= 0 ? o : "off";
		for (let a = 0; a < n; a += 1) {
			r = t[a];
			let [i] = r, m = r.slice(1);
			if (s += i, o === "off") s += m.join(" ");
			else {
				let u = 0, l = m.length;
				for (; u < l;) s += M$1(m[u], o), u !== l - 1 && (s += " "), u += 1;
			}
		}
		return s;
	}, Ce$1 = Pr;
	var Ar = (t) => {
		let e = L$1(t), n = { ...U$1 };
		return T$1(e, (o, r, s, a) => {
			n.x = s, n.y = a;
			let i = X$1(o, n), m = i.length;
			return n.x1 = +i[m - 2], n.y1 = +i[m - 1], n.x2 = +i[m - 4] || n.x1, n.y2 = +i[m - 3] || n.y1, i;
		});
	}, J = Ar;
	var vr = (t, e, n, o, r, s, a, i) => 3 * ((i - e) * (n + r) - (a - t) * (o + s) + o * (t - r) - n * (e - s) + i * (r + t / 3) - a * (s + e / 3)) / 20, Nr = (t) => {
		let e = 0, n = 0, o = 0;
		return ae$1(t).map((r) => {
			switch (r[0]) {
				case "M": return [, e, n] = r, 0;
				default: return o = vr(e, n, r[1], r[2], r[3], r[4], r[5], r[6]), [e, n] = r.slice(-2), o;
			}
		}).reduce((r, s) => r + s, 0);
	}, Oe$1 = Nr;
	var wr = (t) => Oe$1(ae$1(t)) >= 0, yt$1 = wr;
	var Xr = (t) => {
		let e = [], n, o = -1, r = 0, s = 0, a = 0, i = 0, m = { ...U$1 };
		return t.forEach((u) => {
			let [l] = u, c = l.toUpperCase(), g = l === l.toLowerCase(), p = u.slice(1);
			c === "M" ? (o += 1, [r, s] = p, r += g ? m.x : 0, s += g ? m.y : 0, a = r, i = s, n = [g ? [
				c,
				a,
				i
			] : u]) : (c === "Z" ? (r = a, s = i) : c === "H" ? ([, r] = u, r += g ? m.x : 0) : c === "V" ? ([, s] = u, s += g ? m.y : 0) : ([r, s] = u.slice(-2), r += g ? m.x : 0, s += g ? m.y : 0), n.push(u)), m.x = r, m.y = s, e[o] = n;
		}), e;
	}, et$1 = Xr;
	var an$1 = (t) => {
		let e = t.slice(1).map((n, o, r) => o ? r[o - 1].slice(-2).concat(n.slice(1)) : t[0].slice(1).concat(n.slice(1))).map((n) => n.map((o, r) => n[n.length - r - 2 * (1 - r % 2)])).reverse();
		return [["M"].concat(e[0].slice(0, 2))].concat(e.map((n) => ["C"].concat(n.slice(2))));
	}, Mt$1 = an$1;
	var mn$1 = (t, e = .5) => {
		let n = e, o = t.slice(0, 2), r = t.slice(2, 4), s = t.slice(4, 6), a = t.slice(6, 8), i = E$1(o, r, n), m = E$1(r, s, n), u = E$1(s, a, n), l = E$1(i, m, n), c = E$1(m, u, n), f = E$1(l, c, n);
		return [[
			"C",
			i[0],
			i[1],
			l[0],
			l[1],
			f[0],
			f[1]
		], [
			"C",
			c[0],
			c[1],
			u[0],
			u[1],
			a[0],
			a[1]
		]];
	}, vt$1 = mn$1;

//#endregion
//#region src/util/fixPath.js
/**
	* @typedef {import("svg-path-commander").PathArray} PathArray
	*/
	/**
	* Checks a `PathArray` for an unnecessary `Z` segment
	* and returns a new `PathArray` without it.
	*
	* The `pathInput` must be a single path, without
	* sub-paths. For multi-path `<path>` elements,
	* use `splitPath` first and apply this utility on each
	* sub-path separately.
	*
	* @param {string | PathArray} pathInput the `pathArray` source
	* @return {PathArray} a fixed `PathArray`
	*/
	function fixPath(pathInput) {
		const pathArray = L$1(pathInput);
		const normalArray = J(pathArray);
		const length = pathArray.length;
		const isClosed = normalArray.slice(-1)[0][0] === "Z";
		const segBeforeZ = isClosed ? length - 2 : length - 1;
		const [mx, my] = normalArray[0].slice(1);
		const [x, y] = normalArray[segBeforeZ].slice(-2);
		/* istanbul ignore else */
		if (isClosed && mx === x && my === y) return pathArray.slice(0, -1);
		return pathArray;
	}

//#endregion
//#region src/components/svgCubicMorphBase.js
/**
	* Sets the property update function.
	* @param {string} tweenProp the `path` property
	*/
	function onStartCubicMorph(tweenProp) {
		if (!kute_default[tweenProp] && this.valuesEnd[tweenProp]) kute_default[tweenProp] = function updateMorph(elem, a, b, v) {
			const curve = [];
			const path1 = a.curve;
			const path2 = b.curve;
			for (let i = 0, l = path2.length; i < l; i += 1) {
				curve.push([path1[i][0]]);
				for (let j = 1, l2 = path1[i].length; j < l2; j += 1) curve[i].push((numbers(path1[i][j], path2[i][j], v) * 1e3 >> 0) / 1e3);
			}
			elem.setAttribute("d", v === 1 ? b.original : Ce$1(curve));
		};
	}

//#endregion
//#region src/components/svgCubicMorph.js
/**
	* Returns first `pathArray` from multi-paths path.
	* @param {SVGPath.pathArray | string} source the source `pathArray` or string
	* @returns {KUTE.curveSpecs[]} an `Array` with a custom tuple for `equalizeSegments`
	*/
	function getCurveArray(source) {
		return ae$1(et$1(oe$1(source))[0]).map((segment, i, pathArray) => {
			const segmentData = i && [...pathArray[i - 1].slice(-2), ...segment.slice(1)];
			const curveLength = i ? ft$1.getCubicLength(...segmentData) : 0;
			let subsegs;
			if (i) subsegs = curveLength ? vt$1(segmentData) : [segment, segment];
			else subsegs = [segment];
			return {
				s: segment,
				ss: subsegs,
				l: curveLength
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
		const c1 = getCurveArray(path1);
		const c2 = getCurveArray(path2);
		const L1 = c1.length;
		const L2 = c2.length;
		const l1 = c1.filter((x) => x.l).length;
		const l2 = c2.filter((x) => x.l).length;
		const m1 = c1.filter((x) => x.l).reduce((a, { l }) => a + l, 0) / l1 || 0;
		const m2 = c2.filter((x) => x.l).reduce((a, { l }) => a + l, 0) / l2 || 0;
		const tl = TL || Math.max(L1, L2);
		const mm = [m1, m2];
		const dif = [tl - L1, tl - L2];
		let canSplit = 0;
		const result = [c1, c2].map((x, i) => x.l === tl ? x.map((y) => y.s) : x.map((y, j) => {
			canSplit = j && dif[i] && y.l >= mm[i];
			dif[i] -= canSplit ? 1 : 0;
			return canSplit ? y.ss : [y.s];
		}).flat());
		return result[0].length === result[1].length ? result : equalizeSegments(result[0], result[1], tl);
	}
	/**
	* Returns all possible path rotations for `curveArray`.
	* @param {SVGPath.curveArray} a the source `curveArray`
	* @returns {SVGPath.curveArray[]} all rotations for source
	*/
	function getRotations(a) {
		const segCount = a.length;
		const pointCount = segCount - 1;
		return a.map((_, idx) => a.map((__, i) => {
			let oldSegIdx = idx + i;
			let seg;
			if (i === 0 || a[oldSegIdx] && a[oldSegIdx][0] === "M") {
				seg = a[oldSegIdx];
				return ["M", ...seg.slice(-2)];
			}
			if (oldSegIdx >= segCount) oldSegIdx -= pointCount;
			return a[oldSegIdx];
		}));
	}
	/**
	* Returns the `curveArray` rotation for the best morphing animation.
	* @param {SVGPath.curveArray} a the target `curveArray`
	* @param {SVGPath.curveArray} b the reference `curveArray`
	* @returns {SVGPath.curveArray} the best `a` rotation
	*/
	function getRotatedCurve(a, b) {
		const segCount = a.length - 1;
		const lineLengths = [];
		let computedIndex = 0;
		let sumLensSqrd = 0;
		const rotations = getRotations(a);
		rotations.forEach((_, i) => {
			a.slice(1).forEach((__, j) => {
				sumLensSqrd += re$1(a[(i + j) % segCount].slice(-2), b[j % segCount].slice(-2));
			});
			lineLengths[i] = sumLensSqrd;
			sumLensSqrd = 0;
		});
		computedIndex = lineLengths.indexOf(Math.min.apply(null, lineLengths));
		return rotations[computedIndex];
	}
	/**
	* Returns the current `d` attribute value.
	* @returns {string}
	*/
	function getCubicMorph() {
		return this.element.getAttribute("d");
	}
	/**
	* Returns the property tween object.
	* @see KUTE.curveObject
	*
	* @param {string} _ is the `path` property name, not needed
	* @param {string | KUTE.curveObject} value the `path` property value
	* @returns {KUTE.curveObject}
	*/
	function prepareCubicMorph(_, value) {
		const pathObject = {};
		const pathReg = /* @__PURE__ */ new RegExp("\\n", "ig");
		let el = null;
		if (value instanceof SVGElement) el = value;
		else if (/^\.|^#/.test(value)) el = selector(value);
		if (typeof value === "object" && value.curve) return value;
		if (el && /path|glyph/.test(el.tagName)) pathObject.original = el.getAttribute("d").replace(pathReg, "");
		else if (!el && typeof value === "string") pathObject.original = value.replace(pathReg, "");
		return pathObject;
	}
	/**
	* Enables the `to()` method by preparing the tween object in advance.
	* @param {string} tweenProp is `path` tween property, but it's not needed
	*/
	function crossCheckCubicMorph(tweenProp) {
		if (this.valuesEnd[tweenProp]) {
			const pathCurve1 = this.valuesStart[tweenProp].curve;
			const pathCurve2 = this.valuesEnd[tweenProp].curve;
			if (!pathCurve1 || !pathCurve2 || pathCurve1[0][0] === "M" && pathCurve1.length !== pathCurve2.length) {
				const path1 = this.valuesStart[tweenProp].original;
				const path2 = this.valuesEnd[tweenProp].original;
				const curves = equalizeSegments(path1, path2);
				const curve0 = yt$1(curves[0]) !== yt$1(curves[1]) ? Mt$1(curves[0]) : curves[0].slice(0);
				this.valuesStart[tweenProp].curve = curve0;
				this.valuesEnd[tweenProp].curve = getRotatedCurve(curves[1], curve0);
			}
		}
	}
	const svgCubicMorph = {
		component: "svgCubicMorph",
		property: "path",
		defaultValue: [],
		Interpolate: {
			numbers,
			pathToString: Ce$1
		},
		functions: {
			prepareStart: getCubicMorph,
			prepareProperty: prepareCubicMorph,
			onStart: onStartCubicMorph,
			crossCheck: crossCheckCubicMorph
		},
		Util: {
			pathToCurve: ae$1,
			pathToAbsolute: oe$1,
			pathToString: Ce$1,
			parsePathString: L$1,
			getRotatedCurve,
			getRotations,
			equalizeSegments,
			reverseCurve: Mt$1,
			getDrawDirection: yt$1,
			cubicTools: ft$1,
			splitCubic: vt$1,
			splitPath: et$1,
			fixPath,
			getCurveArray
		}
	};
	var svgCubicMorph_default = svgCubicMorph;

//#endregion
//#region src/components/svgTransformBase.js
/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function svgTransformOnStart(tweenProp) {
		if (!kute_default[tweenProp] && this.valuesEnd[tweenProp]) kute_default[tweenProp] = (l, a, b, v) => {
			let x = 0;
			let y = 0;
			const deg = Math.PI / 180;
			const scale = "scale" in b ? numbers(a.scale, b.scale, v) : 1;
			const rotate = "rotate" in b ? numbers(a.rotate, b.rotate, v) : 0;
			const sin = Math.sin(rotate * deg);
			const cos = Math.cos(rotate * deg);
			const skewX = "skewX" in b ? numbers(a.skewX, b.skewX, v) : 0;
			const skewY = "skewY" in b ? numbers(a.skewY, b.skewY, v) : 0;
			const complex = rotate || skewX || skewY || scale !== 1 || 0;
			x -= complex ? b.origin[0] : 0;
			y -= complex ? b.origin[1] : 0;
			x *= scale;
			y *= scale;
			y += skewY ? x * Math.tan(skewY * deg) : 0;
			x += skewX ? y * Math.tan(skewX * deg) : 0;
			const cxsy = cos * x - sin * y;
			y = rotate ? sin * x + cos * y : y;
			x = rotate ? cxsy : x;
			x += "translate" in b ? numbers(a.translate[0], b.translate[0], v) : 0;
			y += "translate" in b ? numbers(a.translate[1], b.translate[1], v) : 0;
			x += complex ? b.origin[0] : 0;
			y += complex ? b.origin[1] : 0;
			l.setAttribute("transform", (x || y ? `translate(${(x * 1e3 >> 0) / 1e3}${y ? `,${(y * 1e3 >> 0) / 1e3}` : ""})` : "") + (rotate ? `rotate(${(rotate * 1e3 >> 0) / 1e3})` : "") + (skewX ? `skewX(${(skewX * 1e3 >> 0) / 1e3})` : "") + (skewY ? `skewY(${(skewY * 1e3 >> 0) / 1e3})` : "") + (scale !== 1 ? `scale(${(scale * 1e3 >> 0) / 1e3})` : ""));
		};
	}

//#endregion
//#region src/components/svgTransform.js
/**
	* Returns a correct transform origin consistent with the shape bounding box.
	* @param {string} origin transform origin string
	* @param {SVGPathCommander.pathBBox} bbox path bounding box
	* @returns {number}
	*/
	function parseStringOrigin(origin, bbox) {
		let result;
		const { x, width } = bbox;
		if (/[a-z]/i.test(origin) && !/px/.test(origin)) result = origin.replace(/top|left/, 0).replace(/right|bottom/, 100).replace(/center|middle/, 50);
		else result = /%/.test(origin) ? x + parseFloat(origin) * width / 100 : parseFloat(origin);
		return result;
	}
	/**
	* Parse SVG transform string and return an object.
	* @param {string} a transform string
	* @returns {Object<string, (string | number)>}
	*/
	function parseTransformString(a) {
		const c = {};
		const d = a && /\)/.test(a) ? a.substring(0, a.length - 1).split(/\)\s|\)/) : "none";
		if (d instanceof Array) for (let j = 0, jl = d.length; j < jl; j += 1) {
			const [prop, val] = d[j].trim().split("(");
			c[prop] = val;
		}
		return c;
	}
	/**
	* Returns the SVG transform tween object.
	* @param {string} _ property name
	* @param {Object<string, (string | number)>} v property value object
	* @returns {KUTE.transformSVGObject} the SVG transform tween object
	*/
	function parseTransformSVG(_, v) {
		/** @type {KUTE.transformSVGObject} */
		const svgTransformObject = {};
		const bb = this.element.getBBox();
		const cx = bb.x + bb.width / 2;
		const cy = bb.y + bb.height / 2;
		let origin = this._transformOrigin;
		let translation;
		if (typeof origin !== "undefined") origin = origin instanceof Array ? origin : origin.split(/\s/);
		else origin = [cx, cy];
		origin[0] = typeof origin[0] === "number" ? origin[0] : parseStringOrigin(origin[0], bb);
		origin[1] = typeof origin[1] === "number" ? origin[1] : parseStringOrigin(origin[1], bb);
		svgTransformObject.origin = origin;
		Object.keys(v).forEach((i) => {
			if (i === "rotate") if (typeof v[i] === "number") svgTransformObject[i] = v[i];
			else if (v[i] instanceof Array) [svgTransformObject[i]] = v[i];
			else svgTransformObject[i] = v[i].split(/\s/)[0] * 1;
			else if (i === "translate") {
				if (v[i] instanceof Array) translation = v[i];
				else if (/,|\s/.test(v[i])) translation = v[i].split(",");
				else translation = [v[i], 0];
				svgTransformObject[i] = [translation[0] * 1 || 0, translation[1] * 1 || 0];
			} else if (/skew/.test(i)) svgTransformObject[i] = v[i] * 1 || 0;
			else if (i === "scale") svgTransformObject[i] = parseFloat(v[i]) || 1;
		});
		return svgTransformObject;
	}
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
	function getStartSvgTransform(_, value) {
		const transformObject = {};
		const currentTransform = parseTransformString(this.element.getAttribute("transform"));
		Object.keys(value).forEach((j) => {
			const scaleValue = j === "scale" ? 1 : 0;
			transformObject[j] = j in currentTransform ? currentTransform[j] : scaleValue;
		});
		return transformObject;
	}
	function svgTransformCrossCheck(prop) {
		if (!this._resetStart) return;
		if (this.valuesEnd[prop]) {
			const valuesStart = this.valuesStart[prop];
			const valuesEnd = this.valuesEnd[prop];
			const currentTransform = parseTransformSVG.call(this, prop, parseTransformString(this.element.getAttribute("transform")));
			Object.keys(currentTransform).forEach((tp) => {
				valuesStart[tp] = currentTransform[tp];
			});
			const parentSVG = this.element.ownerSVGElement;
			const startMatrix = parentSVG.createSVGTransformFromMatrix(parentSVG.createSVGMatrix().translate(-valuesStart.origin[0], -valuesStart.origin[1]).translate("translate" in valuesStart ? valuesStart.translate[0] : 0, "translate" in valuesStart ? valuesStart.translate[1] : 0).rotate(valuesStart.rotate || 0).skewX(valuesStart.skewX || 0).skewY(valuesStart.skewY || 0).scale(valuesStart.scale || 1).translate(+valuesStart.origin[0], +valuesStart.origin[1]));
			valuesStart.translate = [startMatrix.matrix.e, startMatrix.matrix.f];
			Object.keys(valuesStart).forEach((s) => {
				if (!(s in valuesEnd) || s === "origin") valuesEnd[s] = valuesStart[s];
			});
		}
	}
	const svgTransformFunctions = {
		prepareStart: getStartSvgTransform,
		prepareProperty: prepareSvgTransform,
		onStart: svgTransformOnStart,
		crossCheck: svgTransformCrossCheck
	};
	const svgTransform = {
		component: "svgTransformProperty",
		property: "svgTransform",
		defaultOptions: { transformOrigin: "50% 50%" },
		defaultValue: {
			translate: 0,
			rotate: 0,
			skewX: 0,
			skewY: 0,
			scale: 1
		},
		Interpolate: { numbers },
		functions: svgTransformFunctions,
		Util: {
			parseStringOrigin,
			parseTransformString,
			parseTransformSVG
		}
	};
	var svgTransform_default = svgTransform;

//#endregion
//#region node_modules/.pnpm/@thednp+shorty@2.0.11/node_modules/@thednp/shorty/dist/shorty.mjs
	const Ce = "2.0.11", Me = "aria-checked", De = "aria-description", Le = "aria-describedby", Oe = "aria-expanded", xe = "aria-haspopup", X = "aria-hidden", ze = "aria-label", Ie = "aria-labelledby", Pe = "aria-modal", Fe = "aria-pressed", Be = "aria-selected", Ve = "aria-valuemin", He = "aria-valuemax", Ue = "aria-valuenow", We = "aria-valuetext", Y = "abort", tt = "beforeunload", et = "blur", nt = "change", ot = "contextmenu", U = "DOMContentLoaded", st = "DOMMouseScroll", rt = "error", ct = "focus", at = "focusin", it = "focusout", ut = "gesturechange", lt = "gestureend", dt = "gesturestart", ft = "keydown", pt = "keypress", gt = "keyup", mt = "load", vt = "click", bt = "dblclick", Et = "mousedown", ht = "mouseup", yt = "hover", wt = "mouseenter", At = "mouseleave", St = "mousein", kt = "mouseout", Nt = "mouseover", Tt = "mousemove", Ct = "mousewheel", Mt = "move", Dt = "orientationchange", Lt = "pointercancel", Ot = "pointerdown", xt = "pointerleave", zt = "pointermove", It = "pointerup", Pt = "readystatechange", Ft = "reset", Bt = "resize", Vt = "select", Ht = "selectend", Ut = "selectstart", Wt = "scroll", Rt = "submit", Qt = "touchstart", jt = "touchmove", Kt = "touchcancel", qt = "touchend", Gt = "unload", Re = {
		DOMContentLoaded: U,
		DOMMouseScroll: st,
		abort: Y,
		beforeunload: tt,
		blur: et,
		change: nt,
		click: vt,
		contextmenu: ot,
		dblclick: bt,
		error: rt,
		focus: ct,
		focusin: at,
		focusout: it,
		gesturechange: ut,
		gestureend: lt,
		gesturestart: dt,
		hover: yt,
		keydown: ft,
		keypress: pt,
		keyup: gt,
		load: mt,
		mousedown: Et,
		mousemove: Tt,
		mousein: St,
		mouseout: kt,
		mouseenter: wt,
		mouseleave: At,
		mouseover: Nt,
		mouseup: ht,
		mousewheel: Ct,
		move: Mt,
		orientationchange: Dt,
		pointercancel: Lt,
		pointerdown: Ot,
		pointerleave: xt,
		pointermove: zt,
		pointerup: It,
		readystatechange: Pt,
		reset: Ft,
		resize: Bt,
		scroll: Wt,
		select: Vt,
		selectend: Ht,
		selectstart: Ut,
		submit: Rt,
		touchcancel: Kt,
		touchend: qt,
		touchmove: jt,
		touchstart: Qt,
		unload: Gt
	}, Qe = "drag", je = "dragstart", Ke = "dragenter", qe = "dragleave", Ge = "dragover", Ze = "dragend", _e = "loadstart", $e = {
		start: "mousedown",
		end: "mouseup",
		move: "mousemove",
		cancel: "mouseleave"
	}, Je = {
		down: "mousedown",
		up: "mouseup"
	}, Xe = "onmouseleave" in document ? ["mouseenter", "mouseleave"] : ["mouseover", "mouseout"], Ye = {
		start: "touchstart",
		end: "touchend",
		move: "touchmove",
		cancel: "touchcancel"
	}, tn = {
		in: "focusin",
		out: "focusout"
	}, Zt = "a[href], button, input, textarea, select, details, [tabindex]:not([tabindex=\"-1\"]", en = {
		Backspace: "Backspace",
		Tab: "Tab",
		Enter: "Enter",
		Shift: "Shift",
		Control: "Control",
		Alt: "Alt",
		Pause: "Pause",
		CapsLock: "CapsLock",
		Escape: "Escape",
		Scape: "Space",
		ArrowLeft: "ArrowLeft",
		ArrowUp: "ArrowUp",
		ArrowRight: "ArrowRight",
		ArrowDown: "ArrowDown",
		Insert: "Insert",
		Delete: "Delete",
		Meta: "Meta",
		ContextMenu: "ContextMenu",
		ScrollLock: "ScrollLock"
	}, nn = "Alt", on = "ArrowDown", sn = "ArrowUp", rn = "ArrowLeft", cn = "ArrowRight", an = "Backspace", un = "CapsLock", ln = "Control", dn = "Delete", fn = "Enter", pn = "NumpadEnter", gn = "Escape", mn = "Insert", vn = "Meta", bn = "Pause", En = "ScrollLock", hn = "Shift", yn = "Space", wn = "Tab", _t = "animationDuration", $t = "animationDelay", W = "animationName", C = "animationend", Jt = "transitionDuration", Xt = "transitionDelay", M = "transitionend", R = "transitionProperty", An = "addEventListener", Sn = "removeEventListener", kn = {
		linear: "linear",
		easingSinusoidalIn: "cubic-bezier(0.47,0,0.745,0.715)",
		easingSinusoidalOut: "cubic-bezier(0.39,0.575,0.565,1)",
		easingSinusoidalInOut: "cubic-bezier(0.445,0.05,0.55,0.95)",
		easingQuadraticIn: "cubic-bezier(0.550,0.085,0.680,0.530)",
		easingQuadraticOut: "cubic-bezier(0.250,0.460,0.450,0.940)",
		easingQuadraticInOut: "cubic-bezier(0.455,0.030,0.515,0.955)",
		easingCubicIn: "cubic-bezier(0.55,0.055,0.675,0.19)",
		easingCubicOut: "cubic-bezier(0.215,0.61,0.355,1)",
		easingCubicInOut: "cubic-bezier(0.645,0.045,0.355,1)",
		easingQuarticIn: "cubic-bezier(0.895,0.03,0.685,0.22)",
		easingQuarticOut: "cubic-bezier(0.165,0.84,0.44,1)",
		easingQuarticInOut: "cubic-bezier(0.77,0,0.175,1)",
		easingQuinticIn: "cubic-bezier(0.755,0.05,0.855,0.06)",
		easingQuinticOut: "cubic-bezier(0.23,1,0.32,1)",
		easingQuinticInOut: "cubic-bezier(0.86,0,0.07,1)",
		easingExponentialIn: "cubic-bezier(0.95,0.05,0.795,0.035)",
		easingExponentialOut: "cubic-bezier(0.19,1,0.22,1)",
		easingExponentialInOut: "cubic-bezier(1,0,0,1)",
		easingCircularIn: "cubic-bezier(0.6,0.04,0.98,0.335)",
		easingCircularOut: "cubic-bezier(0.075,0.82,0.165,1)",
		easingCircularInOut: "cubic-bezier(0.785,0.135,0.15,0.86)",
		easingBackIn: "cubic-bezier(0.6,-0.28,0.735,0.045)",
		easingBackOut: "cubic-bezier(0.175,0.885,0.32,1.275)",
		easingBackInOut: "cubic-bezier(0.68,-0.55,0.265,1.55)"
	}, Nn = "offsetHeight", Tn = "offsetWidth", Cn = "scrollHeight", Mn = "scrollWidth", Dn = "tabindex", Ln = navigator.userAgentData, { userAgent: Yt } = navigator, On = Yt, xn = () => {
		const t = /iPhone|iPad|iPod|Android/i;
		return navigator?.userAgentData?.brands.some((e) => t.test(e.brand)) || t.test(navigator?.userAgent) || !1;
	}, zn = () => {
		const t = /(iPhone|iPod|iPad)/;
		return navigator?.userAgentData?.brands.some((e) => t.test(e.brand)) || t.test(navigator?.userAgent) || !1;
	}, In = () => navigator?.userAgent?.includes("Firefox") || !1, te = () => typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none"), Pn = () => ["webkitPerspective", "perspective"].some((t) => t in document.head.style), ee = () => {}, Q = (t, e, n, o) => {
		const s = o || !1;
		t.addEventListener(e, n, s);
	}, j = (t, e, n, o) => {
		const s = o || !1;
		t.removeEventListener(e, n, s);
	}, ne = (t, e, n, o) => {
		const s = (r) => {
			(r.target === t || r.currentTarget === t) && (n.apply(t, [r]), j(t, e, s, o));
		};
		Q(t, e, s, o);
	}, Fn = () => {
		let t = !1;
		try {
			const e = Object.defineProperty({}, "passive", { get: () => (t = !0, t) });
			ne(document, U, ee, e);
		} catch {}
		return t;
	}, Bn = () => ["webkitTransform", "transform"].some((t) => t in document.head.style), Vn = () => "ontouchstart" in window || "msMaxTouchPoints" in navigator, Hn = () => ["webkitAnimation", "animation"].some((t) => t in document.head.style), Un = () => ["webkitTransition", "transition"].some((t) => t in document.head.style), K = (t, e) => t.getAttribute(e), Wn = (t, e, n) => e.getAttributeNS(t, n), oe = (t, e) => t.hasAttribute(e), Rn = (t, e, n) => e.hasAttributeNS(t, n), Qn = (t, e, n) => t.setAttribute(e, n), jn = (t, e, n, o) => e.setAttributeNS(t, n, o), Kn = (t, e) => t.removeAttribute(e), qn = (t, e, n) => e.removeAttributeNS(t, n), Gn = (t, ...e) => {
		t.classList.add(...e);
	}, Zn = (t, ...e) => {
		t.classList.remove(...e);
	}, _n = (t, e) => t.classList.contains(e), { body: $n } = document, { documentElement: Jn } = document, { head: Xn } = document, Yn = (t) => Array.from(t), v = (t) => t != null && typeof t == "object" || !1, u = (t) => v(t) && typeof t.nodeType == "number" && [
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11
	].some((e) => t.nodeType === e) || !1, i = (t) => u(t) && t.nodeType === 1 || !1, E = /* @__PURE__ */ new Map(), L = {
		data: E,
		set: (t, e, n) => {
			if (!i(t)) return;
			E.has(e) || E.set(e, /* @__PURE__ */ new Map()), E.get(e).set(t, n);
		},
		getAllFor: (t) => E.get(t) || null,
		get: (t, e) => {
			if (!i(t) || !e) return null;
			const n = L.getAllFor(e);
			return t && n && n.get(t) || null;
		},
		remove: (t, e) => {
			const n = L.getAllFor(e);
			!n || !i(t) || (n.delete(t), n.size === 0 && E.delete(e));
		}
	}, to = (t, e) => L.get(t, e), eo = (t) => t?.charAt(0).toUpperCase() + t?.slice(1), P = (t) => t?.trim().replace(/(?:^\w|[A-Z]|\b\w)/g, (e, n) => n === 0 ? e.toLowerCase() : e.toUpperCase()).replace(/\s+/g, ""), N = (t) => typeof t == "string" || !1, q = (t) => v(t) && t.constructor.name === "Window" || !1, G = (t) => u(t) && t.nodeType === 9 || !1, d = (t) => G(t) ? t : u(t) ? t.ownerDocument : q(t) ? t.document : globalThis.document, T = (t, ...e) => Object.assign(t, ...e), se = (t) => {
		if (!t) return;
		if (N(t)) return d().createElement(t);
		const { tagName: e } = t, n = se(e);
		if (!n) return;
		const o = { ...t };
		return delete o.tagName, T(n, o);
	}, re = (t, e) => {
		if (!t || !e) return;
		if (N(e)) return d().createElementNS(t, e);
		const { tagName: n } = e, o = re(t, n);
		if (!o) return;
		const s = { ...e };
		return delete s.tagName, T(o, s);
	}, Z = (t, e) => t.dispatchEvent(e), no = (t, e, n) => n.indexOf(t) === e, f = (t, e, n) => {
		const o = getComputedStyle(t, n), s = e.replace("webkit", "Webkit").replace(/([A-Z])/g, "-$1").toLowerCase();
		return o.getPropertyValue(s);
	}, ce = (t) => {
		const e = f(t, W), n = f(t, $t), o = n.includes("ms") ? 1 : 1e3, s = e && e !== "none" ? parseFloat(n) * o : 0;
		return Number.isNaN(s) ? 0 : s;
	}, ae = (t) => {
		const e = f(t, W), n = f(t, _t), o = n.includes("ms") ? 1 : 1e3, s = e && e !== "none" ? parseFloat(n) * o : 0;
		return Number.isNaN(s) ? 0 : s;
	}, oo = (t, e) => {
		let n = 0;
		const o = new Event(C), s = ae(t), r = ce(t);
		if (s) {
			const a = (l) => {
				l.target === t && (e.apply(t, [l]), t.removeEventListener(C, a), n = 1);
			};
			t.addEventListener(C, a), setTimeout(() => {
				n || Z(t, o);
			}, s + r + 17);
		} else e.apply(t, [o]);
	}, ie = (t) => {
		const e = f(t, R), n = f(t, Xt), o = n.includes("ms") ? 1 : 1e3, s = e && e !== "none" ? parseFloat(n) * o : 0;
		return Number.isNaN(s) ? 0 : s;
	}, ue = (t) => {
		const e = f(t, R), n = f(t, Jt), o = n.includes("ms") ? 1 : 1e3, s = e && e !== "none" ? parseFloat(n) * o : 0;
		return Number.isNaN(s) ? 0 : s;
	}, so = (t, e) => {
		let n = 0;
		const o = new Event(M), s = ue(t), r = ie(t);
		if (s) {
			const a = (l) => {
				l.target === t && (e.apply(t, [l]), t.removeEventListener(M, a), n = 1);
			};
			t.addEventListener(M, a), setTimeout(() => {
				n || Z(t, o);
			}, s + r + 17);
		} else e.apply(t, [o]);
	}, ro = (t) => Float32Array.from(Array.from(t)), co = (t) => Float64Array.from(Array.from(t)), ao = (t, e) => t.focus(e), io = (t) => t?.trim().replace(/([a-z])([A-Z])/g, "$1-$2").replace(/\s+/g, "-").toLowerCase(), F = (t) => ["true", !0].includes(t) ? !0 : ["false", !1].includes(t) ? !1 : [
		"null",
		"",
		null,
		void 0
	].includes(t) ? null : t !== "" && !Number.isNaN(+t) ? +t : t, S = (t) => Object.entries(t), uo = (t, e, n, o) => {
		if (!i(t)) return e;
		const s = { ...n }, r = { ...t.dataset }, a = { ...e }, l = {}, p = "title";
		return S(r).forEach(([c, g]) => {
			const A = o && typeof c == "string" && c.includes(o) ? P(c.replace(o, "")) : P(c);
			l[A] = F(g);
		}), S(s).forEach(([c, g]) => {
			s[c] = F(g);
		}), S(e).forEach(([c, g]) => {
			c in s ? a[c] = s[c] : c in l ? a[c] = l[c] : a[c] = c === p ? K(t, p) : g;
		}), a;
	}, lo = (t, e) => v(t) && (Object.hasOwn(t, e) || e in t), fo = (t) => Object.keys(t), po = (t) => Object.values(t), go = (t) => Object.fromEntries(t), mo = (t, e) => {
		const n = new CustomEvent(t, {
			cancelable: !0,
			bubbles: !0
		});
		return v(e) && T(n, e), n;
	}, vo = { passive: !0 }, bo = (t) => t.offsetHeight, Eo = (t, e) => {
		S(e).forEach(([n, o]) => {
			if (o && N(n) && n.includes("--")) t.style.setProperty(n, o);
			else {
				const s = {};
				s[n] = o, T(t.style, s);
			}
		});
	}, O = (t) => v(t) && t.constructor.name === "Map" || !1, le = (t) => typeof t == "number" || !1, m = /* @__PURE__ */ new Map(), ho = {
		set: (t, e, n, o) => {
			i(t) && (o && o.length ? (m.has(t) || m.set(t, /* @__PURE__ */ new Map()), m.get(t).set(o, setTimeout(e, n))) : m.set(t, setTimeout(e, n)));
		},
		get: (t, e) => {
			if (!i(t)) return null;
			const n = m.get(t);
			return e && n && O(n) ? n.get(e) || null : le(n) ? n : null;
		},
		clear: (t, e) => {
			if (!i(t)) return;
			const n = m.get(t);
			e && e.length && O(n) ? (clearTimeout(n.get(e)), n.delete(e), n.size === 0 && m.delete(t)) : (clearTimeout(n), m.delete(t));
		}
	}, yo = (t) => t.toLowerCase(), wo = (t) => t.toUpperCase(), de = (t, e) => (u(e) ? e : d()).querySelectorAll(t), z = /* @__PURE__ */ new Map();

//#endregion
//#region src/components/scrollPropertyBase.js
	const touchOrWheel = Vn ? "touchstart" : "mousewheel";
	const scrollContainer = navigator && /(EDGE|Mac)/i.test(navigator.userAgent) ? document.body : document.documentElement;
	/**
	* Prevent further scroll events until scroll animation is over.
	* @param {Event} e event object
	*/
	function preventScroll(e) {
		if (this.scrolling) e.preventDefault();
	}
	/**
	* Returns the scroll element / target.
	* @returns {{el: Element, st: Element}}
	*/
	function getScrollTargets() {
		const el = this.element;
		return el === scrollContainer ? {
			el: document,
			st: document.body
		} : {
			el,
			st: el
		};
	}
	/**
	* Toggles scroll prevention callback on scroll events.
	* @param {string} action addEventListener / removeEventListener
	* @param {Element} element target
	*/
	function toggleScrollEvents(action, element) {
		element[action](Xe[0], preventScroll, vo);
		element[action](touchOrWheel, preventScroll, vo);
	}
	/**
	* Action performed before scroll animation start.
	*/
	function scrollIn() {
		const targets = getScrollTargets.call(this);
		if ("scroll" in this.valuesEnd && !targets.el.scrolling) {
			targets.el.scrolling = 1;
			toggleScrollEvents("addEventListener", targets.el);
			targets.st.style.pointerEvents = "none";
		}
	}
	/**
	* Action performed when scroll animation ends.
	*/
	function scrollOut() {
		const targets = getScrollTargets.call(this);
		if ("scroll" in this.valuesEnd && targets.el.scrolling) {
			targets.el.scrolling = 0;
			toggleScrollEvents("removeEventListener", targets.el);
			targets.st.style.pointerEvents = "";
		}
	}
	/**
	* * Sets the scroll target.
	* * Adds the scroll prevention event listener.
	* * Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartScroll(tweenProp) {
		if (tweenProp in this.valuesEnd && !kute_default[tweenProp]) {
			this.element = "scroll" in this.valuesEnd && (!this.element || this.element === window) ? scrollContainer : this.element;
			scrollIn.call(this);
			kute_default[tweenProp] = (elem, a, b, v) => {
				elem.scrollTop = numbers(a, b, v) >> 0;
			};
		}
	}
	/**
	* Removes the scroll prevention event listener.
	*/
	function onCompleteScroll() {
		scrollOut.call(this);
	}

//#endregion
//#region src/components/scrollProperty.js
/**
	* Returns the current property computed style.
	* @returns {number} computed style for property
	*/
	function getScroll() {
		this.element = "scroll" in this.valuesEnd && (!this.element || this.element === window) ? scrollContainer : this.element;
		return this.element === scrollContainer ? globalThis.pageYOffset || scrollContainer.scrollTop : this.element.scrollTop;
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {number} the property tween object
	*/
	function prepareScroll(_, value) {
		return parseInt(value, 10);
	}
	const ScrollProperty = {
		component: "scrollProperty",
		property: "scroll",
		defaultValue: 0,
		Interpolate: { numbers },
		functions: {
			prepareStart: getScroll,
			prepareProperty: prepareScroll,
			onStart: onStartScroll,
			onComplete: onCompleteScroll
		},
		Util: {
			preventScroll,
			scrollIn,
			scrollOut,
			getScrollTargets,
			toggleScrollEvents
		}
	};
	var scrollProperty_default = ScrollProperty;

//#endregion
//#region src/components/shadowPropertiesBase.js
	const shadowProps$1 = ["boxShadow", "textShadow"];
	/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function onStartShadow(tweenProp) {
		if (this.valuesEnd[tweenProp] && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			const params = [];
			const unit = "px";
			const sl = tweenProp === "textShadow" ? 3 : 4;
			const colA = sl === 3 ? a[3] : a[4];
			const colB = sl === 3 ? b[3] : b[4];
			const inset = a[5] && a[5] !== "none" || b[5] && b[5] !== "none" ? " inset" : false;
			for (let i = 0; i < sl; i += 1) params.push((numbers(a[i], b[i], v) * 1e3 >> 0) / 1e3 + unit);
			elem.style[tweenProp] = inset ? colors(colA, colB, v) + params.join(" ") + inset : colors(colA, colB, v) + params.join(" ");
		};
	}
	const shadowPropOnStart$1 = {};
	shadowProps$1.forEach((x) => {
		shadowPropOnStart$1[x] = onStartShadow;
	});

//#endregion
//#region src/components/shadowProperties.js
	const shadowProps = ["boxShadow", "textShadow"];
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
		let newShadow;
		if (shadow.length === 3) newShadow = [
			shadow[0],
			shadow[1],
			0,
			0,
			shadow[2],
			"none"
		];
		else if (shadow.length === 4) newShadow = /inset|none/.test(shadow[3]) ? [
			shadow[0],
			shadow[1],
			0,
			0,
			shadow[2],
			shadow[3]
		] : [
			shadow[0],
			shadow[1],
			shadow[2],
			0,
			shadow[3],
			"none"
		];
		else if (shadow.length === 5) newShadow = /inset|none/.test(shadow[4]) ? [
			shadow[0],
			shadow[1],
			shadow[2],
			0,
			shadow[3],
			shadow[4]
		] : [
			shadow[0],
			shadow[1],
			shadow[2],
			shadow[3],
			shadow[4],
			"none"
		];
		else if (shadow.length === 6) newShadow = shadow;
		for (let i = 0; i < 4; i += 1) newShadow[i] = parseFloat(newShadow[i]);
		newShadow[4] = trueColor_default(newShadow[4]);
		newShadow = tweenProp === "boxShadow" ? newShadow : newShadow.filter((_, i) => [
			0,
			1,
			2,
			4
		].includes(i));
		return newShadow;
	}
	/**
	* Returns the current property computed style.
	* @param {string} tweenProp the property name
	* @returns {string} computed style for property
	*/
	function getShadow(tweenProp) {
		const cssShadow = getStyleForProperty(this.element, tweenProp);
		return /^none$|^initial$|^inherit$|^inset$/.test(cssShadow) ? defaultValues_default[tweenProp] : cssShadow;
	}
	/**
	* Returns the property tween object.
	* @param {string} tweenProp the property name
	* @param {string} propValue the property value
	* @returns {KUTE.shadowObject} the property tween object
	*/
	function prepareShadow(tweenProp, propValue) {
		let value = propValue;
		if (typeof value === "string") {
			let inset = "none";
			const currentColor = value.match(/(\s?(?:#(?:[\da-f]{3}){1,2}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))\s?)/gi);
			inset = /inset/.test(value) ? "inset" : inset;
			value = /inset/.test(value) ? value.replace(/(\s+inset|inset+\s)/g, "") : value;
			value = value.replace(currentColor[0], "").split(" ").concat([currentColor[0].replace(/\s/g, "")], [inset]);
			value = processShadowArray(value, tweenProp);
		} else if (value instanceof Array) value = processShadowArray(value, tweenProp);
		return value;
	}
	const shadowPropOnStart = {};
	shadowProps.forEach((x) => {
		shadowPropOnStart[x] = onStartShadow;
	});
	const ShadowProperties = {
		component: "shadowProperties",
		properties: shadowProps,
		defaultValues: {
			boxShadow: "0px 0px 0px 0px rgb(0,0,0)",
			textShadow: "0px 0px 0px rgb(0,0,0)"
		},
		Interpolate: {
			numbers,
			colors
		},
		functions: {
			prepareStart: getShadow,
			prepareProperty: prepareShadow,
			onStart: shadowPropOnStart
		},
		Util: {
			processShadowArray,
			trueColor: trueColor_default
		}
	};
	var shadowProperties_default = ShadowProperties;

//#endregion
//#region src/components/textPropertiesBase.js
	const textProperties = [
		"fontSize",
		"lineHeight",
		"letterSpacing",
		"wordSpacing"
	];
	const textOnStart$1 = {};
	/**
	* Sets the property update function.
	* @param {string} tweenProp the property name
	*/
	function textPropOnStart(tweenProp) {
		if (this.valuesEnd[tweenProp] && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
			elem.style[tweenProp] = units(a.v, b.v, b.u, v);
		};
	}
	textProperties.forEach((tweenProp) => {
		textOnStart$1[tweenProp] = textPropOnStart;
	});

//#endregion
//#region src/components/textProperties.js
	const textProps = [
		"fontSize",
		"lineHeight",
		"letterSpacing",
		"wordSpacing"
	];
	const textOnStart = {};
	textProps.forEach((tweenProp) => {
		textOnStart[tweenProp] = textPropOnStart;
	});
	/**
	* Returns the current property computed style.
	* @param {string} prop the property name
	* @returns {string} computed style for property
	*/
	function getTextProp(prop) {
		return getStyleForProperty(this.element, prop) || defaultValues_default[prop];
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {number} the property tween object
	*/
	function prepareTextProp(_, value) {
		return trueDimension_default(value);
	}
	const TextProperties = {
		component: "textProperties",
		category: "textProperties",
		properties: textProps,
		defaultValues: {
			fontSize: 0,
			lineHeight: 0,
			letterSpacing: 0,
			wordSpacing: 0
		},
		Interpolate: { units },
		functions: {
			prepareStart: getTextProp,
			prepareProperty: prepareTextProp,
			onStart: textOnStart
		},
		Util: { trueDimension: trueDimension_default }
	};
	var textProperties_default = TextProperties;

//#endregion
//#region src/components/textWriteBase.js
	const lowerCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").split("");
	const upperCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
	const nonAlpha = String("~!@#$%^&*()_+{}[];'<>,./?=-").split("");
	const numeric = String("0123456789").split("");
	const alphaNumeric = lowerCaseAlpha.concat(upperCaseAlpha, numeric);
	const charSet = {
		alpha: lowerCaseAlpha,
		upper: upperCaseAlpha,
		symbols: nonAlpha,
		numeric,
		alphanumeric: alphaNumeric,
		all: alphaNumeric.concat(nonAlpha)
	};
	const onStartWrite = {
		text(tweenProp) {
			if (!kute_default[tweenProp] && this.valuesEnd[tweenProp]) {
				const chars = this._textChars;
				let charsets = charSet[defaultOptions_default.textChars];
				if (chars in charSet) charsets = charSet[chars];
				else if (chars && chars.length) charsets = chars;
				kute_default[tweenProp] = (elem, a, b, v) => {
					let initialText = "";
					let endText = "";
					const finalText = b === "" ? " " : b;
					const firstLetterA = a.substring(0);
					const firstLetterB = b.substring(0);
					const pointer = charsets[Math.random() * charsets.length >> 0];
					if (a === " ") {
						endText = firstLetterB.substring(Math.min(v * firstLetterB.length, firstLetterB.length) >> 0, 0);
						elem.innerHTML = v < 1 ? endText + pointer : finalText;
					} else if (b === " ") {
						initialText = firstLetterA.substring(0, Math.min((1 - v) * firstLetterA.length, firstLetterA.length) >> 0);
						elem.innerHTML = v < 1 ? initialText + pointer : finalText;
					} else {
						initialText = firstLetterA.substring(firstLetterA.length, Math.min(v * firstLetterA.length, firstLetterA.length) >> 0);
						endText = firstLetterB.substring(0, Math.min(v * firstLetterB.length, firstLetterB.length) >> 0);
						elem.innerHTML = v < 1 ? endText + pointer + initialText : finalText;
					}
				};
			}
		},
		number(tweenProp) {
			if (tweenProp in this.valuesEnd && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
				elem.innerHTML = numbers(a, b, v) >> 0;
			};
		}
	};

//#endregion
//#region src/components/textWrite.js
	function wrapContentsSpan(el, classNAME) {
		let textWriteWrapper;
		let newElem;
		if (typeof el === "string") {
			newElem = document.createElement("SPAN");
			newElem.innerHTML = el;
			newElem.className = classNAME;
			return newElem;
		}
		if (!el.children.length || el.children.length && el.children[0].className !== classNAME) {
			const elementInnerHTML = el.innerHTML;
			textWriteWrapper = document.createElement("SPAN");
			textWriteWrapper.className = classNAME;
			textWriteWrapper.innerHTML = elementInnerHTML;
			el.appendChild(textWriteWrapper);
			el.innerHTML = textWriteWrapper.outerHTML;
		} else if (el.children.length && el.children[0].className === classNAME) [textWriteWrapper] = el.children;
		return textWriteWrapper;
	}
	function getTextPartsArray(el, classNAME) {
		let elementsArray = [];
		const len = el.children.length;
		if (len) {
			const textParts = [];
			let remainingMarkup = el.innerHTML;
			let wrapperParts;
			for (let i = 0, currentChild, childOuter, unTaggedContent; i < len; i += 1) {
				currentChild = el.children[i];
				childOuter = currentChild.outerHTML;
				wrapperParts = remainingMarkup.split(childOuter);
				if (wrapperParts[0] !== "") {
					unTaggedContent = wrapContentsSpan(wrapperParts[0], classNAME);
					textParts.push(unTaggedContent);
					remainingMarkup = remainingMarkup.replace(wrapperParts[0], "");
				} else if (wrapperParts[1] !== "") {
					unTaggedContent = wrapContentsSpan(wrapperParts[1].split("<")[0], classNAME);
					textParts.push(unTaggedContent);
					remainingMarkup = remainingMarkup.replace(wrapperParts[0].split("<")[0], "");
				}
				if (!currentChild.classList.contains(classNAME)) currentChild.classList.add(classNAME);
				textParts.push(currentChild);
				remainingMarkup = remainingMarkup.replace(childOuter, "");
			}
			if (remainingMarkup !== "") {
				const unTaggedRemaining = wrapContentsSpan(remainingMarkup, classNAME);
				textParts.push(unTaggedRemaining);
			}
			elementsArray = elementsArray.concat(textParts);
		} else elementsArray = elementsArray.concat([wrapContentsSpan(el, classNAME)]);
		return elementsArray;
	}
	function setSegments(target, newText) {
		const oldTargetSegs = getTextPartsArray(target, "text-part");
		const newTargetSegs = getTextPartsArray(wrapContentsSpan(newText), "text-part");
		target.innerHTML = "";
		target.innerHTML += oldTargetSegs.map((s) => {
			s.className += " oldText";
			return s.outerHTML;
		}).join("");
		target.innerHTML += newTargetSegs.map((s) => {
			s.className += " newText";
			return s.outerHTML.replace(s.innerHTML, "");
		}).join("");
		return [oldTargetSegs, newTargetSegs];
	}
	function createTextTweens(target, newText, ops) {
		if (target.playing) return false;
		const options = ops || {};
		options.duration = 1e3;
		if (ops.duration === "auto") options.duration = "auto";
		else if (Number.isFinite(ops.duration * 1)) options.duration = ops.duration * 1;
		const TweenContructor = connect_default.tween;
		const segs = setSegments(target, newText);
		const oldTargetSegs = segs[0];
		const newTargetSegs = segs[1];
		const oldTargets = [].slice.call(target.getElementsByClassName("oldText")).reverse();
		const newTargets = [].slice.call(target.getElementsByClassName("newText"));
		let textTween = [];
		let totalDelay = 0;
		textTween = textTween.concat(oldTargets.map((el, i) => {
			options.duration = options.duration === "auto" ? oldTargetSegs[i].innerHTML.length * 75 : options.duration;
			options.delay = totalDelay;
			options.onComplete = null;
			totalDelay += options.duration;
			return new TweenContructor(el, { text: el.innerHTML }, { text: "" }, options);
		}));
		textTween = textTween.concat(newTargets.map((el, i) => {
			function onComplete() {
				target.innerHTML = newText;
				target.playing = false;
			}
			options.duration = options.duration === "auto" ? newTargetSegs[i].innerHTML.length * 75 : options.duration;
			options.delay = totalDelay;
			options.onComplete = i === newTargetSegs.length - 1 ? onComplete : null;
			totalDelay += options.duration;
			return new TweenContructor(el, { text: "" }, { text: newTargetSegs[i].innerHTML }, options);
		}));
		textTween.start = function startTweens() {
			if (!target.playing) {
				textTween.forEach((tw) => tw.start());
				target.playing = true;
			}
		};
		return textTween;
	}
	/**
	* Returns the current element `innerHTML`.
	* @returns {string} computed style for property
	*/
	function getWrite() {
		return this.element.innerHTML;
	}
	/**
	* Returns the property tween object.
	* @param {string} tweenProp the property name
	* @param {string} value the property value
	* @returns {number | string} the property tween object
	*/
	function prepareText(tweenProp, value) {
		if (tweenProp === "number") return parseFloat(value);
		return value === "" ? " " : value;
	}
	const textWriteFunctions = {
		prepareStart: getWrite,
		prepareProperty: prepareText,
		onStart: onStartWrite
	};
	const TextWrite = {
		component: "textWriteProperties",
		category: "textWrite",
		properties: ["text", "number"],
		defaultValues: {
			text: " ",
			number: "0"
		},
		defaultOptions: { textChars: "alpha" },
		Interpolate: { numbers },
		functions: textWriteFunctions,
		Util: {
			charSet,
			createTextTweens
		}
	};
	var textWrite_default = TextWrite;

//#endregion
//#region src/interpolation/arrays.js
/**
	* Array Interpolation Function.
	*
	* @param {number[]} a start array
	* @param {number[]} b end array
	* @param {number} v progress
	* @returns {number[]} the resulting array
	*/
	function arrays(a, b, v) {
		const result = [];
		const { length } = b;
		for (let i = 0; i < length; i += 1) result[i] = ((a[i] + (b[i] - a[i]) * v) * 1e3 >> 0) / 1e3;
		return result;
	}

//#endregion
//#region src/components/transformMatrixBase.js
	const CSS3Matrix = typeof DOMMatrix !== "undefined" ? DOMMatrix : null;
	const onStartTransform = {
		transform(tweenProp) {
			if (CSS3Matrix && this.valuesEnd[tweenProp] && !kute_default[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
				let matrix = new CSS3Matrix();
				const tObject = {};
				Object.keys(b).forEach((p) => {
					tObject[p] = p === "perspective" ? numbers(a[p], b[p], v) : arrays(a[p], b[p], v);
				});
				if (tObject.perspective) matrix.m34 = -1 / tObject.perspective;
				matrix = tObject.translate3d ? matrix.translate(tObject.translate3d[0], tObject.translate3d[1], tObject.translate3d[2]) : matrix;
				matrix = tObject.rotate3d ? matrix.rotate(tObject.rotate3d[0], tObject.rotate3d[1], tObject.rotate3d[2]) : matrix;
				if (tObject.skew) {
					matrix = tObject.skew[0] ? matrix.skewX(tObject.skew[0]) : matrix;
					matrix = tObject.skew[1] ? matrix.skewY(tObject.skew[1]) : matrix;
				}
				matrix = tObject.scale3d ? matrix.scale(tObject.scale3d[0], tObject.scale3d[1], tObject.scale3d[2]) : matrix;
				elem.style[tweenProp] = matrix.toString();
			};
		},
		CSS3Matrix(prop) {
			if (CSS3Matrix && this.valuesEnd.transform) {
				if (!kute_default[prop]) kute_default[prop] = CSS3Matrix;
			}
		}
	};

//#endregion
//#region src/components/transformMatrix.js
	const matrixComponent = "transformMatrix";
	/**
	* Returns the current transform object.
	* @param {string} _ the property name
	* @param {string} value the property value
	* @returns {KUTE.transformMObject} transform object
	*/
	function getTransform(_, value) {
		const transformObject = {};
		const currentValue = this.element[matrixComponent];
		if (currentValue) Object.keys(currentValue).forEach((vS) => {
			transformObject[vS] = currentValue[vS];
		});
		else Object.keys(value).forEach((vE) => {
			transformObject[vE] = vE === "perspective" ? value[vE] : defaultValues_default.transform[vE];
		});
		return transformObject;
	}
	/**
	* Returns the property tween object.
	* @param {string} _ the property name
	* @param {Object<string, string | number | (string | number)[]>} obj the property value
	* @returns {KUTE.transformMObject} the property tween object
	*/
	function prepareTransform(_, value) {
		if (typeof value === "object" && !value.length) {
			let pv;
			const transformObject = {};
			const translate3dObj = {};
			const rotate3dObj = {};
			const scale3dObj = {};
			const skewObj = {};
			const axis = [
				{ translate3d: translate3dObj },
				{ rotate3d: rotate3dObj },
				{ skew: skewObj },
				{ scale3d: scale3dObj }
			];
			Object.keys(value).forEach((prop) => {
				if (/3d/.test(prop) && typeof value[prop] === "object" && value[prop].length) {
					pv = value[prop].map((v) => prop === "scale3d" ? parseFloat(v) : parseInt(v, 10));
					transformObject[prop] = prop === "scale3d" ? [
						pv[0] || 1,
						pv[1] || 1,
						pv[2] || 1
					] : [
						pv[0] || 0,
						pv[1] || 0,
						pv[2] || 0
					];
				} else if (/[XYZ]/.test(prop)) {
					let obj = {};
					if (/translate/.test(prop)) obj = translate3dObj;
					else if (/rotate/.test(prop)) obj = rotate3dObj;
					else if (/scale/.test(prop)) obj = scale3dObj;
					else if (/skew/.test(prop)) obj = skewObj;
					const idx = prop.replace(/translate|rotate|scale|skew/, "").toLowerCase();
					obj[idx] = /scale/.test(prop) ? parseFloat(value[prop]) : parseInt(value[prop], 10);
				} else if (prop === "skew") {
					pv = value[prop].map((v) => parseInt(v, 10) || 0);
					transformObject[prop] = [pv[0] || 0, pv[1] || 0];
				} else transformObject[prop] = parseInt(value[prop], 10);
			});
			axis.forEach((o) => {
				const tp = Object.keys(o)[0];
				const tv = o[tp];
				if (Object.keys(tv).length && !transformObject[tp]) if (tp === "scale3d") transformObject[tp] = [
					tv.x || 1,
					tv.y || 1,
					tv.z || 1
				];
				else if (tp === "skew") transformObject[tp] = [tv.x || 0, tv.y || 0];
				else transformObject[tp] = [
					tv.x || 0,
					tv.y || 0,
					tv.z || 0
				];
			});
			return transformObject;
		}
		throw Error(`KUTE.js - "${value}" is not valid/supported transform function`);
	}
	/**
	* Sets the end values for the next `to()` method call.
	* @param {string} tweenProp the property name
	*/
	function onCompleteTransform(tweenProp) {
		if (this.valuesEnd[tweenProp]) this.element[matrixComponent] = { ...this.valuesEnd[tweenProp] };
	}
	/**
	* Prepare tween object in advance for `to()` method.
	* @param {string} tweenProp the property name
	*/
	function crossCheckTransform(tweenProp) {
		if (this.valuesEnd[tweenProp]) {
			if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective) this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
		}
	}
	const matrixTransform = {
		component: matrixComponent,
		property: "transform",
		defaultValue: {
			perspective: 400,
			translate3d: [
				0,
				0,
				0
			],
			translateX: 0,
			translateY: 0,
			translateZ: 0,
			rotate3d: [
				0,
				0,
				0
			],
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
			skew: [0, 0],
			skewX: 0,
			skewY: 0,
			scale3d: [
				1,
				1,
				1
			],
			scaleX: 1,
			scaleY: 1,
			scaleZ: 1
		},
		functions: {
			prepareStart: getTransform,
			prepareProperty: prepareTransform,
			onStart: onStartTransform,
			onComplete: onCompleteTransform,
			crossCheck: crossCheckTransform
		},
		Interpolate: {
			perspective: numbers,
			translate3d: arrays,
			rotate3d: arrays,
			skew: arrays,
			scale3d: arrays
		}
	};
	var transformMatrix_default = matrixTransform;

//#endregion
//#region src/objects/componentsExtra.js
	const Components = {
		BackgroundPosition: backgroundPosition_default,
		BorderRadius: borderRadius_default,
		BoxModel: boxModel_default,
		ClipProperty: clipProperty_default,
		ColorProperties: colorProperties_default,
		FilterEffects: filterEffects_default,
		HTMLAttributes: htmlAttributes_default,
		OpacityProperty: opacityProperty_default,
		SVGDraw: svgDraw_default,
		SVGCubicMorph: svgCubicMorph_default,
		SVGTransform: svgTransform_default,
		ScrollProperty: scrollProperty_default,
		ShadowProperties: shadowProperties_default,
		TextProperties: textProperties_default,
		TextWriteProperties: textWrite_default,
		MatrixTransform: transformMatrix_default
	};
	Object.keys(Components).forEach((component) => {
		const compOps = Components[component];
		Components[component] = new AnimationDevelopment(compOps);
	});
	var componentsExtra_default = Components;

//#endregion
//#region package.json
	var version = "2.2.5";

//#endregion
//#region src/util/version.js
/**
	* A global namespace for library version.
	* @type {string}
	*/
	const Version = version;
	var version_default = Version;

//#endregion
//#region src/index-extra.js
	var index_extra_default = {
		Animation: AnimationDevelopment,
		Components: componentsExtra_default,
		Tween: TweenExtra,
		fromTo,
		to: to$1,
		TweenCollection,
		ProgressBar,
		allFromTo,
		allTo,
		Objects: objects_default,
		Util: util_default,
		Easing: easing_bezier_default,
		CubicBezier: y$1,
		Render: render_default,
		Interpolate: interpolate_default,
		Process: process_default,
		Internals: internals_default,
		Selector: selector,
		Version: version_default
	};

//#endregion
return index_extra_default;
});