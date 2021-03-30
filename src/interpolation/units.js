export default function units(a, b, u, v) { // number1, number2, unit, progress
  const A = +a;
  const B = b - a;
  // a = +a; b -= a;
  return (A + B * v) + u;
}
