/* KUTE.js - The Light Tweening Engine
 * package - KUTE Effects Plugin
 * desc - Customized and easy accessible FX effects
 * by @dalisoft (https://github.com/dalisoft)
 * Licensed under MIT-License
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(["./kute.js"], function (KUTE) {
			factory(KUTE);
			return KUTE;
		});
	} else if (typeof module == "object" && typeof require == "function") {
		// We assume, that require() is sync.
		var KUTE = require("./kute.js");
		// Export the modified one. Not really required, but convenient.
		module.exports = factory(KUTE);
	} else if (typeof window.KUTE !== 'undefined') {
		// Browser globals
		factory(window.KUTE);
	} else {
		throw new Error("Effects plugin require KUTE.js.");
	}
}
	(function (KUTE) {

		KUTE.Effects = {
			setEffect : function (name, to, options) {
				KUTE.Effects[name] = function (element) {
					return {
						to : to,
						options : options(element)
					}
				}
			},
			Show : function (element) {
				return {
					to : {
						opacity : 1
					},
					options : {
						start : function () {
							element.style.display = 'block';
						}
					}
				}
			},
			Hide : function (element) {
				return {
					to : {
						opacity : 0
					},
					options : {
						complete : function () {
							element.style.display = 'none';
						}
					}
				}
			},
			SlideUp : function (element) {
				return {
					to : {
						height : 0
					},
					options : {
						easing : 'easingQuadInOut',
						complete : function () {
							element.style.display = 'none';
						}
					}
				}
			},
			/* TO-Do
			SlideDown : function ( element ) {
			return {
			to : { maxHeight : 200 },
			options : {
			start : function () {
			element.style.display = 'block';
			element.style.height = '0px';
			},
			complete : function () {
			element.style.height = '';
			}
			}
			}
			}*/
		};

		KUTE.setEffect = KUTE.Effects.setEffect;

		// you can add effects with ```setEffect``` function like this
		KUTE.Effects.setEffect('ScaleOut', { scale : [0, 0], }, function ( element ) {
		return {
			easing : 'easingQuadInOut',
			complete : function () {
				element.style.display = 'none';
			}
		}
	  });

		KUTE.pp['effect'] = function (property, effect, element) {

			if (KUTE.Effects[effect]) {
				var effects = KUTE.Effects[effect](element),
				tween = KUTE.to(element, effects.to, effects.options).start();

				KUTE.dom['effect'] = function (object, propertyName, value) {}
			}

			return {};
		};

	}));
