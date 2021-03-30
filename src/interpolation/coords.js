export default function coords(a, b, l, v) {
  const points = [];
  for (let i = 0; i < l; i += 1) { // for each point
    points[i] = [];
    for (let j = 0; j < 2; j += 1) { // each point coordinate
      points[i].push(((a[i][j] + (b[i][j] - a[i][j]) * v) * 1000 >> 0) / 1000);
    }
  }
  return points;
}
