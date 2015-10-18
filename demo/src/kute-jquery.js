/* KUTE.js - The Light Tweening Engine
 * package jQuery Plugin
 * by dnp_theme
 * Licensed under MIT-License
 */

(function($) {
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
})(jQuery);	