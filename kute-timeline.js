/* KUTE.js - The Light Tweening Engine
 * package - Timeline plug-in
 * desc - Timelines with all controls
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
		throw new Error("Timeline plug-in require KUTE.js.");
	}
}
	(function (KUTE) {
		KUTE.Timeline = function (defOpt) {
			this._tweens = [];
			this._startTime = [0];
			this._collection = [];
			this._lagTime = [0];
			var _totalTime = 0;
			this.tween = function (els, from, to, options) {
				if (arguments.length === 3) {
					options = to;
					to = from;
				}
				var all = document.querySelectorAll(els);
				var opt = {};
				for (var prop in to) {
					for (var set in options) {
						opt[set] = options[set][prop] || options[set] || defOpt[set][prop] || defOpt[prop];
					}
					var offset = opt.offset || 0;
					opt.delay = (opt.delay || 0) + _totalTime;
					for (var i = 0, len = all.length; i < len; i++) {
						opt.delay = opt.delay ? opt.delay + offset : offset;
						if (arguments.length === 4) {
							this._tweens.push(KUTE.fromTo(all[i], from, to, opt));
						} else if (arguments.length === 3) {
							this._tweens.push(KUTE.to(all[i], to, opt));
						}
						this._collection.push(all[i]);
					}
					_totalTime += opt.duration || 1000;
					this._startTime.push((this._startTime[this._startTime.length - 1] || 0));
				}

				return this.start();
			};
			this.to = function (els, to, opt) {
				return this.tween(els, to, opt);
			}
			this.fromTo = function (els, from, to, opt) {
				return this.tween(els, from, to, opt);
			}
			this.control = function (prop, v) {
				var t = this._startTime,
				s = this;
				for (var i = 0, len = t.length; i < len; i++) {
					for (var it = 0, lent = this._tweens.length; it < lent; it++) {
						for (var el = 0, len2 = this._collection.length; el < len2; el++) {
							this._tweens[it][prop].apply(this._tweens[it], v);
						}
					}
				}
			}
			this.start = function () {
				return this.control('start', [])
			}
			return this;
		}

	}));
