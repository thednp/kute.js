export default function numbers(a, b, v) { // number1, number2, progress
  const A = +a;
  const B = b - a;
  // a = +a; b -= a;
  return A + B * v;
}
