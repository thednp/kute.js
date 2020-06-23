import transformProperty from '../util/transformProperty.js'

export default function(el) {
  if ( !el.style ) return; // if the scroll applies to `window` it returns as it has no styling
  let css = el.style.cssText.replace(/\s/g,'').split(';'), // the cssText | the resulting transform object
      transformObject = {},
      arrayFn = ['translate3d','translate','scale3d','skew'];
  css.map(cs => {
    let csi = cs.split(':')
    if ( csi[0] === transformProperty ) {
      let tps = csi[1].split(')'); //all transform properties
      tps.map(tpi => {
        let tpv = tpi.split('('), tp = tpv[0], tv = tpv[1]; // each transform property
        if ( !/matrix/.test(tp) ){
          transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
        }
      })
    }
  })
  return transformObject;
}