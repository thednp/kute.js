export default function(a, b, u, v) {
  let translateArray = [];
  for (let ax=0; ax<3; ax++){
    translateArray[ax] = ( a[ax]||b[ax] ? ( (a[ax] + ( b[ax] - a[ax] ) * v ) * 1000 >> 0 ) / 1000 : 0 ) + u;
  }
  return `translate3d(${translateArray.join(',')})`;
}