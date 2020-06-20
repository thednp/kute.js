export default function(a, b, u, v) {
  let skewArray = []; 
  skewArray[0] = ( a[0]===b[0] ? b[0] : ( (a[0] + ( b[0] - a[0] ) * v ) * 1000 >> 0 ) / 1000 ) + u
  skewArray[1] = a[1]||b[1] ? (( a[1]===b[1] ? b[1] : ( (a[1] + ( b[1] - a[1] ) * v ) * 1000 >> 0 ) / 1000 ) + u) : '0' 
  return `skew(${skewArray.join(',')})`;
}