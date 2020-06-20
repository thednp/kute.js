export default function(a, b, u, v) { // number1, number2, unit, progress
  a = +a; b -= a; return ( a + b * v ) + u;
}