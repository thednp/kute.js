import numbers from './numbers.js';

export default function colors(a, b, v) {
  const _c = {};
  const ep = ')';
  const cm = ',';
  const rgb = 'rgb(';
  const rgba = 'rgba(';

  Object.keys(b).forEach((c) => {
    // _c[c] = c !== 'a' ? (numbers(a[c], b[c], v) >> 0 || 0) : (a[c] && b[c])
    // ? (numbers(a[c], b[c], v) * 100 >> 0) / 100 : null;
    if (c !== 'a') {
      _c[c] = numbers(a[c], b[c], v) >> 0 || 0;
    } else if (a[c] && b[c]) {
      _c[c] = (numbers(a[c], b[c], v) * 100 >> 0) / 100;
    }
  });

  return !_c.a
    ? rgb + _c.r + cm + _c.g + cm + _c.b + ep
    : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
}
