/*!
* KUTE.js Standard v2.2.5 (http://thednp.github.io/kute.js)
* Copyright 2015-2026 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
import CubicBezier from "@thednp/bezier-easing";
import { distanceSquareRoot, getPointAtLength, getTotalLength, invalidPathValue, midPoint, normalizePath, pathToCurve, pathToString, polygonTools, roundPath, splitPath } from "svg-path-commander";

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
	linear: new CubicBezier(0, 0, 1, 1, "linear"),
	easingSinusoidalIn: new CubicBezier(.47, 0, .745, .715, "easingSinusoidalIn"),
	easingSinusoidalOut: new CubicBezier(.39, .575, .565, 1, "easingSinusoidalOut"),
	easingSinusoidalInOut: new CubicBezier(.445, .05, .55, .95, "easingSinusoidalInOut"),
	easingQuadraticIn: new CubicBezier(.55, .085, .68, .53, "easingQuadraticIn"),
	easingQuadraticOut: new CubicBezier(.25, .46, .45, .94, "easingQuadraticOut"),
	easingQuadraticInOut: new CubicBezier(.455, .03, .515, .955, "easingQuadraticInOut"),
	easingCubicIn: new CubicBezier(.55, .055, .675, .19, "easingCubicIn"),
	easingCubicOut: new CubicBezier(.215, .61, .355, 1, "easingCubicOut"),
	easingCubicInOut: new CubicBezier(.645, .045, .355, 1, "easingCubicInOut"),
	easingQuarticIn: new CubicBezier(.895, .03, .685, .22, "easingQuarticIn"),
	easingQuarticOut: new CubicBezier(.165, .84, .44, 1, "easingQuarticOut"),
	easingQuarticInOut: new CubicBezier(.77, 0, .175, 1, "easingQuarticInOut"),
	easingQuinticIn: new CubicBezier(.755, .05, .855, .06, "easingQuinticIn"),
	easingQuinticOut: new CubicBezier(.23, 1, .32, 1, "easingQuinticOut"),
	easingQuinticInOut: new CubicBezier(.86, 0, .07, 1, "easingQuinticInOut"),
	easingExponentialIn: new CubicBezier(.95, .05, .795, .035, "easingExponentialIn"),
	easingExponentialOut: new CubicBezier(.19, 1, .22, 1, "easingExponentialOut"),
	easingExponentialInOut: new CubicBezier(1, 0, 0, 1, "easingExponentialInOut"),
	easingCircularIn: new CubicBezier(.6, .04, .98, .335, "easingCircularIn"),
	easingCircularOut: new CubicBezier(.075, .82, .165, 1, "easingCircularOut"),
	easingCircularInOut: new CubicBezier(.785, .135, .15, .86, "easingCircularInOut"),
	easingBackIn: new CubicBezier(.6, -.28, .735, .045, "easingBackIn"),
	easingBackOut: new CubicBezier(.175, .885, .32, 1.275, "easingBackOut"),
	easingBackInOut: new CubicBezier(.68, -.55, .265, 1.55, "easingBackInOut")
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
		return new CubicBezier(bz[0] * 1, bz[1] * 1, bz[2] * 1, bz[3] * 1);
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
function to(element, endObject, optionsObj) {
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
//#region src/components/boxModelEssential.js
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
* @param {string} value the property name
* @returns {number} the property tween object
*/
function prepareBoxModel(tweenProp, value) {
	const boxValue = trueDimension_default(value);
	const offsetProp = tweenProp === "height" ? "offsetHeight" : "offsetWidth";
	return boxValue.u === "%" ? boxValue.v * this.element[offsetProp] / 100 : boxValue.v;
}
const essentialBoxProps = [
	"top",
	"left",
	"width",
	"height"
];
const essentialBoxPropsValues = {
	top: 0,
	left: 0,
	width: 0,
	height: 0
};
const essentialBoxOnStart = {};
essentialBoxProps.forEach((x) => {
	essentialBoxOnStart[x] = boxModelOnStart;
});
const BoxModelEssential = {
	component: "essentialBoxModel",
	category: "boxModel",
	properties: essentialBoxProps,
	defaultValues: essentialBoxPropsValues,
	Interpolate: { numbers },
	functions: {
		prepareStart: getBoxModel,
		prepareProperty: prepareBoxModel,
		onStart: essentialBoxOnStart
	},
	Util: { trueDimension: trueDimension_default }
};
var boxModelEssential_default = BoxModelEssential;

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
//#region src/interpolation/perspective.js
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
	return `perspective(${((a + (b - a) * v) * 1e3 >> 0) / 1e3}${u})`;
}

