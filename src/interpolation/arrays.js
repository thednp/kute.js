/**
 * Array Interpolation Function.
 *
 * @param {number[]} a start array
 * @param {number[]} b end array
 * @param {number} v progress
 * @returns {number[]} the resulting array
 */
export default function arrays(a, b, v) {
  const result = []; const { length } = b;
  for (let i = 0; i < length; i += 1) {
    // eslint-disable-next-line no-bitwise
    result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0) / 1000;
  }
  return result;
}
