import KUTE from '../objects/kute.js'
import TC from '../interface/tc.js'
import {numbers} from '../objects/interpolate.js' 
import defaultOptions from '../objects/defaultOptions.js'
import Components from '../objects/components.js'

// Component Util
// utility for multi-child targets
// wrapContentsSpan returns an [Element] with the SPAN.tagName and a desired class
function wrapContentsSpan(el,classNAME){
  let textWriteWrapper;
  let newElem;
  if ( typeof(el) === 'string' ) {
    newElem = document.createElement('SPAN')
    newElem.innerHTML = el
    newElem.className = classNAME
    return newElem
  } else if (!el.children.length || el.children.length && el.children[0].className !== classNAME ) {
    let elementInnerHTML = el.innerHTML
    textWriteWrapper = document.createElement('SPAN')
    textWriteWrapper.className = classNAME
    textWriteWrapper.innerHTML = elementInnerHTML
    el.appendChild(textWriteWrapper)
    el.innerHTML = textWriteWrapper.outerHTML
  } else if (el.children.length && el.children[0].className === classNAME){
    textWriteWrapper = el.children[0]
  }
  return textWriteWrapper
}

function getTextPartsArray(el,classNAME){
  let elementsArray = []
  if (el.children.length) {
    let textParts = [];
    let remainingMarkup = el.innerHTML;
    let wrapperParts;

    for ( let i=0, l = el.children.length, currentChild, childOuter, unTaggedContent; i<l; i++) {

      currentChild = el.children[i]
      childOuter = currentChild.outerHTML
      wrapperParts = remainingMarkup.split(childOuter)

      if (wrapperParts[0] !== '') {
        unTaggedContent = wrapContentsSpan(wrapperParts[0],classNAME)
        textParts.push( unTaggedContent )
        remainingMarkup = remainingMarkup.replace(wrapperParts[0],'')
      } else if (wrapperParts[1] !== '') {
        unTaggedContent = wrapContentsSpan(wrapperParts[1].split('<')[0],classNAME)
        textParts.push( unTaggedContent )
        remainingMarkup = remainingMarkup.replace(wrapperParts[0].split('<')[0],'')
      }

      !currentChild.classList.contains(classNAME) && currentChild.classList.add(classNAME)
      textParts.push( currentChild )
      remainingMarkup = remainingMarkup.replace(childOuter,'')
    }

    if (remainingMarkup!==''){
      let unTaggedRemaining = wrapContentsSpan(remainingMarkup,classNAME)
      textParts.push( unTaggedRemaining )
    }

    elementsArray = elementsArray.concat(textParts)
  } else {
    elementsArray = elementsArray.concat([wrapContentsSpan(el,classNAME)])
  }  
  return elementsArray
}

function setSegments(target,newText){
  const oldTargetSegs = getTextPartsArray( target,'text-part');
  const newTargetSegs = getTextPartsArray( wrapContentsSpan( newText ), 'text-part' );

  target.innerHTML = ''
  target.innerHTML += oldTargetSegs.map(s=>{ s.className += ' oldText'; return s.outerHTML }).join('')
  target.innerHTML += newTargetSegs.map(s=>{ s.className += ' newText'; return s.outerHTML.replace(s.innerHTML,'') }).join('')

  return [oldTargetSegs,newTargetSegs]
}

export function createTextTweens(target,newText,options){
  if (target.playing) return;

  options = options || {}
  options.duration = options.duration === 'auto' ? 'auto' : isFinite(options.duration*1) ? options.duration*1 : 1000;

  const segs = setSegments(target,newText);
  const oldTargetSegs = segs[0];
  const newTargetSegs = segs[1];
  let oldTargets = [].slice.call(target.getElementsByClassName('oldText')).reverse();
  let newTargets = [].slice.call(target.getElementsByClassName('newText'));

  let textTween = [], totalDelay = 0

  textTween = textTween.concat(oldTargets.map((el,i) => {
    options.duration = options.duration === 'auto' ? oldTargetSegs[i].innerHTML.length * 75 : options.duration; 
    options.delay = totalDelay;
    options.onComplete = null

    totalDelay += options.duration
    return new TC(el, {text:el.innerHTML}, {text:''}, options );
  }));
  textTween = textTween.concat(newTargets.map((el,i)=> {
    const onComplete = () => {target.innerHTML = newText, target.playing = false};

    options.duration = options.duration === 'auto' ? newTargetSegs[i].innerHTML.length * 75 : options.duration; 
    options.delay = totalDelay;
    options.onComplete = i === newTargetSegs.length-1 ? onComplete : null
    totalDelay += options.duration

    return new TC(el, {text:''}, {text:newTargetSegs[i].innerHTML}, options );
  }));

  textTween.start = function(){
    !target.playing && textTween.map(tw=>tw.start()) && (target.playing = true)
  }
  
  return textTween
}

