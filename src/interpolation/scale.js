export default function scale(a, b, v) {
  return `scale(${((a + (b - a) * v) * 1000 >> 0) / 1000})`;
}
