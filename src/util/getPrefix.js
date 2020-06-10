// getPrefix - returns browser prefix
export default function() {
  let thePrefix, prefixes = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'];
  for (let i = 0, pfl = prefixes.length; i < pfl; i++) { 
    if (`${prefixes[i]}Transform` in document.body.style) { 
      thePrefix = prefixes[i]; break; // !! BREAK
    }  
  }
  return thePrefix;
}