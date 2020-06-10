// getInlineStyle - get transform style for element from cssText for .to() method
export default function(el) {
  if ( !el.style ) return; // if the scroll applies to `window` it returns as it has no styling
  let css = el.style.cssText.replace(/\s/g,'').split(';'), // the cssText | the resulting transform object
      transformObject = {},
      arrayFn = ['translate3d','translate','scale3d','skew'];

  // if we have any inline style in the cssText attribute, usually it has higher priority
  // for ( let i=0, csl = css.length; i<csl; i++ ){
  //   if ( /transform/i.test(css[i])) {
  //     const tps = css[i].split(':')[1].split(')'); //all transform properties
  //     for ( let k=0, tpl = tps.length-1; k< tpl; k++){
  //       const tpv = tps[k].split('('); // each transform property, the sp is for transform property
  //       const tp = tpv[0];
  //       const tv = tpv[1];
  //       if ( !/matrix/.test(tp) ){
  //         transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
  //       }
  //     }
  //   }
  // }
  css.map(cs => {
    if ( /transform/i.test(cs)) {
      let tps = cs.split(':')[1].split(')'); //all transform properties
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