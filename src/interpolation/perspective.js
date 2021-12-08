/**
 * Perspective Interpolation Function.
 *
 * @param {number} a start value
 * @param {number} b end value
 * @param {string} u unit
 * @param {number} v progress
 * @returns {string} the perspective function in string format
 */
export default function perspective(a, b, u, v) {
  // eslint-disable-next-line no-bitwise
  return `perspective(${((a + (b - a) * v) * 1000 >> 0) / 1000}${u})`;
}
