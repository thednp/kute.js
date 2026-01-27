/*!
* KUTE.js Base v2.2.5 (http://thednp.github.io/kute.js)
* Copyright 2015-2026 © thednp
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports =  factory() :
  typeof define === 'function' && define.amd ? define([], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.KUTE = factory()));
})(this, function() {

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
//#region src/objects/linkProperty.js
	const linkProperty = {};
	var linkProperty_default = linkProperty;

//#endregion
//#region src/objects/onComplete.js
	const onComplete = {};
	var onComplete_default = onComplete;

//#endregion
//#region src/objects/objectsBase.js
	const Objects = {
		defaultOptions: defaultOptions_default,
		linkProperty: linkProperty_default,
		onStart: onStart_default,
		onComplete: onComplete_default
	};
	var objectsBase_default = Objects;

//#endregion
//#region src/objects/util.js
	const Util = {};
	var util_default = Util;

//#endregion
//#region src/objects/connect.js
	const connect = {};
	/** @type {KUTE.TweenBase | KUTE.Tween | KUTE.TweenExtra} */
	connect.tween = null;
	connect.processEasing = null;
	var connect_default = connect;

//#endregion
//#region src/easing/easing-base.js
	const Easing = {
		linear: (t) => t,
		easingQuadraticIn: (t) => t * t,
		easingQuadraticOut: (t) => t * (2 - t),
		easingQuadraticInOut: (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
		easingCubicIn: (t) => t * t * t,
		easingCubicOut: (t0) => {
			const t = t0 - 1;
			return t * t * t + 1;
		},
		easingCubicInOut: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
		easingCircularIn: (t) => -(Math.sqrt(1 - t * t) - 1),
		easingCircularOut: (t0) => {
			const t = t0 - 1;
			return Math.sqrt(1 - t * t);
		},
		easingCircularInOut: (t0) => {
			let t = t0 * 2;
			if (t < 1) return -.5 * (Math.sqrt(1 - t * t) - 1);
			t -= 2;
			return .5 * (Math.sqrt(1 - t * t) + 1);
		},
		easingBackIn: (t) => {
			const s = 1.70158;
			return t * t * ((s + 1) * t - s);
		},
		easingBackOut: (t0) => {
			const s = 1.70158;
			const t = t0 - 1;
			return t * t * ((s + 1) * t + s) + 1;
		},
		easingBackInOut: (t0) => {
			const s = 1.70158 * 1.525;
			let t = t0 * 2;
			if (t < 1) return .5 * (t * t * ((s + 1) * t - s));
			t -= 2;
			return .5 * (t * t * ((s + 1) * t + s) + 2);
		}
	};
	/**
	* Returns a valid `easingFunction`.
	*
	* @param {KUTE.easingFunction | string} fn function name or constructor name
	* @returns {KUTE.easingFunction} a valid easing function
	*/
	function processEasing(fn) {
		if (typeof fn === "function") return fn;
		if (typeof Easing[fn] === "function") return Easing[fn];
		return Easing.linear;
	}
	connect_default.processEasing = processEasing;
	var easing_base_default = Easing;

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
//#region src/objects/supportedProperties.js
	const supportedProperties = {};
	var supportedProperties_default = supportedProperties;

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
//#region src/animation/animationBase.js
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
	var AnimationBase = class {
		/**
		* @class
		* @param {KUTE.baseComponent} Component
		*/
		constructor(Component) {
			const ComponentName = Component.component;
			const Functions = {
				onStart: onStart_default,
				onComplete: onComplete_default
			};
			const Category = Component.category;
			const Property = Component.property;
			this._ = 0;
			supportedProperties_default[ComponentName] = Component.properties || Component.subProperties || Component.property;
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
			return { name: ComponentName };
		}
	};

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
	const TransformFunctionsBase = {
		component: "baseTransform",
		property: "transform",
		functions: { onStart: onStartTransform },
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
	var transformFunctionsBase_default = TransformFunctionsBase;

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
	const BoxModelBase = {
		component: "baseBoxModel",
		category: "boxModel",
		properties: baseBoxProps,
		Interpolate: { numbers },
		functions: { onStart: baseBoxOnStart }
	};
	var boxModelBase_default = BoxModelBase;

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
	const OpacityPropertyBase = {
		component: "baseOpacity",
		property: "opacity",
		Interpolate: { numbers },
		functions: { onStart: onStartOpacity }
	};
	var opacityPropertyBase_default = OpacityPropertyBase;

//#endregion
//#region src/objects/componentsBase.js
	const Components = {
		Transform: new AnimationBase(transformFunctionsBase_default),
		BoxModel: new AnimationBase(boxModelBase_default),
		Opacity: new AnimationBase(opacityPropertyBase_default)
	};
	var componentsBase_default = Components;

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
//#region src/index-base.js
	var index_base_default = {
		Animation: AnimationBase,
		Components: componentsBase_default,
		Tween: TweenBase,
		fromTo,
		Objects: objectsBase_default,
		Easing: easing_base_default,
		Util: util_default,
		Render: render_default,
		Interpolate: interpolate_default,
		Internals: internals_default,
		Selector: selector,
		Version: version_default
	};

//#endregion
return index_base_default;
});