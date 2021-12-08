/**
 * getInlineStyle
 * Returns the transform style for element from
 * cssText. Used by for the `.to()` static method.
 *
 * @param {Element} el target element
 * @returns {object}
 */
export default function getInlineStyle(el) {
  // if the scroll applies to `window` it returns as it has no styling
  if (!el.style) return false;
  // the cssText | the resulting transform object
  const css = el.style.cssText.replace(/\s/g, '').split(';');
  const transformObject = {};
  const arrayFn = ['translate3d', 'translate', 'scale3d', 'skew'];

  css.forEach((cs) => {
    if (/transform/i.test(cs)) {
      // all transform properties
      const tps = cs.split(':')[1].split(')');
      tps.forEach((tpi) => {
        const tpv = tpi.split('(');
        const tp = tpv[0];
        // each transform property
        const tv = tpv[1];
        if (!/matrix/.test(tp)) {
          transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
        }
      });
    }
  });

  return transformObject;
}
