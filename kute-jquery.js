/* KUTE.js - The Light Tweening Engine
 * package jQuery Plugin
 * by dnp_theme
 * Licensed under MIT-License
 */

(function(root,factory){
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
  } else if (typeof root.KUTE !== "undefined" && (typeof root.$ !== 'undefined' || typeof root.jQuery !== 'undefined' ) ) {
    // jQuery always has two ways of existing... Find one, and pass.
    var $ = root.jQuery || root.$, KUTE = root.KUTE;
    factory($, KUTE);
  } else {
    throw new Error("jQuery Plugin for KUTE.js depend on KUTE.js and jQuery");
  }
 })(this, function($, KUTE) {
  'use strict';

  $.fn.fromTo = function(from,to,ops) {
    var el = this.length > 1 ? this : this[0], method = this.length > 1 ? 'allFromTo' : 'fromTo';
    return KUTE[method](el,from,to,ops);
  };

  $.fn.to = function(to,ops) {
    var el = this.length > 1 ? this : this[0], method = this.length > 1 ? 'allTo' : 'to';
    return KUTE[method](el,to,ops);
  };

  return this;
});