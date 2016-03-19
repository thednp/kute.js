/* KUTE.js - The Light Tweening Engine
 * package - HTML Plugin
 * desc - makes tween object with HTML
 * by @dalisoft (https://github.com/dalisoft)
 * Licensed under MIT-License
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    // We assume, that require() is sync.
    var KUTE = require("./kute.js");   
    // Export the modified one. Not really required, but convenient.
    module.exports = factory(KUTE);
  } else if ( typeof window.KUTE !== 'undefined' ) {
    // Browser globals		
    factory(KUTE);
  } else {
    throw new Error("HTML Plugin require KUTE.js.");
  }
}( function (KUTE) {
  'use strict';
		// performance-ready simple & lightweight HTML plug-in for KUTE.js
	  var kute = [].slice.call(document.querySelectorAll('[kute]'));
		  kute.map(function(k){
			var type = k.getAttribute("kute"), prop = (new Function("return {" + k.getAttribute("kute-props") + "}")()), opt = (new Function("return {" + k.getAttribute("kute-options") + "}")())
			KUTE[type](/all/.test(type) ? (k.getAttribute("class") || "").split(" ")[0] || k.tagName : k, type === "fromTo" ? prop.from : prop, type === "fromTo" ? prop.to : opt, type === "fromTo" && opt).start();
		  });
}));
