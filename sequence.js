/*!
 * Sequence.js
 * v1.0.3 for KUTE.js
 * by @dalisoft (https://github.com/dalisoft)
 * (c) 2016, @dalisoft.
 * MIT-Licensed
 */

(function (factory) {
	if (typeof(module) === "object" && module.exports !== undefined) {
		module.exports = factory();
	} else if (typeof(define) === "function" && define.amd !== undefined) {
		define(factory);
	} else if (typeof(window) === "object") {
		window.Sequence = factory();
	} else {
		factory();
	}
}
	(function () {
		function Sequence(options) {
			if (window === this) {
				return new Sequence(options);
			}
			this.options = options || {};
			this.queue = [];
			this.queued = 0;
			this.tweens = [];
			this.labels = {}; /* we add this on future release */
			return this;
		}

		var p = Sequence.prototype;
		var lastSeqTime = 0;
		p.tween = function (el, f, t, s, options, queue) {
			options = options || {};
			d = options.d !== undefined ? options.d : 1000;
			lastSeqTime += d;
			options.delay = options.delay !== undefined ? options.delay : 0;
			queue = queue !== undefined ? queue : true;
			var els = typeof el === "string" ? document.querySelectorAll(el) : el.length ? el : [el]; // re-make selector to improve performance
			var tweens = [];
			var totalDuration = 0;
			var _evDelay = 0;
			for (var o in this.options) {
				if (!options[o]) {
					options[o] = this.options[o];
				}
			}
			options.repeat = options.repeat || 0;
			for (var i = 0, len = els.length; i < len; i++) {
				var tween = f === undefined ? KUTE.to(els[i], t, options) : KUTE.fromTo(els[i], f, t, options);
				tweens.push({
					tween : tween,
					evDelay : i * s
				});
				_evDelay = i * s;
			}
			totalDuration = (d * options.repeat) + _evDelay + options.delay;
			this.queue.push({
				tweens : tweens,
				totalDuration : (queue && totalDuration !== Infinity) ? totalDuration : 0
			});
			this.queued++;
			return this;
		};
		p.to = function (el, t, d, s, options) {
			return this.tween(el, undefined, t, d, s, options);
		};
		p.fromTo = function (el, f, t, d, s, options) {
			return this.tween(el, f, t, d, s, options);
		};
		p.start = function (time) {
			var queue = this.queue;
			time = time !== undefined ? time : window.performance.now();
			for (var i = 0; i < this.queued; i++) {
				time += lastSeqTime * (i / 2);
				var q = queue[i].tweens;
				var startTime = (queue[i].totalDuration * i) + time;
				for (var tweenIndex = 0, length = q.length; tweenIndex < length; tweenIndex++) {
					var tween = q[tweenIndex],
					curr = tween.tween,
					evDelay = tween.evDelay;
					curr.start(evDelay + startTime);
					this.tweens.push(curr);
				}
			}
		};
		p.control = function (type, value) {
			var tweens = this.tweens;
			for (var i = 0, len = tweens.length; i < len; i++) {
				tweens[i][type](value);
			}
			return this;
		};
		var control = ['play', 'pause', 'timeScale', 'makeFaster', 'makeSlower', 'repeat', 'yoyo', 'delay', 'repeatDelay', 'easing', 'interpolation', 'restart', 'seek', 'stop'];
		control.forEach(function (name) {
			p[name] = function (value) {
				return this.control(name, value);
			}
		});
		return Sequence;
	}));