//#endregion
//#region src/interpolation/translate3d.js
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
	const translateArray = [];
	for (let ax = 0; ax < 3; ax += 1) translateArray[ax] = (a[ax] || b[ax] ? ((a[ax] + (b[ax] - a[ax]) * v) * 1e3 >> 0) / 1e3 : 0) + u;
	return `translate3d(${translateArray.join(",")})`;
}

//#endregion
//#region src/interpolation/rotate3d.js
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
	let rotateStr = "";
	rotateStr += a[0] || b[0] ? `rotateX(${((a[0] + (b[0] - a[0]) * v) * 1e3 >> 0) / 1e3}${u})` : "";
	rotateStr += a[1] || b[1] ? `rotateY(${((a[1] + (b[1] - a[1]) * v) * 1e3 >> 0) / 1e3}${u})` : "";
	rotateStr += a[2] || b[2] ? `rotateZ(${((a[2] + (b[2] - a[2]) * v) * 1e3 >> 0) / 1e3}${u})` : "";
	return rotateStr;
}

//#endregion
//#region src/interpolation/translate.js
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
	const translateArray = [];
	translateArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1e3 >> 0) / 1e3) + u;
	translateArray[1] = a[1] || b[1] ? (a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1e3 >> 0) / 1e3) + u : "0";
	return `translate(${translateArray.join(",")})`;
}

//#endregion
//#region src/interpolation/rotate.js
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
	return `rotate(${((a + (b - a) * v) * 1e3 >> 0) / 1e3}${u})`;
}

//#endregion
//#region src/interpolation/scale.js
/**
* Scale Interpolation Function.
*
* @param {number} a start scale
* @param {number} b end scale
* @param {number} v progress
* @returns {string} the interpolated scale
*/
function scale(a, b, v) {
	return `scale(${((a + (b - a) * v) * 1e3 >> 0) / 1e3})`;
}

//#endregion
//#region src/interpolation/skew.js
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
	const skewArray = [];
	skewArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1e3 >> 0) / 1e3) + u;
	skewArray[1] = a[1] || b[1] ? (a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1e3 >> 0) / 1e3) + u : "0";
	return `skew(${skewArray.join(",")})`;
}

