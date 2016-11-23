/* KUTE.js - The Light Tweening Engine
 * by dnp_theme
 * Licensed under MIT-License
 */
(function (root,factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory); // AMD. Register as an anonymous module.
  } else if (typeof exports == 'object') {
    module.exports = factory(); // Node, not strict CommonJS
  } else {
    root.KUTE = factory();
  }
}(this, function () {
  "use strict"; 

  // set a custom scope for KUTE.js
  var g = typeof global !== 'undefined' ? global : window, time = g.performance,
    K = {}, _tws = g._tweens = [], tick = null,
    // tools / utils
    getPrefix = function() { //returns browser prefix
      var div = document.createElement('div'), i = 0,  pf = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'],
        s = ['MozTransform', 'mozTransform', 'WebkitTransform', 'webkitTransform', 'OTransform', 'oTransform', 'MsTransform', 'msTransform'];
      for (var i = 0, pl = pf.length; i < pl; i++) { if (s[i] in div.style) { return pf[i]; }  }
      div = null;
    },
    property = function(p){ // returns prefixed property | property
      var r = (!(p in document.body.style)) ? true : false, f = getPrefix(); // is prefix required for property | prefix
      return r ? f + (p.charAt(0).toUpperCase() + p.slice(1)) : p;
    },
    selector = function(el,multi){ // a public selector utility
      var nl; 
      if (multi){
        nl = el instanceof Object || typeof el === 'object' ? el : document.querySelectorAll(el);
      } else {
        nl = typeof el === 'object' ? el 
           : /^#/.test(el) ? document.getElementById(el.replace('#','')) : document.querySelector(el);       
      }
      if (nl === null && el !== 'window') throw new TypeError('Element not found or incorrect selector: '+el); 
      return nl;   
    },
    trueDimension = function (d,p) { //true dimension returns { v = value, u = unit }
      var x = parseInt(d) || 0, mu = ['px','%','deg','rad','em','rem','vh','vw'], y;
      for (var i=0, l = mu.length; i<l; i++) { if ( typeof d === 'string' && d.indexOf(mu[i]) !== -1 ) { y = mu[i]; break; } }
      y = y !== undefined ? y : (p ? 'deg' : 'px');
      return { v: x, u: y };
    },
    trueColor = function (v) { // replace transparent and transform any color to rgba()/rgb()
      if (/rgb|rgba/.test(v)) { // first check if it's a rgb string
        var vrgb = v.replace(/[^\d,]/g, '').split(','), y = vrgb[3] ? vrgb[3] : null;
        if (!y) {
          return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]) };
        } else {
          return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]), a: y*1 };
        }
      } else if (/^#/.test(v)) {
        var fromHex = hexToRGB(v); return { r: fromHex.r, g: fromHex.g, b: fromHex.b };
      } else if (/transparent|none|initial|inherit/.test(v)) {
        return { r: 0, g: 0, b: 0, a: 0 };
      } else if (!/^#|^rgb/.test(v) ) { // maybe we can check for web safe colors
        var h = document.getElementsByTagName('head')[0]; h.style.color = v; 
        var webColor = g.getComputedStyle(h,null).color; webColor = /rgb/.test(webColor) ? webColor.replace(/[^\d,]/g, '').split(',') : [0,0,0];
        h.style.color = ''; return { r: parseInt(webColor[0]), g: parseInt(webColor[1]), b: parseInt(webColor[2]) };
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
      var css = el.style.cssText.replace(/\s/g,'').split(';'),//the cssText  
        trsf = {}; //the transform object
      // if we have any inline style in the cssText attribute, usually it has higher priority
      for ( var i=0, csl = css.length; i<csl; i++ ){
        if ( /transform/i.test(css[i])) {
          var tps = css[i].split(':')[1].split(')'); //all transform properties        
          for ( var k=0, tpl = tps.length-1; k< tpl; k++){
            var tpv = tps[k].split('('), tp = tpv[0], tv = tpv[1]; //each transform property          
            if ( _transform.indexOf(tp) !== -1 ){
              trsf[tp] = /translate3d/.test(tp) ? tv.split(',') : tv;
            }
          }
        }
      }
      return trsf;
    },
    getCurrentStyle = function (el,p) { // gCS = get style property for element from computedStyle for .to() method
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
          return _defaults[p];
        }
      }
    },
    
    //more internals
    getAll = function () { return _tws; },
    removeAll = function () { _tws = []; },
    add = function (tw) { _tws.push(tw); },
    remove = function (tw) { var i = _tws.indexOf(tw); if (i !== -1) { _tws.splice(i, 1); }}, 
    stop = function () { if (tick) { _cancelAnimationFrame(tick); tick = null; } },    

    canTouch = ('ontouchstart' in g || navigator.msMaxTouchPoints) || false, // support Touch?
    touchOrWheel = canTouch ? 'touchstart' : 'mousewheel', mouseEnter = 'mouseenter', //events to prevent on scroll
    _requestAnimationFrame = g.requestAnimationFrame || g.webkitRequestAnimationFrame || function (c) { return setTimeout(c, 16) },
    _cancelAnimationFrame = g.cancelAnimationFrame || g.webkitCancelRequestAnimationFrame || function (c) { return clearTimeout(c) },
    transformProperty = property('transform'),

    //true scroll container
    body = document.body, html = document.getElementsByTagName('HTML')[0],
    scrollContainer = /webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? body : html,

    _isIE = navigator && (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) !== null) ? parseFloat( RegExp.$1 ) : false,
    _isIE8 = _isIE === 8, // check IE8/IE

    //supported properties
    _colors = ['color', 'backgroundColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    _scroll  = ['scrollTop', 'scroll'], //scroll, it has no default value, it's calculated on tween start
    _opacity  = ['opacity'], // opacity
    _boxModel  = ['top', 'left', 'width', 'height'], // dimensions / box model
    _transform  = ['translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'translate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scale'], // transform
    _all = _colors.concat(_scroll, _opacity, _boxModel, _transform), al = _all.length,
    _defaults = _defaults || {}; //all properties default values
   
  //populate default values object
  for ( var i=0; i<al; i++ ){
    var p = _all[i];
    if (_colors.indexOf(p) !== -1){
      _defaults[p] = 'rgba(0,0,0,0)'; // _defaults[p] = {r:0,g:0,b:0,a:1}; // no unit/suffix
    } else if ( _boxModel.indexOf(p) !== -1 ) {
      _defaults[p] = 0;      
    } else if ( p === 'translate3d' ){ // px
      _defaults[p] = [0,0,0];
    } else if ( p === 'translate' ){ // px
      _defaults[p] = [0,0];
    } else if ( p === 'rotate' || /X|Y|Z/.test(p) ){ // deg
      _defaults[p] = 0;    
    } else if ( p === 'scale' || p === 'opacity' ){ // unitless
      _defaults[p] = 1;    
    }
    p = null;
  }
  
  // KUTE.js INTERPOLATORS
  var /*Interpolate = g.Interpolate = {},*/
    number = g._number = function(a,b,v) { // number1, number2, progress
      a = +a; b -= a; return a + b * v;
    },
    unit = g._unit = function(a,b,u,v) { // number1, number2, unit, progress
      a = +a; b -= a; return (a + b * v)+u;
    },
    color = g._color = function(a,b,v,h){ // rgba1, rgba2, progress, convertToHex(true/false)
      var _c = {}, c, n = number, ep = ')', cm =',', r = 'rgb(', ra = 'rgba(';
      for (c in b) { _c[c] = c !== 'a' ? (parseInt( number(a[c],b[c],v) ) || 0) : (a[c] && b[c]) ? parseFloat( number(a[c],b[c],v) ) : null; }
      return h ? rgbToHex( _c.r, _c.g, _c.b ) : !_c.a ? r + _c.r + cm + _c.g + cm + _c.b + ep : ra + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
    },
    translate = g._translate = function (a,b,v){
      var translation = {};

      for (var ax in b){
        var x1 = a[ax].value || 0, x2 = b[ax].value || 0, xu = b[ax].unit || 'px';
        translation[ax] = x1===x2 ? x2+xu : (x1 + ( x2 - x1 ) * v) + xu;  
      }
      return b.x ? 'translate(' + translation.x + ',' + translation.y + ')' :
        'translate3d(' + translation.translateX + ',' + translation.translateY + ',' + translation.translateZ + ')';
    },
    rotate = g._rotate = function (a,b,v){
      var rotation = {};
      for ( var rx in b ){
        if ( a[rx] ) {
          var a1 = a[rx].value, a2 = b[rx].value, au = b[rx].unit||'deg', av = a1 + (a2 - a1) * v;
          rotation[rx] = rx === 'z' ? 'rotate('+av+au+')' : rx + '(' + av + au + ')';
        }
      }
      return b.z ?  rotation.z  : (rotation.rotateX||'') + (rotation.rotateY||'') + (rotation.rotateZ||'');
    },
    skew = g._skew = function (a,b,v){
      var skewProp = {};
      for ( var sx in b ){
        if ( a[sx] ) {
          var s1 = a[sx].value, s2 = b[sx].value, su = b[sx].unit||'deg';
          skewProp[sx] = sx + '(' + (s1 + (s2 - s1) * v) + su + ')';
        }
      }
      return (skewProp.skewX||'') + (skewProp.skewY||'');
    },
    scale = g._scale = function(a,b,v){
      var scaleA = a.value, scaleB = b.value; 
      return 'scale(' + (scaleA + (scaleB - scaleA) * v) + ')';             
    },

    // KUTE.js DOM update functions
    DOM = g.dom = {},
    ticker = g._ticker = function(t) {
      var i = 0, l;
      while ( i < (l=_tws.length) ) {
      // while ( i < _tws.length ) {
        if ( update(_tws[i],t) ) {
          i++;
        } else {
          _tws.splice(i, 1);
        }
      }
      tick = _requestAnimationFrame(ticker);
    },
    update = g._update = function(w,t) {
      t = t || time.now();
      // if (t < w._startTime && w.playing && !w.paused) { return true; }
      if ( t < w._startTime && w.playing ) { return true; }

      // element/node, method, (prefixed)property, startValue, endValue, progress
      var elapsed = Math.min(( t - w._startTime ) / w.options.duration, 1); // calculate progress

      // for (var p in w._vE){ DOM[p](w._el,p,w._vS[p],w._vE[p],w._e(elapsed),w.options); } //render the CSS update
      for (var p in w._vE){ DOM[p](w._el,p,w._vS[p],w._vE[p],w.options.easing(elapsed),w.options); } //render the CSS update

      if (w.options.update) { w.options.update.call(); } // fire the updateCallback, try to minimize recursion

      if (elapsed === 1) {
        if (w.options.repeat > 0) {
          if ( w.options.repeat < 9999 ) { w.options.repeat--; } else { w.options.repeat = 0; } // we have to make it stop somewhere, infinity is too damn much
          
          if (w.options.yoyo) { w.reversed = !w.reversed; reverse.call(w); } // handle yoyo
            
          w._startTime = (w.options.yoyo && !w.reversed) ? t + w.options.repeatDelay : t; //set the right time for delay
          return true;        
        } else {
          
          if (w.options.complete) { w.options.complete.call(); }
          
          scrollOut.call(w); // unbind preventing scroll when scroll tween finished 
          
          // start animating chained tweens
          for (var i = 0, ctl = w.options.chain.length; i < ctl; i++) {
            w.options.chain[i].start();
          }
          //stop ticking when finished
          close.call(w);
        }
        return false;
      }
      return true;
    },
  
    // applies the transform origin and perspective
    perspective = function (l,o) {
      if ( o.transformOrigin !== undefined ) { l.style[property('transformOrigin')] = o.transformOrigin; } // element transform origin    
      if ( o.perspectiveOrigin !== undefined ) { l.style[property('perspectiveOrigin')] = o.perspectiveOrigin; } // element perspective origin
      if ( o.parentPerspective !== undefined ) { l.parentNode.style[property('perspective')] = o.parentPerspective + 'px'; } // parent perspective  
      if ( o.parentPerspectiveOrigin !== undefined ) { l.parentNode.style[property('perspectiveOrigin')] = o.parentPerspectiveOrigin; } // parent perspective origin
    },
      
    // process properties for _vE and _vS or one of them
    preparePropertiesObject = function (t, l) {
      var skewObject = {}, rotateObject = {}, translateObject = {}, transformObject = {}, propertiesObject = {};
      for (var x in t) {
        if (_transform.indexOf(x) !== -1) { // transform object gets built here
          if ( /^translate(?:[XYZ]|3d)$/.test(x) ) { //process translate3d
            var ta = ['X', 'Y', 'Z']; //coordinates //   translate[x] = pp(x, t[x]);  
            
            for (var f = 0; f < 3; f++) {        
              var a = ta[f];
              if ( /3d/.test(x) ) {
                translateObject['translate' + a] = parseProperty.transform('translate' + a, t[x][f]);                
              } else {
                translateObject['translate' + a] = ('translate' + a in t) ? parseProperty.transform('translate' + a, t['translate' + a]) : { value: 0, unit: 'px' };
              }
            }
            transformObject['translate'] = translateObject;
          } else if ( /^rotate(?:[XYZ])$|^skew(?:[XY])$/.test(x) ) { //process rotation/skew
            var ap = /rotate/.test(x) ? 'rotate' : 'skew', ra = ['X', 'Y', 'Z'], 
              rtp = ap === 'rotate' ? rotateObject : skewObject; 
            for (var r = 0; r < 3; r++) {
              var v = ra[r];
              if ( t[ap+v] !== undefined && x !== 'skewZ' ) {
                rtp[ap+v] = parseProperty.transform(ap+v, t[ap+v]);
              }
            }
            transformObject[ap] = rtp;
          } else if ( /(rotate|translate|scale)$/.test(x) ) { //process 2d translation / rotation
            transformObject[x] = parseProperty.transform(x, t[x]);
          }
          propertiesObject[transformProperty] = transformObject;
        } else if ( x !== 'transform') {
          if ( _boxModel.indexOf(x) !== -1 ) {
            propertiesObject[x] = parseProperty.boxModel(x,t[x]); 
          } else if (_opacity.indexOf(x) !== -1 || _scroll.indexOf(x) !== -1) { 
            propertiesObject[x] = parseProperty.unitless(x,t[x]); 
          } else if (_colors.indexOf(x) !== -1) { 
            propertiesObject[x] = parseProperty.colors(x,t[x]);
          } else if (x in parseProperty) { propertiesObject[x] = parseProperty[x](x,t[x],l); } // or any other property from css/ attr / svg / third party plugins
        }
      }
      return propertiesObject;
    },

    // process properties object | registers the plugins prepareStart functions
    // string parsing and property specific value processing
    parseProperty = {
      boxModel : function(p,v){ // box model | text props | radius props
        if (!(p in DOM)){
          DOM[p] = function(l,p,a,b,v){
            l.style[p] = unit(a.value,b.value,b.unit,v);
          }
        }
        return { value: trueDimension(v).v, unit: trueDimension(v).u }; 
      },
      transform : function(p,v){ // transform prop / value
        if (!('transform' in DOM)) {
          DOM[transformProperty] = function(l,p,a,b,v,o){
            var _tS = '', t = '', r = '', sk = '', s = '', pp = pp || o.perspective && parseInt(o.perspective) !== 0 ? 'perspective('+parseInt(o.perspective)+'px) ' : 0;

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

            l.style[p] = pp ? pp + _tS : _tS;
          }
        }

        // process each transform property
        if (/translate/.test(p)) {
          if (p === 'translate3d') {
            var t3d = v.split(','); 
            return {
              translateX : { value: trueDimension(t3d[0]).v, unit: trueDimension(t3d[0]).u },
              translateY : { value: trueDimension(t3d[1]).v, unit: trueDimension(t3d[1]).u },
              translateZ : { value: trueDimension(t3d[2]).v, unit: trueDimension(t3d[2]).u }
            };
          } else if (/^translate(?:[XYZ])$/.test(p)) {
            return { value: trueDimension(v).v, unit: (trueDimension(v).u||'px') };
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
          }
        } else if (/rotate|skew/.test(p)) {
          if (/^rotate(?:[XYZ])$|skew(?:[XY])$/.test(p)) {
            return { value: trueDimension(v,true).v, unit: (trueDimension(v,true).u||'deg') };
          } else if (p === 'rotate') {
            var r2d = {};
            r2d.z = { value: trueDimension(v,true).v, unit: (trueDimension(v,true).u||'deg') };
            return r2d;
          } 
        } else if (p === 'scale') {
          return { value: parseFloat(v) }; // this must be parseFloat(v)
        }
      },
      unitless : function(p,v){  // scroll | opacity | unitless  
        if (/scroll/.test(p) && !(p in DOM) ){
          DOM[p] = function(l,p,a,b,v) {
            l.scrollTop = number(a,b,v);
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
      colors : function(p,v){ // colors
        if (!(p in DOM)) {
          DOM[p] = function(l,p,a,b,v,o) {
            l.style[p] = color(a,b,v,o.keepHex);
          };
        }
        return trueColor(v); 
      }
    },
    reverse = g._reverse = function () {
      if (this.options.yoyo) {
        for (var p in this._vE) {
          var tmp = this._vSR[p];
          this._vSR[p] = this._vE[p];
          this._vE[p] = tmp;  
          this._vS[p] = this._vSR[p];    
        }
      }
    },
    close = function () { //  when animation is finished reset repeat, yoyo&reversed tweens
      if (this.repeat > 0) { this.options.repeat = this.repeat; }
      if (this.options.yoyo && this.reversed===true) { reverse.call(this); this.reversed = false; }
      this.playing = false;

      setTimeout(function(){ if (!_tws.length) { stop(); } }, 48);  // when all animations are finished, stop ticking after ~3 frames
    },
    scrollOut = function(){ //prevent scroll when tweening scroll    
      if (( 'scroll' in this._vE || 'scrollTop' in this._vE ) && document.body.getAttribute('data-tweening')) {
        document.removeEventListener(touchOrWheel, preventScroll, false);
        document.removeEventListener(mouseEnter, preventScroll, false);
        document.body.removeAttribute('data-tweening');
      }
    },
    scrollIn = function(){
      if (( 'scroll' in this._vE || 'scrollTop' in this._vE ) && !document.body.getAttribute('data-tweening')) {
        document.addEventListener(touchOrWheel, preventScroll, false);
        document.addEventListener(mouseEnter, preventScroll, false);
        document.body.setAttribute('data-tweening', 'scroll');
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
          return g.Physics[es].apply(this); // predefined physics bezier based easing functions
        } else {
          return g.Ease[es].apply(this); // predefined bezier based easing functions
        }
      }
    },
    getStartValues = function () { // stack transform props for .to() chains
      var startValues = {}, cs = getInlineStyle(this._el,'transform'),
        deg = ['rotate','skew'], ax = ['X','Y','Z'];
          
      for (var p in this._vS){
        if ( _transform.indexOf(p) !== -1 ) {
          var r2d = (/(rotate|translate|scale)$/.test(p));
          if ( /translate/.test(p) && p !== 'translate' ) {
            startValues['translate3d'] = cs['translate3d'] || _defaults[p];           
          } else if ( r2d ) { // 2d transforms
            startValues[p] = cs[p] || _defaults[p]; 
          } else if ( !r2d && /rotate|skew/.test(p) ) { // all angles
            for (var d=0; d<2; d++) {
              for (var a = 0; a<3; a++) {
                var s = deg[d]+ax[a];                
                if (_transform.indexOf(s) !== -1 && (s in this._vS) ) { startValues[s] =  cs[s] || _defaults[s]; }
              }
            }
          }
        } else {
          if ( _scroll.indexOf(p) === -1 ) {
            if (p === 'opacity' && _isIE8 ) { // handle IE8 opacity  
              var co = getCurrentStyle(this._el,'filter');          
              startValues['opacity'] = typeof co === 'number' ? co : _defaults['opacity'];
            } else {
              if ( _all.indexOf(p) !== -1 ) {
                startValues[p] = getCurrentStyle(this._el,p) || d[p];
              } else { // plugins register here
                startValues[p] = p in prepareStart ? prepareStart[p](this._el,p,this._vS[p]) : 0;
              }
            }
          } else {
            startValues[p] = (this._el === null || this._el === undefined) ? (g.pageYOffset || scrollContainer.scrollTop) : this._el.scrollTop;
          }      
        }
      }
      for ( var p in cs ){ // also add to _vS values from previous tweens  
        if ( _transform.indexOf(p) !== -1 && (!( p in this._vS )) ) {
          startValues[p] = cs[p] || _defaults[p]; 
        }
      }

      this._vS = {};
      this._vS = preparePropertiesObject(startValues,this._el); 
      
      if ( transformProperty in this._vE ){ // stack transform
        for ( var sp in this._vS[transformProperty]) {
          if (!(sp in this._vE[transformProperty])) { this._vE[transformProperty][sp] = {}; }
          for ( var spp in this._vS[transformProperty][sp] ) { // 3rd level
            if ( this._vS[transformProperty][sp][spp].value !== undefined ) {
              if (!(spp in this._vE[transformProperty][sp])) { this._vE[transformProperty][sp][spp] = {}; }
              for ( var sppp in this._vS[transformProperty][sp][spp]) { // spp = translateX | rotateX | skewX | rotate2d
                if ( !(sppp in this._vE[transformProperty][sp][spp])) {
                  this._vE[transformProperty][sp][spp][sppp] = this._vS[transformProperty][sp][spp][sppp]; // sppp = unit | value
                }
              }
            }
          }
          if ( 'value' in this._vS[transformProperty][sp] && (!('value' in this._vE[transformProperty][sp])) ) { // 2nd level                    
            for ( var spp1 in this._vS[transformProperty][sp] ) { // scale
              if (!(spp1 in this._vE[transformProperty][sp])) {
                this._vE[transformProperty][sp][spp1] = this._vS[transformProperty][sp][spp1]; // spp = unit | value 
              }
            }
          }
        }
      }
    },
    prepareStart = {},
    crossCheck = {},

    // core easing functions  
    easing = g.Easing = {};
  easing.linear = function (t) { return t; };
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

  // these methods run faster when defined outside
  var start = g._start = function (t) { // move functions that use the ticker outside the prototype to be in the same scope with it
      scrollIn.call(this);
        
      perspective(this._el,this.options); // apply the perspective and transform origin
      if ( this.options.rpr ) { getStartValues.apply(this); } // on start we reprocess the valuesStart for TO() method

      K.svg && K.svq(this); // SVG Plugin | on start we process the SVG paths and SVG transforms

      for ( var e in this._vE ) {
        if (e in crossCheck) crossCheck[e]; // this is where we do the valuesStart and valuesEnd check
        this._vSR[e] = this._vS[e];      
      }

      // now it's a good time to start
      add(this);
      this.playing = true;
      this.paused = false;
      this._startFired = false;
      this._startTime = t || time.now();
      this._startTime += this.options.delay;
      
      if (!this._startFired) {
        if (this.options.start) { this.options.start.call(); }
        this._startFired = true;
      }
      !tick && ticker();
      return this;
    },
    play = g._play = function () {
      if (this.paused && this.playing) {
        this.paused = false;
        if (this.options.resume) { this.options.resume.call(); }        
        this._startTime += time.now() - this._pauseTime;    
        add(this);
        !tick && ticker();  // restart ticking if stopped
      }
      return this;
    },
    
    // single Tween object construct
    Tween = g._Tween = function (_el, _vS, _vE, _o) {
      this._el = 'scroll' in _vE && (_el === undefined || _el === null) ? scrollContainer : _el; // element animation is applied to

      this.playing = false; // _isPlaying
      this.reversed = false; // _reversed
      this.paused = false; //_paused

      this._startTime = null; // startTime
      this._pauseTime = null; //_pauseTime

      this._startFired = false; //_on StartCallbackFIRED

      this._vSR = {}; // internal valuesStartRepeat
      this._vS = _o.rpr ? _vS : preparePropertiesObject(_vS,_el); // valuesStart
      this._vE = preparePropertiesObject(_vE,_el); // valuesEnd

      this.options = {}; for (var o in _o) { this.options[o] = _o[o]; }
      this.options.chain = []; //_chainedTweens
      this.options.easing = _o.easing && typeof processEasing(_o.easing) === 'function' ? processEasing(_o.easing) : easing.linear;
      this.options.repeat = _o.repeat || 0;
      this.options.repeatDelay = _o.repeatDelay || 0;
      this.options.yoyo = _o.yoyo || false; // _yoyo
      this.options.rpr = _o.rpr || false; // internal option to process inline/computed style at start instead of init true/false
      this.options.duration = _o.duration || 700; //duration
      this.options.delay = _o.delay || 0; //delay
      this.repeat = this.options.repeat; // we cache the number of repeats to be able to put it back after all cycles finish

      this.start = start; this.play = play; this.resume = play;
      this.pause = function() {
        if (!this.paused && this.playing) {
          remove(this);
          this.paused = true;    
          this._pauseTime = time.now();    
          if (this.options.pause) { this.options.pause.call(); }
        }
        return this;
      };
      this.stop = function () {
        if (!this.paused && this.playing) {
          remove(this);
          this.playing = false;
          this.paused = false;
          scrollOut.call(this);
            
          if (this.options.stop) { this.options.stop.call(); }    
          this.stopChainedTweens();
          close.call(this);
        }
        return this;
      };
      this.chain = function () { this.options.chain = arguments; return this; };
      this.stopChainedTweens = function () {
        for (var i = 0, ctl =this.options.chain.length; i < ctl; i++) {
          this.options.chain[i].stop();
        }
      };
    },

    // the multi elements Tween constructs
    TweensTO = function (els, vE, o) { // .to
      this.tweens = []; var _o = []; 
      for ( var i = 0, tl = els.length; i < tl; i++ ) {
        _o[i] = o || {}; o.delay = o.delay || 0;
        _o[i].delay = i>0 ? o.delay + (o.offset||0) : o.delay;
        this.tweens.push( to(els[i], vE, _o[i]) );
      }
    },
    TweensFT = function (els, vS, vE, o) { // .fromTo
      this.tweens = []; var _o = []; 
      for ( var i = 0, l = els.length; i < l; i++ ) {
        _o[i] = o || {}; o.delay = o.delay || 0;
        _o[i].delay = i>0 ? o.delay + (o.offset||0) : o.delay;
        this.tweens.push( fromTo(els[i], vS, vE, _o[i]) );
      }
    },
    ws = TweensTO.prototype = TweensFT.prototype = {
      start : function(t){
        t = t || time.now();
        for ( var i = 0, tl = this.tweens.length; i < tl; i++ ) { 
          this.tweens[i].start(t);
        }
        return this;
      },
      stop : function(){ for ( var i = 0, tl = this.tweens.length; i < tl; i++ ) { this.tweens[i].stop(); } return this; },
      pause : function(){ for ( var i = 0, tl = this.tweens.length; i < tl; i++ ) { this.tweens[i].pause(); } return this; },
      chain : function(){ this.tweens[this.tweens.length-1].options.chain = arguments; return this; },
      play : function(){ for ( var i = 0, tl = this.tweens.length; i < tl; i++ ) { this.tweens[i].play(); } return this; },
      resume : function() {return this.play()}
    },

    // main methods
    to = function (el, to, o) {
      var _el = selector(el); o = o || {}; o.rpr = true;  
      return new Tween(_el, to, to, o);
    },
    fromTo = function (el, f, to, o) {
      var _el = selector(el); o = o || {};
      var tw = new Tween(_el, f, to, o); K.svg && K.svq(tw); // on init we process the SVG paths
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
    property: property, getPrefix: getPrefix, selector: selector, processEasing : processEasing, // utils
    to: to, fromTo: fromTo, allTo: allTo, allFromTo: allFromTo, // main methods
    parseProperty: parseProperty, prepareStart: prepareStart, crossCheck : crossCheck, // Tween : Tween, // property parsing & preparation | Tween | crossCheck
    truD: trueDimension, truC: trueColor, rth: rgbToHex, htr: hexToRGB, getCurrentStyle: getCurrentStyle, // property parsing
  };
}));