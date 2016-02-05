/*
 * KUTE.js - The Light Tweening Engine | dnp_theme
 * package dynamics.js easings pack by Michael Villar
 * https://github.com/michaelvillar/dynamics.js
 * optimized by dnp_theme 2015 – MIT License
 * Licensed under MIT-License
 */

(function(factory){
  // Obtain a reference to the base KUTE.
  // Since KUTE supports a variety of module systems,
  // we need to pick up which one to use.
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    // We assume, that require() is sync.
    var KUTE = require("./kute.js");
    
    // Export the modified one. Not really required, but convenient.
    module.exports = factory(KUTE);
  } else if(typeof window.KUTE != "undefined") {
    window.KUTE.Physics = window.KUTE.Physics || factory(KUTE);
  } else {
    throw new Error("Physics Easing functions for KUTE.js depend on KUTE.js. Read the docs for more info.")
  }
})(function(KUTE){
  'use strict';
  var P = P || {}, _hPI = Math.PI / 2;

  // spring easing
  P.spring = function(options) {
    options = options || {};

    var fq = Math.max(1, (options.frequency || 300 ) / 20),
        fc = Math.pow(20, (options.friction || 200 ) / 100),
        aSt = options.anticipationStrength || 0,
        aS = (options.anticipationSize || 0) / 1000;

    _kps.run = function(t) {
      var A, At, a, angle, b, frictionT, y0, yS;

      frictionT = (t / (1 - aS)) - (aS / (1 - aS));
      if (t < aS) {
        yS = (aS / (1 - aS)) - (aS / (1 - aS));
        y0 = (0 / (1 - aS)) - (aS / (1 - aS));
        b = Math.acos(1 / _kps.A1(t,yS));
        a = (Math.acos(1 / _kps.A1(t,y0)) - b) / (fq * (-aS));
        A = _kps.A1;
      } else {
        A = _kps.A2;
        b = 0;
        a = 1;
      }
      At = A(frictionT,aS,aSt,fc);
      angle = fq * (t - aS) * a + b;
      return 1 - (At * Math.cos(angle));
    };

    return _kps.run;
  };

  var _kps = P.spring.prototype;
  _kps.run = {};
  _kps.A1 = function(t,aS,aSt) {
    var a, b, x0, x1;
    x0 = aS / (1 - aS);
    x1 = 0;
    b = (x0 - (0.8 * x1)) / (x0 - x1);
    a = (0.8 - b) / x0;
    return (a * t * aSt / 100) + b;
  };
  _kps.A2 = function(t,aS,aSt,f) {
    return Math.pow(f / 10, -t) * (1 - t);
  };


  // bounce
  P.bounce = function(options) {
    options = options || {};
    var fq = Math.max(1, (options.frequency || 300) / 20),
        f = Math.pow(20, (options.friction || 200) / 100);

    _kpo.run = function(t) {
      var At = Math.pow(f / 10, -t) * (1 - t),
          angle = fq * t * 1 + _hPI;
      return At * Math.cos(angle);
    };
    return _kpo.run;
  };

  var _kpo = P.bounce.prototype;
  _kpo.run = {};


  // gravity
  P.gravity = function(options) {
    var bounciness, curves, elasticity, gravity, initialForce;

    options = options || {};
    bounciness = ( options.bounciness || 400 ) / 1250;
    elasticity = ( options.elasticity || 200 ) / 1000;
    initialForce = options.initialForce || false;

    gravity = 100;
    curves = [];
    _kpg.L = (function() {
      var b, curve;
      b = Math.sqrt(2 / gravity);
      curve = {
        a: -b,
        b: b,
        H: 1
      };
      if (initialForce) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      while (curve.H > 0.001) {
        _kpg.L = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + _kpg.L * bounciness,
          H: curve.H * bounciness * bounciness
        };
      }
      return curve.b;
    })();

    (function() {
      var L2, b, curve, _results;
      b = Math.sqrt(2 / (gravity * _kpg.L * _kpg.L));
      curve = {
        a: -b,
        b: b,
        H: 1
      };
      if (initialForce) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      curves.push(curve);
      L2 = _kpg.L;
      _results = [];
      while (curve.b < 1 && curve.H > 0.001) {
        L2 = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L2 * bounciness,
          H: curve.H * elasticity
        };
        _results.push(curves.push(curve));
      }
      return _results;
    })();
    _kpg.fn = function(t) {
      var curve, i, v;
      i = 0;
      curve = curves[i];
      while (!(t >= curve.a && t <= curve.b)) {
        i += 1;
        curve = curves[i];
        if (!curve) {
          break;
        }
      }
      if (!curve) {
        v = initialForce ? 0 : 1;
      } else {
        v = _kpg.getPointInCurve(curve.a, curve.b, curve.H, t, options, _kpg.L);
      }
      return v;
    };

    return _kpg.fn;
  };

  var _kpg = P.gravity.prototype;
  _kpg.L = {};
  _kpg.fn = {};
  _kpg.getPointInCurve = function(a, b, H, t, o, L) {
    var c, t2;
    L = b - a;
    t2 = (2 / L) * t - 1 - (a * 2 / L);
    c = t2 * t2 * H - H + 1;
    if (o.initialForce) {
      c = 1 - c;
    }
    return c;
  };

  //throw up and pull down by gravity
  P.forceWithGravity = function(o) {
    var ops = o || {};
    ops.initialForce = true;
    return P.gravity(ops);
  };


  // multi point bezier
  P.bezier = function(options) {
    options = options || {};
    var points = options.points,
    returnsToSelf = false, Bs = [];

    (function() {
      var i, k;

      for (i in points) {
        k = parseInt(i);
        if (k >= points.length - 1) {
          break;
        }
        _kpb.fn(points[k], points[k + 1], Bs);
      }
      return Bs;
    })();

    _kpb.run = function(t) {
      if (t === 0) {
        return 0;
      } else if (t === 1) {
        return 1;
      } else {
        return _kpb.yForX(t, Bs, returnsToSelf);
      }
    };
    return _kpb.run;
  };

  var _kpb = P.bezier.prototype;
  _kpb.B2 = {};
  _kpb.run = {};

  _kpb.fn = function(pointA, pointB, Bs) {
    var B2 = function(t) {
      return _kpb.Bezier(t, pointA, pointA.cp[pointA.cp.length - 1], pointB.cp[0], pointB);
    };
    return Bs.push(B2);
  };

  _kpb.Bezier = function(t, p0, p1, p2, p3) {
    return {
      x: (Math.pow(1 - t, 3) * p0.x) + (3 * Math.pow(1 - t, 2) * t * p1.x) + (3 * (1 - t) * Math.pow(t, 2) * p2.x) + Math.pow(t, 3) * p3.x,
      y: (Math.pow(1 - t, 3) * p0.y) + (3 * Math.pow(1 - t, 2) * t * p1.y) + (3 * (1 - t) * Math.pow(t, 2) * p2.y) + Math.pow(t, 3) * p3.y
    };
  };

  _kpb.yForX = function(xTarget, Bs, rTS) {
    var B, aB, i, lower, percent, upper, x, xT, _i = 0, _len = Bs.length;
    B = null;
    for (_i; _i < _len; _i++) {
      aB = Bs[_i];
      if (xTarget >= aB(0).x && xTarget <= aB(1).x) {
        B = aB;
      }
      if (B !== null) {
        break;
      }
    }
    if (!B) {
    return ( rTS ? 0 : 1 );
    }
    xT = 0.0001; // xTolerance
    lower = 0; upper = 1;
    percent = (upper + lower) / 2;
    x = B(percent).x; i = 0;
    while (Math.abs(xTarget - x) > xT && i < 100) {
      if (xTarget > x) {
        lower = percent;
      } else {
        upper = percent;
      }
      percent = (upper + lower) / 2;
      x = B(percent).x;
      i++;
    }
    return B(percent).y;
  };

  P.physicsInOut = function(options) {
    var friction;
    options = options || {};
    friction = options.friction|| 500;
    return P.bezier({ points: [ { x: 0, y: 0, cp: [ { x: 0.92 - (friction / 1000), y: 0 } ] }, { x: 1, y: 1, cp: [ { x: 0.08 + (friction / 1000), y: 1 } ] } ] });
  };

  P.physicsIn = function(options) {
    var friction;
    options = options || {};
    friction = options.friction|| 500;
    return P.bezier({ points: [ { x: 0, y: 0, cp: [ { x: 0.92 - (friction / 1000), y: 0 } ] }, { x: 1, y: 1, cp: [ { x: 1, y: 1 } ] } ] });
  };

  P.physicsOut = function(options) {
    var friction;
    options = options || {};
    friction = options.friction|| 500;
    return P.bezier({ points: [ { x: 0, y: 0, cp: [ { x: 0, y: 0 } ] }, { x: 1, y: 1, cp: [ { x: 0.08 + (friction / 1000), y: 1 } ] }]  });
  };

  P.physicsBackOut = function(options) {
    var friction;
    options = options || {};
    friction = options.friction|| 500;
    return P.bezier({ points: [{"x":0,"y":0,"cp":[{"x":0,"y":0}]},{"x":1,"y":1,"cp":[{"x":0.735+(friction/1000),"y":1.3}]}]  });
  };

  P.physicsBackIn = function(options) {
    var friction;
    options = options || {};
    friction = options.friction|| 500;
    return P.bezier({ points: [{"x":0,"y":0,"cp":[{"x":0.28-(friction / 1000),"y":-0.6}]},{"x":1,"y":1,"cp":[{"x":1,"y":1}]}]  });
  };

  P.physicsBackInOut = function(options) {
    var friction;
    options = options || {};
    friction = options.friction|| 500;
    return P.bezier({ points: [{"x":0,"y":0,"cp":[{"x":0.68-(friction / 1000),"y":-0.55}]},{"x":1,"y":1,"cp":[{"x":0.265+(friction / 1000),"y":1.45}]}]  });
  };
  return P;
});
