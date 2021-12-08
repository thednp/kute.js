/**
 * getPrefix
 *
 * Returns browser CSS3 prefix. Keep `for()`
 * for wider browser support.
 *
 * @returns {?string} the browser prefix
 */
const getPrefix = () => {
  let thePrefix = null;
  const prefixes = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'];
  for (let i = 0, pfl = prefixes.length; i < pfl; i += 1) {
    if (`${prefixes[i]}Transform` in document.body.style) {
      thePrefix = prefixes[i]; break; // !! BREAK
    }
  }
  return thePrefix;
};
export default getPrefix;
