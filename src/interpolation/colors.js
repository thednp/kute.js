import numbers from './numbers.js'

export default function(a, b, v) {
  let _c = {},
      c,
      ep = ')',
      cm =',',
      rgb = 'rgb(',
      rgba = 'rgba(';

  for (c in b) { _c[c] = c !== 'a' ? (numbers(a[c],b[c],v)>>0 || 0) : (a[c] && b[c]) ? (numbers(a[c],b[c],v) * 100 >> 0 )/100 : null; }
  return !_c.a ? rgb + _c.r + cm + _c.g + cm + _c.b + ep : rgba + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep;
}