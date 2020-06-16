// a public selector utility
export default function selector(el, multi) {
  try{
    let requestedElem;
    if (multi){
      requestedElem = el instanceof HTMLCollection 
                   || el instanceof NodeList 
                   || el instanceof Array && el.every(x => x instanceof Element)
                    ? el : document.querySelectorAll(el);
    } else {
      requestedElem = el instanceof Element 
                   || el === window // scroll
                    ? el : document.querySelector(el);
    }
    return requestedElem;
  } catch(e){
    console.error(`KUTE.js - Element(s) not found: ${el}.`)
  }
}