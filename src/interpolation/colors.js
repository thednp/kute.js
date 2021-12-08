import numbers from './numbers';
/**
 * Color Interpolation Function.
 *
 * @param {KUTE.colorObject} a start color
 * @param {KUTE.colorObject} b end color
 * @param {number} v progress
 * @returns {string} the resulting color
 */
export default function colors(a, b, v) {
  const _c = {};
  const ep = ')';
  const cm = ',';
  const rgb = 'rgb(';
  const rgba = 'rgba(';

  Object.keys(b).forEach((c) => {
    if (c !== 'a') {
      _c[c] = numbers(a[c], b[c], v) >> 0 || 0; // eslint-disable-line no-bitwise
    } else if (a[c] && b[c]) {
      _c[c] = (numbers(a[c], b[c], v) * 100 >> 0) / 100; // eslint-disable-line no-bitwise
    }
  });

  return !_c.a
    ? rgb + _c.r + cm + _c.g + cm + _c.b + ep
    : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
}
