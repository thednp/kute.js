/* KUTE.js - The Light Tweening Engine
 * by dnp_theme
 * Licensed under MIT-License
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory); // AMD. Register as an anonymous module.
  } else if (typeof exports == 'object') {
    module.exports = factory(); // Node, not strict CommonJS
  } else {
    // Browser globals    
    window.KUTE = window.KUTE || factory();
  }
}( function () {
  "use strict";
  var K = K || {}, _tws = [], _t, _min = Math.min;
  
  K.getPrefix = function() { //returns browser prefix
    var div = document.createElement('div'), i = 0,  pf = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'], pl = pf.length,
      s = ['MozTransform', 'mozTransform', 'WebkitTransform', 'webkitTransform', 'OTransform', 'oTransform', 'MsTransform', 'msTransform'];
    for (i; i < pl; i++) { if (s[i] in div.style) { return pf[i]; }  }
    div = null;
  };
  
  K.property = function(p){ // returns prefixed property | property
     var r = (!(p in document.body.style)) ? true : false, f = K.getPrefix(); // is prefix required for property | prefix
     return r ? f + (p.charAt(0).toUpperCase() + p.slice(1)) : p;
  };
  
  K.selector = function(el,multi){ // a selector utility
    var nl;
    if (multi){
      nl = el instanceof NodeList ? el : document.querySelectorAll(el);
    } else {
      nl = typeof el === 'object' ? el : /^#/.test(el) ? document.getElementById(el.replace('#','')) : document.querySelector(el);       
    }
    if (nl === null && el !== 'window') throw new TypeError('Element not found or incorrect selector: '+el); 
    return nl;   
  };
   
  var _tch = ('ontouchstart' in window || navigator.msMaxTouchPoints) || false, // support Touch?
    _ev = _tch ? 'touchstart' : 'mousewheel', _evh = 'mouseenter', //events to prevent on scroll
    _pfto = K.property('transformOrigin'), //assign preffix to DOM properties
    _pfp = K.property('perspective'),
    _pfo = K.property('perspectiveOrigin'),
    _tr = K.property('transform'),
    _raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (c) { return setTimeout(c, 16) },
    _caf = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function (c) { return clearTimeout(c) },
    
    //true scroll container
    _bd = document.body, _htm = document.getElementsByTagName('HTML')[0],
    _sct = /webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? _bd : _htm,

    _isIE = (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null) ? parseFloat( RegExp.$1 ) : false,
    _isIE8 = _isIE === 8, // check IE8/IE

    //supported properties
    _cls = ['color', 'backgroundColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    _sc  = ['scrollTop', 'scroll'], //scroll, it has no default value, it's calculated on tween start
    _op  = ['opacity'], // opacity
    _bm  = ['top', 'left', 'width', 'height'], // dimensions / box model
    _3d  = ['rotateX', 'rotateY','translateZ'], // transform properties that require perspective
    _tf  = ['translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'translate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scale'], // transform
    _all = _cls.concat(_sc, _op, _bm, _tf), al = _all.length,
    _d = _d || {}; //all properties default values
   
  //populate default values object
  for ( var i=0; i< al; i++ ){
    var p = _all[i];
    if (_cls.indexOf(p) !== -1){
      _d[p] = 'rgba(0,0,0,0)'; // _d[p] = {r:0,g:0,b:0,a:1};
    } else if ( _bm.indexOf(p) !== -1 ) {
      _d[p] = 0;      
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
  
  // main methods
  K.to = function (el, to, o) {  
    var _el = K.selector(el),
        _vS = to, _vE = K.prP(to, {}, _el)[0]; o = o || {}; o.rpr = true;  
    return new K.Tween(_el, _vS, _vE, o);
  };

  K.fromTo = function (el, f, to, o) {
    var _el = K.selector(el), ft = K.prP(f, to, _el), _vS = ft[0], _vE = ft[1]; o = o || {};
    var tw = new K.Tween(_el, _vS, _vE, o); K.svg && K.svq(tw); // on init we process the SVG paths
    return tw;
  };
  
  // multiple elements tweening
  K.allTo = function (els, to, o) {
    var _els = K.selector(els,true);
    return new K.TweensTO(_els, to, o);
  };
  
  K.allFromTo = function (els, f, to, o) {
    var _els = K.selector(els,true);
    return new K.TweensFT(_els, f, to, o); 
  };
 
  // render functions
  K.dom = {};
  K._u = function(w,t) {
    t = t || window.performance.now();
    if (t < w._sT && w.playing && !w.paused) { return true; }

    var p, e = _min(( t - w._sT ) / w._dr, 1); // calculate progress
    
    for (p in w._vE){ K.dom[p](w,p,w._e(e)); } //render the CSS update
    
    if (w._uC) { w._uC.call(); } // fire the updateCallback

    if (e === 1) {
      if (w._r > 0) {
        if ( w._r < 9999 ) { w._r--; }      
        
        if (w._y) { w.reversed = !w.reversed; w.rvs(); } // handle yoyo
          
        w._sT = (w._y && !w.reversed) ? t + w._rD : t; //set the right time for delay
        return true;        
      } else {
        
        if (w._cC) { w._cC.call(); }
        
        //stop preventing scroll when scroll tween finished 
        w.scrollOut();
        
        // start animating chained tweens
        var i = 0, ctl = w._cT.length;
        for (i; i < ctl; i++) {
          w._cT[i].start(w._sT + w._dr);
        }
        
        //stop ticking when finished
        w.close();          
        return false;
      }
    }
    return true;
  };
  
  // internal ticker
  K._tk = function (t) {
    var i = 0, tl; 
    _t = _raf(K._tk);
    while ( i < (tl = _tws.length) ) {
      if ( K._u(_tws[i],t) ) {
        i++;
      } else {
        _tws.splice(i, 1);
      }
    }
  };
  
  // aplies the transform origin and perspective
  K.perspective = function (l,w) {
    if ( w._to !== undefined ) { l.style[_pfto] = w._to; } // element transform origin    
    if ( w._ppo !== undefined ) { l.style[_pfo] = w._ppo; } // element perspective origin
    if ( w._ppp !== undefined ) { l.parentNode.style[_pfp] = w._ppp + 'px'; } // parent perspective  
    if ( w._pppo !== undefined ) { l.parentNode.style[_pfo] = w._pppo; } // parent perspective origin
  };
  
  //more internals
  K.getAll = function () { return _tws; };
  K.removeAll = function () {  _tws = []; };
  K.add = function (tw) {  _tws.push(tw); };
  K.remove = function (tw) {
    var i = _tws.indexOf(tw);
    if (i !== -1) { _tws.splice(i, 1); }
  };  
  K.s = function () { _caf(_t);  _t = null; };
    
  // process properties for _vE and _vS or one of them
  K.prP = function (e, s, l) {
    var i, pl = arguments.length, _st = []; pl = pl > 2 ? 2 : pl;

    for (i=0; i<pl; i++) {
      var t = arguments[i], x, sk = {}, rt = {}, tl = {}, tr = {}; _st[i] = {};
      for (x in t) {
        if (_tf.indexOf(x) !== -1) { // transform object gets built here
          if ( /^translate(?:[XYZ]|3d)$/.test(x) ) { //process translate3d
            var ta = ['X', 'Y', 'Z'], f = 0; //coordinates //   translate[x] = pp(x, t[x]);  
            
            for (f; f < 3; f++) {        
              var a = ta[f];
              if ( /3d/.test(x) ) {
                tl['translate' + a] = K.pp.tf('translate' + a, t[x][f]);                
              } else {
                tl['translate' + a] = ('translate' + a in t) ? K.pp.tf('translate' + a, t['translate' + a]) : { value: 0, unit: 'px' };
              }
            }
            tr['translate'] = tl;
          } else if ( /^rotate(?:[XYZ])$/.test(x) || /^skew(?:[XY])$/.test(x) ) { //process rotation/skew
            var ap = /rotate/.test(x) ? 'rotate' : 'skew', ra = ['X', 'Y', 'Z'], r = 0, 
              rtp = ap === 'rotate' ? rt : sk; 
            for (r; r < 3; r++) {
              var v = ra[r];
              if ( t[ap+v] !== undefined && x !== 'skewZ' ) {
                rtp[ap+v] = K.pp.tf(ap+v, t[ap+v]);
              }
            }
            tr[ap] = rtp;
          } else if ( /(rotate|translate|scale)$/.test(x) ) { //process 2d translation / rotation
            tr[x] = K.pp.tf(x, t[x]);
          }
          _st[i]['transform'] = tr;
        } else if ( x !== 'transform') {
          if ( _bm.indexOf(x) !== -1 ) {
            _st[i][x] = K.pp.box(x,t[x]); 
          } else if (_op.indexOf(x) !== -1 || _sc.indexOf(x) !== -1) { 
            _st[i][x] = K.pp.unl(x,t[x]); 
          } else if (_cls.indexOf(x) !== -1) { 
            _st[i][x] = K.pp.cls(x,t[x]);
          } else if (x in K.pp) { _st[i][x] = K.pp[x](x,t[x],l); } // or any other property from css/ attr / svg / third party plugins
        }
      }
    }
    return _st;
  };
  
  // process properties object | registers the plugins prepareStart functions
  K.pp = {};  K.prS = {}; 
  K.pp.tf = function(p,v){ // transform prop / value
    if (!('transform' in K.dom)) {
      K.dom['transform'] = function(w,p,v) {
        var _tS = '', tP, rps, pps = 'perspective('+w._pp+'px) ';
        for (tP in w._vE[p]) {
          var t1 = w._vS[p][tP], t2 = w._vE[p][tP];
          rps = rps || _3d.indexOf(tP) !== -1 && !_isIE; 

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
        w._el.style[_tr] = rps || ( w._pp !== undefined && w._pp !== 0 ) ? pps + _tS : _tS;
      };
    }
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
      r2d.z = { value: K.truD(v,p).v, unit: (K.truD(v,p).u||'deg') };
      return r2d;
    } else if (p === 'scale') {
      return { value: parseFloat(v) }; // this must be parseFloat(v)
    }
  };
  K.pp.unl = function(p,v){  // scroll | opacity | unitless  
    if (/scroll/.test(p)){
        K.dom[p] = function(w,p,v) {
          w._el = (w._el === undefined || w._el === null) ? _sct : w._el;
          w._el.scrollTop = w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v;
        };
    } else if (p === 'opacity') {
      if (!(p in K.dom)) {    
        if (_isIE8) {
          K.dom[p] = function(w,p,v) {
            w._el.style.filter = "alpha(opacity=" + ( w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v) * 100 + ")";
          };
        } else {
          K.dom[p] = function(w,p,v) {
            w._el.style.opacity = w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v;
          };
        }
      }
    }
    return { value: parseFloat(v) }; 
  } 
  K.pp.box = function(p,v){
    if (!(p in K.dom)) {
      K.dom[p] = function(w,p,v) {
        w._el.style[p] = (w._vS[p].value + (w._vE[p].value - w._vS[p].value) * v ) + w._vE[p].unit;
      };
    }   
    return { value: K.truD(v).v, unit: K.truD(v).u }; 
  } 
    // box model | text props | radius props
  K.pp.cls = function(p,v){ // colors
    if (!(p in K.dom)) {
      K.dom[p] = function(w,p,v) {
        var _c = {}; 
        for (var c in w._vE[p].value) {
          if ( c !== 'a' ){
            _c[c] = parseInt(w._vS[p].value[c] + (w._vE[p].value[c] - w._vS[p].value[c]) * v )||0;            
          } else {
            _c[c] = (w._vS[p].value[c] && w._vE[p].value[c]) ? parseFloat(w._vS[p].value[c] + (w._vE[p].value[c] - w._vS[p].value[c]) * v) : null;
          }          
        }

        if ( w._hex ) {
          w._el.style[p] = K.rth( _c.r, _c.g, _c.b );
        } else {
          w._el.style[p] = !_c.a || _isIE8 ? 'rgb(' + _c.r + ',' + _c.g + ',' + _c.b + ')' : 'rgba(' + _c.r + ',' + _c.g + ',' + _c.b + ',' + _c.a + ')';          
        }                    
      };
    }
    return { value: K.truC(v) }; 
  } 
    
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
    if (data && data === 'scroll') { e.preventDefault();  }
  };
    
  K.truC = function (v) { // replace transparent and transform any color to rgba()/rgb()
    var vrgb, y;
    if (/rgb|rgba/.test(v)) { //rgb will be fastest initialized
      vrgb = v.replace(/[^\d,]/g, '').split(','); y = vrgb[3] ? vrgb[3] : null;
      if (!y) {
        return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]) };
      } else {
        return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]), a: y*1 };
      }
    }
    if (/#/.test(v)) {
      vrgb = K.htr(v); return { r: vrgb.r, g: vrgb.g, b: vrgb.b };
    }
    if (/transparent|none|initial|inherit/.test(v)) {
      return { r: 0, g: 0, b: 0, a: 0 };
    } 
    if (!/#|rgb/.test(v) ) { // maybe we can check for web safe colors
        var h = document.getElementsByTagName('head')[0]; h.style.color = v; vrgb = window.getComputedStyle(h,null).color;
        h.style.color = ''; return v !== vrgb ? K.truC(vrgb) : {r:0,g:0,b:0};
    }
  };
    
  K.rth = function (r, g, b) { // transform rgb to hex or vice-versa | webkit browsers ignore HEX, always use RGB/RGBA
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  K.htr = function (hex) {
    var shr = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
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
  
  K.gIS = function(el,p) { // gIS = get transform style for element from cssText for .to() method, the sp is for transform property
    if (!el) return; // if the scroll applies to `window` it returns as it has no styling
    var cst = el.style.cssText,//the cssText  
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
  
  K.gCS = function (el,p) { // gCS = get style property for element from computedStyle for .to() method
    var es = el.style, cs = window.getComputedStyle(el,null) || el.currentStyle, pp = K.property(p), //the computed style | prefixed property
      s = es[p] && !/auto|initial|none|unset/.test(es[p]) ? es[p] : cs[pp]; // s the property style value
    if ( p !== 'transform' && (pp in cs || pp in es) ) {
      if ( s ){
        if (pp==='filter') { // handle IE8 opacity
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
  
  K.pe = function (es) { //process easing
    if ( typeof es === 'function') {
      return es;
    } else if ( typeof es === 'string' ) {
      if ( /easing|linear/.test(es) ) {
        return K.Easing[es]; //regular Robert Penner Easing Functions
      } else if ( /bezier/.test(es) )  { 
        var bz = es.replace(/bezier|\s|\(|\)/g,'').split(',');
        return K.Ease.Bezier( bz[0]*1,bz[1]*1,bz[2]*1,bz[3]*1 ); //bezier easing            
      } else if ( /physics/.test(es) )  {
        return K.Physics[es](); // predefined physics bezier based easing functions
      } else {
        return K.Ease[es](); // predefined bezier based easing functions            
      }
    }
  };
  
  // core easing functions  
  K.Easing = {};
  K.Easing.linear = function (t) { return t; };
  var _PI = Math.PI, _2PI = Math.PI * 2, _hPI = Math.PI / 2, _kea = 0.1, _kep = 0.4;
  
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
  K.Easing.easingCircularInOut = function(t) {  return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); };
  K.Easing.easingExponentialIn = function(t) { return Math.pow(2, 10 * (t - 1)) - 0.001; };
  K.Easing.easingExponentialOut = function(t) { return 1 - Math.pow(2, -10 * t); };
  K.Easing.easingExponentialInOut = function(t) { return (t *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (t - 1)) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))); };
  K.Easing.easingBackIn = function(t) { var s = 1.70158; return t * t * ((s + 1) * t - s); };
  K.Easing.easingBackOut = function(t) { var s = 1.70158; return --t * t * ((s + 1) * t + s) + 1; };
  K.Easing.easingBackInOut = function(t) { var s = 1.70158 * 1.525;  if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2); };
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
  
  // single Tween object construct
  K.Tween = function (_el, _vS, _vE, _o) {
    this._el = _el; // element animation is applied to
    this._vSR = {}; // internal valuesStartRepeat
    this._vS = _vS; // valuesStart
    this._vE = _vE; // valuesEnd
    
    this._y = _o.yoyo || false; // _yoyo
    this.playing = false; // _isPlaying
    this.reversed = false; // _reversed
    this.paused = false; //_paused
    this._sT = null; // startTime
    this._pST = null; //_pauseStartTime    
    this._hex = _o.keepHex || false; // option to keep hex for color tweens true/false
    this._rpr = _o.rpr || false; // internal option to process inline/computed style at start instead of init true/false
       
    this._dr = _o.duration || 700; //duration
    this._r = _o.repeat || 0; // _repeat
    this._rD = _o.repeatDelay || 0; // _repeatDelay
    this._dl = _o.delay || 0; //delay
    this._to = _o.transformOrigin; // transform-origin    
    this._pp = _o.perspective; // perspective    
    this._ppo = _o.perspectiveOrigin; // perspective origin  
    this._ppp = _o.parentPerspective; // parent perspective    
    this._pppo = _o.parentPerspectiveOrigin; // parent perspective origin    
    this._e = _o && _o.easing && typeof K.pe(_o.easing) === 'function' ? K.pe(_o.easing) : K.Easing.linear; // _easing function
    this._cT = []; //_chainedTweens
    this._sCF = false; //_on StartCallbackFIRED
    this._sC = _o.start || null; // _on StartCallback
    this._uC = _o.update || null; // _on UpdateCallback
    this._cC = _o.complete || null; // _on CompleteCallback
    this._pC = _o.pause || null; // _on PauseCallback
    this._rC = _o.play || null; // _on ResumeCallback
    this._stC = _o.stop || null; // _on StopCallback    
    this.repeat = this._r; // we cache the number of repeats to be able to put it back after all cycles finish
    
    //also add plugins options
    for (var o in _o) { if (!(o in this) && !/perspective|delay|duration|repeat|origin|start|stop|update|complete|pause|play|yoyo|easing/i.test(o) ) { this[o] = _o[o]; } }
  };
    
  var w = K.Tween.prototype;
        
  w.start = function (t) {
    this.scrollIn();
       
    K.perspective(this._el,this); // apply the perspective and transform origin
    if ( this._rpr ) { this.stack(); } // on start we reprocess the valuesStart for TO() method
        
    for ( var e in this._vE ) {
      this._vSR[e] = this._vS[e];      
    }

    // now it's a good time to start
    _tws.push(this);
    this.playing = true;
    this.paused = false;
    this._sCF = false;
    this._sT = t || window.performance.now();
    this._sT += this._dl;
    
    if (!this._sCF) {
      if (this._sC) { this._sC.call(); }
      this._sCF = true;
    }
    if (!_t) K._tk();
    return this;
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

  w.play = w.resume = function () {
    if (this.paused && this.playing) {
      this.paused = false;
      if (this._rC !== null) { this._rC.call(); }        
      this._sT += window.performance.now() - this._pST;    
      K.add(this);
      if (!_t) K._tk();  // restart ticking if stopped
    }
    return this;
  };

  w.rvs = function () {
    if (this._y) {
      for (var p in this._vE) {
        var tmp = this._vSR[p];
        this._vSR[p] = this._vE[p];
        this._vE[p] = tmp;  
        this._vS[p] = this._vSR[p];    
      }
    }
  };
  
  w.chain = function () {  this._cT = arguments; return this; };

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
    document.addEventListener(_evh, K.preventScroll, false);
  };

  w.removeListeners = function () {
    document.removeEventListener(_ev, K.preventScroll, false);
    document.removeEventListener(_evh, K.preventScroll, false);
  };

  w.stack = function () { // stack transform props for .to() chains
    var f = this.prS();
    this._vS = {};
    this._vS = K.prP(f,{},this._el)[0]; 
    for ( var p in this._vS ) {
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
            for ( var spp1 in this._vS[p][sp] ) { // scale
              if (!(spp1 in this._vE[p][sp])) {
                this._vE[p][sp][spp1] = this._vS[p][sp][spp1]; // spp = unit | value 
              }
            }
          }
        }
      }
    }
    K.svg && K.svq(this); // SVG Plugin | on start we process the SVG paths
  };
    
  //prepare valuesStart for .to() method
  w.prS = function () { 
    var f = {}, el = this._el, to = this._vS, cs = K.gIS(el,'transform'), deg = ['rotate','skew'], ax = ['X','Y','Z'];
        
    for (var p in to){
      if ( _tf.indexOf(p) !== -1 ) {
        var r2d = (/(rotate|translate|scale)$/.test(p));
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
            var co = K.gCS(el,'filter');          
            f['opacity'] = typeof co === 'number' ? co : _d['opacity'];
          } else {
            if ( _all.indexOf(p) !== -1 ) {
              f[p] = K.gCS(el,p) || d[p];
            } else { // plugins register here
              f[p] = p in K.prS ? K.prS[p](el,p,to[p]) : 0;
            }
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
  
  w.close = function () {
    var self = this;
    setTimeout(function(){
      var i = _tws.indexOf(self);
      if (i === _tws.length-1) { K.s(); }  
      if (self.repeat > 0) { self._r = self.repeat; }
      if (self._y && self.reversed===true) { self.rvs(); self.reversed = false; }
      self.playing = false;
    },64)
  };

  // the multi elements Tween constructs
  K.TweensTO = function (els, vE, o) { // .to
    this.tweens = []; var i, tl = els.length, _o = []; 
    for ( i = 0; i < tl; i++ ) {
      _o[i] = o || {}; o.delay = o.delay || 0;
      _o[i].delay = i>0 ? o.delay + (o.offset||0) : o.delay;
      this.tweens.push( K.to(els[i], vE, _o[i]) );
    }
  };
  K.TweensFT = function (els, vS, vE, o) { // .fromTo
    this.tweens = []; var i, tl = els.length, _o = []; 
    for ( i = 0; i < tl; i++ ) {
      _o[i] = o || {}; o.delay = o.delay || 0;
      _o[i].delay = i>0 ? o.delay + (o.offset||0) : o.delay;
      this.tweens.push( K.fromTo(els[i], vS, vE, _o[i]) );
    }
  };
  var ws = K.TweensTO.prototype = K.TweensFT.prototype;
  ws.start = function(t){
    t = t || window.performance.now(); 
    var i, tl = this.tweens.length;
    for ( i = 0; i < tl; i++ ) { 
      this.tweens[i].start(t);
    }
    return this;
  }
  ws.stop = function(){ for ( var i = 0; i < this.tweens.length; i++ ) { this.tweens[i].stop(); } return this; }
  ws.pause = function(){ for ( var i = 0; i < this.tweens.length; i++ ) { this.tweens[i].pause(); } return this; }
  ws.chain = function(){ this.tweens[this.tweens.length-1]._cT = arguments; return this; }
  ws.play = ws.resume = function(){ for ( var i = 0; i < this.tweens.length; i++ ) { this.tweens[i].play(); } return this; }

  return K;
}));