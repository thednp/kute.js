export default function rotate3d(a, b, u, v) {
  let rotateStr = '';
  rotateStr += a[0] || b[0] ? `rotateX(${((a[0] + (b[0] - a[0]) * v) * 1000 >> 0) / 1000}${u})` : '';
  rotateStr += a[1] || b[1] ? `rotateY(${((a[1] + (b[1] - a[1]) * v) * 1000 >> 0) / 1000}${u})` : '';
  rotateStr += a[2] || b[2] ? `rotateZ(${((a[2] + (b[2] - a[2]) * v) * 1000 >> 0) / 1000}${u})` : '';
  return rotateStr;
}
