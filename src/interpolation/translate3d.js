/**
 * Translate 3D Interpolation Function.
 *
 * @param {number[]} a start [x,y,z] position
 * @param {number[]} b end [x,y,z] position
 * @param {string} u unit, usually `px` degrees
 * @param {number} v progress
 * @returns {string} the interpolated 3D translation string
 */
export default function translate3d(a, b, u, v) {
  const translateArray = [];
  for (let ax = 0; ax < 3; ax += 1) {
    translateArray[ax] = (a[ax] || b[ax]
      // eslint-disable-next-line no-bitwise
      ? ((a[ax] + (b[ax] - a[ax]) * v) * 1000 >> 0) / 1000 : 0) + u;
  }
  return `translate3d(${translateArray.join(',')})`;
}
