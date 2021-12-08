/**
 * Skew Interpolation Function.
 *
 * @param {number} a start {x,y} angles
 * @param {number} b end {x,y} angles
 * @param {string} u unit, usually `deg` degrees
 * @param {number} v progress
 * @returns {string} the interpolated string value of skew(s)
 */
export default function skew(a, b, u, v) {
  const skewArray = [];
  // eslint-disable-next-line no-bitwise
  skewArray[0] = (a[0] === b[0] ? b[0] : ((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000) + u;
  // eslint-disable-next-line no-bitwise
  skewArray[1] = a[1] || b[1] ? ((a[1] === b[1] ? b[1] : ((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000) + u) : '0';
  return `skew(${skewArray.join(',')})`;
}