//#endregion
//#region src/components/transformFunctionsBase.js
/**
* Sets the property update function.
* * same to svgTransform, htmlAttributes
* @param {string} tweenProp the property name
*/
function onStartTransform(tweenProp) {
	if (!kute_default[tweenProp] && this.valuesEnd[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
		elem.style[tweenProp] = (a.perspective || b.perspective ? perspective(a.perspective, b.perspective, "px", v) : "") + (a.translate3d ? translate3d(a.translate3d, b.translate3d, "px", v) : "") + (a.rotate3d ? rotate3d(a.rotate3d, b.rotate3d, "deg", v) : "") + (a.skew ? skew(a.skew, b.skew, "deg", v) : "") + (a.scale || b.scale ? scale(a.scale, b.scale, v) : "");
	};
}

//#endregion
//#region src/components/transformFunctions.js
/**
* Returns the current property inline style.
* @param {string} tweenProp the property name
* @returns {string} inline style for property
*/
function getTransform(tweenProp) {
	const currentStyle = getInlineStyle(this.element);
	return currentStyle[tweenProp] ? currentStyle[tweenProp] : defaultValues_default[tweenProp];
}
/**
* Returns the property tween object.
* @param {string} _ the property name
* @param {Object<string, string | number | (string | number)[]>} obj the property value
* @returns {KUTE.transformFObject} the property tween object
*/
function prepareTransform(_, obj) {
	const prepAxis = [
		"X",
		"Y",
		"Z"
	];
	const transformObject = {};
	const translateArray = [];
	const rotateArray = [];
	const skewArray = [];
	const arrayFunctions = [
		"translate3d",
		"translate",
		"rotate3d",
		"skew"
	];
	Object.keys(obj).forEach((x) => {
		const pv = typeof obj[x] === "object" && obj[x].length ? obj[x].map((v) => parseInt(v, 10)) : parseInt(obj[x], 10);
		if (arrayFunctions.includes(x)) {
			const propId = x === "translate" || x === "rotate" ? `${x}3d` : x;
			if (x === "skew") transformObject[propId] = pv.length ? [pv[0] || 0, pv[1] || 0] : [pv || 0, 0];
			else if (x === "translate") transformObject[propId] = pv.length ? [
				pv[0] || 0,
				pv[1] || 0,
				pv[2] || 0
			] : [
				pv || 0,
				0,
				0
			];
			else transformObject[propId] = [
				pv[0] || 0,
				pv[1] || 0,
				pv[2] || 0
			];
		} else if (/[XYZ]/.test(x)) {
			const fn = x.replace(/[XYZ]/, "");
			const fnId = fn === "skew" ? fn : `${fn}3d`;
			const fnLen = fn === "skew" ? 2 : 3;
			let fnArray = [];
			if (fn === "translate") fnArray = translateArray;
			else if (fn === "rotate") fnArray = rotateArray;
			else if (fn === "skew") fnArray = skewArray;
			for (let fnIndex = 0; fnIndex < fnLen; fnIndex += 1) {
				const fnAxis = prepAxis[fnIndex];
				fnArray[fnIndex] = `${fn}${fnAxis}` in obj ? parseInt(obj[`${fn}${fnAxis}`], 10) : 0;
			}
			transformObject[fnId] = fnArray;
		} else if (x === "rotate") transformObject.rotate3d = [
			0,
			0,
			pv
		];
		else transformObject[x] = x === "scale" ? parseFloat(obj[x]) : pv;
	});
	return transformObject;
}
/**
* Prepare tween object in advance for `to()` method.
* @param {string} tweenProp the property name
*/
function crossCheckTransform(tweenProp) {
	if (this.valuesEnd[tweenProp]) {
		if (this.valuesEnd[tweenProp]) {
			if (this.valuesEnd[tweenProp].perspective && !this.valuesStart[tweenProp].perspective) this.valuesStart[tweenProp].perspective = this.valuesEnd[tweenProp].perspective;
		}
	}
}
const TransformFunctions = {
	component: "transformFunctions",
	property: "transform",
	subProperties: [
		"perspective",
		"translate3d",
		"translateX",
		"translateY",
		"translateZ",
		"translate",
		"rotate3d",
		"rotateX",
		"rotateY",
		"rotateZ",
		"rotate",
		"skewX",
		"skewY",
		"skew",
		"scale"
	],
	defaultValues: {
		perspective: 400,
		translate3d: [
			0,
			0,
			0
		],
		translateX: 0,
		translateY: 0,
		translateZ: 0,
		translate: [0, 0],
		rotate3d: [
			0,
			0,
			0
		],
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		rotate: 0,
		skewX: 0,
		skewY: 0,
		skew: [0, 0],
		scale: 1
	},
	functions: {
		prepareStart: getTransform,
		prepareProperty: prepareTransform,
		onStart: onStartTransform,
		crossCheck: crossCheckTransform
	},
	Interpolate: {
		perspective,
		translate3d,
		rotate3d,
		translate,
		rotate,
		scale,
		skew
	}
};
var transformFunctions_default = TransformFunctions;

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
function getTotalLength$1(el) {
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
	const length = /path|glyph/.test(element.tagName) ? element.getTotalLength() : getTotalLength$1(element);
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
		getTotalLength: getTotalLength$1,
		resetDraw,
		getDraw,
		percent
	}
};
var svgDraw_default = SvgDrawProperty;

