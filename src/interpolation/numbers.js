/**
 * Numbers Interpolation Function.
 *
 * @param {number} a start value
 * @param {number} b end value
 * @param {number} v progress
 * @returns {number} the interpolated number
 */
export default function numbers(a, b, v) {
  const A = +a;
  const B = b - a;
  // a = +a; b -= a;
  return A + B * v;
}
