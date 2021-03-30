// getPrefix - returns browser prefix
export default function getPrefix() {
  let thePrefix; const
    prefixes = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'];
  for (let i = 0, pfl = prefixes.length; i < pfl; i += 1) {
    if (`${prefixes[i]}Transform` in document.body.style) {
      thePrefix = prefixes[i]; break; // !! BREAK
    }
  }
  return thePrefix;
}
