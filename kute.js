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
    tweens = [], tick = null; // tick must be null!!

  //supported properties
  var _colors = ['color', 'backgroundColor'], // colors 'hex', 'rgb', 'rgba' -- #fff / rgb(0,0,0) / rgba(0,0,0,0)
    _boxModel  = ['top', 'left', 'width', 'height'], // dimensions / box model
    _transform  = ['translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'translate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scale'], // transform
    _scroll  = ['scroll'], //scroll, it has no default value, it's calculated on tween start
    _opacity  = ['opacity'], // opacity
    _all = _colors.concat( _opacity, _boxModel, _transform), al = _all.length,
    _defaults = {}; //all properties default values

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

  // default tween options, since 1.6.1
  var defaultOptions = {
      duration: 700,
      delay: 0,
      offset: 0,
      repeat: 0,
      repeatDelay: 0,
      yoyo: false,
      easing: 'linear',
      keepHex: false,
    },
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
    radToDeg = function(a) { return a*180/Math.PI; },
    trueDimension = function (d,p) { //true dimension returns { v = value, u = unit }
      var x = parseInt(d) || 0, mu = ['px','%','deg','rad','em','rem','vh','vw'], y;
      for (var i=0, l = mu.length; i<l; i++) { if ( typeof d === 'string' && d.indexOf(mu[i]) !== -1 ) { y = mu[i]; break; } }
      y = y !== undefined ? y : (p ? 'deg' : 'px');
      return { v: x, u: y };
    },
    trueColor = function (v) { // replace transparent and transform any color to rgba()/rgb()
      if (/rgb|rgba/.test(v)) { // first check if it's a rgb string
        var vrgb = v.replace(/\s|\)/,'').split('(')[1].split(','), y = vrgb[3] ? vrgb[3] : null;
        if (!y) {
          return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]) };
        } else {
          return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]), a: parseFloat(y) };
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
    getInlineStyle = function(el,p) { // get transform style for element from cssText for .to() method, the sp is for transform property
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
    getCurrentStyle = function (el,p) { // get computed style property for element for .to() method
      var styleAttribute = el.style, computedStyle = g.getComputedStyle(el,null) || el.currentStyle, pp = property(p), //the computed style | prefixed property
        styleValue = styleAttribute[p] && !/auto|initial|none|unset/.test(styleAttribute[p]) ? styleAttribute[p] : computedStyle[pp]; // s the property style value
      if ( p !== 'transform' && (pp in computedStyle || pp in styleAttribute) ) {
        if ( styleValue ){
          if (pp==='filter') { // handle IE8 opacity
            var filterValue = parseInt(styleValue.split('=')[1].replace(')',''));
            return parseFloat(filterValue/100);
          } else {
            return styleValue;
          }
        } else {
          return _defaults[p];
        }
      }
    },

    //more internals
    getAll = function () { return tweens; },
    removeAll = function () { tweens = []; },
    add = function (tw) { tweens.push(tw); },
    remove = function (tw) { var i = tweens.indexOf(tw); if (i !== -1) { tweens.splice(i, 1); }},
    stop = function () { if (tick) { _cancelAnimationFrame(tick); tick = null; } },

    canTouch = ('ontouchstart' in g || navigator && navigator.msMaxTouchPoints) || false, // support Touch?
    touchOrWheel = canTouch ? 'touchstart' : 'mousewheel', mouseEnter = 'mouseenter', //events to prevent on scroll
    _requestAnimationFrame = g.requestAnimationFrame || g.webkitRequestAnimationFrame || function (c) { return setTimeout(c, 16) },
    _cancelAnimationFrame = g.cancelAnimationFrame || g.webkitCancelRequestAnimationFrame || function (c) { return clearTimeout(c) },
    transformProperty = property('transform'),

    //true scroll container
    body = document.body, html = document.getElementsByTagName('HTML')[0],
    scrollContainer = navigator && /webkit/i.test(navigator.userAgent) || document.compatMode == 'BackCompat' ? body : html,

    isIE = navigator && (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) !== null) ? parseFloat( RegExp.$1 ) : false,
    isIE8 = isIE === 8, // check IE8/IE
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // we optimize morph depending on device type

  // KUTE.js INTERPOLATORS
  var interpolate = g.Interpolate = {},
    number = interpolate.number = function(a,b,v) { // number1, number2, progress
      a = +a; b -= a; return a + b * v;
    },
    unit = interpolate.unit = function(a,b,u,v) { // number1, number2, unit, progress
      a = +a; b -= a; return ( a + b * v ) + u;
    },
    color = interpolate.color = function(a,b,v,h){ // rgba1, rgba2, progress, convertToHex(true/false)
      var _c = {}, c, n = number, ep = ')', cm =',', r = 'rgb(', ra = 'rgba(';
      for (c in b) { _c[c] = c !== 'a' ? (number(a[c],b[c],v)>>0 || 0) : (a[c] && b[c]) ? (number(a[c],b[c],v) * 100 >> 0 )/100 : null; }
      return h ? rgbToHex( _c.r, _c.g, _c.b ) : !_c.a ? r + _c.r + cm + _c.g + cm + _c.b + ep : ra + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
    },
    translate = interpolate.translate = isMobile ? function (a,b,u,v){
      var translation = {};
      for (var ax in b){
        translation[ax] = ( a[ax]===b[ax] ? b[ax] : (a[ax] + ( b[ax] - a[ax] ) * v ) >> 0 ) + u;
      }
      return translation.x||translation.y ? 'translate(' + translation.x + ',' + translation.y + ')' :
        'translate3d(' + translation.translateX + ',' + translation.translateY + ',' + translation.translateZ + ')';
    } : function (a,b,u,v){
      var translation = {};
      for (var ax in b){
        translation[ax] = ( a[ax]===b[ax] ? b[ax] : ( (a[ax] + ( b[ax] - a[ax] ) * v ) * 100 >> 0 ) / 100 ) + u;
      }
      return translation.x||translation.y ? 'translate(' + translation.x + ',' + translation.y + ')' :
        'translate3d(' + translation.translateX + ',' + translation.translateY + ',' + translation.translateZ + ')';
    },
    rotate = interpolate.rotate = function (a,b,u,v){
      var rotation = {};
      for ( var rx in b ){
        rotation[rx] = rx === 'z' ? ('rotate('+ (((a[rx] + (b[rx] - a[rx]) * v) * 100 >> 0 ) / 100) + u + ')')
                                  : (rx + '(' + (((a[rx] + (b[rx] - a[rx]) * v) * 100 >> 0 ) / 100) + u + ')');
      }
      return rotation.z ? rotation.z : (rotation.rotateX||'') + (rotation.rotateY||'') + (rotation.rotateZ||'');
    },
    skew = interpolate.skew = function (a,b,u,v){
      var skewProp = {};
      for ( var sx in b ){
        skewProp[sx] = sx + '(' + (((a[sx] + (b[sx] - a[sx]) * v) * 10 >> 0) / 10) + u + ')';
      }
      return (skewProp.skewX||'') + (skewProp.skewY||'');
    },
    scale = interpolate.scale = function(a,b,v){
      return 'scale(' + (((a + (b - a) * v) * 1000 >> 0 ) / 1000) + ')';
    },

    // KUTE.js DOM update functions
    DOM = {},
    ticker = function(t) {
      var i = 0;
      while ( i < tweens.length ) {
        if ( update.call(tweens[i],t) ) {
          i++;
        } else {
          tweens.splice(i, 1);
        }
      }
      tick = _requestAnimationFrame(ticker);
    },
    update = function(t) {
      t = t || time.now();
      if ( t < this._startTime && this.playing ) { return true; }

      var elapsed = Math.min(( t - this._startTime ) / this.options.duration, 1), progress = this.options.easing(elapsed); // calculate progress

      for (var p in this.valuesEnd){ DOM[p](this.element,p,this.valuesStart[p],this.valuesEnd[p],progress,this.options); } //render the CSS update

      if (this.options.update) { this.options.update.call(); } // fire the updateCallback

      if (elapsed === 1) {
        if (this.options.repeat > 0) {
          if ( isFinite(this.options.repeat ) ) { this.options.repeat--; }

          if (this.options.yoyo) { // handle yoyo
            this.reversed = !this.reversed;
            reverse.call(this);
          }

          this._startTime = (this.options.yoyo && !this.reversed) ? t + this.options.repeatDelay : t; //set the right time for delay
          return true;
        } else {

          if (this.options.complete) { this.options.complete.call(); }

          scrollOut.call(this); // unbind preventing scroll when scroll tween finished

          for (var i = 0, ctl = this.options.chain.length; i < ctl; i++) { // start animating chained tweens
            this.options.chain[i].start();
          }

          //stop ticking when finished
          close.call(this);
        }
        return false;
      }
      return true;
    },

    // applies the transform origin and perspective
    perspective = function () {
      var el = this.element, ops = this.options;
      if ( ops.perspective !== undefined && transformProperty in this.valuesEnd ) { // element perspective
        this.valuesStart[transformProperty]['perspective'] = this.valuesEnd[transformProperty]['perspective']; 
      }
      // element transform origin / we filter it out for svgTransform to fix the Firefox transformOrigin bug https://bugzilla.mozilla.org/show_bug.cgi?id=923193
      if ( ops.transformOrigin !== undefined && (!('svgTransform' in this.valuesEnd)) ) { el.style[property('transformOrigin')] = ops.transformOrigin; } // set transformOrigin for CSS3 transforms only
      if ( ops.perspectiveOrigin !== undefined ) { el.style[property('perspectiveOrigin')] = ops.perspectiveOrigin; } // element perspective origin
      if ( ops.parentPerspective !== undefined ) { el.parentNode.style[property('perspective')] = ops.parentPerspective + 'px'; } // parent perspective
      if ( ops.parentPerspectiveOrigin !== undefined ) { el.parentNode.style[property('perspectiveOrigin')] = ops.parentPerspectiveOrigin; } // parent perspective origin
    },

    // plugin connector objects
    prepareStart = {}, // check current property value when .to() method is used
    crossCheck = {}, // checks for differences between start and end value, try to make sure start unit and end unit are same as well as consistent, stack transforms, process SVG paths

    // parse properties object
    // string parsing and property specific value processing
    parseProperty = { // we already start working on core supported properties
      boxModel : function(p,v){
        if (!(p in DOM)){
          DOM[p] = function(l,p,a,b,v){
            l.style[p] = ( v > 0.99 || v < 0.01 ? ((number(a,b,v)*10)>>0)/10 : (number(a,b,v) ) >> 0 ) + 'px';
          }
        }
        var boxValue = trueDimension(v);
        return boxValue.u === '%' ? boxValue.v * this.element.offsetWidth / 100 : boxValue.v;
      },
      transform : function(p,v) {
        if (!(transformProperty in DOM)) {
          DOM[transformProperty] = function(l,p,a,b,v,o){
            l.style[p] = (a.perspective||'')
                       + ('translate' in a ? translate(a.translate,b.translate,'px',v):'')
                       + ('rotate' in a ? rotate(a.rotate,b.rotate,'deg',v):'')
                       + ('skew' in a ? skew(a.skew,b.skew,'deg',v):'')
                       + ('scale' in a ? scale(a.scale,b.scale,v):'');
          }
        }

        // process each transform property
        if (/translate/.test(p)) {
          if (p === 'translate3d') {
            var t3d = v.split(','), t3d0 = trueDimension(t3d[0]), t3d1 = trueDimension(t3d[1], t3d2 = trueDimension(t3d[2]));
            return {
              translateX : t3d0.u === '%' ? (t3d0.v * this.element.offsetWidth / 100) : t3d0.v,
              translateY : t3d1.u === '%' ? (t3d1.v * this.element.offsetHeight / 100) : t3d1.v,
              translateZ : t3d2.u === '%' ? (t3d2.v * (this.element.offsetHeight + this.element.offsetWidth) / 200) : t3d2.v // to be changed with something like element and/or parent perspective
            };
          } else if (/^translate(?:[XYZ])$/.test(p)) {
            var t1d = trueDimension(v), percentOffset = /X/.test(p) ? this.element.offsetWidth / 100 : /Y/.test(p) ? this.element.offsetHeight / 100 : (this.element.offsetWidth+this.element.offsetHeight) / 200;

            return t1d.u === '%' ? (t1d.v * percentOffset) : t1d.v;
          } else if (p === 'translate') {
            var tv = typeof v === 'string' ? v.split(',') : v, t2d = {}, t2dv,
              t2d0 = trueDimension(tv[0]), t2d1 = tv.length ? trueDimension(tv[1]) : {v: 0, u: 'px'};
            if (tv instanceof Array) {
              t2d.x = t2d0.u === '%' ? (t2d0.v * this.element.offsetWidth / 100) : t2d0.v,
              t2d.y = t2d1.u === '%' ? (t2d1.v * this.element.offsetHeight / 100) : t2d1.v
            } else {
              t2dv = trueDimension(tv);
              t2d.x = t2dv.u === '%' ? (t2dv.v * this.element.offsetWidth / 100) : t2dv.v,
              t2d.y = 0
            }

            return t2d;
          }
        } else if (/rotate|skew/.test(p)) {
          if (/^rotate(?:[XYZ])$|skew(?:[XY])$/.test(p)) {
            var r3d = trueDimension(v,true);
            return r3d.u === 'rad' ? radToDeg(r3d.v) : r3d.v;
          } else if (p === 'rotate') {
            var r2d = {}, r2dv = trueDimension(v,true);
            r2d.z = r2dv.u === 'rad' ? radToDeg(r2dv.v) : r2dv.v;
            return r2d;
          }
        } else if (p === 'scale') {
          return parseFloat(v); // this must be parseFloat(v)
        }
      },
      unitless : function(p,v){  // scroll | opacity
        if (/scroll/.test(p) && !(p in DOM) ){
          DOM[p] = function(l,p,a,b,v) {
            l.scrollTop = (number(a,b,v))>>0;
          };
        } else if (p === 'opacity') {
          if (!(p in DOM)) {
            if (isIE8) {
              DOM[p] = function(l,p,a,b,v) {
                var st = "alpha(opacity=", ep = ')';
                l.style.filter = st + ((number(a,b,v) * 100)>>0) + ep;
              };
            } else {
              DOM[p] = function(l,p,a,b,v) {
                l.style.opacity = ((number(a,b,v) * 100)>>0)/100;
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

    // process properties for endValues and startValues or one of them
    preparePropertiesObject = function(obj, fn) { // this, props object, type: start/end
      var element = this.element, propertiesObject = fn === 'start' ? this.valuesStart : this.valuesEnd,
        skewObject = {}, rotateObject = {}, translateObject = {}, transformObject = {};

      for (var x in obj) {
        if (_transform.indexOf(x) !== -1) { // transform object gets built here
          if ( /^translate(?:[XYZ]|3d)$/.test(x) ) { //process translate3d
            var ta = ['X', 'Y', 'Z']; //coordinates //   translate[x] = pp(x, obj[x]);

            for (var f = 0; f < 3; f++) {
              var a = ta[f];
              if ( /3d/.test(x) ) {
                translateObject['translate' + a] = parseProperty.transform.call(this,'translate' + a, obj[x][f]);
              } else {
                translateObject['translate' + a] = ('translate' + a in obj) ? parseProperty.transform.call(this,'translate' + a, obj['translate' + a]) : 0;
              }
            }
            transformObject['translate'] = translateObject;
          } else if ( /^rotate(?:[XYZ])$|^skew(?:[XY])$/.test(x) ) { //process rotation/skew
            var ap = /rotate/.test(x) ? 'rotate' : 'skew', ra = ['X', 'Y', 'Z'],
              rtp = ap === 'rotate' ? rotateObject : skewObject;
            for (var r = 0; r < 3; r++) {
              var v = ra[r];
              if ( obj[ap+v] !== undefined && x !== 'skewZ' ) {
                rtp[ap+v] = parseProperty.transform.call(this,ap+v, obj[ap+v]);
              }
            }
            transformObject[ap] = rtp;
          } else if ( /(rotate|translate|scale)$/.test(x) ) { //process 2d translation / rotation
            transformObject[x] = parseProperty.transform.call(this, x, obj[x]);
          }
          propertiesObject[transformProperty] = transformObject;
        } else {
          if ( _boxModel.indexOf(x) !== -1 ) {
            propertiesObject[x] = parseProperty.boxModel.call(this,x,obj[x]);
          } else if (_opacity.indexOf(x) !== -1 || x === 'scroll') {
            propertiesObject[x] = parseProperty.unitless.call(this,x,obj[x]);
          } else if (_colors.indexOf(x) !== -1) {
            propertiesObject[x] = parseProperty.colors.call(this,x,obj[x]);
          } else if (x in parseProperty) {  // or any other property from css/ attr / svg / third party plugins
            propertiesObject[x] = parseProperty[x].call(this,x,obj[x]);
          }
        }
      }
    },
    reverse = function () {
      if (this.options.yoyo) {
        for (var p in this.valuesEnd) {
          var tmp = this.valuesRepeat[p];
          this.valuesRepeat[p] = this.valuesEnd[p];
          this.valuesEnd[p] = tmp;
          this.valuesStart[p] = this.valuesRepeat[p];
        }
      }
    },
    close = function () { //  when animation is finished reset repeat, yoyo&reversed tweens
      if (this.repeat > 0) { this.options.repeat = this.repeat; }
      if (this.options.yoyo && this.reversed===true) { reverse.call(this); this.reversed = false; }
      this.playing = false;

      setTimeout(function(){ if (!tweens.length) { stop(); } }, 48);  // when all animations are finished, stop ticking after ~3 frames
    },
    preventScroll = function (e) { // prevent mousewheel or touch events while tweening scroll
      var data = document.body.getAttribute('data-tweening');
      if (data && data === 'scroll') { e.preventDefault(); }
    },
    scrollOut = function(){ //prevent scroll when tweening scroll
      if ( 'scroll' in this.valuesEnd && document.body.getAttribute('data-tweening')) {
        document.removeEventListener(touchOrWheel, preventScroll, false);
        document.removeEventListener(mouseEnter, preventScroll, false);
        document.body.removeAttribute('data-tweening');
      }
    },
    scrollIn = function(){
      if ( 'scroll' in this.valuesEnd && !document.body.getAttribute('data-tweening')) {
        document.addEventListener(touchOrWheel, preventScroll, false);
        document.addEventListener(mouseEnter, preventScroll, false);
        document.body.setAttribute('data-tweening', 'scroll');
      }
    },
    processEasing = function (fn) { //process easing function
      if ( typeof fn === 'function') {
        return fn;
      } else if ( typeof fn === 'string' ) {
        return easing[fn]; // regular Robert Penner Easing Functions
      }
    },
    getStartValues = function () { // stack transform props for .to() chains
      var startValues = {}, currentStyle = getInlineStyle(this.element,'transform'),
        deg = ['rotate','skew'], ax = ['X','Y','Z'];

      for (var p in this.valuesStart){
        if ( _transform.indexOf(p) !== -1 ) {
          var r2d = (/(rotate|translate|scale)$/.test(p));
          if ( /translate/.test(p) && p !== 'translate' ) {
            startValues['translate3d'] = currentStyle['translate3d'] || _defaults[p];
          } else if ( r2d ) { // 2d transforms
            startValues[p] = currentStyle[p] || _defaults[p];
          } else if ( !r2d && /rotate|skew/.test(p) ) { // all angles
            for (var d=0; d<2; d++) {
              for (var a = 0; a<3; a++) {
                var s = deg[d]+ax[a];
                if (_transform.indexOf(s) !== -1 && (s in this.valuesStart) ) { startValues[s] = currentStyle[s] || _defaults[s]; }
              }
            }
          }
        } else {
          if ( p !== 'scroll' ) {
            if (p === 'opacity' && isIE8 ) { // handle IE8 opacity
              var currentOpacity = getCurrentStyle(this.element,'filter');
              startValues['opacity'] = typeof currentOpacity === 'number' ? currentOpacity : _defaults['opacity'];
            } else {
              if ( _all.indexOf(p) !== -1 ) {
                startValues[p] = getCurrentStyle(this.element,p) || d[p];
              } else { // plugins register here
                startValues[p] = p in prepareStart ? prepareStart[p].call(this,p,this.valuesStart[p]) : 0;
              }
            }
          } else {
            startValues[p] = this.element === scrollContainer ? (g.pageYOffset || scrollContainer.scrollTop) : this.element.scrollTop;
          }
        }
      }
      for ( var p in currentStyle ){ // also add to startValues values from previous tweens
        if ( _transform.indexOf(p) !== -1 && (!( p in this.valuesStart )) ) {
          startValues[p] = currentStyle[p] || _defaults[p];
        }
      }

      this.valuesStart = {};
      preparePropertiesObject.call(this,startValues,'start');

      if ( transformProperty in this.valuesEnd ) { // let's stack transform
        for ( var sp in this.valuesStart[transformProperty]) { // sp is the object corresponding to the transform function objects translate / rotate / skew / scale
          if ( sp !== 'perspective') {
            if ( typeof this.valuesStart[transformProperty][sp] === 'object' ) {
              for ( var spp in this.valuesStart[transformProperty][sp] ) { // 3rd level
                if ( typeof this.valuesEnd[transformProperty][sp] === 'undefined' ) { this.valuesEnd[transformProperty][sp] = {}; }
                if ( typeof this.valuesStart[transformProperty][sp][spp] === 'number' && typeof this.valuesEnd[transformProperty][sp][spp] === 'undefined' ) {
                  this.valuesEnd[transformProperty][sp][spp] = this.valuesStart[transformProperty][sp][spp];
                }
              }
            } else if ( typeof this.valuesStart[transformProperty][sp] === 'number' ) {
              if ( typeof this.valuesEnd[transformProperty][sp] === 'undefined' ) { // scale
                this.valuesEnd[transformProperty][sp] = this.valuesStart[transformProperty][sp];
              }
            }
          }
        }
      }
    };

    // core easing functions
  var easing = g.Easing = {};
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

  // single Tween object construct
  var Tween = function (targetElement, startObject, endObject, options) {
      this.element = 'scroll' in endObject && (targetElement === undefined || targetElement === null) ? scrollContainer : targetElement; // element animation is applied to

      this.playing = false;
      this.reversed = false;
      this.paused = false;

      this._startTime = null;
      this._pauseTime = null;

      this._startFired = false;
      this.options = {}; for (var o in options) { this.options[o] = options[o]; }
      this.options.rpr = options.rpr || false; // internal option to process inline/computed style at start instead of init true/false

      this.valuesRepeat = {}; // internal valuesRepeat
      this.valuesEnd = {}; // valuesEnd
      this.valuesStart = {}; // valuesStart

      preparePropertiesObject.call(this,endObject,'end'); // valuesEnd
      if ( this.options.rpr ) { this.valuesStart = startObject; } else { preparePropertiesObject.call(this,startObject,'start'); } // valuesStart

      if ( this.options.perspective !== undefined && transformProperty in this.valuesEnd ) { // element transform perspective
        var perspectiveString = 'perspective('+parseInt(this.options.perspective)+'px)';
        this.valuesEnd[transformProperty].perspective = perspectiveString;
      }

      for ( var e in this.valuesEnd ) {
        if (e in crossCheck && !this.options.rpr) crossCheck[e].call(this); // this is where we do the valuesStart and valuesEnd check for fromTo() method
      }

      this.options.chain = []; // chained Tweens
      this.options.easing = options.easing && typeof processEasing(options.easing) === 'function' ? processEasing(options.easing) : easing[defaultOptions.easing]; // you can only set a core easing function as default
      this.options.repeat = options.repeat || defaultOptions.repeat;
      this.options.repeatDelay = options.repeatDelay || defaultOptions.repeatDelay;
      this.options.yoyo = options.yoyo || defaultOptions.yoyo;
      this.options.duration = options.duration || defaultOptions.duration; // duration option | default
      this.options.delay = options.delay || defaultOptions.delay; // delay option | default

      this.repeat = this.options.repeat; // we cache the number of repeats to be able to put it back after all cycles finish
    },
    // tween control and chain
    TweenProto = Tween.prototype = {
      // queue tween object to main frame update
      start : function (t) { // move functions that use the ticker outside the prototype to be in the same scope with it
        scrollIn.call(this);

        if ( this.options.rpr ) { getStartValues.apply(this); } // on start we reprocess the valuesStart for TO() method
        perspective.apply(this); // apply the perspective and transform origin

        for ( var e in this.valuesEnd ) {
          if (e in crossCheck && this.options.rpr) crossCheck[e].call(this); // this is where we do the valuesStart and valuesEnd check for to() method
          this.valuesRepeat[e] = this.valuesStart[e];
        }

        // now it's a good time to start
        tweens.push(this);
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
      play : function () {
        if (this.paused && this.playing) {
          this.paused = false;
          if (this.options.resume) { this.options.resume.call(); }
          this._startTime += time.now()  - this._pauseTime;
          add(this);
          !tick && ticker();  // restart ticking if stopped
        }
        return this;
      },
      resume : function () { return this.play(); },
      pause : function() {
        if (!this.paused && this.playing) {
          remove(this);
          this.paused = true;
          this._pauseTime = time.now();
          if (this.options.pause) { this.options.pause.call(); }
        }
        return this;
      },
      stop : function () {
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
      },
      chain : function() { this.options.chain = arguments; return this; },
      stopChainedTweens : function () {
        for (var i = 0, ctl = this.options.chain.length; i < ctl; i++) {
          this.options.chain[i].stop();
        }
      }
    },

    // the multi elements Tween constructs
    TweensTO = function (els, vE, o) { // .to
      this.tweens = []; var options = [];
      for ( var i = 0, tl = els.length; i < tl; i++ ) {
        options[i] = o || {}; o.delay = o.delay || defaultOptions.delay;
        options[i].delay = i>0 ? o.delay + (o.offset||defaultOptions.offset) : o.delay;
        this.tweens.push( to(els[i], vE, options[i]) );
      }
    },
    TweensFT = function (els, vS, vE, o) { // .fromTo
      this.tweens = []; var options = [];
      for ( var i = 0, l = els.length; i < l; i++ ) {
        options[i] = o || {}; o.delay = o.delay || defaultOptions.delay;
        options[i].delay = i>0 ? o.delay + (o.offset||defaultOptions.offset) : o.delay;
        this.tweens.push( fromTo(els[i], vS, vE, options[i]) );
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
    to = function (element, endObject, options) {
      options = options || {}; options.rpr = true;
      return new Tween(selector(element), endObject, endObject, options);
    },
    fromTo = function (element, startObject, endObject, options) {
      options = options || {};
      return new Tween(selector(element), startObject, endObject, options);
    },

    // multiple elements tweening
    allTo = function (elements, endObject, options) {
      return new TweensTO(selector(elements,true), endObject, options);
    },
    allFromTo = function (elements, f, endObject, options) {
      return new TweensFT(selector(elements,true), f, endObject, options);
    };

  return { // export core methods to public for plugins
    property: property, getPrefix: getPrefix, selector: selector, processEasing : processEasing, // utils
    defaultOptions : defaultOptions, // default tween options since 1.6.1
    to: to, fromTo: fromTo, allTo: allTo, allFromTo: allFromTo, // main methods
    ticker : ticker, tick : tick, tweens : tweens, update: update, dom : DOM, // update
    parseProperty: parseProperty, prepareStart: prepareStart, crossCheck : crossCheck, Tween : Tween, // property parsing & preparation | Tween | crossCheck
    truD: trueDimension, truC: trueColor, rth: rgbToHex, htr: hexToRGB, getCurrentStyle: getCurrentStyle, // property parsing
  };
}));