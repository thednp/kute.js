/**
 * Units Interpolation Function.
 *
 * @param {number} a start value
 * @param {number} b end value
 * @param {string} u unit
 * @param {number} v progress
 * @returns {string} the interpolated value + unit string
 */
export default function units(a, b, u, v) { // number1, number2, unit, progress
  const A = +a;
  const B = b - a;
  // a = +a; b -= a;
  return (A + B * v) + u;
}
