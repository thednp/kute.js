/**
 * SkewX Interpolation Function.
 *
 * @param {number} a start angle
 * @param {number} b end angle
 * @param {string} u unit, usually `deg` degrees
 * @param {number} v progress
 * @returns {string} the interpolated skewX
 */
export default function skewX(a, b, u, v) {
  // eslint-disable-next-line no-bitwise
  return `skewX(${((a + (b - a) * v) * 1000 >> 0) / 1000}${u})`;
}
