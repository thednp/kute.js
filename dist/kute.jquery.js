// KUTE jQuery Plugin for kute.js | by dnp_theme | License - MIT
// $('selector').Kute(options);

(function($) {
	$.fn.Kute = function( options ) {
	function fn(next){
		if ( next ) {
			options.finish = options.finish ? function () {
				options.finish();
				next();
			} : next;
		}
			new KUTE.Animate( this, options );
	}
		return $.queue ? this.queue(fn) : this.each(fn);
	};	
})(jQuery);
