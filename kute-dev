/* KUTE.js - The Light Tweening Engine
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['KUTE'], factory);
    } else if (typeof exports === 'object') {
        // Node, not strict CommonJS
        module.exports = factory(require('KUTE'));
    } else {
        // Browser globals		
		root.KUTE = root.KUTE || factory(root.KUTE);
    }
}(this, function () {
	'use strict';	
	var K = K || {}, _tws = [], _t, _stk = false, // _stoppedTick // _tweens // KUTE, _tween, _tick,			
		_pf = _pf || getPrefix(), // prefix
		_rafR = _rafR || ((!('requestAnimationFrame' in window)) ? true : false), // is prefix required for requestAnimationFrame
		_pfT = _pfT || ((!('transform' in document.getElementsByTagName('div')[0].style)) ? true : false), // is prefix required for transform
		_tch = _tch || (('ontouchstart' in window || navigator.msMaxTouchPoints) || false), // support Touch?
		_ev = _ev || (_tch ? 'touchstart' : 'mousewheel'), //event to prevent on scroll
				
		_bd = document.body,
		_htm = document.getElementsByTagName('HTML')[0],
		_sct = _sct || (/webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? _bd : _htm),

		_isIE = _isIE || document.documentElement.classList.contains('ie'),
		_isIE8 = _isIE8 || document.documentElement.classList.contains('ie8'),

		//assign preffix to DOM properties
		_pfp = _pfp || _pfT ? _pf + 'Perspective' : 'perspective',
		_pfo = _pfo || _pfT ? _pf + 'PerspectiveOrigin' : 'perspectiveOrigin',
		_tr = _tr || _pfT ? _pf + 'Transform' : 'transform',
		_br = _br || _pfT ? _pf + 'BorderRadius' : 'borderRadius',
		_brtl = _brtl || _pfT ? _pf + 'BorderTopLeftRadius' : 'borderTopLeftRadius',
		_brtr = _brtr || _pfT ? _pf + 'BorderTopRightRadius' : 'borderTopRightRadius',
		_brbl = _brbl || _pfT ? _pf + 'BorderBottomLeftRadius' : 'borderBottomLeftRadius',
		_brbr = _brbr || _pfT ? _pf + 'BorderBottomRightRadius' : 'borderBottomRightRadius',
		_raf = _raf || _rafR ? window[_pf + 'RequestAnimationFrame'] : window['requestAnimationFrame'],
		_caf = _caf || _rafR ? window[_pf + 'CancelAnimationFrame'] : window['cancelAnimationFrame'],
		
		//supported properties
		_cls = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
		_sc  = ['scrollTop', 'scroll'], //scroll, it has no default value, it's calculated on tween start
		_clp = ['clip'], // clip
		_op  = ['opacity'], // opacity
		_rd  = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'], // border radius px/%
		_dm  = ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'], // dimensions / box model
		_po  = ['top', 'left', 'right', 'bottom'], // position
		_bg  = ['backgroundPosition'], // background position TO DO
		_3d  = ['rotateX', 'rotateY','translateZ'], // transform properties that require perspective
		_tf  = ['matrix', 'matrix3d', 'rotateX', 'rotateY', 'rotateZ', 'translate3d', 'translateX', 'translateY', 'translateZ', 'skewX', 'skewY', 'scale'], // transform
		_all = _cls.concat(_sc, _clp, _op, _rd, _dm, _po, _bg, _tf), al = _all.length,
		// _easings = ["linear","easeInQuad","easeOutQuad","easeInOutQuad","easeInCubic","easeOutCubic","easeInOutCubic","easeInQuart","easeInQuart","easeOutQuart","easeInOutQuart","easeInQuint","easeOutQuint","easeInOutQuint","easeInExpo","easeOutExpo","easeInOutExpo"],	

		_tfS = {}, _tfE = {}, _tlS = {}, _tlE = {}, _rtS = {}, _rtE = {}, //internal temp

		_d = _d || {}; //all properties default values

	//populate default values object
	for ( var i=0; i< al; i++){
		var p = _all[i];
		if (_cls.indexOf(p) !== -1){
			_d[p] = 'rgba(0,0,0,0)'; // _d[p] = {r:0,g:0,b:0,a:1};
		} else if ( _rd.indexOf(p) !== -1 || _dm.indexOf(p) !== -1 || _po.indexOf(p) !== -1){
			_d[p] = 0;			
		} else if ( _bg.indexOf(p) !== -1 ){
			_d[p] = [50,50];
		} else if ( p === 'clip' ){
			_d[p] = [0,0,0,0];			 
		} else if ( p === 'matrix' ){
			_d[p] = [1, 0, 0, 1, 0, 0];		
		} else if ( p === 'matrix3d' ){
			_d[p] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];		
		} else if ( p === 'translate3d' ){
			_d[p] = [0,0,0];		
		} else if ( /X|Y|Z/.test(p) ){
			_d[p] = 0;		
		} else if ( p === 'scale' || p === 'opacity' ){
			_d[p] = 1;		
		}
	}
	
	//more internals
	K.getAll = function () { return _tws; };
	K.removeAll = function () {	_tws = []; };
	K.add = function (tw) {	_tws.push(tw); };
	K.remove = function (tw) {
		var i = _tws.indexOf(tw);
		if (i !== -1) {
			_tws.splice(i, 1);
		}
	};
	
	// internal ticker
	K.t = function (t) {
		_t = _raf(K.t);
		var i = 0, l = _tws.length;		
		while ( i < l ) {
			if (!_tws[i]) {return false;}			
			if (K.u(_tws[i],t)) {
				i++;
			} else {
				_tws.splice(i, 1);
			}
		}		
		_stk = false;
		return true;
	};
	
	// internal stopTick
	K.s = function () { 
		if ( _stk === false ) {
			_caf(_t);
			_stk = true;
			_t = null;
		}
	};
	
	//main methods
	K.to = function (el, to, o) {
		var _el = _el || typeof el === 'object' ? el : document.querySelector(el),
			_o = _o || o;

		_o.rpr = true;
		_o.toMatrix = o.toMatrix||false;		
		_o.easing = _o && K.pe(_o.easing) || K.Easing.linear;

		var _vS = to, // we're gonna have to build this object at start
			_vE = K.prP(to, true),
			_tw = new K.Tween(_el, _vS, _vE, _o);
				
		return _tw;
	};

	K.fromTo = function (el, f, to, o) {
		var _el = _el || typeof el === 'object' ? el : document.querySelector(el);
		var _o = o;

		_o.toMatrix = o.toMatrix||false;
		_o.easing = _o && K.pe(_o.easing) || K.Easing.linear;
			
		var _vS = K.prP(f, false),			
			_vE = K.prP(to, true),
			_tw = new K.Tween(_el, _vS, _vE, _o);
		
		return _tw;
	};
	// fallback method for previous versions
	K.Animate = function (el, f, to, o) {
		return K.fromTo(el, f, to, o);
	};
	
	//main worker, doing update on tick
	K.u = function(w,t) {
		if (t < w._sT) { return true; }

		if (!w._sCF) {
			if (w._sC) { w._sC.call(); }
			w._sCF = true;
		}

		var e = ( t - w._sT ) / w._dr; //elapsed
		e = e > 1 ? 1 : e;				
		var _v = w._e(e);
		
		//render the CSS update
		K.r(w,_v);
		
		if (w._uC) { w._uC.call(); }

		if (e === 1) {			
			if (w._r > 0) {
				if ( w._r !== Infinity ) {w._r--; }
				var p;
				// reassign starting values, restart by making _sT = now
				for (p in w._vSR) {
					if (w._y) {
						var tmp = w._vSR[p];
						w._vSR[p] = w._vE[p];
						w._vE[p] = tmp;
					}
					w._vS[p] = w._vSR[p];
				}
				if (w._y) { w._rv = !w._rv; }
				
				//set the right time for delay
				w._sT = (w._y && !w._rv) ? t + w._rD : t;				
				return true;				
			} else {
				if (w._cC) { w._cC.call(); }
				//stop ticking when finished
				w.close();				
				//stop preventing scroll when scroll tween finished 
				w.scrollOut();
				var i = 0, ctl = w._cT.length;
				for (i; i < ctl; i++) {
					w._cT[i].start(t);
				}					
				return false;
			}
		}
		return true;
	};

	// render for each property
	K.r = function (w,v) {
		var p;
		for (p in w._vE) {

			var _start = w._vS[p],
				_end = w._vE[p],
				v1 = _start.value,
				v2 = _end.value,
				u = _end.unit;
			
			//process styles by property / property type							
			if (p === 'transform') {
				var _tS = '', tP, rps, pps = 'perspective('+w._pp+'px) '; //transform style & property

				for (tP in _end) {
					var t1 = _start[tP], t2 = _end[tP];
					rps = _3d.indexOf(tP) !== -1; 
					if ( /matrix/.test(tP) ) { //if (!t1) return false;
						var i=0, va = [];
							for ( i; i<t2.length; i++ ){							
								va[i] = t1[i]===t2[i] ? t2[i] : (t1[i] + ( t2[i] - t1[i] ) * v);
							}
							_tS = tP+'('+va+')';						

					} else {
						if ( tP === 'translate' ) {
							var tls = '', ts = {}, ax;														
							for (ax in t2){
								var x1 = t1[ax].value || 0, x2 = t2[ax].value || 0, xu = t2[ax].unit || 'px';
								ts[ax] = x1===x2 ? x2+xu : (x1 + ( x2 - x1 ) * v) + xu;	
							}
							tls = 'translate3d(' + ts.translateX + ',' + ts.translateY + ',' + ts.translateZ + ')';							
							_tS = (_tS === '') ? tls : (tls + ' ' + _tS);							
						} else if (tP === 'rotate' || tP === 'skew') {
							var aS = {}, rx, rt = '', ap = tP === 'rotate' ? 'rotate' : 'skew';
								for ( rx in t2 ){
									var a1 = t1[rx].value, a2 = t2[rx].value, av = a1 + (a2 - a1) * v;
									aS[rx] = rx + '(' + (av||0) + 'deg' + ') ';
								}
								rt = ap === 'rotate' ? (aS.rotateX||'') + (aS.rotateY||'') + (aS.rotateZ||'') : (aS.skewX||'') + (aS.skewY||'');								
							_tS = (_tS === '') ? rt : (_tS + ' ' + rt);
						} else if (tP === 'scale') {
							var s1 = t1.value, s2 = t2.value,
								s = s1 + (s2 - s1) * v, scS = tP + '(' + s + ')';									
							_tS = (_tS === '') ? scS : (_tS + ' ' + scS);
						}
					}
				}
				w._el.style[_tr] = (rps && w._pp && w._pp !== 0 && !('matrix' in _end || 'matrix3d' in _end) ) ? pps + _tS : _tS;
			} else if (_cls.indexOf(p) !== -1) {
				var _c = {}, c;

				for (c in v2) {
					if ( c !== 'a' ){
						_c[c] = parseInt(v1[c] + (v2[c] - v1[c]) * v);						
					} else {
						_c[c] = (v1[c] && v2[c]) ? parseFloat(v1[c] + (v2[c] - v1[c]) * v) : null;
					}					
				}
				
				if ( w._hex || _isIE8 ) {					
					w._el.style[p] = K.rth( parseInt(_c.r), parseInt(_c.g), parseInt(_c.b) );										
				} else {
					w._el.style[p] = !_c.a ? 'rgb(' + _c.r + ',' + _c.g + ',' + _c.b + ')' : 'rgba(' + _c.r + ',' + _c.g + ',' + _c.b + ',' + _c.a + ')';					
				}

			} else if (_po.indexOf(p) !== -1 || _dm.indexOf(p) !== -1) {
				w._el.style[p] = (v1 + (v2 - v1) * v) + u;
			} else if (_rd.indexOf(p) !== -1) {
				if (/borderRadius/.test(p)) {
					w._el.style[_br] = (v1 + (v2 - v1) * v) + u;
				} else if (/TopLeft/.test(p)) {
					w._el.style[_brtl] = (v1 + (v2 - v1) * v) + u;
				} else if (/TopRight/.test(p)) {
					w._el.style[_brtr] = (v1 + (v2 - v1) * v) + u;
				} else if (/BottomLeft/.test(p)) {
					w._el.style[_brbl] = (v1 + (v2 - v1) * v) + u;
				} else if (/BottomRight/.test(p)) {
					w._el.style[_brbr] = (v1 + (v2 - v1) * v) + u;
				}
			} else if (_sc.indexOf(p) !== -1) {
				var ets = w._el === null ? _sct : w._el;							
				ets.scrollTop = v1 + ( v2 - v1 ) * v;
			} else if (_bg.indexOf(p) !== -1) {
				var px = _start.x.v + ( _end.x.v - _start.x.v ) * v, pxu = _end.x.u || '%',
					py = _start.y.v + ( _end.y.v - _start.y.v ) * v, pyu = _end.y.u || '%';			
				w._el.style[p] = px + pxu + ' ' + py + pyu;
			} else if (_clp.indexOf(p) !== -1) {
				var h = 0, clp = [];
				for (h;h<4;h++){
					clp[h] = (_start[h].v + ( _end[h].v - _start[h].v ) * v) + _end[h].u || 'px'
				}	
				w._el.style[p] = 'rect('+clp+')';
			} else if (_op.indexOf(p) !== -1) {
				var opc = v1 + (v2 - v1) * v, fo = parseInt((opc)*100);
				if (_isIE8) {
					w._el.style.filter = "alpha(opacity=" + fo + ")";
				} else {
					w._el.style.opacity = opc;
				}
			}
		}
	};
	
	K.matrix = function (w,o) { // tween reprocess transform to matrix at start() K.matrix(t,tr);
		var t = '', d, m, c, ty, pp,		
			parent = document.createElement('div'); 
		d = document.createElement('div');
		d.style.position = 'absolute'; 
		d.style.top = -999+'em'; 
		parent.appendChild(d);
		document.body.appendChild(parent);		
		pp = typeof w._pp === 'number' ? 'perspective('+w._pp+'px) ' : null;
		for (var p in o.transform) {			
			var l = o.transform[p];
			if ( /translate|rotate|skew/.test(p) ) {				
				for (var sp in l) {
					var spl = l[sp], vl = sp+'('+spl.value+spl.unit+')'; 
					t = t !== '' && spl ? t + ' ' + vl : vl;				
				}
			} else { //scale
				t = t !== '' ? t + ' ' + p+'('+l.value+')' : p+'('+l.value+')';
			}
		}
		
		K.perspective(d,w);
		d.style[_tr] = pp ? pp+t : t;
		c = window.getComputedStyle(d)[_tr];
			
		ty = 'matrix3d';			
		m = c.replace(/3d|matrix|\(|\)|\s/g,'').split(',');	
			
		// parse all numbers properly
		for (var x = 0; x<m.length; x++){ 
			m[x] = parseFloat(m[x]); 
		}
		 if ( m.length === 6 ) {
			m = [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1]; 
		} 			

		o.transform = {};
		o.transform[ty] = m;	

		document.body.removeChild(parent);		
		d = null; parent = null;
	};
	
	K.perspective = function (l,w) {
		if ( w._ppo !== undefined ) { l.style[_pfo] = w._ppo; } // element perspective origin
		if ( w._ppp !== undefined ) { l.parentNode.style[_pfp] = w._ppp + 'px'; } // parent perspective origin	
		if ( w._pppo !== undefined ) { l.parentNode.style[_pfo] = w._pppo; } // parent perspective origin
	};
	
	K.Tween = function (_el, _vS, _vE, _o) {
		this._el = this._el || _el; // element animation is applied to
		this._dr = this._dr || _o&&_o.duration || 700; //duration
		this._r = this._r || _o&&_o.repeat || 0; // _repeat
		this._vSR = {}; // internal valuesStartRepeat
		this._vS = _vS; // valuesStart
		this._vE = _vE; // valuesEnd
		this._y = this._y || _o&&_o.yoyo || false; // _yoyo
		this._P = false; // _isPlaying
		this._rv = false; // _reversed
		this._rD = this._rD || _o&&_o.repeatDelay || 0; // _repeatDelay
		this._dl = this._dl || _o&&_o.delay || 0; //delay
		this._sT = null; // startTime
		this._ps = false; //_paused
		this._pST = null; //_pauseStartTime		
		this._pp = this._pp || _o.perspective; // perspective		
		this._ppo = this._ppo || _o.perspectiveOrigin; // perspective origin	
		this._ppp = this._ppp || _o.parentPerspective; // parent perspective		
		this._pppo = this._pppo || _o.parentPerspectiveOrigin; // parent perspective origin		
		this._tM = this._tM || _o.toMatrix || false; // internal option to convert values to matrix transforms  
		this._rpr = this._rpr || _o.rpr || false; // internal option to process inline/computed style at start instead of init true/false
		this._hex = this._hex || _o.keepHex || false; // option to keep hex for color tweens true/false
		this._e = this._e || _o.easing; // _easing
		this._cT = this._cT || []; //_chainedTweens
		this._sC = this._sC || _o&&_o.start || null; // _on StartCallback
		this._sCF = false; //_on StartCallbackFIRED
		this._uC = _o&&_o.update || null; // _on UpdateCallback
		this._cC = _o&&_o.complete || null; // _on CompleteCallback
		this._pC = _o&&_o.pause || null; // _on PauseCallback
		this._stC = _o&&_o.stop || null; // _on StopCallback
	};
		
	var w = K.Tween.prototype;
				
	w.start = function (t) {
		K.add(this);
		this._P = true;
		this._sCF = false;
		this._sT = t || window.performance.now();
		this._sT += this._dl;
		this.scrollIn();
		var p, sp, hasStart = true, hasFrom = false;
		
		K.perspective(this._el,this);
				
		if ( this._rpr ) { // on start we reprocess the valuesStart for TO() method
			var f = {};
			for ( p in this._vS ) { if ( typeof this._vS[p] !== 'object' || (( this._vS[p] instanceof Array) ) ) hasStart = false; }
			for ( p in f ) { if (typeof f[p] !== 'undefined') { hasFrom = true; } else { hasFrom = false; }	}
	
			if ( !hasStart && !hasFrom ){
				f = this.prS(); 
				this._vS = {};
				this._vS = K.prP(f,false);				
			} else if ( !hasStart && hasFrom ){
				this._vS = {};
				this._vS = K.prP(f,false);
			}

			// make a better chaining for .to() method
			// set transform properties from inline style coming from previous tween
			for ( p in this._vS ) {
				if ( p === 'transform' && this._vS.transform.matrix3d === undefined ){
					for ( sp in this._vS[p]) {
						var tp = this._vS[p][sp];
						if (tp.value !== undefined && (!( sp in this._vE[p])) ) { // scale
							this._vE[p][sp] = this._vS[p][sp];
						}
						for (var spp in tp){
							if (this._vE[p][sp] === undefined ) { this._vE[p][sp] = {} }
							if ( (spp in tp) && tp[spp].value !== undefined && (!( spp in this._vE[p][sp])) ) {
								this._vE[p][sp][spp] = this._vS[p][sp][spp];
							}
						}
					}					
				}
			}	
		}

		if ( this._tM && ('transform' in this._vE) ) { 
			if ( this._vS.transform.matrix3d === undefined ) { K.matrix(this,this._vS); }
			if ( this._vE.transform.matrix3d === undefined ) { K.matrix(this,this._vE); }
		}		
		
		for ( p in this._vE ) {
			this._vSR[p] = this._vS[p];			
		}

		if (!_t) K.t();
		return this;
	};
	
	w.prS = function () { //prepare valuesStart for .to() method
		var p, f = {}, el = this._el, to = this._vS, cs = this.gIS('transform'), deg = ['rotate','skew'], ax = ['X','Y','Z'];
		for (p in to){
			if ( _tf.indexOf(p) !== -1 ) {
				if ( /matrix/.test(p) ) {
					var m = this.gCS('transform',p);					
					f[p] = m !== 'none' ? this.gCS('transform',p) : _d[p];												
				} else {
					if ( /translate/.test(p) ) {
						if ( cs[p] !== undefined ) {
							f[p] = cs[p]
						} else if ( cs['translate3d'] !== undefined  ) {							
							f['translate3d'] = cs['translate3d'];		
						} else {
							f[p] = _d[p];
						}			
					} else if ( p === 'scale' ) {
						f[p] = cs[p] || _d[p]; // scale
					} else { // all angles
						for (var d=0; d<2; d++) {
							for (var a = 0; a<3; a++) {
								var s = deg[d]+ax[a];
								
								if ( s in cs ) {
									f[s] = cs[s]; 
								} else {
									f[s] = _d[s];
								}
							}
						}
					}
				}
			} else {
				if ( _sc.indexOf(p) === -1 ) {				
					f[p] = this.gCS(p) || _d[p];
				} else {
					f[p] = el === null ? (window.pageYOffset || _sct.scrollTop) : el.scrollTop;
				}			
			}					
		}
		for ( p in cs ){ // also add to _vS values from previous tweens
			if ( _tf.indexOf(p) !== -1 &&  (!( p in to )) && cs[p] !== undefined ) {
				f[p] = cs[p];
			}		
		}
		return f;	
	};	
	
	w.gIS = function(p) { // gIS = get transform style for element from cssText for .to() method, the sp is for transform property
		if (!this._el) return; // if the scroll applies to `window` it returns as it has no styling
		var l = this._el, cst = l.style.cssText,//the cssText	
			trsf = {}; //the transform object
		// if we have any inline style in the cssText attribute, usually it has higher priority
		var css = cst.replace(/\s/g,'').split(';'), i=0, csl = css.length;
		for ( i; i<csl; i++ ){

			if ( /transform/.test(css[i])) {	
				var tps = css[i].split(':')[1].split(')'), k=0, tpl = tps.length; //all transform properties
				for ( k; k< tpl; k++){
					var tp = tps[k].split('('); //each transform property
					if ( tp[0] !== '' && _tf.indexOf(tp[0]) ){
						trsf[tp[0]] = /translate3d|matrix/.test(tp[0]) ? tp[1].split(',') : tp[1];
					}
				}
			}
		}
		return trsf;
	};
	
	w.gCS = function (p) { // gCS = get style property for element from computedStyle for .to() method
		var el = this._el, cs = window.getComputedStyle(el), //the computed style
			ppp = (_pfT && ( /transform|Radius/.test(p) ) ) ? ('-'+_pf.toLowerCase()+'-'+p) : p, //prefixed property for CSS match
			s = ( (_pfT && p==='transform' ) || (_pfT && _rd.indexOf(p) !== -1)) // s the property style value
			  ? cs[ppp]
			  : cs[p];

		if (p === 'transform' && ppp in cs){ // get a transform Array from computed style
			var mt = s.split('(')[0], m = s.replace(/3d|matrix|\(|\)|\s|/g,'').split(','), ml = m.length; //matrix type, array values and length
			
			if (mt==='none'){
				return _d['matrix3d'];
			} else if ( m instanceof Array ) {
				//make sure we always use a matrix3d
				if ( ml === 6 ) { m = [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1]; }
				for (var i=0; i<16; i++){
					m[i] = parseFloat(m[i]);//make sure all are numbers
				}
				return m;		
			}
		} else if ( p !== 'transform' && ppp in cs ) {		
			if ( s ){
				return s;
			} else {
				return _d[p];
			}			
		}
	};	
				
	w.stop = function () {
		if (!this._P) { return; }
		K.remove(this);
		this._P = false;
		this.scrollOut();
		
		this.close();
		
		if (this._stC !== null) {
			this._stC.call();
		}
		this.stopChainedTweens();
		return this;
	};	
	
	w.seek = function(time) {
		this._sT = -time;
		return this;
	};

	w.pause = function() {
		if (this._ps) { return this; }
		this._ps = true;
		this._pST = window.performance.now();
		
		if (this._pC !== null) {
			this._pC.call();
		}
		K.remove(this);
		return this;
	};

	w.play = function () {
		if (!this._ps) { return this; }
		this._ps = false;
		this._sT += window.performance.now() - this._pST;

		K.add(this);
		return this;
	};

	w.resume = function () {
		this.play();
		return this;
	};

	w.restart = function () {
		this.seek(0);
		return this;
	};
	
	w.scrollOut = function(){ //prevent scroll when tweening scroll		
		if ( 'scroll' in this._vE || 'scrollTop' in this._vE ) {
			this.removeListeners();
			document.body.removeAttribute('data-tweening');
		}
	};
	w.scrollIn = function(){
		if ( 'scroll' in this._vE || 'scrollTop' in this._vE ) {
			if (!document.body.getAttribute('data-tweening') ) {
				document.body.setAttribute('data-tweening', 'scroll');
				this.addListeners();
			}
		}
	};
	
	w.addListeners = function () {
		document.addEventListener(_ev, K.preventScroll, false);
	};

	w.removeListeners = function () {
		document.removeEventListener(_ev, K.preventScroll, false);
	};

	w.stopChainedTweens = function () {
		var i = 0, ctl =this._cT.length;
		for (i; i < ctl; i++) {
			this._cT[i].stop();
		}
	};

	w.chain = function () {
		this._cT = arguments;
		return this;
	};

	w.close = function () {
		var i = _tws.indexOf(this);
		if (i === _tws.length-1) { K.s(); }
	};
				
	// process properties
	K.prP = function (t, e) { // process tween properties for .fromTo() method 
		var _st = {},
			tr = e === true ? _tfE : _tfS,
			tl = e === true ? _tlE : _tlS,
			rt = e === true ? _rtE : _rtS;

		tl = {}; tr = {};

		for (var x in t) {
			if (typeof t[x] === 'object' && !( t[x] instanceof Array) ) {
				for (var y in t[x]) {
					_st[x][y] = K.pp(t[x], t[x][y]);
				}
			} else {
				if (_tf.indexOf(x) !== -1) {
					
					if (/matrix/.test(x)) { //process matrix
						if ( t[x] instanceof Array ) {
							for (var i = 0; i< t[x].length; i++){
								t[x][i] = parseFloat(t[x][i]);
							}							
						} else {
							tr[x] = t[x].replace(/3d|matrix|\(|\)|\s|/g,'').split(',');
							for (var i = 0; i< t[x].length; i++){
								t[x][i] = parseFloat(t[x][i]);
							}
						}					
						tr[x] = t[x];
					} else {
						if (/translate/.test(x)) { //process translate3d
							var ta = ['X', 'Y', 'Z'], f = 0; //coordinates // 	translate[x] = pp(x, t[x]);	
							for (f; f < 3; f++) {
								var a = ta[f];
								if ( /3d/.test(x) ){
									tl['translate' + a] = K.pp('translate' + a, t[x][f]);
								} else {
									tl['translate' + a] = ('translate' + a in t) ? K.pp('translate' + a, t['translate' + a]) : { value: 0, unit: 'px' };
								}
							}
							tr['translate'] = tl;
						} else if (/rotate|skew/.test(x)) { //process rotation
							var ap = /rotate/.test(x) ? 'rotate' : 'skew', ra = ['X', 'Y', 'Z'], r = 0, 
								_rt = {}, _sk = {}, rt = ap === 'rotate' ? _rt : _sk; 
							for (r; r < 3; r++) {
								var v = ra[r]; 
								if ( t[ap+v] !== undefined ) {
									rt[ap+v] = K.pp(ap + v, t[ap+v]);
								}			
							}
							
							tr[ap] = rt;
						} else { //process scale
							tr[x] = K.pp(x, t[x]);
						}
					}
					_st['transform'] = tr;

				} else {
					_st[x] = K.pp(x, t[x]);
				}
			}
		}
		return _st;
	};
		
	// _cls _sc _op _dm _po _bg _tf		 
	K.pp = function(p, v) {//process single property
		if (_tf.indexOf(p) !== -1) {
			var t = p.replace(/X|Y|Z/, '');
			if (p === 'translate3d') { 
				var tv = v.split(',');
				return {
					translateX : { value: K.truD(tv[0]).v, unit: K.truD(tv[0]).u },
					translateY : { value: K.truD(tv[1]).v, unit: K.truD(tv[1]).u },
					translateZ : { value: K.truD(tv[2]).v, unit: K.truD(tv[2]).u }
				};
			} else if (t === 'translate') {
				return { value: K.truD(v).v, unit: K.truD(v).u };
			} else if (t === 'skew' || t === 'rotate') {
				return { value: K.truD(v).v, unit: 'deg' };
			} else if (t === 'scale') {
				return { value: parseFloat(v, 10) };
			}
		}
		if (_po.indexOf(p) !== -1 || _dm.indexOf(p) !== -1) {
			return { value: K.truD(v).v, unit: K.truD(v).u };
		}
		if (_op.indexOf(p) !== -1) {
			return { value: parseFloat(v, 10) };
		}
		if (_sc.indexOf(p) !== -1) {
			return { value: parseFloat(v, 10) };
		}
		if (_clp.indexOf(p) !== -1) {
			if ( v instanceof Array ){
				return [ K.truD(v[0]), K.truD(v[1]), K.truD(v[2]), K.truD(v[3]) ];
			} else {				
				var ci;
				if ( /rect/.test(v) ) {
					ci = v.replace(/rect|\(|\)/g,'').split(/\s|\,/); 
				} else if ( /auto|none|initial/.test(v) ){
					ci = _d[p];	
				}				
				return [ K.truD(ci[0]),  K.truD(ci[1]), K.truD(ci[2]),  K.truD(ci[3]) ];
			}	
		}
		if (_cls.indexOf(p) !== -1) {
			return { value: K.truC(v) };
		}
		if (_bg.indexOf(p) !== -1) {
			if ( v instanceof Array ){				
				return { x: K.truD(v[0])||{ v: 50, u: '%' }, y: K.truD(v[1])||{ v: 50, u: '%' } };
			} else {
				var posxy = v.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/,50).split(/\s|\,/g);
				return { x: K.truD(posxy[0])||{ v: 50, u: '%' }, y: K.truD(posxy[1])||{ v: 50, u: '%' } };
			}	
		}
		if (_rd.indexOf(p) !== -1) {
			var rad = K.truD(v);
			return { value: rad.v, unit: rad.u };
		}
	};
		
	K.truD = function (d) { //true dimension returns { v = value, u = unit }
		var x = parseInt(d), y = /[a-z]+|%/g.test(d) ? d.replace(x,'') : 'px'; 
		return { v: x, u: y };
	};
	
	K.preventScroll = function (e) { // prevent mousewheel or touch events while tweening scroll
		var data = document.body.getAttribute('data-tweening');
		if (data && data === 'scroll') {
			e.preventDefault();
		}
	};
		
	K.truC = function (v) { // replace transparent and transform any color to rgba()/rgb()
		var vrgb, y;
		if (/rgb|rgba/.test(v)) { //rgb will be fastest initialized
			vrgb = v.replace(/[^\d,]/g, '').split(','); y = vrgb[3] ? vrgb[3] : null;
			if (!y) {
				return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]) };
			} else {
				return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]), a: parseFloat(y) };
			}
		}
		if (/#/.test(v)) {
			return { r: K.htr(v).r, g: K.htr(v).g, b: K.htr(v).b };
		}
		if (/transparent|none|initial|inherit/.test(v)) {
			return { r: 0, g: 0, b: 0, a: 0 };
		}
	};
		
	K.rth = function (r, g, b) { // transform rgb to hex or vice-versa | webkit browsers ignore HEX, always use RGB/RGBA
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	};
	K.htr = function (hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shr = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shr, function (m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};	
	
	K.pe = function (es) { //process easing
		if ( typeof es === 'function') {
			return es;
		} else if ( typeof es === 'string' ) {
			if ( /easing|linear/.test(es) ) {
				return K.Easing[es]; //regular Robert Penner Easing Functions
			} else if ( /bezier/.test(es) )  { 
				var bz = es.replace(/bezier|\s|\(|\)/g,'').split(','), i = 0, l = bz.length;
				for (i; i<l;i++) { bz[i] = parseFloat(bz[i]); }
				return K.Ease.bezier(bz[0],bz[1],bz[2],bz[3]); //bezier easing						
			} else {
				return K.Ease[es](); //bezier based easing functions						
			}
		}
	};
		
	K.Ease = {}; K.Easing = {};  K.Physics = {}; // we build nice ease objects here
		
	//high performance for accuracy (smoothness) trade
	K.Easing.linear = function (t) { return t; };
	
	//high accuracy for tiny performance trade
	K.Ease.easeIn = function(){ return _bz.pB(0.42, 0.0, 1.00, 1.0); };
	K.Ease.easeOut = function(){ return _bz.pB(0.00, 0.0, 0.58, 1.0); };
	K.Ease.easeInOut = function(){ return _bz.pB(0.50, 0.16, 0.49, 0.86); };
				
	K.Ease.easeInSine = function(){ return _bz.pB(0.47, 0, 0.745, 0.715); };
	K.Ease.easeOutSine = function(){ return _bz.pB(0.39, 0.575, 0.565, 1); };
	K.Ease.easeInOutSine = function(){ return _bz.pB(0.445, 0.05, 0.55, 0.95); };
	
	K.Ease.easeInQuad = function () { return _bz.pB(0.550, 0.085, 0.680, 0.530); };
	K.Ease.easeOutQuad = function () { return _bz.pB(0.250, 0.460, 0.450, 0.940); };			
	K.Ease.easeInOutQuad = function () { return _bz.pB(0.455, 0.030, 0.515, 0.955); };
	
	K.Ease.easeInCubic = function () { return _bz.pB(0.55, 0.055, 0.675, 0.19); };
	K.Ease.easeOutCubic = function () { return _bz.pB(0.215, 0.61, 0.355, 1); };			
	K.Ease.easeInOutCubic = function () { return _bz.pB(0.645, 0.045, 0.355, 1); };
	
	K.Ease.easeInQuart = function () { return _bz.pB(0.895, 0.03, 0.685, 0.22); };
	K.Ease.easeOutQuart = function () { return _bz.pB(0.165, 0.84, 0.44, 1); };
	K.Ease.easeInOutQuart = function () { return _bz.pB(0.77, 0, 0.175, 1); };	

	K.Ease.easeInQuint = function(){ return _bz.pB(0.755, 0.05, 0.855, 0.06); };
	K.Ease.easeOutQuint = function(){ return _bz.pB(0.23, 1, 0.32, 1); };
	K.Ease.easeInOutQuint = function(){ return _bz.pB(0.86, 0, 0.07, 1); };
							
	K.Ease.easeInExpo = function(){ return _bz.pB(0.95, 0.05, 0.795, 0.035); }; 
	K.Ease.easeOutExpo = function(){ return _bz.pB(0.19, 1, 0.22, 1); };
	K.Ease.easeInOutExpo = function(){ return _bz.pB(1, 0, 0, 1); };

	K.Ease.easeInCirc = function(){ return _bz.pB(0.6, 0.04, 0.98, 0.335); };
	K.Ease.easeOutCirc = function(){ return _bz.pB(0.075, 0.82, 0.165, 1); };
	K.Ease.easeInOutCirc = function(){ return _bz.pB(0.785, 0.135, 0.15, 0.86); };
	
	K.Ease.easeInBack = function(){ return _bz.pB(0.600, -0.280, 0.735, 0.045); };
	K.Ease.easeOutBack = function(){ return _bz.pB(0.175, 0.885, 0.320, 1.275); };
	K.Ease.easeInOutBack = function(){ return _bz.pB(0.68, -0.55, 0.265, 1.55); };
	
	K.Ease.slowMo = function(){ return _bz.pB(0.000, 0.500, 1.000, 0.500); };
	K.Ease.slowMo1 = function(){ return _bz.pB(0.000, 0.700, 1.000, 0.300); };
	K.Ease.slowMo2 = function(){ return _bz.pB(0.000, 0.900, 1.000, 0.100); };

	//  BezierEasing - use bezier curve for transition easing function
	//  by Gaëtan Renaudeau 2014 – MIT License
	//  optimized by dnp_theme 2015 – MIT License
	K.Ease.bezier = function(mX1, mY1, mX2, mY2) {		
	    return _bz.pB(mX1, mY1, mX2, mY2);
	};
		
	var _bz = K.Ease.bezier.prototype;
	
    // These values are established by empiricism with tests (tradeoff: performance VS precision)
    _bz.ni    = 4; // NEWTON_ITERATIONS
    _bz.nms   = 0.001; // NEWTON_MIN_SLOPE
    _bz.sp    = 0.0000001; // SUBDIVISION_PRECISION
    _bz.smi   = 10, // SUBDIVISION_MAX_ITERATIONS

    _bz.ksts = 11; // k Spline Table Size
    _bz.ksss = 1.0 / (_bz.ksts - 1.0); // k Sample Step Size

    _bz.f32as = 'Float32Array' in window; // float32ArraySupported
    _bz.msv = _bz.f32as ? new Float32Array (_bz.ksts) : new Array (_bz.ksts); // m Sample Values

    _bz.A = function(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; };
    _bz.B = function(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; };
    _bz.C = function(aA1)      { return 3.0 * aA1; };
		
	_bz.r = {};
	_bz.pB = function (mX1, mY1, mX2, mY2) {
		this._p = false; var self = this;
		
		_bz.r = function(aX){	
	        if (!self._p) _bz.pc(mX1, mX2, mY1, mY2); 
	        if (mX1 === mY1 && mX2 === mY2) return aX;
	
	        if (aX === 0) return 0;
	        if (aX === 1) return 1; 
	        return _bz.cB(_bz.gx(aX, mX1, mX2), mY1, mY2);		
		};
		return _bz.r;
    };
	
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    _bz.cB = function(aT, aA1, aA2) { // calc Bezier
        return ((_bz.A(aA1, aA2)*aT + _bz.B(aA1, aA2))*aT + _bz.C(aA1))*aT;
    };

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    _bz.gS = function (aT, aA1, aA2) { // getSlope
        return 3.0 * _bz.A(aA1, aA2)*aT*aT + 2.0 * _bz.B(aA1, aA2) * aT + _bz.C(aA1);
    };

    _bz.bS = function(a, aA, aB, mX1, mX2) { // binary Subdivide
        var x, t, i = 0, j = _bz.sp, y = _bz.smi;
        do {
            t = aA + (aB - aA) / 2.0;
            x = _bz.cB(t, mX1, mX2) - a;
            if (x > 0.0) {
                aB = t;
            } else {
                aA = t;
            }
        } while (Math.abs(x) > j && ++i < y);
        return t;
    };

    _bz.nri = function (aX, agt, mX1, mX2) { // newton Raphs on Iterate
		var i = 0, j = _bz.ni;
        for (i; i < j; ++i) {
            var cs = _bz.gS(agt, mX1, mX2);
            if (cs === 0.0) return agt;
            var x = _bz.cB(agt, mX1, mX2) - aX;
            agt -= x / cs;
        }
        return agt;
    };

    _bz.csv = function (mX1, mX2) { // calc Sample Values
		var i = 0, j = _bz.ksts;
        for (i; i < j; ++i) {
            _bz.msv[i] = _bz.cB(i * _bz.ksss, mX1, mX2);
        }
    };

    _bz.gx = function (aX,mX1,mX2) { //get to X
        var iS = 0.0, cs = 1, ls = _bz.ksts - 1;

        for (; cs != ls && _bz.msv[cs] <= aX; ++cs) {
            iS += _bz.ksss;
        }
        --cs;

        // Interpolate to provide an initial guess for t
        var dist = (aX - _bz.msv[cs]) / (_bz.msv[cs+1] - _bz.msv[cs]),
            gt = iS + dist * _bz.ksss,
            ins = _bz.gS(gt, mX1, mX2),
			fiS = iS + _bz.ksss;

        if (ins >= _bz.nms) {
            return _bz.nri(aX, gt, mX1, mX2);
        } else if (ins === 0.0) {
            return gt;
        } else {
            return _bz.bS(aX, iS, fiS, mX1, mX2);
        }
    };

    _bz.pc = function(mX1, mX2, mY1, mY2) { 
	   this._p = true;
		if (mX1 != mY1 || mX2 != mY2)
        _bz.csv(mX1, mX2);
    };	
	
	//returns browser prefix
	function getPrefix(){ 
		var div = document.createElement('div'), i = 0,	pf = ['Moz', 'Webkit', 'O', 'Ms'],
			s = ['MozTransform', 'WebkitTransform', 'OTransform', 'MsTransform'], pl = s.length;
		for (i; i < pl; i++) { if (s[i] in div.style) return pf[i];	}
		div = null;
		return false;
	}
	
	return K;
}));
