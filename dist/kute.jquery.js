// KUTE jQuery Plugin for kute.js | by dnp_theme | License - MIT
// $('selector').Kute(method, options);

(function($) {
	$.fn.Kute = function( method, options ) { // method can be Animate(), fromTo(), to(), stop(), start(), chain(), etc
		return this.each(function(){
			new KUTE[method]( this, options );
		});
	};	
})(jQuery);
