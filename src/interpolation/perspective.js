export default function perspective(a, b, u, v) {
  return `perspective(${((a + (b - a) * v) * 1000 >> 0) / 1000}${u})`;
}
