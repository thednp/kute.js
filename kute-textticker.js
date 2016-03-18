/*!
 * TextTickerPlugin.js
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
    factory(window.KUTE);
  } else {
    throw new Error("TextTicker-Plugin requires KUTE.js.");
  }
}( function (KUTE) {

	function TextTicker( element, _a ) {

		return function ( _b ) {

			var len = Math.max(_a.length, _b.length);

			return function( value ) {

				var substr = Math.floor( Math.min( value * len, len ) );

				element.innerHTML = _b.substring( 0, substr ) + _a.substr( substr );
				
			};

		}

}

KUTE.pp['text'] = function( prop, value, element ){

	if ( typeof value === "string" ) {

		var t = TextTicker( element, element.innerHTML )( value );

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
