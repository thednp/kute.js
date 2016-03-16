/*!
 * TextPlugin.js
 * version 1.0.0
 * A string character tweening
 * special for KUTE.js
 * by @dalisoft (https://github.com/dalisoft)
 * Licensed under MIT-License
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    var KUTE = require("./kute.js");   
    module.exports = factory(KUTE);
  } else if ( typeof window.KUTE !== 'undefined' ) {		
    factory();
  } else {
    throw new Error("Text-Plugin requires KUTE.js.");
  }
}( function () {

	function Text( element, initial ) {

	if ( !( this instanceof Text ) ) {

		return new Text( initial );

	}

	var _a = initial,
		_b = null,
		_c = null,
		_s = String(" 0123456789abcdefghijklmnopqrstuvwxyz".toUpperCase() + "abcdefghijklmnopqrstuvwxyz~!@#$%^&*()_+{}[];'<>,./?\=-").split(""),
		_parseText = this.parseText = function ( str ) {

			var _str = str.split("");
			var _len = _str.length;
			var i = 0;
			var len = 0;
			var _parsed = [];
			while (i < _len) {
				var ii = _s.indexOf(_str[i]);
				if (ii !== -1) {
				_parsed.push(ii);
				}
				i++;
			}
			return _parsed;

		},
		_normalizeText = this.normalizeText = function ( a, b ) {

		var max = a.length > b.length,

			_max = max ? a : b,

			_min = max ? b : a;

			for ( var i in _max ) {

				if ( _min[i] === undefined) {

					_min[i] = 0;

				}

			}

			_min.length = _max.length;

			a = max ? _max : _min;

			b = max ? _min : _max;

		},
		_tween = this.tween = function ( fn ) {

			return function ( value ) {

				fn( value );

			}

		};

		this.text = function ( newText ) {

				_b = newText;

			var _start = _parseText(_a),

				_end = _parseText(_b),

				_cache = [];

				_normalizeText( _start, _end );
				
			return _tween(function( value ) {

				for ( var i = 0, len = _end.length, a, b; i < len; i++ ) {

					var a = _start[i],

						b = _end[i],

						num = Math.floor(a + ( b - a ) * value);

					_cache[i] = _s[num];

				}

				element.textContent = _cache.join("");
				

			});

		}

	return this;

}

KUTE.pp['text'] = function( prop, value, element ){

	if ( typeof value === "string" ) {

		var t = new Text( element, element.textContent ).text( value );

		if ( !( 'text' in KUTE.dom ) ) {

			KUTE.dom['text'] = function (elem, prop, value) {

					t(value);
			}

		}

	}

	return this;

}

    return this;

}));
