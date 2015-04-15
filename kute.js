// kute.js - The Light Tweening Engine | License - MIT
// @author dnp_theme / http://themeforest.net/user/dnp_theme
 
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
		}
	};
} )();

//animate object
KUTE.Animate = function( object, options ) {
	
	//element to animate
	var el = typeof object === 'object' ? object : document.querySelector(object);
		
	//get true scroll container
	var bd = document.body, htm = document.documentElement, sct = bd.scrollHeight === htm.scrollHeight ? htm : bd;
	
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
			position	: {top:'',left:''}, // integer/%
			translate	: {x:0, y:0, z:0}, // integer only
			rotate		: {x:0, y:0, z:0}, // integer only
			scale		: 1, // integer only
			scroll		: sct.scrollTop, // integer only		
		},
		to : {
			opacity		: '',
			width		: '', 
			height		: '',
			position	: {top:'',left:''},
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
	var oft = ops.from.position.top;
	var ofl = ops.from.position.left;
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
	var ott = ops.to.position.top;
	var otl = ops.to.position.left;
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
	var iwi	= cv(ofw) ? truD(ofw)[0] : truD( css.width )[0]; // width
	var ihe	= cv(ofh) ? truD(ofh)[0] : truD( css.height )[0]; // height
	
	var ito = cv(oft) ? truD(oft)[0] : ''; // move
	var ile	= cv(ofl) ? truD(ofl)[0] : '';
		
	var tr3d,tx,ty,tz,itx,ity,itz; // translate
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
	var wi	= cv( otw ) ? truD(otw)[0] : ''; // width
	var he	= cv( oth ) ? truD(oth)[0] : ''; // height
			
	var top	= cv(ott) ? truD(ott)[0] : ''; // pos top
	var le	= cv(otl) ? truD(otl)[0] : ''; //pos left
	
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

	//check measurement unit
	var wiu	= cv( wi ) ? truD(otw)[1] : ''; // width
	var heu	= cv( he ) ? truD(oth)[1] : ''; // height
	
	var tou	= cv( ott ) ? truD(ott)[1] : ''; // pos top
	var leu	= cv( otl ) ? truD(otl)[1] : ''; // pos left
	
	var txu	= cv( tx ) ? truD(ottx)[1] : ''; // translate
	var tyu	= cv( ty ) ? truD(otty)[1] : '';
	var tzu	= cv( tz ) ? truD(ottz)[1] : '';
	
	animateTween();
	
	var from = { w: iwi, h: ihe, t: ito, l: ile, scale: isa, trX: itx, trY: ity, trZ: itz, roX: irx, roY: iry, roZ: irz, opacity: iop, scroll: isc };
	var target = { w: wi, h: he, t: top, l: le, scale: sa, trX: tx, trY: ty, trZ: tz, roX: rx, roY: ry, roZ: rz, opacity: op, scroll: sc };
	
	return new KUTE.Tween( from )
		.to( target, ops.duration )
		.delay( ops.delay )
		.easing( pes )
		.onStart( runStart )
		.onUpdate(
			function () {
				
				//translate3d
				if ( cv(tx) || cv(ty) || cv(tz) ) {
					tr3d = 'translate3d(' + ((this.trX + txu) || 0) + ',' + ( (this.trY + tyu) || 0) + ',' + ( (this.trZ + tzu) || 0) + ')';
				} else { tr3d = ''; }

				//rotate
				var roxt = cv(rx) ? ' rotateX(' + this.roX + 'deg)' : '';
				var royt = cv(ry) ? ' rotateY(' + this.roY + 'deg)' : '';
				var rozt = cv(rz) ? ' rotateZ(' + this.roZ + 'deg)' : '';

				//scale
				var sca = cv(sa) ? 'scale(' + this.scale + ') ' : '';
				
				//do a zoom for IE8
				if (isIE8 && cv(sa)) {
					el.style.zoom = this.scale;	
				}
				
				//sum all transform
				var transform = sca + tr3d + roxt + royt + rozt;
				var perspective = parseInt(css.perspective)||'';
				if ( cv(transform) ) { tr(transform,perspective) }
				

				//dimensions width / height
				if ( cv(wi) ) { el.style.width = this.w + wiu; }
				if ( cv(he) ) { el.style.height = this.h + heu; }

				//position
				if ( cv(top) ) { el.style.top = this.t + tou; }					
				if ( cv(le ) ) { el.style.left = this.l + leu; }
				
				// scrolling
				if ( cv(sc) ) { sct.scrollTop = this.scroll; }

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
	
	function animateTween(time) {
		requestAnimationFrame( animateTween );
		KUTE.update(time);
	}
	
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

	// process transform
	function tr(p,pp) {	
		el.style.webkitTransform = p;
		el.style.MozTransform = p;
		el.style.msTransform = (cv(pp)?'perspective('+pp+'px)':'') + p;
		el.style.Transform = p;			
	}	
};

//tween object
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

//easing functions
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
