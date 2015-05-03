// kute.full.js - The Light Tweening Engine | by dnp_theme
// http://themeforest.net/user/dnp_theme
// License - MIT

 
// KUTE MAIN OBJECT
var KUTE = KUTE || ( function () {
	var _tweens = [];
	return {
		getAll: function () {
			return _tweens;
		},
		removeAll: function () {
			_tweens = [];
		},
		add: function ( tween ) {
			_tweens.push( tween );
		},
		remove: function ( tween ) {
			var i = _tweens.indexOf( tween );
			if ( i !== -1 ) {
				_tweens.splice( i, 1 );
			}
		},
		update: function ( time ) {
			if ( _tweens.length === 0 ) return false;
			var i = 0;
			time = time !== undefined ? time : window.performance.now();
			while ( i < _tweens.length ) {
				if ( _tweens[ i ].update( time ) ) {
					i++;
				} else {
					_tweens.splice( i, 1 );
				}
			}
			return true;
		},
		process : function ( time ) {
			requestAnimationFrame(KUTE.process);
			KUTE.update( time );
		}
	};
} )();

KUTE.Animate = function( object, options ) {
	
	//element to animate
	var el = typeof object === 'object' ? object : document.querySelector(object);
	
	//get true scroll container and current scroll
	var bd = document.body, 
		htm = document.getElementsByTagName('HTML')[0],
		sct = /webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? bd : htm,		
		crs = window.pageYOffset || sct.scrollTop;
	
	//determine if we're on IE or IE8
	var isIE = document.documentElement.classList.contains('ie');
	var isIE8 = document.documentElement.classList.contains('ie8');
	
	//get element current style
	var css = el.currentStyle || window.getComputedStyle(el);
	
	// default values
	var ops = {
		from : {
			opacity		: 1, // integer
			width		: '', // integer/px/%
			height		: '', // integer/px/%
			color		: '', //hex/rgb
			backgroundColor : '', //hex/rgb				
			position	: {top:'',right:'',bottom:'',left:''}, // integer/%
			backgroundPosition: {x:'',y:''}, // integer/%/string[left,center,bottom,etc]
			translate	: {x:0, y:0, z:0}, // integer only
			rotate		: {x:0, y:0, z:0}, // integer only
			scale		: 1, // integer only
			scroll		: crs, // integer only		
		},
		to : {
			opacity		: '',
			width		: '', 
			height		: '',
			color		: '',
			backgroundColor : '',
			position	: {top:'',right:'',bottom:'',left:''},
			backgroundPosition: {x: '', y: ''},			
			translate	: {x:'', y:'', z:''},
			rotate		: {x:'', y:'', z:''},
			scale		: '',
			scroll		: '',			
		},
		easing			: KUTE.Easing.Linear.None, //pe('linear')
		delay			: 0,
		duration		: 500,
		start			: null, // run function when tween starts 
		finish			: null, // run function when tween finishes
		special			: null // run function while tween runing
	};

	//override the default values with option values
	for (var x in options) {
	  if(typeof(options[x]) === 'object'){
		 for (var y in options[x]){
			 ops[x][y] = options[x][y];
		 }		  
	  }else{
		  ops[x] = options[x];
	  }
	}
		
	//create shorthand for all properties
	var ofo = ops.from.opacity;
	var ofw = ops.from.width;
	var ofh = ops.from.height;
	var ofc = ops.from.color;
	var ofbc = ops.from.backgroundColor;
	var oft = ops.from.position.top;
	var ofr = ops.from.position.right;
	var ofb = ops.from.position.bottom;
	var ofl = ops.from.position.left;
	var ofbx = ops.from.backgroundPosition.x;
	var ofby = ops.from.backgroundPosition.y;
	var oftx = ops.from.translate.x;
	var ofty = ops.from.translate.y;
	var oftz = ops.from.translate.z;
	var ofrx = ops.from.rotate.x;
	var ofry = ops.from.rotate.y;
	var ofrz = ops.from.rotate.z;
	var ofs = ops.from.scale;
	var ofsc = ops.from.scroll;

	var oto = ops.to.opacity;
	var otw = ops.to.width;
	var oth = ops.to.height;
	var otc = ops.to.color;
	var otbc = ops.to.backgroundColor;
	var ott = ops.to.position.top;
	var otr = ops.to.position.right;
	var otb = ops.to.position.bottom;
	var otl = ops.to.position.left;
	var otbx = ops.to.backgroundPosition.x;
	var otby = ops.to.backgroundPosition.y;
	var ottx = ops.to.translate.x;
	var otty = ops.to.translate.y;
	var ottz = ops.to.translate.z;
	var otrx = ops.to.rotate.x;
	var otry = ops.to.rotate.y;
	var otrz = ops.to.rotate.z;
	var ots = ops.to.scale;
	var otsc = ops.to.scroll;		
		
	//process easing
	var pes = typeof ops.easing === 'string' ? pe(ops.easing) : ops.easing;
	
	//from/initial values
	var icor = (cv(ofc) ? parseInt(pc(ofc)[0]) : '') || parseInt(pc(truC(css.color))[0]);
	var icog = (cv(ofc) ? parseInt(pc(ofc)[1]) : '') || parseInt(pc(truC(css.color))[1]);
	var icob = (cv(ofc) ? parseInt(pc(ofc)[2]) : '') || parseInt(pc(truC(css.color))[2]);
	
	var ibcr = (cv(ofbc) ? parseInt(pc(ofbc)[0]) : '') || parseInt(pc(truC(css.backgroundColor))[0]);
	var ibcg = (cv(ofbc) ? parseInt(pc(ofbc)[1]) : '') || parseInt(pc(truC(css.backgroundColor))[1]);
	var ibcb = (cv(ofbc) ? parseInt(pc(ofbc)[2]) : '') || parseInt(pc(truC(css.backgroundColor))[2]);
		
	var iwi	= cv(ofw) ? truD(ofw)[0] : truD( css.width )[0];
	var ihe	= cv(ofh) ? truD(ofh)[0] : truD( css.height )[0];
	
	var ito = cv(oft) ? truD(oft)[0] : '';
	var iri	= cv(ofr) ? truD(ofr)[0] : '';
	var ibo	= cv(ofb) ? truD(ofb)[0] : '';
	var ile	= cv(ofl) ? truD(ofl)[0] : '';
	
	var ibx, iby, bx, by;
	if ( cv( otbx ) || cv( otby ) ) {
		ibx	= cv( ofbx ) ? truX(ofbx) : bPos(el)[0];
		iby	= cv( ofby ) ? truY(ofby) : bPos(el)[1];
	} else {
		ibx	= '';
		iby	= '';		
	}
	
	var tr3d,tx,ty,tz,itx,ity,itz;
	if ( cv( ottx ) || cv( otty ) || cv( ottz ) ) {
		itx	= cv(oftx) ? truD(oftx)[0] : 0;
		ity	= cv(ofty) ? truD(ofty)[0] : 0;
		itz	= cv(oftz) ? truD(oftz)[0] : 0;
	} else {
		itx = ''; ity = ''; itz = '';
	}	
	
	var irx = cv(ofrx) ? parseInt(ofrx) :''; //always deg
	var iry = cv(ofry) ? parseInt(ofry) :'';
	var irz = cv(ofrz) ? parseInt(ofrz) :'';
	
	var isa = parseFloat(ofs); // scale can be float
	var iop = parseFloat(ofo); // opacity
	var isc = parseInt(ofsc); // scroll
	
			
	//target values
	var cor = cv(otc) ? parseInt(pc(otc)[0]) : '';
	var cog = cv(otc) ? parseInt(pc(otc)[1]) : '';
	var cob = cv(otc) ? parseInt(pc(otc)[2]) : '';
	
	var bcr = cv(otbc) ? parseInt(pc(otbc)[0]) : '';
	var bcg = cv(otbc) ? parseInt(pc(otbc)[1]) : '';
	var bcb = cv(otbc) ? parseInt(pc(otbc)[2]) : '';
	
	var wi	= cv( otw ) ? truD(otw)[0] : '';
	var he	= cv( oth ) ? truD(oth)[0] : '';
			
	var top	= cv(ott) ? truD(ott)[0] : '';
	var ri	= cv(otr) ? truD(otr)[0] : '';
	var bo	= cv(otb) ? truD(otb)[0] : '';
	var le	= cv(otl) ? truD(otl)[0] : '';
	
	if ( cv( otbx ) || cv( otby ) ) {
		bx	= cv( otbx ) ? truX(otbx) : ibx;
		by	= cv( otby ) ? truY(otby) : iby;
	} else {
		bx	= '';
		by	= '';		
	}
	
	if ( cv( ottx ) || cv( otty ) || cv( ottz ) ) { // translate 3d
		tx	= cv( ottx ) ? truD(ottx)[0] : 0;
		ty	= cv( otty ) ? truD(otty)[0] : 0;
		tz	= cv( ottz ) ? truD(ottz)[0] : 0;		
	} else {
		tx = ''; ty = ''; tz = '';
	}
	
	var rx = cv( otrx ) ? parseInt(otrx) : ''; // rotate
	var ry = cv( otry ) ? parseInt(otry) : '';
	var rz = cv( otrz ) ? parseInt(otrz) : '';
	
	var sa 	= cv( ots ) ? parseFloat(ots) : ''; // scale values below 1 need to be reformated
	var op 	= cv( oto ) ? parseFloat(oto) : ''; // opacity
	var sc 	= cv( otsc ) ? parseInt(otsc) : ''; // scroll

	//check unit
	var wiu	= cv( wi ) ? truD(otw)[1] : '';
	var heu	= cv( he ) ? truD(oth)[1] : '';
	
	var tou	= cv( ott ) ? truD(ott)[1] : '';
	var riu	= cv( otr ) ? truD(otr)[1] : '';
	var bou	= cv( otb ) ? truD(otb)[1] : '';
	var leu	= cv( otl ) ? truD(otl)[1] : '';
	
	var txu	= cv( tx ) ? truD(ottx)[1] : '';
	var tyu	= cv( ty ) ? truD(otty)[1] : '';
	var tzu	= cv( tz ) ? truD(ottz)[1] : '';	
	
	var from = { w: iwi, h: ihe, t: ito, r: iri, b: ibo, l: ile, colr: icor, colg: icog, colb: icob, bgr: ibcr, bgg: ibcg, bgb: ibcb, bgX: ibx, bgY: iby, scale: isa, trX: itx, trY: ity, trZ: itz, roX: irx, roY: iry, roZ: irz, opacity: iop, scroll: isc };
	var target = { w: wi, h: he, t: top, r: ri, b: bo, l: le, colr: cor, colg: cog, colb: cob, bgr: bcr, bgg: bcg, bgb: bcb, bgX: bx, bgY: by, scale: sa, trX: tx, trY: ty, trZ: tz, roX: rx, roY: ry, roZ: rz, opacity: op, scroll: sc };
	
	return new KUTE.Tween( from )				
		.to( target, ops.duration )
		.delay( ops.delay )
		.easing( pes )
		.onStart( runStart )
		.onUpdate(
			function () {
				
				//color and background-color					
				if ( cv(cor) ) { el.style.color = rth( parseInt(this.colr),parseInt(this.colg),parseInt(this.colb) ); }
				if ( cv(bcr) ) { el.style.backgroundColor = rth( parseInt(this.bgr),parseInt(this.bgg),parseInt(this.bgb)); }

				//translate3d
				if ( cv(tx) || cv(ty) || cv(tz) ) {
					tr3d = 'translate3d(' + ((this.trX + txu) || 0) + ',' + ((this.trY + tyu) || 0) + ',' + ((this.trZ + tzu) || 0) + ')';
				} else { tr3d = ''; }

				var roxt = cv(rx) ? ' rotateX(' + this.roX + 'deg)' : '';
				var royt = cv(ry) ? ' rotateY(' + this.roY + 'deg)' : '';
				var rozt = cv(rz) ? ' rotateZ(' + this.roZ + 'deg)' : '';

				//scale
				var sca = cv(sa) ? ' scale(' + this.scale + ')' : '';
				//do a zoom for IE8
				if (isIE8 && cv(sa)) {
					el.style.zoom = this.scale;	
				}
				//sum all transform
				var transform = sca + tr3d + roxt + royt + rozt;
				var perspective = parseInt(css.perspective)||'';
				if ( cv(transform) ) { tr(transform,perspective) }

				//dimensions
				if ( cv(wi) ) { el.style.width = this.w + wiu; }
				if ( cv(he) ) { el.style.height = this.h + heu; }

				//positioning
				if ( cv(top) ) { el.style.top = this.t + tou; }					
				if ( cv(ri ) ) { el.style.right = this.r + riu; }
				if ( cv(bo ) ) { el.style.bottom = this.b + bou; }
				if ( cv(le ) ) { el.style.left = this.l + leu; }

				// scrolling
				if ( cv(sc) ) { sct.scrollTop = this.scroll; }

				//background position
				if ( cv(bx) || cv(by) ) {
					var bXX = this.bgX;
					var bYY = this.bgY;
					el.style.backgroundPosition = bXX.toString()+'% '+bYY.toString()+'%';
				}

				//opacity					
				if ( cv(op) ) { el.style.opacity = (this.opacity).toFixed(2); }
				//do a filter opacity for IE8
				if (isIE8 && cv(op)) {
					el.style.filter = "alpha(opacity=" + parseInt(100 * this.opacity) + ")"	
				}				

				//run special function onUpdate
				if ( ops.special && typeof ops.special === "function") { ops.special(); }
			}
		)
		.onComplete( runFinished )
		.start();
	
	//callback when tween is finished
	function runFinished() {
		if ( ops.finish && typeof ops.finish === "function") { 
			ops.finish();
		}
		if ( cv(otsc) ) {
			document.body.removeAttribute('data-tweening')
		}
	}
	
	//callback when tween just started
	function runStart() {
		if ( ops.start && typeof ops.start === "function") { 
			ops.start();
		}
		//fix the scrolling being interrupted via mousewheel		
		if ( cv(otsc) ) {
		  if ( !document.body.getAttribute('data-tweening') && document.body.getAttribute('data-tweening') !== 'scroll' )
			  document.body.setAttribute('data-tweening','scroll');
		}
	}
	
	/* Process values utils
	----------------------------*/
	
	//process easing 31
	function pe(e) {
		if ( e === 'linear' ) return			KUTE.Easing.Linear.None;
		if ( e === 'quadraticIn' ) return		KUTE.Easing.Quadratic.In;
		if ( e === 'quadraticOut' ) return		KUTE.Easing.Quadratic.Out;
		if ( e === 'quadraticInOut' ) return	KUTE.Easing.Quadratic.InOut;
		if ( e === 'cubicIn' ) return			KUTE.Easing.Cubic.In;
		if ( e === 'cubicOut' ) return			KUTE.Easing.Cubic.Out;
		if ( e === 'cubicInOut' ) return		KUTE.Easing.Cubic.InOut;
		if ( e === 'quarticIn' ) return			KUTE.Easing.Quartic.In;
		if ( e === 'quarticOut' ) return		KUTE.Easing.Quartic.Out;
		if ( e === 'quarticInOut' ) return		KUTE.Easing.Quartic.InOut;
		if ( e === 'quinticIn' ) return			KUTE.Easing.Quintic.In;
		if ( e === 'quinticOut' ) return		KUTE.Easing.Quintic.Out;
		if ( e === 'quinticInOut' ) return		KUTE.Easing.Quintic.InOut;
		if ( e === 'sinusoidalIn' ) return		KUTE.Easing.Sinusoidal.In;
		if ( e === 'sinusoidalOut' ) return		KUTE.Easing.Sinusoidal.Out;
		if ( e === 'sinusoidalInOut' ) return	KUTE.Easing.Sinusoidal.InOut;
		if ( e === 'exponentialIn' ) return		KUTE.Easing.Exponential.In;
		if ( e === 'exponentialOut' ) return	KUTE.Easing.Exponential.Out;
		if ( e === 'exponentialInOut' ) return	KUTE.Easing.Exponential.InOut;
		if ( e === 'circularIn' ) return		KUTE.Easing.Circular.In;
		if ( e === 'circularOut' ) return		KUTE.Easing.Circular.Out;
		if ( e === 'circularInOut' ) return		KUTE.Easing.Circular.InOut;
		if ( e === 'elasticIn' ) return			KUTE.Easing.Elastic.In;
		if ( e === 'elasticOut' ) return		KUTE.Easing.Elastic.Out;
		if ( e === 'elasticInOut' ) return		KUTE.Easing.Elastic.InOut;
		if ( e === 'backIn' ) return			KUTE.Easing.Back.In;
		if ( e === 'backOut' ) return			KUTE.Easing.Back.Out;
		if ( e === 'backInOut' ) return			KUTE.Easing.Back.InOut;
		if ( e === 'bounceIn' ) return			KUTE.Easing.Bounce.In;
		if ( e === 'bounceOut' ) return			KUTE.Easing.Bounce.Out;
		if ( e === 'bounceInOut' ) return		KUTE.Easing.Bounce.InOut;
		//default
		return KUTE.Easing.Exponential.InOut;
	}

	// value checker
	function cv(v) {
		if ( v !== undefined && v !== '' && v !== 'NaN' ) return true;
	}

	// get true w/h
	function truD(d){
		var v,u;
		if (/px/i.test(d)) { 
			u = 'px'; v = parseInt( d );
		} else if (/%/i.test(d)) {
			u = '%'; v = parseInt( d );
		} else {
			v = d; u = 'px';
		}	
		return [v,u];
	}

	// get background position true values
	function truX(x) {
		if ( x == 'left' ) { 
			return 0; 
		} else if ( x == 'center' ) { 
			return 50; 
		} else if ( x == 'right' ) { 
			return 100; 		
		} else { 
			return parseInt( x ); 
		} 			
	}
	function truY(y) {
		if ( y == 'top' ) { 
			return 0; 
		} else if ( y == 'center' ) { 
			return 50; 
		} else if ( y == 'bottom' ) { 
			return 100; 		
		} else { 
			return parseInt( y ); 
		} 			
	}

	// get current background position
	function bPos(elem) {	
		var sty = css.backgroundPosition,x,y;			
		var pos = sty.split(" ");
			x = truX(pos[0]);			
		if ( cv(pos[1]) ) {
			y = truY(pos[1]);
		} else {
			y = 0;
		}
		return [ x, y ]; 
	}

	// convert transparent to rgba()
	function truC(c) {
		if ( c === 'transparent' ) { 
			return c.replace('transparent','rgba(0,0,0,0)');
		} else if ( cv(c) ) {
			return c;
		}		
	}

	// process color
	function pc(c) {
		if ( cv(c) && /#/i.test(c) ) { return [htr(c).r,htr(c).g,htr(c).b]; } else { return c.replace(/[^\d,]/g, '').split(','); }
	}	
	
	// transform rgb to hex or vice-versa
	function rth(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	function htr(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shr = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shr, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	// process transform
	function tr(p,pp) {	
		el.style.transform = p;			
		el.style.msTransform = (cv(pp)?'perspective('+pp+'px) ':'') + p;
		el.style.MozTransform = p;
		el.style.webkitTransform = p;
	}
};

KUTE.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 700;
	var _isPlaying = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = KUTE.Easing.Linear.None;
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {
		_valuesStart[ field ] = parseFloat(object[field], 10);
	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {
			_duration = duration;
		}

		_valuesEnd = properties;
		return this;
	};

	this.start = function ( time ) {

		KUTE.add( this );
		_isPlaying = true;
		_onStartCallbackFired = false;
		_startTime = time !== undefined ? time : window.performance.now();
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {
			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {
				if ( _valuesEnd[ property ].length === 0 ) {
					continue;
				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );
			}
			
			if( ( _valuesEnd[ property ] instanceof Array ) === false ) {
				_valuesEnd[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}
			
			_valuesStart[ property ] = _object[ property ];
			
			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}
		}
		return this;
	};

	this.stop = function () {
		if ( !_isPlaying ) {
			return this;
		}

		KUTE.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {
			_onStopCallback.call( _object );
		}

		return this;

	};

	this.delay = function ( amount ) {
		_delayTime = amount;
		return this;
	};

	this.easing = function ( easing ) {
		_easingFunction = easing;
		return this;
	};

	this.onStart = function ( callback ) {
		_onStartCallback = callback;
		return this;
	};

	this.onUpdate = function ( callback ) {
		_onUpdateCallback = callback;
		return this;
	};

	this.onComplete = function ( callback ) {
		_onCompleteCallback = callback;
		return this;
	};

	this.onStop = function ( callback ) {
		_onStopCallback = callback;
		return this;
	};

	this.update = function ( time ) {
		var property;

		if ( time < _startTime ) {
			return true;
		}

		if ( _onStartCallbackFired === false ) {
			if ( _onStartCallback !== null ) {
				_onStartCallback.call( _object );
			}
			_onStartCallbackFired = true;
		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;
		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			// Parses relative end values with start as base (e.g.: +10, -3)
			if ( typeof(end) === "string" ) {
				end = start + parseFloat(end, 10);
			}

			// protect against non numeric properties.
			if ( typeof(end) === "number" ) {
				_object[ property ] = start + ( end - start ) * value;
			}
		}

		if ( _onUpdateCallback !== null ) {
			_onUpdateCallback.call( _object, value );
		}

		if ( elapsed == 1 ) {

			if ( _onCompleteCallback !== null ) {
				_onCompleteCallback.call( _object );
			}
			return false;			
		}
		return true;
	};
};

KUTE.process(0);

KUTE.Easing = {
	Linear: {
		None: function ( k ) {
			return k;
		}
	},
	Quadratic: {
		In: function ( k ) {
			return k * k;
		},

		Out: function ( k ) {
			return k * ( 2 - k );
		},

		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );
		}
	},
	Cubic: {
		In: function ( k ) {
			return k * k * k;
		},
		Out: function ( k ) {
			return --k * k * k + 1;
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );
		}
	},
	Quartic: {
		In: function ( k ) {
			return k * k * k * k;
		},
		Out: function ( k ) {
			return 1 - ( --k * k * k * k );
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
		}
	},
	Quintic: {
		In: function ( k ) {
			return k * k * k * k * k;
		},

		Out: function ( k ) {
			return --k * k * k * k * k + 1;
		},

		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
		}
	},
	Sinusoidal: {
		In: function ( k ) {
			return 1 - Math.cos( k * Math.PI / 2 );
		},		
		Out: function ( k ) {
			return Math.sin( k * Math.PI / 2 );
		},
		InOut: function ( k ) {
			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
		}
	},

	Exponential: {
		In: function ( k ) {
			return k === 0 ? 0 : Math.pow( 1024, k - 1 );
		},
		Out: function ( k ) {
			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
		},
		InOut: function ( k ) {
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
		}
	},
	Circular: {
		In: function ( k ) {
			return 1 - Math.sqrt( 1 - k * k );
		},
		Out: function ( k ) {
			return Math.sqrt( 1 - ( --k * k ) );
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
		}
	},
	Elastic: {
		In: function ( k ) {
			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
		},
		Out: function ( k ) {
			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
		},
		InOut: function ( k ) {
			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
		}
	},
	Back: {
		In: function ( k ) {
			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );
		},
		Out: function ( k ) {
			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;
		},
		InOut: function ( k ) {
			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
		}
	},
	Bounce: {
		In: function ( k ) {
			return 1 - KUTE.Easing.Bounce.Out( 1 - k );
		},
		Out: function ( k ) {
			if ( k < ( 1 / 2.75 ) ) {
				return 7.5625 * k * k;
			} else if ( k < ( 2 / 2.75 ) ) {
				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
			} else if ( k < ( 2.5 / 2.75 ) ) {
				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
			} else {
				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
			}
		},
		InOut: function ( k ) {
			if ( k < 0.5 ) return KUTE.Easing.Bounce.In( k * 2 ) * 0.5;
			return KUTE.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
		}
	}
};


// prevent mousewheel or touch events while tweening scroll
document.addEventListener('mousewheel', preventScroll, false);
document.addEventListener('touchstart', preventScroll, false);
function preventScroll(e){
	var data = document.body.getAttribute('data-tweening');
	if ( data && data === 'scroll' ) {
		e.preventDefault();	
	}
};
