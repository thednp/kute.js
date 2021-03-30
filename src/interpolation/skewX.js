export default function skewX(a, b, u, v) {
  return `skewX(${((a + (b - a) * v) * 1000 >> 0) / 1000}${u})`;
}
