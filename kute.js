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
    window.KUTE = factory();
  }
}( function () {
  "use strict";
  var g = window, K = K || {}, _tws = g._tweens = [], tick = g._tick = null, time = g.performance,
  
    getPrefix = function() { //returns browser prefix
      var div = document.createElement('div'), i = 0,  pf = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'], pl = pf.length,
        s = ['MozTransform', 'mozTransform', 'WebkitTransform', 'webkitTransform', 'OTransform', 'oTransform', 'MsTransform', 'msTransform'];
      for (i; i < pl; i++) { if (s[i] in div.style) { return pf[i]; }  }
      div = null;
    },
    property = function(p){ // returns prefixed property | property
      var r = (!(p in document.body.style)) ? true : false, f = getPrefix(); // is prefix required for property | prefix
      return r ? f + (p.charAt(0).toUpperCase() + p.slice(1)) : p;
    },
    selector = function(el,multi){ // a selector utility
      var nl;
      if (multi){
        nl = typeof el === 'object' ? el : document.querySelectorAll(el);
      } else {
        nl = typeof el === 'object' ? el 
           : /^#/.test(el) ? document.getElementById(el.replace('#','')) : document.querySelector(el);       
      }
      if (nl === null && el !== 'window') throw new TypeError('Element not found or incorrect selector: '+el); 
      return nl;   
    },
    trueDimension = function (d,p) { //true dimension returns { v = value, u = unit }
      var x = parseInt(d) || 0, mu = ['px','%','deg','rad','em','rem','vh','vw'], l = mu.length, 
        y = getU();
      function getU() {
        var u,i=0;
        for (i;i<l;i++) { if ( typeof d === 'string' && d.indexOf(mu[i]) !== -1 ) u = mu[i]; }
        u = u !== undefined ? u : (p ? 'deg' : 'px')
        return u;
      }
      return { v: x, u: y };
    },
    trueColor = function (v) { // replace transparent and transform any color to rgba()/rgb()
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
        vrgb = hexToRGB(v); return { r: vrgb.r, g: vrgb.g, b: vrgb.b };
      }
      if (/transparent|none|initial|inherit/.test(v)) {
        return { r: 0, g: 0, b: 0, a: 0 };
      } 
      if (!/#|rgb/.test(v) ) { // maybe we can check for web safe colors
          var h = document.getElementsByTagName('head')[0]; h.style.color = v; vrgb = g.getComputedStyle(h,null).color;
          h.style.color = ''; return v !== vrgb ? trueColor(vrgb) : {r:0,g:0,b:0};
      }
    },
    preventScroll = function (e) { // prevent mousewheel or touch events while tweening scroll
      var data = document.body.getAttribute('data-tweening');
      if (data && data === 'scroll') { e.preventDefault();  }
    },
    rgbToHex = function (r, g, b) { // transform rgb to hex or vice-versa | webkit browsers ignore HEX, always use RGB/RGBA
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    hexToRGB = function (hex) {
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
    },
    getInlineStyle = function(el,p) { // getInlineStyle = get transform style for element from cssText for .to() method, the sp is for transform property
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
    },
    getComputedStyle = function (el,p) { // gCS = get style property for element from computedStyle for .to() method
      var es = el.style, cs = g.getComputedStyle(el,null) || el.currentStyle, pp = property(p), //the computed style | prefixed property
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
    },
    processEasing = function (es) { //process easing
      if ( typeof es === 'function') {
        return es;
      } else if ( typeof es === 'string' ) {
        if ( /easing|linear/.test(es) ) {
          return easing[es]; // regular Robert Penner Easing Functions
        } else if ( /bezier/.test(es) )  { 
          var bz = es.replace(/bezier|\s|\(|\)/g,'').split(',');
          return g.Bezier( bz[0]*1,bz[1]*1,bz[2]*1,bz[3]*1 ); //bezier easing            
        } else if ( /physics/.test(es) )  {
          return g.Physics[es](); // predefined physics bezier based easing functions
        } else {
          return g.Ease[es](); // predefined bezier based easing functions
        }
      }
    },
    _tch = ('ontouchstart' in g || navigator.msMaxTouchPoints) || false, // support Touch?
    _ev = _tch ? 'touchstart' : 'mousewheel', _evh = 'mouseenter', //events to prevent on scroll
    _pfto = property('transformOrigin'), //assign preffix to DOM properties
    _pfp = property('perspective'),
    _pfo = property('perspectiveOrigin'),
    _tr = g.pfTransform = property('transform'),
    _raf = g.requestAnimationFrame || g.webkitRequestAnimationFrame || function (c) { return setTimeout(c, 16) },
    _caf = g.cancelAnimationFrame || g.webkitCancelRequestAnimationFrame || function (c) { return clearTimeout(c) },
    
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
  
  // KUTE.js INTERPOLATORS
  var Interpolate = g.Interpolate = {},
    number = g.Interpolate.number = function(a,b,v) { // number1, number2, progress
      a = +a; b -= a; return a + b * v;
    },
    unit = g.Interpolate.unit = function(a,b,u,v) { // number1, number2, unit, progress
      a = +a; b -= a; return (a + b * v)+u;
    },
    color = g.Interpolate.color = function(a,b,v,h){ // rgba1, rgba2, progress, convertToHex(true/false)
      var _c = {}, c, n = number, rt = rgbToHex, ep = ')', cm =',', r = 'rgb(', ra = 'rgba(';
      for (c in b) { _c[c] = c !== 'a' ? (parseInt( number(a[c],b[c],v) ) || 0) : (a[c] && b[c]) ? parseFloat( number(a[c],b[c],v) ) : null; }
      return h ? rt( _c.r, _c.g, _c.b ) : !_c.a ? r + _c.r + cm + _c.g + cm + _c.b + ep : ra + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
    },
    translate = g.Interpolate.translate = function (a,b,v){
      var ts = {};

      for (var ax in b){
        var x1 = a[ax].value || 0, x2 = b[ax].value || 0, xu = b[ax].unit || 'px';
        ts[ax] = x1===x2 ? x2+xu : (x1 + ( x2 - x1 ) * v) + xu;  
      }
      return b.x ? 'translate(' + ts.x + ',' + ts.y + ')' :
        'translate3d(' + ts.translateX + ',' + ts.translateY + ',' + ts.translateZ + ')';
    },
    rotate = g.Interpolate.rotate = function (a,b,v){
      var rS = {};
      for ( var rx in b ){
        if ( a[rx] ) {
          var a1 = a[rx].value, a2 = b[rx].value, au = b[rx].unit||'deg', av = a1 + (a2 - a1) * v;
          rS[rx] = rx === 'z' ? 'rotate('+av+au+')' : rx + '(' + av + au + ')';
        }
      }
      return b.z ?  rS.z  : (rS.rotateX||'') + (rS.rotateY||'') + (rS.rotateZ||'');
    },
    skew = g.Interpolate.skew = function (a,b,v){
      var sS = {};
      for ( var sx in b ){
        if ( a[sx] ) {
          var s1 = a[sx].value, s2 = b[sx].value, su = b[sx].unit||'deg';
          sS[sx] = sx + '(' + (s1 + (s2 - s1) * v) + su + ')';
        }
      }
      return (sS.skewX||'') + (sS.skewY||'');
    },
    scale = g.Interpolate.scale = function(a,b,v){
      var sc1 = a.value, sc2 = b.value; 
      return 'scale(' + (sc1 + (sc2 - sc1) * v) + ')';             
    },

    // KUTE.js DOM update functions
    DOM = g.dom = {},
    ticker = g._ticker = function(t) {
      var i = 0; 
      while ( i < _tws.length ) {
        if ( update(_tws[i],t) ) {
          i++;
        } else {
          _tws.splice(i, 1);
        }
      }
      tick = _raf(ticker);
    },

    update = g._update = function(w,t) {
      t = t || time.now();
      if (t < w._sT && w.playing && !w.paused) { return true; }

      // element/node, method, (prefixed)property, startValue, endValue, progress
      var p, e = Math.min(( t - w._sT ) / w._dr, 1); // calculate progress

      for (p in w._vE){ DOM[p].call(this,w._el,p,w._vS[p],w._vE[p],w._e(e),w._ops); } //render the CSS update

      if (w._uC) { w._uC.call(); } // fire the updateCallback

      if (e === 1) {
        if (w._r > 0) {
          if ( w._r < 9999 ) { w._r--; } // we have to make it stop somewhere, infinity is too damn much
          
          if (w._y) { w.reversed = !w.reversed; w.rvs(); } // handle yoyo
            
          w._sT = (w._y && !w.reversed) ? t + w._rD : t; //set the right time for delay
          return true;        
        } else {
          
          if (w._cC) { w._cC.call(); }
          
          w.scrollOut(); // unbind preventing scroll when scroll tween finished 
          
          // start animating chained tweens
          var i = 0, ctl = w._cT.length;
          for (i; i < ctl; i++) {
            // w._cT[i].start(w._sT + w._dr);
            w._cT[i].start();
          }
          
          //stop ticking when finished
          w.close();          
          return false;
        }
      }
      return true;
    },
  
    // applies the transform origin and perspective
    perspective = function (l,w) {
      if ( w._to !== undefined ) { l.style[_pfto] = w._to; } // element transform origin    
      if ( w._ppo !== undefined ) { l.style[_pfo] = w._ppo; } // element perspective origin
      if ( w._ppp !== undefined ) { l.parentNode.style[_pfp] = w._ppp + 'px'; } // parent perspective  
      if ( w._pppo !== undefined ) { l.parentNode.style[_pfo] = w._pppo; } // parent perspective origin
    },
    
    //more internals
    getAll = function () { return _tws; },
    removeAll = function () {  _tws = []; },
    add = function (tw) {  _tws.push(tw); },
    remove = function (tw) { var i = _tws.indexOf(tw); if (i !== -1) { _tws.splice(i, 1); }}, 
    stop = function () { tick && _caf(tick);  tick = null; },
      
    // process properties for _vE and _vS or one of them
    preparePropertiesObject = function (e, s, l) {
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
                  tl['translate' + a] = parseProperty.tf('translate' + a, t[x][f]);                
                } else {
                  tl['translate' + a] = ('translate' + a in t) ? parseProperty.tf('translate' + a, t['translate' + a]) : { value: 0, unit: 'px' };
                }
              }
              tr['translate'] = tl;
            } else if ( /^rotate(?:[XYZ])$|^skew(?:[XY])$/.test(x) ) { //process rotation/skew
              var ap = /rotate/.test(x) ? 'rotate' : 'skew', ra = ['X', 'Y', 'Z'], r = 0, 
                rtp = ap === 'rotate' ? rt : sk; 
              for (r; r < 3; r++) {
                var v = ra[r];
                if ( t[ap+v] !== undefined && x !== 'skewZ' ) {
                  rtp[ap+v] = parseProperty.tf(ap+v, t[ap+v]);
                }
              }
              tr[ap] = rtp;
            } else if ( /(rotate|translate|scale)$/.test(x) ) { //process 2d translation / rotation
              tr[x] = parseProperty.tf(x, t[x]);
            }
            _st[i]['transform'] = tr;
          } else if ( x !== 'transform') {
            if ( _bm.indexOf(x) !== -1 ) {
              _st[i][x] = parseProperty.box(x,t[x]); 
            } else if (_op.indexOf(x) !== -1 || _sc.indexOf(x) !== -1) { 
              _st[i][x] = parseProperty.unl(x,t[x]); 
            } else if (_cls.indexOf(x) !== -1) { 
              _st[i][x] = parseProperty.cls(x,t[x]);
            } else if (x in K.pp) { _st[i][x] = K.pp[x](x,t[x],l); } // or any other property from css/ attr / svg / third party plugins
          }
        }
      }
      return _st;
    },

    // process properties object | registers the plugins prepareStart functions
    // string parsing and property specific value processing
    parseProperty = {
      box : function(p,v){ // box model | text props | radius props
        if (!(p in DOM)){
          DOM[p] = function(l,p,a,b,v){
            l.style[p] = unit(a.value,b.value,b.unit,v);
          }
        }
        return { value: trueDimension(v).v, unit: trueDimension(v).u }; 
      },
      tf : function(p,v){ // transform prop / value
        if (!('transform' in DOM)) {
          DOM.transform = function(l,p,a,b,v,o){
            var _tS = '', t = '', r = '', sk = '', s = '', pp = pp = pp || o.perspective && parseInt(o.perspective) !== 0 ? 'perspective('+parseInt(o.perspective)+'px) ' : false;

            for (var tp in b){
              if (tp === 'translate'){
                t += translate(a[tp],b[tp],v);
              } else if (tp === 'rotate'){
                r += rotate(a[tp],b[tp],v);
              } else if (tp === 'skew'){
                sk += skew(a[tp],b[tp],v);
              } else if (tp === 'scale'){
                s += scale(a[tp],b[tp],v);
              }
            }
            _tS = t + r + sk + s;

            l.style[_tr] = pp ? pp + _tS : _tS;
          }
        }

        // process each transform property
        if (p === 'translate3d') {
          var t3d = v.split(','); 
          return {
            translateX : { value: trueDimension(t3d[0]).v, unit: trueDimension(t3d[0]).u },
            translateY : { value: trueDimension(t3d[1]).v, unit: trueDimension(t3d[1]).u },
            translateZ : { value: trueDimension(t3d[2]).v, unit: trueDimension(t3d[2]).u }
          };
        } else if (/^translate(?:[XYZ])$/.test(p)) {
          return { value: trueDimension(v).v, unit: (trueDimension(v).u||'px') };
        } else if (/^rotate(?:[XYZ])$|skew(?:[XY])$/.test(p)) {
          return { value: trueDimension(v,true).v, unit: (trueDimension(v,true).u||'deg') };
        } else if (p === 'translate') {
          var tv = typeof v === 'string' ? v.split(',') : v, t2d = {};
          if (tv instanceof Array) {
            t2d.x = { value: trueDimension(tv[0]).v, unit: trueDimension(tv[0]).u },
            t2d.y = { value: trueDimension(tv[1]).v, unit: trueDimension(tv[1]).u }
          } else {
            t2d.x = { value: trueDimension(tv).v, unit: trueDimension(tv).u },
            t2d.y = { value: 0, unit: 'px' }        
          }
          return t2d;
        } else if (p === 'rotate') {
          var r2d = {};
          r2d.z = { value: trueDimension(v,true).v, unit: (trueDimension(v,true).u||'deg') };
          return r2d;
        } else if (p === 'scale') {
          return { value: parseFloat(v) }; // this must be parseFloat(v)
        }
      },
      unl : function(p,v){  // scroll | opacity | unitless  
        if (/scroll/.test(p) && !(p in DOM) ){
          DOM[p] = function(l,p,a,b,v) {
            var el = el || (l === undefined || l === null) ? _sct : l;
            el.scrollTop = number(a,b,v);
          };
        } else if (p === 'opacity') {
          if (!(p in DOM)) {    
            if (_isIE8) {
              DOM[p] = function(l,p,a,b,v) {
                var st = "alpha(opacity=", ep = ')';
                l.style.filter = st + (number(a,b,v) * 100) + ep;
              };
            } else {
              DOM[p] = function(l,p,a,b,v) {
                l.style.opacity = number(a,b,v);
              };
            }
          }
        }
        return parseFloat(v); 
      },
      cls : function(p,v){ // colors
        if (!(p in DOM)) {
          DOM[p] = function(l,p,a,b,v,o) {
            l.style[p] = color(a,b,v,o.keepHex);
          };
        }
        return trueColor(v); 
      }
    },  
    prepareStart = {},

    // core easing functions  
    easing = g.Easing = {};
  easing.linear = g.linear = function (t) { return t; };
  easing.easingSinusoidalIn = function(t) { return -Math.cos(t * Math.PI / 2) + 1; };
  easing.easingSinusoidalOut = function(t) { return Math.sin(t * Math.PI / 2); };
  easing.easingSinusoidalInOut = function(t) { return -0.5 * (Math.cos(Math.PI * t) - 1); };
  easing.easingQuadraticIn = function (t) { return t*t; };
  easing.easingQuadraticOut = function (t) { return t*(2-t); };
  easing.easingQuadraticInOut = function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; };
  easing.easingCubicIn = function (t) { return t*t*t; };
  easing.easingCubicOut = function (t) { return (--t)*t*t+1; };
  easing.easingCubicInOut = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; };
  easing.easingQuarticIn = function (t) { return t*t*t*t; };
  easing.easingQuarticOut = function (t) { return 1-(--t)*t*t*t; };
  easing.easingQuarticInOut = function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; };
  easing.easingQuinticIn = function (t) { return t*t*t*t*t; };
  easing.easingQuinticOut = function (t) { return 1+(--t)*t*t*t*t; };
  easing.easingQuinticInOut = function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; };
  easing.easingCircularIn = function(t) { return -(Math.sqrt(1 - (t * t)) - 1); };
  easing.easingCircularOut = function(t) { return Math.sqrt(1 - (t = t - 1) * t); };
  easing.easingCircularInOut = function(t) {  return ((t*=2) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1); };
  easing.easingExponentialIn = function(t) { return Math.pow(2, 10 * (t - 1)) - 0.001; };
  easing.easingExponentialOut = function(t) { return 1 - Math.pow(2, -10 * t); };
  easing.easingExponentialInOut = function(t) { return (t *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (t - 1)) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))); };
  easing.easingBackIn = function(t) { var s = 1.70158; return t * t * ((s + 1) * t - s); };
  easing.easingBackOut = function(t) { var s = 1.70158; return --t * t * ((s + 1) * t + s) + 1; };
  easing.easingBackInOut = function(t) { var s = 1.70158 * 1.525;  if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2); };
  easing.easingElasticIn = function(t) {
    var s, _kea = 0.1, _kep = 0.4;
    if ( t === 0 ) return 0; if ( t === 1 ) return 1;
    if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2;
    return - ( _kea * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * Math.PI * 2 / _kep ) );
  };
  easing.easingElasticOut = function(t) {
    var s, _kea = 0.1, _kep = 0.4;
    if ( t === 0 ) return 0; if ( t === 1 ) return 1;
    if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2 ;
    return ( _kea * Math.pow( 2, - 10 * t) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) + 1 );
  };
  easing.easingElasticInOut = function(t) {
    var s, _kea = 0.1, _kep = 0.4;
    if ( t === 0 ) return 0; if ( t === 1 ) return 1;
    if ( !_kea || _kea < 1 ) { _kea = 1; s = _kep / 4; } else s = _kep * Math.asin( 1 / _kea ) / Math.PI * 2 ;
    if ( ( t *= 2 ) < 1 ) return - 0.5 * ( _kea * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) );
    return _kea * Math.pow( 2, -10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * Math.PI * 2  / _kep ) * 0.5 + 1;
  };
  easing.easingBounceIn = function(t) { return 1 - easing.easingBounceOut( 1 - t ); };
  easing.easingBounceOut = function(t) {
    if ( t < ( 1 / 2.75 ) ) { return 7.5625 * t * t; } 
    else if ( t < ( 2 / 2.75 ) ) { return 7.5625 * ( t -= ( 1.5 / 2.75 ) ) * t + 0.75; } 
    else if ( t < ( 2.5 / 2.75 ) ) { return 7.5625 * ( t -= ( 2.25 / 2.75 ) ) * t + 0.9375; } 
    else {return 7.5625 * ( t -= ( 2.625 / 2.75 ) ) * t + 0.984375; }
  };
  easing.easingBounceInOut = function(t) { if ( t < 0.5 ) return easing.easingBounceIn( t * 2 ) * 0.5; return easing.easingBounceOut( t * 2 - 1 ) * 0.5 + 0.5;};

  var start = function (t) { // move functions that use the ticker outside the prototype to be in the same scope with it
      this.scrollIn();
        
      perspective(this._el,this); // apply the perspective and transform origin
      if ( this._rpr ) { this.stack(); } // on start we reprocess the valuesStart for TO() method
          
      for ( var e in this._vE ) {
        this._vSR[e] = this._vS[e];      
      }

      // now it's a good time to start
      add(this);
      this.playing = true;
      this.paused = false;
      this._sCF = false;
      this._sT = t || time.now();
      this._sT += this._dl;
      
      if (!this._sCF) {
        if (this._sC) { this._sC.call(); }
        this._sCF = true;
      }
      if (!tick) ticker();
      return this;
    },
    play = function () {
      if (this.paused && this.playing) {
        this.paused = false;
        if (this._rC !== null) { this._rC.call(); }        
        this._sT += time.now() - this._pST;    
        add(this);
        if (!tick) ticker();  // restart ticking if stopped
      }
      return this;
    },
    // single Tween object construct
    Tween = function (_el, _vS, _vE, _o) {
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
      // this._pp = _o.perspective && parseInt(_o.perspective) !== 0 ? 'perspective('+parseInt(_o.perspective)+'px) ' : false; // perspective    
      this._ppo = _o.perspectiveOrigin; // perspective origin  
      this._ppp = _o.parentPerspective; // parent perspective    
      this._pppo = _o.parentPerspectiveOrigin; // parent perspective origin    
      this._e = _o && _o.easing && typeof processEasing(_o.easing) === 'function' ? processEasing(_o.easing) : easing.linear; // _easing function
      this._cT = []; //_chainedTweens
      this._sCF = false; //_on StartCallbackFIRED
      this._sC = _o.start || null; // _on StartCallback
      this._uC = _o.update || null; // _on UpdateCallback
      this._cC = _o.complete || null; // _on CompleteCallback
      this._pC = _o.pause || null; // _on PauseCallback
      this._rC = _o.play || null; // _on ResumeCallback
      this._stC = _o.stop || null; // _on StopCallback    
      this.repeat = this._r; // we cache the number of repeats to be able to put it back after all cycles finish
      this._ops = {};
      this.start = Tween.prototype.start = start;
      this.play = Tween.prototype.play = this.resume = Tween.prototype.resume = play;

      //also add plugins options or transform perspective
      for (var o in _o) { if (!(o in this) && !/delay|duration|repeat|origin|start|stop|update|complete|pause|play|yoyo|easing/i.test(o) ) { this._ops[o] = _o[o]; } }

      this.pause = function() {
        if (!this.paused && this.playing) {
          remove(this);
          this.paused = true;    
          this._pST = time.now();    
          if (this._pC !== null) {
            this._pC.call();
          }
        }
        return this;
      }
      this.stop = function () {
        if (!this.paused && this.playing) {
          remove(this);
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
      }
      this.rvs = function () {
        if (this._y) {
          for (var p in this._vE) {
            var tmp = this._vSR[p];
            this._vSR[p] = this._vE[p];
            this._vE[p] = tmp;  
            this._vS[p] = this._vSR[p];    
          }
        }
      }
      this.chain = function () {  this._cT = arguments; return this; };
      this.stopChainedTweens = function () {
        var i = 0, ctl =this._cT.length;
        for (i; i < ctl; i++) {
          this._cT[i].stop();
        }
      }
      this.scrollOut = function(){ //prevent scroll when tweening scroll    
        if ( 'scroll' in this._vE || 'scrollTop' in this._vE ) {
          this.removeListeners();
          document.body.removeAttribute('data-tweening');
        }
      }
      this.scrollIn = function(){
        if ( 'scroll' in this._vE || 'scrollTop' in this._vE ) {
          if (!document.body.getAttribute('data-tweening') ) {
            document.body.setAttribute('data-tweening', 'scroll');
            this.addListeners();
          }
        }
      }
      this.addListeners = function () {
        document.addEventListener(_ev, preventScroll, false);
        document.addEventListener(_evh, preventScroll, false);
      }
      this.removeListeners = function () {
        document.removeEventListener(_ev, preventScroll, false);
        document.removeEventListener(_evh, preventScroll, false);
      }
      this.stack = function () { // stack transform props for .to() chains
        var f = this.prS();
        this._vS = {};
        this._vS = preparePropertiesObject(f,{},this._el)[0]; 
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
        K.svg && K.svq(this); // SVG Plugin | on start we process the SVG paths and transforms
      }
      //prepare valuesStart for .to() method
      this.prS = function () { 
        var f = {}, el = this._el, to = this._vS, cs = getInlineStyle(el,'transform'), deg = ['rotate','skew'], ax = ['X','Y','Z'];
            
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
                var co = getComputedStyle(el,'filter');          
                f['opacity'] = typeof co === 'number' ? co : _d['opacity'];
              } else {
                if ( _all.indexOf(p) !== -1 ) {
                  f[p] = getComputedStyle(el,p) || d[p];
                } else { // plugins register here
                  f[p] = p in K.prS ? K.prS[p](el,p,to[p]) : 0;
                }
              }
            } else {
              f[p] = (el === null || el === undefined) ? (g.pageYOffset || _sct.scrollTop) : el.scrollTop;
            }      
          }
        }
        for ( var p in cs ){ // also add to _vS values from previous tweens  
          if ( _tf.indexOf(p) !== -1 && (!( p in to )) ) {
            f[p] = cs[p] || _d[p]; 
          }
        }
        return f;  
      }
      
      this.close = function () {
        var self = this;
        setTimeout(function(){
          var i = _tws.indexOf(self);
          if (i === _tws.length-1) { stop(); }  
          if (self.repeat > 0) { self._r = self.repeat; }
          if (self._y && self.reversed===true) { self.rvs(); self.reversed = false; }
          self.playing = false;
        },64)
      }
    },

    // the multi elements Tween constructs
    TweensTO = function (els, vE, o) { // .to
      this.tweens = []; var i, tl = els.length, _o = []; 
      for ( i = 0; i < tl; i++ ) {
        _o[i] = o || {}; o.delay = o.delay || 0;
        _o[i].delay = i>0 ? o.delay + (o.offset||0) : o.delay;
        this.tweens.push( to(els[i], vE, _o[i]) );
      }
    },
    TweensFT = function (els, vS, vE, o) { // .fromTo
      this.tweens = []; var tl = els.length, _o = [], self = this; 
      for ( var i = 0; i < tl; i++ ) {
        _o[i] = o || {}; o.delay = o.delay || 0;
        _o[i].delay = i>0 ? o.delay + (o.offset||0) : o.delay;
        this.tweens.push( fromTo(els[i], vS, vE, _o[i]) );
      }
    },
    ws = TweensTO.prototype = TweensFT.prototype = {
      start : function(t){
        t = t || time.now(); 
        var i, tl = this.tweens.length;
        for ( i = 0; i < tl; i++ ) { 
          this.tweens[i].start(t);
        }
        return this;
      },
      stop : function(){ for ( var i = 0; i < this.tweens.length; i++ ) { this.tweens[i].stop(); } return this; },
      pause : function(){ for ( var i = 0; i < this.tweens.length; i++ ) { this.tweens[i].pause(); } return this; },
      chain : function(){ this.tweens[this.tweens.length-1]._cT = arguments; return this; },
      play : function(){ for ( var i = 0; i < this.tweens.length; i++ ) { this.tweens[i].play(); } return this; },
      resume :function() {return this.play()}
    },
    // main methods
    to = function (el, to, o) {
      var _el = selector(el),
          _vS = to, _vE = preparePropertiesObject(to, {}, _el)[0]; o = o || {}; o.rpr = true;  
      return new Tween(_el, _vS, _vE, o);
    },
    fromTo = function (el, f, to, o) {
      var _el = selector(el), ft = preparePropertiesObject(f, to, _el), _vS = ft[0], _vE = ft[1]; o = o || {};
      var tw = new Tween(_el, _vS, _vE, o); K.svg && K.svq(tw); // on init we process the SVG paths
      return tw;
    },
    // multiple elements tweening
    allTo = function (els, to, o) {
      var _els = selector(els,true);
      return new TweensTO(_els, to, o);
    },
    allFromTo = function (els, f, to, o) {
      var _els = selector(els,true);
      return new TweensFT(_els, f, to, o); 
    };

  return K = { // export core methods to public for plugins
    property: property, getPrefix: getPrefix, selector: selector, pe : processEasing, // utils
    to: to, fromTo: fromTo, allTo: allTo, allFromTo: allFromTo, // main methods
    Interpolate: Interpolate, // interpolators
    dom: DOM, // DOM manipulation
    pp: parseProperty, prS: prepareStart, // property parsing & preparation
    truD: trueDimension, truC: trueColor, rth: rgbToHex, htr: hexToRGB, gCS: getComputedStyle, // property parsing
  };
}));