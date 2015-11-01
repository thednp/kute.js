/* KUTE.js - The Light Tweening Engine
 * package jQuery Plugin
 * by dnp_theme
 * Licensed under MIT-License
 */

 (function(kutejQuery){
	 // We need to require the root KUTE and jQuery.
     if(define == "function") {
         define(["./kute.js", "jQuery"], function(KUTE, $){
			 kutejQuery($, KUTE);
			 return KUTE;
		 });
     } else if(typeof module == "object" && typeof require == "function") {
         // We assume, that require() is sync.
         var KUTE = require("./kute.js");
		 var $ = require("jQuery");
         kutejQuery($, KUTE);
         // Export the modified one. Not really required, but convenient.
         module.exports = $;
     } else if(typeof root.KUTE != "undefined") {
		 // jQuery always has two ways of existing... Find one, and pass.
		 var $ = root.jQuery || root.$;
         kutejQuery($, root.KUTE);
     } else {
         throw new Error("KUTE.js jQuery depends on KUTE.js and jQuery. Read the docs for more info.")
     }
 })(function($, KUTE) {
	$.fn.KUTE = function( method, start, end, ops ) { // method can be Animate(), fromTo(), to(), stop(), start(), chain(), pause()
		var tws = [], i, l = this.length;

		for (i=0;i<l;i++){
			var mt = this[i][method];
			if ( typeof mt === 'function' ) {
				mt.apply(this[i]);
			}
			if ( method === 'to' ) {
				tws.push( new KUTE[method]( this[i], start, end ) ); // here start is end and end is ops
			} else if ( method === 'fromTo' || method === 'Animate' ) {
				tws.push( new KUTE[method]( this[i], start, end, ops ) );
			} else if ( method === 'chain' ) {
				this[i].chain.apply(this[i],start);
			}
		}
		return tws;
	};
});
