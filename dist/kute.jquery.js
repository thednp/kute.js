// KUTE jQuery Plugin for kute.js | by dnp_theme | License - MIT
// $('selector').Kute(method, options);

(function($) {		
	$.fn.KUTE = function( method, start, end, ops ) { // method can be Animate(), fromTo(), to(), stop(), start(), chain(), pause()	
		var mt = this[0][method], i, l = this.length;
		if ( typeof mt === 'function' ) {
			mt.apply(this[0]);
		}
		for (i=0;i<l;i++){
			if ( method === 'to' ) {				
				return new KUTE[method]( this[i], start, end ); // here start is end and end is ops 
			} else if ( method === 'fromTo' || method === 'Animate' ) {
				return new KUTE[method]( this[i], start, end, ops );
			}			
		}
	};
})(jQuery);		
