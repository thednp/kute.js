import transformProperty from '../util/transformProperty';

/**
 * getInlineStyle
 *
 * Returns the transform style for element from cssText.
 * Used by for the `.to()` static method on legacy browsers.
 *
 * @param {Element} el target element
 * @returns {object} a transform object
 */
export default function getInlineStyleLegacy(el) {
  if (!el.style) return false; // if the scroll applies to `window` it returns as it has no styling
  const css = el.style.cssText.replace(/\s/g, '').split(';'); // the cssText | the resulting transform object
  const transformObject = {};
  const arrayFn = ['translate3d', 'translate', 'scale3d', 'skew'];

  css.forEach((cs) => {
    const csi = cs.split(':');
    if (csi[0] === transformProperty) {
      const tps = csi[1].split(')'); // all transform properties
      tps.forEach((tpi) => {
        const tpv = tpi.split('('); const tp = tpv[0]; const
          tv = tpv[1]; // each transform property
        if (!/matrix/.test(tp)) {
          transformObject[tp] = arrayFn.includes(tp) ? tv.split(',') : tv;
        }
      });
    }
  });

  return transformObject;
}
