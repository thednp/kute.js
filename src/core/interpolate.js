
// KUTE.js INTERPOLATE FUNCTIONS
// =============================

export function numbers(a, b, v) { // number1, number2, progress
  a = +a; b -= a; return a + b * v;
}
export function units(a, b, u, v) { // number1, number2, unit, progress
  a = +a; b -= a; return ( a + b * v ) + u;
}
export function arrays(a,b,v){
  const result = []
  for ( let i=0, l=b.length; i<l; i++ ) {
    result[i] = ((a[i] + (b[i] - a[i]) * v) * 1000 >> 0 ) / 1000
  }
  return result
}

export default {
  numbers,
  units,
  arrays
}