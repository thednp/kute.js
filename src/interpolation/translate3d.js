export default function translate3d(a, b, u, v) {
  const translateArray = [];
  for (let ax = 0; ax < 3; ax += 1) {
    translateArray[ax] = (a[ax] || b[ax]
      ? ((a[ax] + (b[ax] - a[ax]) * v) * 1000 >> 0) / 1000 : 0) + u;
  }
  return `translate3d(${translateArray.join(',')})`;
}
