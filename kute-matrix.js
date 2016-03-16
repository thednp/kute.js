/* KUTE.js - The Light Tweening Engine
 * package - Matrix Transform Plugin
 * desc - adds the ability to animate transform with matrix / matrix3d
 * by dnp_theme
 * Licensed under MIT-License
 */


(function(factory){
  if (typeof define === 'function' && define.amd) {
    define(["./kute.js"], function(KUTE){ factory(KUTE); return KUTE; });
  } else if(typeof module == "object" && typeof require == "function") {
    var KUTE = require("./kute.js");
    // Export the modified one. Not really required, but convenient.
    module.exports = factory(KUTE);
  } else if(typeof window.KUTE != "undefined") {
    // window.KUTE.Matrix = window.KUTE.Matrix || factory(KUTE);
    factory(KUTE);
  } else {
    throw new Error("Matrix Plugin require KUTE.js.")
  }
})(function(KUTE){
  'use strict';
  var K = window.KUTE, _pf = K.getPrefix(),
    _pfT = (!('transform' in document.body.style)) ? true : false, // is prefix required for transform
    _tr = _pfT ? _pf + 'Transform' : 'transform',
    _3d  = ['rotateX', 'rotateY','translateZ', 'perspective', 'rotate3d', 'scale3d', 'translate3d'], // transform properties that require perspective
    _tf  = ['translate3d', 'translateX', 'translateY', 'translateZ', 'rotate', 'translate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scale']; // transform
  

    /**
     * CSSMatrix Shim
     * @constructor
     */
    // CSS Matrix as implemented by @arian
    // https://github.com/arian/M/blob/master/CSSMatrix.js
    var CSSMatrix = function(){
      var a = [].slice.call(arguments),
        m = this;
    //   if (a.length) for (var i = a.length; i--;){
    //     if (Math.abs(a[i]) < CSSMatrix.SMALL_NUMBER) a[i] = 0;
    //   }
      m.setIdentity();
      if (a.length == 16){
        m.m11 = m.a = a[0];  m.m12 = m.b = a[1];  m.m13 = a[2];  m.m14 = a[3];
        m.m21 = m.c = a[4];  m.m22 = m.d = a[5];  m.m23 = a[6];  m.m24 = a[7];
        m.m31 = a[8];  m.m32 = a[9];  m.m33 = a[10]; m.m34 = a[11];
        m.m41 = m.e = a[12]; m.m42 = m.f = a[13]; m.m43 = a[14]; m.m44 = a[15];
      } else if (a.length == 6) {
        this.affine = true;
        m.m11 = m.a = a[0]; m.m12 = m.b = a[1]; m.m14 = m.e = a[4];
        m.m21 = m.c = a[2]; m.m22 = m.d = a[3]; m.m24 = m.f = a[5];
      } else if (a.length === 1 && typeof a[0] == 'string') {
        m.setMatrixValue(a[0]);
      } else if (a.length > 0) {
        throw new TypeError('Invalid Matrix Value');
      }
    };

    // decimal values in WebKitCSSMatrix.prototype.toString are truncated to 6 digits
    CSSMatrix.SMALL_NUMBER = 1e-20;

    // Transformations

    // http://en.wikipedia.org/wiki/Rotation_matrix
    CSSMatrix.Rotate = function(rx, ry, rz){
      rx *= Math.PI / 180;
      ry *= Math.PI / 180;
      rz *= Math.PI / 180;
      // minus sin() because of right-handed system
      var cosx = Math.cos(rx), sinx = - Math.sin(rx);
      var cosy = Math.cos(ry), siny = - Math.sin(ry);
      var cosz = Math.cos(rz), sinz = - Math.sin(rz);
      var m = new CSSMatrix();

      m.m11 = m.a = cosy * cosz;
      m.m12 = m.b = - cosy * sinz;
      m.m13 = siny;

      m.m21 = m.c = sinx * siny * cosz + cosx * sinz;
      m.m22 = m.d = cosx * cosz - sinx * siny * sinz;
      m.m23 = - sinx * cosy;

      m.m31 = sinx * sinz - cosx * siny * cosz;
      m.m32 = sinx * cosz + cosx * siny * sinz;
      m.m33 = cosx * cosy;

      return m;
    };

    CSSMatrix.RotateAxisAngle = function(x, y, z, angle){
      angle *= Math.PI / 360;

      var sinA = Math.sin(angle), cosA = Math.cos(angle), sinA2 = sinA * sinA;
      var length = Math.sqrt(x * x + y * y + z * z);

      if (length === 0){
        // bad vector length, use something reasonable
        x = 0;
        y = 0;
        z = 1;
      } else {
        x /= length;
        y /= length;
        z /= length;
      }

      var x2 = x * x, y2 = y * y, z2 = z * z;

      var m = new CSSMatrix();
      m.m11 = m.a = 1 - 2 * (y2 + z2) * sinA2;
      m.m12 = m.b = 2 * (x * y * sinA2 + z * sinA * cosA);
      m.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);
      m.m21 = m.c = 2 * (y * x * sinA2 - z * sinA * cosA);
      m.m22 = m.d = 1 - 2 * (z2 + x2) * sinA2;
      m.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
      m.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
      m.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
      m.m33 = 1 - 2 * (x2 + y2) * sinA2;
      m.m14 = m.m24 = m.m34 = 0;
      m.m41 = m.e = m.m42 = m.f = m.m43 = 0;
      m.m44 = 1;

      return m;
    };

    CSSMatrix.ScaleX = function(x){
      var m = new CSSMatrix();
      m.m11 = m.a = x;
      return m;
    };

    CSSMatrix.ScaleY = function(y){
      var m = new CSSMatrix();
      m.m22 = m.d = y;
      return m;
    };

    CSSMatrix.ScaleZ = function(z){
      var m = new CSSMatrix();
      m.m33 = z;
      return m;
    };

    CSSMatrix.Scale = function(x, y, z){
      var m = new CSSMatrix();
      m.m11 = m.a = x;
      m.m22 = m.d = y;
      m.m33 = z;
      return m;
    };

    CSSMatrix.SkewX = function(angle){
      angle *= Math.PI / 180;
      var m = new CSSMatrix();
      m.m21 = m.c = Math.tan(angle);
      return m;
    };

    CSSMatrix.SkewY = function(angle){
      angle *= Math.PI / 180;
      var m = new CSSMatrix();
      m.m12 = m.b = Math.tan(angle);
      return m;
    };

    CSSMatrix.Translate = function(x, y, z){
      var m = new CSSMatrix();
      m.m41 = m.e = x;
      m.m42 = m.f = y;
      m.m43 = z;
      return m;
    };

    CSSMatrix.multiply = function(m1, m2){

      var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41,
        m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42,
        m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43,
        m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44,

        m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41,
        m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42,
        m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43,
        m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44,

        m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41,
        m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42,
        m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43,
        m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44,

        m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41,
        m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42,
        m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43,
        m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;

      return new CSSMatrix( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 );
    };

    // w3c defined methods

    /**
     * The setMatrixValue method replaces the existing matrix with one computed
     * from parsing the passed string as though it had been assigned to the
     * transform property in a CSS style rule.
     * @param {String} string The string to parse.
     */
    CSSMatrix.prototype.setMatrixValue = function(string){
      string = String(string).trim();
      var m = this;
      m.setIdentity();
      if (string == 'none') return m;
      var type = string.slice(0, string.indexOf('(')), parts, i;
      if (type == 'matrix3d'){
        parts = string.slice(9, -1).split(',');
        for (i = parts.length; i--;) parts[i] = parseFloat(parts[i]);
        m.m11 = m.a = parts[0]; m.m12 = m.b = parts[1]; m.m13 = parts[2];  m.m14 = parts[3];
        m.m21 = m.c = parts[4]; m.m22 = m.d = parts[5]; m.m23 = parts[6];  m.m24 = parts[7];
        m.m31 = parts[8]; m.m32 = parts[9]; m.m33 = parts[10]; m.m34 = parts[11];
        m.m41 = m.e = parts[12]; m.m42 = m.f = parts[13]; m.m43 = parts[14]; m.m44 = parts[15];
      } else if (type == 'matrix'){
        m.affine = true;
        parts = string.slice(7, -1).split(',');
        for (i = parts.length; i--;) parts[i] = parseFloat(parts[i]);
        m.m11 = m.a = parts[0]; m.m12 = m.b = parts[2]; m.m41 = m.e = parts[4];
        m.m21 = m.c = parts[1]; m.m22 = m.d = parts[3]; m.m42 = m.f = parts[5];
      } else {
        throw new TypeError('Invalid Matrix Value');
      }
      return m;
    };

    /**
     * The multiply method returns a new CSSMatrix which is the result of this
     * matrix multiplied by the passed matrix, with the passed matrix to the right.
     * This matrix is not modified.
     *
     * @param {CSSMatrix} m2
     * @return {CSSMatrix} The result matrix.
     */
    CSSMatrix.prototype.multiply = function(m2){
      return CSSMatrix.multiply(this, m2);
    };

    /**
     * The translate method returns a new matrix which is this matrix post
     * multiplied by a translation matrix containing the passed values. If the z
     * component is undefined, a 0 value is used in its place. This matrix is not
     * modified.
     *
     * @param {number} x X component of the translation value.
     * @param {number} y Y component of the translation value.
     * @param {number=} z Z component of the translation value.
     * @return {CSSMatrix} The result matrix
     */
    CSSMatrix.prototype.translate = function(x, y, z){
      if (z == null) z = 0;
      return CSSMatrix.multiply(this, CSSMatrix.Translate(x, y, z));
    };

    /**
     * The scale method returns a new matrix which is this matrix post multiplied by
     * a scale matrix containing the passed values. If the z component is undefined,
     * a 1 value is used in its place. If the y component is undefined, the x
     * component value is used in its place. This matrix is not modified.
     *
     * @param {number} x The X component of the scale value.
     * @param {number=} y The Y component of the scale value.
     * @param {number=} z The Z component of the scale value.
     * @return {CSSMatrix} The result matrix
     */
    CSSMatrix.prototype.scale = function(x, y, z){
      if (y == null) y = x;
      if (z == null) z = 1;
      return CSSMatrix.multiply(this, CSSMatrix.Scale(x, y, z));
    };

    /**
     * The rotate method returns a new matrix which is this matrix post multiplied
     * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
     * If the y and z components are undefined, the x value is used to rotate the
     * object about the z axis, as though the vector (0,0,x) were passed. All
     * rotation values are in degrees. This matrix is not modified.
     *
     * @param {number} rx The X component of the rotation value, or the Z component if the rotY and rotZ parameters are undefined.
     * @param {number=} ry The (optional) Y component of the rotation value.
     * @param {number=} rz The (optional) Z component of the rotation value.
     * @return {CSSMatrix} The result matrix
     */
    CSSMatrix.prototype.rotate = function(rx, ry, rz){
      if (ry == null) ry = rx;
      if (rz == null) rz = rx;
      return CSSMatrix.multiply(this, CSSMatrix.Rotate(rx, ry, rz));
    };

    /**
     * The rotateAxisAngle method returns a new matrix which is this matrix post
     * multiplied by a rotation matrix with the given axis and angle. The right-hand
     * rule is used to determine the direction of rotation. All rotation values are
     * in degrees. This matrix is not modified.
     *
     * @param {number} x The X component of the axis vector.
     * @param {number=} y The Y component of the axis vector.
     * @param {number=} z The Z component of the axis vector.
     * @param {number} angle The angle of rotation about the axis vector, in degrees.
     * @return {CSSMatrix} The result matrix
     */
    CSSMatrix.prototype.rotateAxisAngle = function(x, y, z, angle){
      if (y == null) y = x;
      if (z == null) z = x;
      return CSSMatrix.multiply(this, CSSMatrix.RotateAxisAngle(x, y, z, angle));
    };

    // Defined in WebKitCSSMatrix, but not in the w3c draft

    /**
     * Specifies a skew transformation along the x-axis by the given angle.
     *
     * @param {number} angle The angle amount in degrees to skew.
     * @return {CSSMatrix} The result matrix
     */
    CSSMatrix.prototype.skewX = function(angle){
      return CSSMatrix.multiply(this, CSSMatrix.SkewX(angle));
    };

    /**
     * Specifies a skew transformation along the x-axis by the given angle.
     *
     * @param {number} angle The angle amount in degrees to skew.
     * @return {CSSMatrix} The result matrix
     */
    CSSMatrix.prototype.skewY = function(angle){
      return CSSMatrix.multiply(this, CSSMatrix.SkewY(angle));
    };

    /**
     * Returns a string representation of the matrix.
     * @return {string}
     */
    CSSMatrix.prototype.toString = function(){
      var m = this;

      if (this.affine){
        return  'matrix(' + [
          m.a, m.b,
          m.c, m.d,
          m.e, m.f
        ].join(', ') + ')';
      }
      // note: the elements here are transposed
      return  'matrix3d(' + [
        m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44
      ].join(', ') + ')';
    };


    // Additional methods

    /**
     * Set the current matrix to the identity form
     *
     * @return {CSSMatrix} this matrix
     */
    CSSMatrix.prototype.setIdentity = function(){
      var m = this;
      m.m11 = m.a = 1; m.m12 = m.b = 0; m.m13 = 0; m.m14 = 0;
      m.m21 = m.c = 0; m.m22 = m.d = 1; m.m23 = 0; m.m24 = 0;
      m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0;
      m.m41 = m.e = 0; m.m42 = m.f = 0; m.m43 = 0; m.m44 = 1;
      return this;
    };

    /**
     * Transform a tuple (3d point) with this CSSMatrix
     *
     * @param {Tuple} an object with x, y, z and w properties
     * @return {Tuple} the passed tuple
     */
    CSSMatrix.prototype.transform = function(t /* tuple */ ){
      var m = this;

      var x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w,
        y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w,
        z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w,
        w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;

      t.x = x / w;
      t.y = y / w;
      t.z = z / w;

      return t;
    };

    // CSSMatrix.prototype.toFullString = function(){
    //   var m = this;
    //   return [
    //     [m.m11, m.m12, m.m13, m.m14].join(', '),
    //     [m.m21, m.m22, m.m23, m.m24].join(', '),
    //     [m.m31, m.m32, m.m33, m.m34].join(', '),
    //     [m.m41, m.m42, m.m43, m.m44].join(', ')
    //   ].join('\n');
    // }; 
  
  CSSMatrix.Perspective = function(d){
    var m = new CSSMatrix(); 
    m.m34 = -1/d; 
    return m;
  };


  
  /**
   * The perspective method returns a new matrix which is this matrix post
   * multiplied by a perspective matrix containing the passed values. If the 
   * y and z components are undefined, a 0 value is used in its place.
   *
   * @param {number} x X component of the perspective value.
   * @param {number} y Y component of the perspective value.
   * @param {number=} z Z component of the perspective value.
   * @return {M} The result matrix
   */
  CSSMatrix.prototype.perspective = function(d){
    return CSSMatrix.multiply(this, CSSMatrix.Perspective(d));
  };  
  
  CSSMatrix.toMat4 = function(out, a) {
    if (!out)
        out = new Array(16)

    out[0] = a[0]
    out[1] = a[1]
    out[2] = 0
    out[3] = 0
    out[4] = a[2]
    out[5] = a[3]
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[10] = 1
    out[11] = 0
    out[12] = a[4]
    out[13] = a[5]
    out[14] = 0
    out[15] = 1
    return out
  }
  
  CSSMatrix.prototype.toArray = function(p){
    if (p === 'matrix'){
      return [this.a, this.b, this.c, this.d, this.e, this.f];
    } else {
      return [this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44];
    }
  }

  K.pp['matrix'] = function(p,v,l){
    if ( !('matrix' in K.dom) ) {
      K.dom['matrix'] = function(w,p,v) {
        var m = [], i, l = w._vS[p].length, t = l===6 ? 'matrix' : 'matrix3d';
        for (i=0; i<l; i++ ){
          m.push( w._vS[p][i] + (w._vE[p][i] - w._vS[p][i]) * v)
        }
        w._el.style[_tr] = t + '(' + m + ')';
      };
    }
    if (v instanceof Object){
      return K.compose(v);
    } else if (typeof v === 'string'){
      return CSSMatrix.prototype.setMatrixValue(v);
    } else if (v instanceof Array){
      return v;
    }
  }

  K.compose = function(o){
    var m = new CSSMatrix(), p = 'matrix3d', ps, x, y ,z, rx, ry, rz, sx, sy, scx, scy, scz;
    ps = o['perspective'] ? o['perspective'] : false;
    x = o['translateX'] ? o['translateX'] : 0;
    y = o['translateY'] ? o['translateY'] : 0;
    z = o['translateZ'] ? o['translateZ'] : 0;
    rx = o['rotateX'] ? o['rotateX'] : 0;
    rz = o['rotateZ'] ? o['rotateZ'] : rx;
    ry = o['rotateY'] ? o['rotateY'] : rx;
    sx = o['skewX'] ? o['skewX'] : 0;
    sy = o['skewY'] ? o['skewY'] : 0;
    scx = o['scaleX'] ? o['scaleX'] : 1;
    scy = o['scaleY'] ? o['scaleY'] : 1;
    scz = o['scaleZ'] ? o['scaleZ'] : 1;

    m = ps&&(rx||ry||z||scz!==1) ? m.perspective(ps) : m;
    m = x||y||z ? m.translate(x, y, z) : m;
    // m = rx!==0||ry!==0||rz!==0 ? m.rotate(rx,ry,rz) : m;
    m = m.rotate(rx,0,0).rotate(0,ry,0).rotate(0,0,rz);
    m = sx ? m.skewX(sx) : m;
    m = sy ? m.skewY(sy) : m;
    m = scx!==1||scy!==1||scz!==1 ? m.scale(scx, scy, scz) : m;
    
    p = ps&&(rx!==0||ry!==0||z!==0||scz!==1) ? p : 'matrix';
    m = m.toArray(p);

    return m;
  };

  return this;
});  