//#endregion
//#region src/interpolation/coords.js
/**
* Coordinates Interpolation Function.
*
* @param {number[][]} a start coordinates
* @param {number[][]} b end coordinates
* @param {string} l amount of coordinates
* @param {number} v progress
* @returns {number[][]} the interpolated coordinates
*/
function coords(a, b, l, v) {
	const points = [];
	for (let i = 0; i < l; i += 1) {
		points[i] = [];
		for (let j = 0; j < 2; j += 1) points[i].push(((a[i][j] + (b[i][j] - a[i][j]) * v) * 1e3 >> 0) / 1e3);
	}
	return points;
}

//#endregion
//#region src/components/svgMorphBase.js
/**
* Sets the property update function.
* @param {string} tweenProp the property name
*/
function onStartSVGMorph(tweenProp) {
	if (!kute_default[tweenProp] && this.valuesEnd[tweenProp]) kute_default[tweenProp] = (elem, a, b, v) => {
		const path1 = a.polygon;
		const path2 = b.polygon;
		const len = path2.length;
		elem.setAttribute("d", v === 1 ? b.original : `M${coords(path1, path2, len, v).join("L")}Z`);
	};
}

//#endregion
//#region src/components/svgMorph.js
/**
* Returns an existing polygon or false if it's not a polygon.
* @param {SVGPath.pathArray} pathArray target `pathArray`
* @returns {KUTE.exactPolygon | false} the resulted polygon
*/
function exactPolygon(pathArray) {
	const polygon = [];
	const pathlen = pathArray.length;
	let segment = [];
	let pathCommand = "";
	if (!pathArray.length || pathArray[0][0] !== "M") return false;
	for (let i = 0; i < pathlen; i += 1) {
		segment = pathArray[i];
		[pathCommand] = segment;
		if (pathCommand === "M" && i || pathCommand === "Z") break;
		else if ("ML".includes(pathCommand)) polygon.push([segment[1], segment[2]]);
		else return false;
	}
	return pathlen ? { polygon } : false;
}
/**
* Returns a new polygon polygon.
* @param {SVGPath.pathArray} parsed target `pathArray`
* @param {number} maxLength the maximum segment length
* @returns {KUTE.exactPolygon} the resulted polygon
*/
function approximatePolygon(parsed, maxLength) {
	const ringPath = splitPath(parsed)[0];
	const normalPath = normalizePath(ringPath);
	const pathLength = getTotalLength(normalPath);
	const polygon = [];
	let numPoints = 3;
	let point;
	if (maxLength && !Number.isNaN(maxLength) && +maxLength > 0) numPoints = Math.max(numPoints, Math.ceil(pathLength / maxLength));
	for (let i = 0; i < numPoints; i += 1) {
		point = getPointAtLength(normalPath, pathLength * i / numPoints);
		polygon.push([point.x, point.y]);
	}
	if (polygonTools.polygonArea(polygon) > 0) polygon.reverse();
	return {
		polygon,
		skipBisect: true
	};
}
/**
* Parses a path string and returns a polygon array.
* @param {string} str path string
* @param {number} maxLength maximum amount of points
* @returns {KUTE.exactPolygon} the polygon array we need
*/
function pathStringToPolygon(str, maxLength) {
	const parsed = normalizePath(str);
	return exactPolygon(parsed) || approximatePolygon(parsed, maxLength);
}
/**
* Rotates a polygon to better match its pair.
* @param {KUTE.polygonMorph} polygon the target polygon
* @param {KUTE.polygonMorph} vs the reference polygon
*/
function rotatePolygon(polygon, vs) {
	const len = polygon.length;
	let min = Infinity;
	let bestOffset;
	let sumOfSquares = 0;
	let spliced;
	let d;
	let p;
	for (let offset = 0; offset < len; offset += 1) {
		sumOfSquares = 0;
		for (let i = 0; i < vs.length; i += 1) {
			p = vs[i];
			d = distanceSquareRoot(polygon[(offset + i) % len], p);
			sumOfSquares += d * d;
		}
		if (sumOfSquares < min) {
			min = sumOfSquares;
			bestOffset = offset;
		}
	}
	if (bestOffset) {
		spliced = polygon.splice(0, bestOffset);
		polygon.splice(polygon.length, 0, ...spliced);
	}
}
/**
* Sample additional points for a polygon to better match its pair.
* @param {KUTE.polygonObject} polygon the target polygon
* @param {number} numPoints the amount of points needed
*/
function addPoints(polygon, numPoints) {
	const desiredLength = polygon.length + numPoints;
	const step = polygonTools.polygonLength(polygon) / numPoints;
	let i = 0;
	let cursor = 0;
	let insertAt = step / 2;
	let a;
	let b;
	let segment;
	while (polygon.length < desiredLength) {
		a = polygon[i];
		b = polygon[(i + 1) % polygon.length];
		segment = distanceSquareRoot(a, b);
		if (insertAt <= cursor + segment) {
			polygon.splice(i + 1, 0, segment ? midPoint(a, b, (insertAt - cursor) / segment) : a.slice(0));
			insertAt += step;
		} else {
			cursor += segment;
			i += 1;
		}
	}
}
/**
* Split segments of a polygon until it reaches a certain
* amount of points.
* @param {number[][]} polygon the target polygon
* @param {number} maxSegmentLength the maximum amount of points
*/
function bisect(polygon, maxSegmentLength = Infinity) {
	let a = [];
	let b = [];
	for (let i = 0; i < polygon.length; i += 1) {
		a = polygon[i];
		b = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];
		while (distanceSquareRoot(a, b) > maxSegmentLength) {
			b = midPoint(a, b, .5);
			polygon.splice(i + 1, 0, b);
		}
	}
}
/**
* Checks the validity of a polygon.
* @param {KUTE.polygonMorph} polygon the target polygon
* @returns {boolean} the result of the check
*/
function validPolygon(polygon) {
	return Array.isArray(polygon) && polygon.every((point) => Array.isArray(point) && point.length === 2 && !Number.isNaN(point[0]) && !Number.isNaN(point[1]));
}
/**
* Returns a new polygon and its length from string or another `Array`.
* @param {KUTE.polygonMorph | string} input the target polygon
* @param {number} maxSegmentLength the maximum amount of points
* @returns {KUTE.polygonMorph} normalized polygon
*/
function getPolygon(input, maxSegmentLength) {
	let skipBisect;
	let polygon;
	if (typeof input === "string") {
		const converted = pathStringToPolygon(input, maxSegmentLength);
		({polygon, skipBisect} = converted);
	} else if (!Array.isArray(input)) throw Error(`${invalidPathValue}: ${input}`);
	/** @type {KUTE.polygonMorph} */
	const points = [...polygon];
	if (!validPolygon(points)) throw Error(`${invalidPathValue}: ${points}`);
	if (points.length > 1 && distanceSquareRoot(points[0], points[points.length - 1]) < 1e-9) points.pop();
	if (!skipBisect && maxSegmentLength && !Number.isNaN(maxSegmentLength) && +maxSegmentLength > 0) bisect(points, maxSegmentLength);
	return points;
}
/**
* Returns two new polygons ready to tween.
* @param {string} path1 the first path string
* @param {string} path2 the second path string
* @param {number} precision the morphPrecision option value
* @returns {KUTE.polygonMorph[]} the two polygons
*/
function getInterpolationPoints(path1, path2, precision) {
	const morphPrecision = precision || defaultOptions_default.morphPrecision;
	const fromRing = getPolygon(path1, morphPrecision);
	const toRing = getPolygon(path2, morphPrecision);
	const diff = fromRing.length - toRing.length;
	addPoints(fromRing, diff < 0 ? diff * -1 : 0);
	addPoints(toRing, diff > 0 ? diff : 0);
	rotatePolygon(fromRing, toRing);
	return [fromRing, toRing];
}
/**
* Returns the current `d` attribute value.
* @returns {string} the `d` attribute value
*/
function getSVGMorph() {
	return this.element.getAttribute("d");
}
/**
* Returns the property tween object.
* @param {string} _ the property name
* @param {string | KUTE.polygonObject} value the property value
* @returns {KUTE.polygonObject} the property tween object
*/
function prepareSVGMorph(_, value) {
	const pathObject = {};
	const pathReg = /* @__PURE__ */ new RegExp("\\n", "ig");
	let elem = null;
	if (value instanceof SVGPathElement) elem = value;
	else if (/^\.|^#/.test(value)) elem = selector(value);
	if (typeof value === "object" && value.polygon) return value;
	if (elem && ["path", "glyph"].includes(elem.tagName)) pathObject.original = elem.getAttribute("d").replace(pathReg, "");
	else if (!elem && typeof value === "string") pathObject.original = value.replace(pathReg, "");
	return pathObject;
}
/**
* Enables the `to()` method by preparing the tween object in advance.
* @param {string} prop the `path` property name
*/
function crossCheckSVGMorph(prop) {
	if (this.valuesEnd[prop]) {
		const pathArray1 = this.valuesStart[prop].polygon;
		const pathArray2 = this.valuesEnd[prop].polygon;
		if (!pathArray1 || !pathArray2 || pathArray1.length !== pathArray2.length) {
			const p1 = this.valuesStart[prop].original;
			const p2 = this.valuesEnd[prop].original;
			const [path1, path2] = getInterpolationPoints(p1, p2, this._morphPrecision ? parseInt(this._morphPrecision, 10) : defaultOptions_default.morphPrecision);
			this.valuesStart[prop].polygon = path1;
			this.valuesEnd[prop].polygon = path2;
		}
	}
}
const SVGMorph = {
	component: "svgMorph",
	property: "path",
	defaultValue: [],
	Interpolate: coords,
	defaultOptions: { morphPrecision: 10 },
	functions: {
		prepareStart: getSVGMorph,
		prepareProperty: prepareSVGMorph,
		onStart: onStartSVGMorph,
		crossCheck: crossCheckSVGMorph
	},
	Util: {
		addPoints,
		bisect,
		getPolygon,
		validPolygon,
		getInterpolationPoints,
		pathStringToPolygon,
		distanceSquareRoot,
		midPoint,
		approximatePolygon,
		rotatePolygon,
		pathToString,
		pathToCurve,
		getTotalLength,
		getPointAtLength,
		polygonTools,
		roundPath
	}
};
var svgMorph_default = SVGMorph;

//#endregion
//#region src/objects/componentsDefault.js
const Components = {
	EssentialBoxModel: boxModelEssential_default,
	ColorsProperties: colorProperties_default,
	HTMLAttributes: htmlAttributes_default,
	OpacityProperty: opacityProperty_default,
	TextWriteProp: textWrite_default,
	TransformFunctions: transformFunctions_default,
	SVGDraw: svgDraw_default,
	SVGMorph: svgMorph_default
};
Object.keys(Components).forEach((component) => {
	const compOps = Components[component];
	Components[component] = new Animation(compOps);
});
var componentsDefault_default = Components;

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
//#region src/index.js
const KUTE = {
	Animation,
	Components: componentsDefault_default,
	Tween,
	fromTo,
	to,
	TweenCollection,
	allFromTo,
	allTo,
	Objects: objects_default,
	Util: util_default,
	Easing: easing_bezier_default,
	CubicBezier,
	Render: render_default,
	Interpolate: interpolate_default,
	Process: process_default,
	Internals: internals_default,
	Selector: selector,
	Version: version_default
};
var src_default = KUTE;

//#endregion
export { src_default as default };