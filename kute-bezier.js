/*
 * KUTE.js - The Light Tweening Engine | dnp_theme
 * package bezier easing
 * BezierEasing by Gaëtan Renaudeau 2014 – MIT License
 * optimized by dnp_theme 2015 – MIT License
 * Licensed under MIT-License
*/
  
(function (root,factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kute.js'], factory);
  } else if(typeof module == 'object' && typeof require == 'function') {
    module.exports = factory(require('kute.js'));
  } else if ( typeof root.KUTE !== 'undefined' ) {
    // Browser globals		
    root.Bezier = factory(root.KUTE);
  } else {
    throw new Error("Bezier Easing functions depend on KUTE.js");
  }
}(this, function (KUTE) {
  'use strict';

  var g = typeof global !== 'undefined' ? global : window, E = {};
  // E.Bezier = g.Bezier = function(mX1, mY1, mX2, mY2) {
  g.Bezier = function(mX1, mY1, mX2, mY2) {
    return _bz.pB(mX1, mY1, mX2, mY2);
  };

  // var _bz = E.Bezier.prototype = g.Bezier.prototype;
  var _bz = g.Bezier.prototype;

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  _bz.ni    = 4; // NEWTON_ITERATIONS
  _bz.nms   = 0.001; // NEWTON_MIN_SLOPE
  _bz.sp    = 0.0000001; // SUBDIVISION_PRECISION
  _bz.smi   = 10, // SUBDIVISION_MAX_ITERATIONS

  _bz.ksts = 11; // k Spline Table Size
  _bz.ksss = 1.0 / (_bz.ksts - 1.0); // k Sample Step Size

  _bz.f32as = 'Float32Array' in g; // float32ArraySupported
  _bz.msv = _bz.f32as ? new Float32Array (_bz.ksts) : new Array (_bz.ksts); // m Sample Values

  _bz.A = function(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; };
  _bz.B = function(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; };
  _bz.C = function(aA1)      { return 3.0 * aA1; };

  _bz.pB = function (mX1, mY1, mX2, mY2) {
    this._p = false; var self = this;

    return function(aX){
      if (!self._p) _bz.pc(mX1, mX2, mY1, mY2);
      if (mX1 === mY1 && mX2 === mY2) return aX;

      if (aX === 0) return 0;
      if (aX === 1) return 1;
      return _bz.cB(_bz.gx(aX, mX1, mX2), mY1, mY2);
    };
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

  g.Ease = {}; // export these functions to global for best performance

  // predefined bezier based easings, can be accessed via string, eg 'easeIn' or 'easeInOutQuart'
  // _easings = ["linear","easeInQuad","easeOutQuad","easeInOutQuad","easeInCubic","easeOutCubic","easeInOutCubic","easeInQuart","easeInQuart","easeOutQuart","easeInOutQuart","easeInQuint","easeOutQuint","easeInOutQuint","easeInExpo","easeOutExpo","easeInOutExpo","slowMo","slowMo1","slowMo2"],
  g.Ease.easeIn = function(){ return _bz.pB(0.42, 0.0, 1.00, 1.0); };
  g.Ease.easeOut = function(){ return _bz.pB(0.00, 0.0, 0.58, 1.0); };
  g.Ease.easeInOut = function(){ return _bz.pB(0.50, 0.16, 0.49, 0.86); };

  g.Ease.easeInSine = function(){ return _bz.pB(0.47, 0, 0.745, 0.715); };
  g.Ease.easeOutSine = function(){ return _bz.pB(0.39, 0.575, 0.565, 1); };
  g.Ease.easeInOutSine = function(){ return _bz.pB(0.445, 0.05, 0.55, 0.95); };

  g.Ease.easeInQuad = function () { return _bz.pB(0.550, 0.085, 0.680, 0.530); };
  g.Ease.easeOutQuad = function () { return _bz.pB(0.250, 0.460, 0.450, 0.940); };
  g.Ease.easeInOutQuad = function () { return _bz.pB(0.455, 0.030, 0.515, 0.955); };

  g.Ease.easeInCubic = function () { return _bz.pB(0.55, 0.055, 0.675, 0.19); };
  g.Ease.easeOutCubic = function () { return _bz.pB(0.215, 0.61, 0.355, 1); };
  g.Ease.easeInOutCubic = function () { return _bz.pB(0.645, 0.045, 0.355, 1); };

  g.Ease.easeInQuart = function () { return _bz.pB(0.895, 0.03, 0.685, 0.22); };
  g.Ease.easeOutQuart = function () { return _bz.pB(0.165, 0.84, 0.44, 1); };
  g.Ease.easeInOutQuart = function () { return _bz.pB(0.77, 0, 0.175, 1); };

  g.Ease.easeInQuint = function(){ return _bz.pB(0.755, 0.05, 0.855, 0.06); };
  g.Ease.easeOutQuint = function(){ return _bz.pB(0.23, 1, 0.32, 1); };
  g.Ease.easeInOutQuint = function(){ return _bz.pB(0.86, 0, 0.07, 1); };

  g.Ease.easeInExpo = function(){ return _bz.pB(0.95, 0.05, 0.795, 0.035); };
  g.Ease.easeOutExpo = function(){ return _bz.pB(0.19, 1, 0.22, 1); };
  g.Ease.easeInOutExpo = function(){ return _bz.pB(1, 0, 0, 1); };

  g.Ease.easeInCirc = function(){ return _bz.pB(0.6, 0.04, 0.98, 0.335); };
  g.Ease.easeOutCirc = function(){ return _bz.pB(0.075, 0.82, 0.165, 1); };
  g.Ease.easeInOutCirc = function(){ return _bz.pB(0.785, 0.135, 0.15, 0.86); };

  g.Ease.easeInBack = function(){ return _bz.pB(0.600, -0.280, 0.735, 0.045); };
  g.Ease.easeOutBack = function(){ return _bz.pB(0.175, 0.885, 0.320, 1.275); };
  g.Ease.easeInOutBack = function(){ return _bz.pB(0.68, -0.55, 0.265, 1.55); };

  g.Ease.slowMo = function(){ return _bz.pB(0.000, 0.500, 1.000, 0.500); };
  g.Ease.slowMo1 = function(){ return _bz.pB(0.000, 0.700, 1.000, 0.300); };
  g.Ease.slowMo2 = function(){ return _bz.pB(0.000, 0.900, 1.000, 0.100); };
  
  // return E;
}));