// Component Values
const lowerCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").split(""), // lowercase
    upperCaseAlpha = String("abcdefghijklmnopqrstuvwxyz").toUpperCase().split(""), // uppercase
    nonAlpha = String("~!@#$%^&*()_+{}[];'<>,./?\=-").split(""), // symbols
    numeric = String("0123456789").split(""), // numeric
    alphaNumeric = lowerCaseAlpha.concat(upperCaseAlpha,numeric), // alpha numeric
    allTypes = alphaNumeric.concat(nonAlpha); // all caracters

const charSet = {
  alpha: lowerCaseAlpha, // lowercase
  upper: upperCaseAlpha, // uppercase
  symbols: nonAlpha, // symbols
  numeric: numeric,
  alphanumeric: alphaNumeric,
  all: allTypes,
}

// Component Functions
export function getWrite(tweenProp,value){
  return this.element.innerHTML;
}
export function prepareText(tweenProp,value) {
  if( tweenProp === 'number' ) {
    return parseFloat(value)
  } else {
    // empty strings crash the update function
    return value === '' ? ' ' : value
  }
}
export const onStartWrite = {
  text: function(tweenProp){
    if ( !KUTE[tweenProp] && this.valuesEnd[tweenProp] ) {
      
      let chars = this._textChars,
          charsets = chars in charSet ? charSet[chars] 
                  : chars && chars.length ? chars 
                  : charSet[defaultOptions.textChars]

      KUTE[tweenProp] = function(elem,a,b,v) {
        
        let initialText = '', 
            endText = '',
            firstLetterA = a.substring(0), 
            firstLetterB = b.substring(0),
            pointer = charsets[(Math.random() * charsets.length)>>0];

        if (a === ' ') {
          endText         = firstLetterB.substring(Math.min(v * firstLetterB.length, firstLetterB.length)>>0, 0 );
          elem.innerHTML = v < 1 ? ( ( endText + pointer  ) ) : (b === '' ? ' ' : b);
        } else if (b === ' ') {
          initialText     = firstLetterA.substring(0, Math.min((1-v) * firstLetterA.length, firstLetterA.length)>>0 );
          elem.innerHTML = v < 1 ? ( ( initialText + pointer  ) ) : (b === '' ? ' ' : b);
        } else {
          initialText     = firstLetterA.substring(firstLetterA.length, Math.min(v * firstLetterA.length, firstLetterA.length)>>0 );
          endText         = firstLetterB.substring(0,                   Math.min(v * firstLetterB.length, firstLetterB.length)>>0 );
          elem.innerHTML = v < 1 ? ( (endText + pointer + initialText) ) : (b === '' ? ' ' : b);
        }
      }
    }
  },
  number: function(tweenProp) {
    if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) { // numbers can be 0
      KUTE[tweenProp] = (elem, a, b, v) => {
        elem.innerHTML = numbers(a, b, v)>>0;
      }
    }
  }
}

// All Component Functions
export const textWriteFunctions = {
  prepareStart: getWrite,
  prepareProperty: prepareText,
  onStart: onStartWrite
}

// const textWrite = { category : 'textWrite', defaultValues: {}, interpolators: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Base Component
export const baseTextWriteOps = {
  component: 'textWriteProperties',
  category: 'textWrite',
  properties: ['text','number'],
  // defaultValues: {text: ' ',numbers:'0'},
  defaultOptions: { textChars: 'alpha' },
  Interpolate: {numbers},
  functions: {onStart:onStartWrite},
  // export to global for faster execution
  Util: { charSet }
}

// Full Component
export const textWriteOps = {
  component: 'textWriteProperties',
  category: 'textWrite',
  properties: ['text','number'],
  defaultValues: {text: ' ',numbers:'0'},
  defaultOptions: { textChars: 'alpha' },
  Interpolate: {numbers},
  functions: textWriteFunctions,
  // export to global for faster execution
  Util: { charSet, createTextTweens }
}

Components.TextWriteProperties = textWriteOps
