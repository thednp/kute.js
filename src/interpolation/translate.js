/**
 * Translate 2D Interpolation Function.
 *
 * @param {number[]} a start [x,y] position
 * @param {number[]} b end [x,y] position
 * @param {string} u unit, usually `px` degrees
 * @param {number} v progress
 * @returns {string} the interpolated 2D translation string
 */
export default function translate(a, b, u, v) {
  const translateArray = [];
  // eslint-disable-next-line no-bitwise
  translateArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u;
  // eslint-disable-next-line no-bitwise
  translateArray[1] = a[1] || b[1] ? ((a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u) : '0';
  return `translate(${translateArray.join(',')})`;
}
