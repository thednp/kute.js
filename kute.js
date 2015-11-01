/* KUTE.js - The Light Tweening Engine
 * by dnp_theme
 * Licensed under MIT-License
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		define([], factory); // AMD. Register as an anonymous module.
    } else if (typeof exports == 'object') {
        module.exports = factory(); // Node, not strict CommonJS
    } else {
        // Browser globals
		root.KUTE = root.KUTE || factory();
    }
}(this, function () {
	var K = K || {}, _tws = [], _t, _stk = false, // _stoppedTick // _tweens // KUTE, _tween, _tick,
		_pf = getPrefix(), // prefix
		_rafR = _rafR || ((!('requestAnimationFrame' in window)) ? true : false), // is prefix required for requestAnimationFrame
		_pfT = _pfT || ((!('transform' in document.getElementsByTagName('div')[0].style)) ? true : false), // is prefix required for transform
		_pfB = _pfB || ((!('border-radius' in document.getElementsByTagName('div')[0].style)) ? true : false), // is prefix required for border-radius
		_tch = _tch || (('ontouchstart' in window || navigator.msMaxTouchPoints) || false), // support Touch?
		_ev = _ev || (_tch ? 'touchstart' : 'mousewheel'), //event to prevent on scroll

		_bd = document.body,
		_htm = document.getElementsByTagName('HTML')[0],
		_sct = (/webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? _bd : _htm),

		_isIE = (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null) ? parseFloat( RegExp.$1 ) : false,
		_isIE8 = _isIE === 8,

		//assign preffix to DOM properties
		_pfp = _pfp || _pfT ? _pf + 'Perspective' : 'perspective',
		_pfo = _pfo || _pfT ? _pf + 'PerspectiveOrigin' : 'perspectiveOrigin',
		_tr = _tr || _pfT ? _pf + 'Transform' : 'transform',
		_br = _br || _pfB ? _pf + 'BorderRadius' : 'borderRadius',
		_brtl = _brtl || _pfB ? _pf + 'BorderTopLeftRadius' : 'borderTopLeftRadius',
		_brtr = _brtr || _pfB ? _pf + 'BorderTopRightRadius' : 'borderTopRightRadius',
		_brbl = _brbl || _pfB ? _pf + 'BorderBottomLeftRadius' : 'borderBottomLeftRadius',
		_brbr = _brbr || _pfB ? _pf + 'BorderBottomRightRadius' : 'borderBottomRightRadius',
		_raf = _raf || _rafR ? window[_pf + 'RequestAnimationFrame'] : window['requestAnimationFrame'],
		_caf = _caf || _rafR ? window[_pf + 'CancelAnimationFrame'] : window['cancelAnimationFrame'],

		//supported properties
		_cls = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
		_sc  = ['scrollTop', 'scroll'], //scroll, it has no default value, it's calculated on tween start
		_clp = ['clip'], // clip
		_op  = ['opacity'], // opacity
		_rd  = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'], // border radius px/any
		_bm  = ['top', 'left', 'right', 'bottom',
				'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
				'padding', 'margin', 'paddingTop','paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop','marginBottom', 'marginLeft', 'marginRight',
				'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'], // dimensions / box model
		_tp  = ['fontSize','lineHeight','letterSpacing'], // text properties
		_bg  = ['backgroundPosition'], // background position
		_3d  = ['rotateX', 'rotateY','translateZ'], // transform properties that require perspective
		_tf  = ['translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'translate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scale'], // transform
		_all = _cls.concat(_sc, _clp, _op, _rd, _bm, _tp, _bg, _tf), al = _all.length,
		_tfS = {}, _tfE = {}, _tlS = {}, _tlE = {}, _rtS = {}, _rtE = {}, //internal temp
		_d = _d || {}; //all properties default values

	//populate default values object
	for ( var i=0; i< al; i++){
		var p = _all[i];
		if (_cls.indexOf(p) !== -1){
			_d[p] = 'rgba(0,0,0,0)'; // _d[p] = {r:0,g:0,b:0,a:1};
		} else if ( _rd.indexOf(p) !== -1 || _bm.indexOf(p) !== -1 || _tp.indexOf(p) !== -1) {
			_d[p] = 0;
		} else if ( _bg.indexOf(p) !== -1 ){
			_d[p] = [50,50];
		} else if ( p === 'clip' ){
			_d[p] = [0,0,0,0];
		} else if ( p === 'translate3d' ){
			_d[p] = [0,0,0];
		} else if ( p === 'translate' ){
			_d[p] = [0,0];
		} else if ( p === 'rotate' || /X|Y|Z/.test(p) ){
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
			if (!_tws[i]) { return false; }
			if (_tws[i].u(t)) {
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
		if ( o === undefined ) { o = {}; }
		var _el = _el || typeof el === 'object' ? el : document.querySelector(el),
			_o = _o || o;
		_o.rpr = true;
		_o.easing = _o && K.pe(_o.easing) || K.Easing.linear;

		var _vS = to, // we're gonna have to build this object at start
			_vE = K.prP(to, true),
			_tw = new K.Tween(_el, _vS, _vE, _o);
		return _tw;
	};

	K.fromTo = function (el, f, to, o) {
		if ( o === undefined ) { o = {}; }
		var _el = _el || typeof el === 'object' ? el : document.querySelector(el);
		var _o = o;

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

	// render for each property
	K.r = function (w,v) {
		var p, css = w._el && w._el.style, opp = _isIE8 ? 'filter':'opacity',
			ets = (w._el === undefined || w._el === null) ? _sct : w._el;
		for (p in w._vE) {

			var _start = w._vS[p],
				_end = w._vE[p],
				v1 = _start.value,
				v2 = _end.value,
				tv = v1 + (v2 - v1) * v,
				u = _end.unit,
				// checking array on every frame takes time so let's cache these
				cls = _cls.indexOf(p) !== -1,
				bm = _tp.indexOf(p) !== -1 || _bm.indexOf(p) !== -1,
				rd = _rd.indexOf(p) !== -1 && !_isIE8,
				sc = _sc.indexOf(p) !== -1,
				bg = _bg.indexOf(p) !== -1,
				clp = _clp.indexOf(p) !== -1,
				op = _op.indexOf(p) !== -1,
				tf = p === 'transform' && !_isIE8;

			//process styles by property / property type
			if ( rd ) {
				if (p === 'borderRadius') {
					css[_br] = tv + u;
				} else if (p === 'borderTopLeftRadius') {
					css[_brtl] = tv + u;
				} else if (p === 'borderTopRightRadius') {
					css[_brtr] = tv + u;
				} else if (p === 'borderBottomLeftRadius') {
					css[_brbl] = tv + u;
				} else if (p === 'borderBottomRightRadius') {
					css[_brbr] = tv + u;
				}

			} else if (tf) {
				var _tS = '', tP, rps, pps = 'perspective('+w._pp+'px) '; //transform style & property

				for (tP in _end) {
					var t1 = _start[tP], t2 = _end[tP];
					rps = _3d.indexOf(tP) !== -1 && !_isIE;

					if ( tP === 'translate' ) {
						var tls = '', ts = {}, ax;

						for (ax in t2){
							var x1 = t1[ax].value || 0, x2 = t2[ax].value || 0, xu = t2[ax].unit || 'px';
							ts[ax] = x1===x2 ? x2+xu : (x1 + ( x2 - x1 ) * v) + xu;
						}
						tls = t2.x ? 'translate(' + ts.x + ',' + ts.y + ')' :
							'translate3d(' + ts.translateX + ',' + ts.translateY + ',' + ts.translateZ + ')';

						_tS = (_tS === '') ? tls : (tls + ' ' + _tS);
					} else if ( tP === 'rotate' ) {
						var rt = '', rS = {}, rx;

						for ( rx in t2 ){
							if ( t1[rx] ) {
								var a1 = t1[rx].value, a2 = t2[rx].value, au = t2[rx].unit||'deg',
									av = a1 + (a2 - a1) * v;
								rS[rx] = rx ==='z' ? 'rotate('+av+au+')' : rx + '(' + av + au + ') ';
							}
						}
						rt = t2.z ?  rS.z  : (rS.rotateX||'') + (rS.rotateY||'') + (rS.rotateZ||'');

						_tS = (_tS === '') ? rt : (_tS + ' ' + rt);
					} else if (tP==='skew') {
						var sk = '', sS = {};
						for ( var sx in t2 ){
							if ( t1[sx] ) {
								var s1 = t1[sx].value, s2 = t2[sx].value, su = t2[sx].unit||'deg',
									sv = s1 + (s2 - s1) * v;
								sS[sx] = sx + '(' + sv + su + ') ';
							}
						}
						sk = (sS.skewX||'') + (sS.skewY||'');
						_tS = (_tS === '') ? sk : (_tS + ' ' + sk);
					} else if (tP === 'scale') {
						var sc1 = t1.value, sc2 = t2.value,
							s = sc1 + (sc2 - sc1) * v, scS = tP + '(' + s + ')';
						_tS = (_tS === '') ? scS : (_tS + ' ' + scS);
					}
				}
				css[_tr] = rps || ( w._pp !== undefined && w._pp !== 0 ) ? pps + _tS : _tS;
			} else if ( cls ) {
				var _c = {}, c;

				for (c in v2) {
					if ( c !== 'a' ){
						_c[c] = parseInt(v1[c] + (v2[c] - v1[c]) * v)||0;
					} else {
						_c[c] = (v1[c] && v2[c]) ? parseFloat(v1[c] + (v2[c] - v1[c]) * v) : null;
					}
				}

				if ( w._hex ) {
					css[p] = K.rth( parseInt(_c.r), parseInt(_c.g), parseInt(_c.b) );
				} else {
					css[p] = !_c.a || _isIE8 ? 'rgb(' + _c.r + ',' + _c.g + ',' + _c.b + ')' : 'rgba(' + _c.r + ',' + _c.g + ',' + _c.b + ',' + _c.a + ')';
				}
			} else if ( bm ) {
				css[p] = tv+u;
			} else if ( sc ) {
				ets.scrollTop = v1 + ( v2 - v1 ) * v;
			} else if ( bg ) {
				var px1 = _start.x.v, px2 = _end.x.v, py1 = _start.y.v, py2 = _end.y.v,
					px = (px1 + ( px2 - px1 ) * v), pxu = '%',
					py = (py1 + ( py2 - py1 ) * v), pyu = '%';
				css[p] = px + pxu + ' ' + py + pyu;
			} else if ( clp ) {
				var h = 0, cl = [];
				for (h;h<4;h++){
					var c1 = _start[h].v, c2 = _end[h].v, cu = _end[h].u || 'px';
					cl[h] = ((c1 + ( c2 - c1 ) * v)) + cu;
				}
				css[p] = 'rect('+cl+')';
			} else if ( op ) {
				css[opp] = !_isIE8 ? tv : "alpha(opacity=" + parseInt(tv*100) + ")";
			}
		}
	};

	K.perspective = function (l,w) {
		if ( w._ppo !== undefined ) { l.style[_pfo] = w._ppo; } // element perspective origin
		if ( w._ppp !== undefined ) { l.parentNode.style[_pfp] = w._ppp + 'px'; } // parent perspective
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
		this.playing = false; // _isPlaying
		this.reversed = false; // _reversed
		this._rD = this._rD || _o&&_o.repeatDelay || 0; // _repeatDelay
		this._dl = this._dl || _o&&_o.delay || 0; //delay
		this._sT = null; // startTime
		this.paused = false; //_paused
		this._pST = null; //_pauseStartTime
		this._pp = this._pp || _o.perspective; // perspective
		this._ppo = this._ppo || _o.perspectiveOrigin; // perspective origin
		this._ppp = this._ppp || _o.parentPerspective; // parent perspective
		this._pppo = this._pppo || _o.parentPerspectiveOrigin; // parent perspective origin
		this._rpr = this._rpr || _o.rpr || false; // internal option to process inline/computed style at start instead of init true/false
		this._hex = this._hex || _o.keepHex || false; // option to keep hex for color tweens true/false
		this._e = this._e || _o.easing; // _easing
		this._cT = this._cT || []; //_chainedTweens
		this._sC = this._sC || _o&&_o.start || null; // _on StartCallback
		this._sCF = false; //_on StartCallbackFIRED
		this._uC = _o&&_o.update || null; // _on UpdateCallback
		this._cC = _o&&_o.complete || null; // _on CompleteCallback
		this._pC = _o&&_o.pause || null; // _on PauseCallback
		this._rC = _o&&_o.play || null; // _on ResumeCallback
		this._stC = _o&&_o.stop || null; // _on StopCallback
		this.repeat = this._r; // we cache the number of repeats to be able to put it back after all cycles finish
	};

	var w = K.Tween.prototype;

	w.start = function (t) {
		this.scrollIn();
		var f = {};

		K.perspective(this._el,this); // apply the perspective

		if ( this._rpr ) { // on start we reprocess the valuesStart for TO() method
			f = this.prS();
			this._vS = {};
			this._vS = K.prP(f,false);

			for ( p in this._vS ) {
				if ( p === 'transform' && (p in this._vE) ){
					for ( var sp in this._vS[p]) {
						if (!(sp in this._vE[p])) { this._vE[p][sp] = {}; }
						for ( var spp in this._vS[p][sp] ) { // 3rd level
							if ( this._vS[p][sp][spp].value !== undefined ) {
								if (!(spp in this._vE[p][sp])) { this._vE[p][sp][spp] = {}; }
								for ( var sppp in this._vS[p][sp][spp]) { // spp = translateX | rotateX | skewX | rotate2d
									if ( !(sppp in this._vE[p][sp][spp])) {
										this._vE[p][sp][spp][sppp] = this._vS[p][sp][spp][sppp]; // sppp = unit | value
									}
								}
							}
						}
						if ( 'value' in this._vS[p][sp] && (!('value' in this._vE[p][sp])) ) { // 2nd level
							for ( var spp in this._vS[p][sp] ) { // scale
								if (!(spp in this._vE[p][sp])) {
									this._vE[p][sp][spp] = this._vS[p][sp][spp]; // spp = unit | value
								}
							}
						}
					}
				}
			}
		}

		for ( p in this._vE ) {
			this._vSR[p] = this._vS[p];
		}

		// now it's a good time to start
		K.add(this);
		this.playing = true;
		this.paused = false;
		this._sCF = false;
		this._sT = t || window.performance.now();
		this._sT += this._dl;
		if (!_t) K.t();
		return this;
	};

	//main worker, doing update on tick
	w.u = function(t) {
		t = t || window.performance.now();
		if (t < this._sT && this.playing && !this.paused) { return true; }

		if (!this._sCF) {
			if (this._sC) { this._sC.call(); }
			this._sCF = true;
		}

		var e = ( t - this._sT ) / this._dr; //elapsed
		e = e > 1 ? 1 : e;

		//render the CSS update
		K.r(this,this._e(e));

		if (this._uC) { this._uC.call(); }

		if (e === 1) {
			if (this._r > 0) {
				if ( this._r !== Infinity ) { this._r--; }

				if (this._y) { this.reversed = !this.reversed; this.reverse(); } // handle yoyo

				this._sT = (this._y && !this.reversed) ? t + this._rD : t; //set the right time for delay
				return true;
			} else {

				if (this._cC) { this._cC.call(); }

				//stop preventing scroll when scroll tween finished
				this.scrollOut();
				var i = 0, ctl = this._cT.length;
				for (i; i < ctl; i++) {
					this._cT[i].start(this._sT + this._dr);
				}

				//stop ticking when finished
				this.close();
				return false;
			}
		}
		return true;
	};

	w.stop = function () {
		if (!this.paused && this.playing) {
			K.remove(this);
			this.playing = false;
			this.paused = false;
			this.scrollOut();

			if (this._stC !== null) {
				this._stC.call();
			}
			this.stopChainedTweens();
			this.close();
		}
		return this;
	};

	w.pause = function() {
		if (!this.paused && this.playing) {
			K.remove(this);
			this.paused = true;
			this._pST = window.performance.now();
			if (this._pC !== null) {
				this._pC.call();
			}
		}
		return this;
	};

	w.play = function () {
		if (this.paused && this.playing) {
			this.paused = false;
			if (this._rC !== null) {
				this._rC.call();
			}
			this._sT += window.performance.now() - this._pST;
			K.add(this);
			if (!_t) K.t();	// restart ticking if stopped
		}
		return this;
	};

	w.resume = function () { this.play(); return this; };

	w.reverse = function () {
		if (this._y) {
			for (var p in this._vE) {
				var tmp = this._vSR[p];
				this._vSR[p] = this._vE[p];
				this._vE[p] = tmp;
				this._vS[p] = this._vSR[p];
			}
		}
		return this;
	};

	w.chain = function () {	this._cT = arguments; return this; };

	w.stopChainedTweens = function () {
		var i = 0, ctl =this._cT.length;
		for (i; i < ctl; i++) {
			this._cT[i].stop();
		}
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

	w.prS = function () { //prepare valuesStart for .to() method
		var f = {}, el = this._el, to = this._vS, cs = this.gIS('transform'), deg = ['rotate','skew'], ax = ['X','Y','Z'];

		for (var p in to){
			if ( _tf.indexOf(p) !== -1 ) {
				var r2d = (p === 'rotate' || p === 'translate' || p === 'scale');
				if ( /translate/.test(p) && p !== 'translate' ) {
					f['translate3d'] = cs['translate3d'] || _d[p];
				} else if ( r2d ) { // 2d transforms
					f[p] = cs[p] || _d[p];
				} else if ( !r2d && /rotate|skew/.test(p) ) { // all angles
					for (var d=0; d<2; d++) {
						for (var a = 0; a<3; a++) {
							var s = deg[d]+ax[a];
							if (_tf.indexOf(s) !== -1 && (s in to) ) { f[s] =  cs[s] || _d[s]; }
						}
					}
				}
			} else {
				if ( _sc.indexOf(p) === -1 ) {
					if (p === 'opacity' && _isIE8 ) { // handle IE8 opacity
						var co = this.gCS('filter');
						f['opacity'] = typeof co === 'number' ? co : _d['opacity'];
					} else {
						f[p] = this.gCS(p) || _d[p];
					}
				} else {
					f[p] = (el === null || el === undefined) ? (window.pageYOffset || _sct.scrollTop) : el.scrollTop;
				}
			}
		}
		for ( var p in cs ){ // also add to _vS values from previous tweens
			if ( _tf.indexOf(p) !== -1 && (!( p in to )) ) {
				f[p] = cs[p] || _d[p];
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
					if ( tp[0] !== '' && _tf.indexOf(tp) ){
						trsf[tp[0]] = /translate3d/.test(tp[0]) ? tp[1].split(',') : tp[1];
					}
				}
			}
		}
		return trsf;
	};

	w.gCS = function (p) { // gCS = get style property for element from computedStyle for .to() method
		var el = this._el, cs = window.getComputedStyle(el) || el.currentStyle, //the computed style
			ppp = ( !_isIE8 && _pfT && ( /transform|Radius/.test(p) ) ) ? ('-'+ _pf.toLowerCase()+'-'+p) : p, //prefixed property for CSS match
			s = ( (_pfT && p==='transform' ) || (_pfT && _rd.indexOf(p) !== -1)) // s the property style value
			  ? cs[ppp]
			  : cs[p];

		if ( p !== 'transform' && (ppp in cs) ) {
			if ( s ){
				if (ppp==='filter') { // handle IE8 opacity
					var si1 = parseInt(s.split('=')[1].replace(')','')), si = parseFloat(si1/100);
					return si;
				} else {
					return s;
				}
			} else {
				return _d[p];
			}
		}
	};

	w.close = function () {
		var self = this;
		setTimeout(function(){
			var i = _tws.indexOf(self);
			if (i === _tws.length-1) { K.s(); }
			if (self.repeat > 0) { self._r = self.repeat; }
			if (self._y && self.reversed===true) { self.reverse(); self.reversed = false; }
			self.playing = false;
		},100)
	};

	// process properties
	K.prP = function (t, e) { // process tween properties for .fromTo() method
		var _st = {},
			tr = e === true ? _tfE : _tfS,
			tl = e === true ? _tlE : _tlS,
			rt = e === true ? _rtE : _rtS;

		tl = {}; tr = {};

		for (var x in t) {
			if (_tf.indexOf(x) !== -1) {

				if (x !== 'translate' && /translate/.test(x)) { //process translate3d
					var ta = ['X', 'Y', 'Z'], f = 0; //coordinates // 	translate[x] = pp(x, t[x]);

					for (f; f < 3; f++) {
						var a = ta[f];
						if ( /3d/.test(x) ) {
							tl['translate' + a] = K.pp('translate' + a, t[x][f]);
						} else {
							tl['translate' + a] = ('translate' + a in t) ? K.pp('translate' + a, t['translate' + a]) : { value: 0, unit: 'px' };
						}
					}

					tr['translate'] = tl;
				} else if ( x !== 'rotate' && /rotate|skew/.test(x)) { //process rotation
					var ap = /rotate/.test(x) ? 'rotate' : 'skew', ra = ['X', 'Y', 'Z'], r = 0,
						_rt = {}, _sk = {}, rt = ap === 'rotate' ? _rt : _sk;
					for (r; r < 3; r++) {
						var v = ra[r];
						if ( t[ap+v] !== undefined && x !== 'skewZ' ) {
							rt[ap+v] = K.pp(ap + v, t[ap+v]);
						}
					}

					tr[ap] = rt;
				} else if ( x === 'translate' || x === 'rotate' || x === 'scale' ) { //process 2d translation / rotation
					tr[x] = K.pp(x, t[x]);
				}

				_st['transform'] = tr;

			} else if (_tf.indexOf(x) === -1)  {
				_st[x] = K.pp(x, t[x]);
			}
		}
		return _st;
	};

	// _cls _sc _op _bm _tp _bg _tf
	K.pp = function(p, v) {//process single property
		if (_tf.indexOf(p) !== -1) {
			var t = p.replace(/X|Y|Z/, ''), tv;
			if (p === 'translate3d') {
				tv = v.split(',');
				return {
					translateX : { value: K.truD(tv[0]).v, unit: K.truD(tv[0]).u },
					translateY : { value: K.truD(tv[1]).v, unit: K.truD(tv[1]).u },
					translateZ : { value: K.truD(tv[2]).v, unit: K.truD(tv[2]).u }
				};
			} else if (p !== 'translate' && t === 'translate') {
				return { value: K.truD(v).v, unit: (K.truD(v).u||'px') };
			} else if (p !== 'rotate' && (t === 'skew' || t === 'rotate') && p !== 'skewZ' ) {
				return { value: K.truD(v).v, unit: (K.truD(v,p).u||'deg') };
			} else if (p === 'translate') {
				tv = typeof v === 'string' ? v.split(',') : v; var t2d = {};
				if (tv instanceof Array) {
					t2d.x = { value: K.truD(tv[0]).v, unit: K.truD(tv[0]).u },
					t2d.y = { value: K.truD(tv[1]).v, unit: K.truD(tv[1]).u }
				} else {
					t2d.x = { value: K.truD(tv).v, unit: K.truD(tv).u },
					t2d.y = { value: 0, unit: 'px' }
				}
				return t2d;
			} else if (p === 'rotate') {
				var r2d = {};
				r2d.z = { value: parseInt(v, 10), unit: (K.truD(v,p).u||'deg') };
				return r2d;
			} else if (p === 'scale') {
				return { value: parseFloat(v, 10) };
			}
		}
		if (_tp.indexOf(p) !== -1 || _bm.indexOf(p) !== -1) {
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
				var posxy = v.replace(/top|left/g,0).replace(/right|bottom/g,100).replace(/center|middle/,50).split(/\s|\,/g),
					xp = K.truD(posxy[0]), yp = K.truD(posxy[1]);
				return { x: xp, y: yp };
			}
		}
		if (_rd.indexOf(p) !== -1) {
			var rad = K.truD(v);
			return { value: rad.v, unit: rad.u };
		}
	};

	K.truD = function (d,p) { //true dimension returns { v = value, u = unit }
		var x = parseInt(d) || 0, mu = ['px','%','deg','rad','em','rem','vh','vw'], l = mu.length,
			y = getU();
		function getU() {
			var u,i=0;
			for (i;i<l;i++) { if ( typeof d === 'string' && d.indexOf(mu[i]) !== -1 ) u = mu[i]; }
			u = u !== undefined ? u : (p ? 'deg' : 'px')
			return u;
		}
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
			} else if ( /physics/.test(es) )  {
				return K.Physics[es](); // predefined physics bezier based easing functions
			} else {
				return K.Ease[es](); // predefined bezier based easing functions
			}
		}
	};

	K.Easing = {};  // we build nice ease objects here

	//high performance for accuracy (smoothness) trade
	K.Easing.linear = function (t) { return t; };

	var _PI = Math.PI, _2PI = Math.PI * 2, _hPI = Math.PI / 2,
		_kea = 0.1, _kep = 0.4;

	K.Easing.easingSinusoidalIn = function(t) { return -Math.cos(t * _hPI) + 1; };
	K.Easing.easingSinusoidalOut = function(t) { return Math.sin(t * _hPI); };
	K.Easing.easingSinusoidalInOut = function(t) { return -0.5 * (Math.cos(_PI * t) - 1); };
	K.Easing.easingQuadraticIn = function (t) { return t*t; };
	K.Easing.easingQuadraticOut = function (t) { return t*(2-t); };
	K.Easing.easingQuadraticInOut = function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; };
	K.Easing.easingCubicIn = function (t) { return t*t*t; };
	K.Easing.easingCubicOut = function (t) { return (--t)*t*t+1; };
	K.Easing.easingCubicInOut = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; };
	K.Easing.easingQuarticIn = function (t) { return t*t*t*t; };
	K.Easing.easingQuarticOut = function (t) { return 1-(--t)*t*t*t; };
	K.Easing.easingQuarticInOut = function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; };
	K.Easing.easingQuinticIn = function (t) { return t*t*t*t*t; };
	K.Easing.easingQuinticOut = function (t) { return 1+(--t)*t*t*t*t; };
	K.Easing.easingQuinticInOut = function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; };
	K.Easing.easingCircularIn = function(t) { return -(Math.sqrt(1 - (t * t)) - 1); };
	K.Easing.easingCircularOut = function(t) { return Math.sqrt(1 - (t = t - 1) * t); };
	K.Easing.easingCircularInOut = function(t) {	return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); };
	K.Easing.easingExponentialIn = function(t) { return Math.pow(2, 10 * (t - 1)) - 0.001; };
	K.Easing.easingExponentialOut = function(t) { return 1 - Math.pow(2, -10 * t); };
	K.Easing.easingExponentialInOut = function(t) { return (t *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (t - 1)) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))); };
	K.Easing.easingBackIn = function(t) { var s = 1.70158; return t * t * ((s + 1) * t - s); };
	K.Easing.easingBackOut = function(t) { var s = 1.70158; return --t * t * ((s + 1) * t + s) + 1; };
	K.Easing.easingBackInOut = function(t) { var s = 1.70158 * 1.525;	if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));	return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2); };
	K.Easing.easingElasticIn = function(t) {
		var s;
		if ( t === 0 ) return 0; if ( t === 1 ) return 1;
		if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / _2PI;
		return - ( _kea * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * _2PI / _kep ) );
	};
	K.Easing.easingElasticOut = function(t) {
		var s;
		if ( t === 0 ) return 0; if ( t === 1 ) return 1;
		if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / _2PI ;
		return ( _kea * Math.pow( 2, - 10 * t) * Math.sin( ( t - s ) * _2PI  / _kep ) + 1 );
	};
	K.Easing.easingElasticInOut = function(t) {
		var s;
		if ( t === 0 ) return 0; if ( t === 1 ) return 1;
		if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / _2PI ;
		if ( ( t *= 2 ) < 1 ) return - 0.5 * ( _kea * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * _2PI  / _kep ) );
		return _kea * Math.pow( 2, -10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * _2PI  / _kep ) * 0.5 + 1;
	};
	K.Easing.easingBounceIn = function(t) { return 1 - K.Easing.easingBounceOut( 1 - t ); };
	K.Easing.easingBounceOut = function(t) {
		if ( t < ( 1 / 2.75 ) ) { return 7.5625 * t * t; }
		else if ( t < ( 2 / 2.75 ) ) { return 7.5625 * ( t -= ( 1.5 / 2.75 ) ) * t + 0.75; }
		else if ( t < ( 2.5 / 2.75 ) ) { return 7.5625 * ( t -= ( 2.25 / 2.75 ) ) * t + 0.9375; }
		else {return 7.5625 * ( t -= ( 2.625 / 2.75 ) ) * t + 0.984375; }
	};
	K.Easing.easingBounceInOut = function(t) { if ( t < 0.5 ) return K.Easing.easingBounceIn( t * 2 ) * 0.5; return K.Easing.easingBounceOut( t * 2 - 1 ) * 0.5 + 0.5;};

	//returns browser prefix
	function getPrefix() {
		var div = document.createElement('div'), i = 0,	pf = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'], pl = pf.length,
			s = ['MozTransform', 'mozTransform', 'WebkitTransform', 'webkitTransform', 'OTransform', 'oTransform', 'MsTransform', 'msTransform'];

		for (i; i < pl; i++) { if (s[i] in div.style) { return pf[i]; }	}
		div = null;
	}

	return K;
}));
