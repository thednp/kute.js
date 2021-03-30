export default function arrays(a, b, v) {
  const result = [];
  for (let i = 0, l = b.length; i < l; i += 1) {
    result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0) / 1000;
  }
  return result;
}
