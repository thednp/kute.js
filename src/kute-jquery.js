/* KUTE.js - The Light Tweening Engine
 * package jQuery Plugin
 * by dnp_theme
 * Licensed under MIT-License
 */

 (function(factory){
  // We need to require the root KUTE and jQuery.
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js", "jquery"], function(KUTE, $){
      factory($, KUTE);
      return KUTE;
    });
  } else if(typeof module == "object" && typeof require == "function") {
    // We assume, that require() is sync.
    var KUTE = require("./kute.js");
    var $ = require("jquery");
    
    // Export the modified one. Not really required, but convenient.
    module.exports = factory($, KUTE);
  } else if (typeof window.KUTE !== "undefined" && (typeof window.$ !== 'undefined' || typeof window.jQuery !== 'undefined' ) ) {
    // jQuery always has two ways of existing... Find one, and pass.
    var $ = window.jQuery || window.$, KUTE = window.KUTE;
    $.fn.KUTE = factory($, KUTE);
  } else {
    throw new Error("jQuery plugin for KUTE.js depends on KUTE.js and jQuery. Read the docs for more info.");
  }
 })(function($, KUTE) {
  'use strict';
  var $K = function( method, start, end, ops ) { // method can be fromTo(), to(), stop(), start(), chain(), pause()
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
  return $K;
});
