export default function rotate(a, b, u, v) {
  return `rotate(${((a + (b - a) * v) * 1000 >> 0) / 1000}${u})`;
}
