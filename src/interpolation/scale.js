/**
 * Scale Interpolation Function.
 *
 * @param {number} a start scale
 * @param {number} b end scale
 * @param {number} v progress
 * @returns {string} the interpolated scale
 */
export default function scale(a, b, v) {
  // eslint-disable-next-line no-bitwise
  return `scale(${((a + (b - a) * v) * 1000 >> 0) / 1000})`;
}
