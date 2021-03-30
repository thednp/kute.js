import connect from '../objects/connect.js';
import numbers from '../interpolation/numbers.js';

import { onStartWrite, charSet } from './textWriteBase.js';

// Component Util
// utility for multi-child targets
// wrapContentsSpan returns an [Element] with the SPAN.tagName and a desired class
function wrapContentsSpan(el, classNAME) {
  let textWriteWrapper;
  let newElem;
  if (typeof (el) === 'string') {
    newElem = document.createElement('SPAN');
    newElem.innerHTML = el;
    newElem.className = classNAME;
    return newElem;
  }
  if (!el.children.length || (el.children.length && el.children[0].className !== classNAME)) {
    const elementInnerHTML = el.innerHTML;
    textWriteWrapper = document.createElement('SPAN');
    textWriteWrapper.className = classNAME;
    textWriteWrapper.innerHTML = elementInnerHTML;
    el.appendChild(textWriteWrapper);
    el.innerHTML = textWriteWrapper.outerHTML;
  } else if (el.children.length && el.children[0].className === classNAME) {
    [textWriteWrapper] = el.children;
  }
  return textWriteWrapper;
}

function getTextPartsArray(el, classNAME) {
  let elementsArray = [];
  const len = el.children.length;
  if (len) {
    const textParts = [];
    let remainingMarkup = el.innerHTML;
    let wrapperParts;

    for (let i = 0, currentChild, childOuter, unTaggedContent; i < len; i += 1) {
      currentChild = el.children[i];
      childOuter = currentChild.outerHTML;
      wrapperParts = remainingMarkup.split(childOuter);

      if (wrapperParts[0] !== '') {
        unTaggedContent = wrapContentsSpan(wrapperParts[0], classNAME);
        textParts.push(unTaggedContent);
        remainingMarkup = remainingMarkup.replace(wrapperParts[0], '');
      } else if (wrapperParts[1] !== '') {
        unTaggedContent = wrapContentsSpan(wrapperParts[1].split('<')[0], classNAME);
        textParts.push(unTaggedContent);
        remainingMarkup = remainingMarkup.replace(wrapperParts[0].split('<')[0], '');
      }

      if (!currentChild.classList.contains(classNAME)) currentChild.classList.add(classNAME);
      textParts.push(currentChild);
      remainingMarkup = remainingMarkup.replace(childOuter, '');
    }

    if (remainingMarkup !== '') {
      const unTaggedRemaining = wrapContentsSpan(remainingMarkup, classNAME);
      textParts.push(unTaggedRemaining);
    }

    elementsArray = elementsArray.concat(textParts);
  } else {
    elementsArray = elementsArray.concat([wrapContentsSpan(el, classNAME)]);
  }
  return elementsArray;
}

function setSegments(target, newText) {
  const oldTargetSegs = getTextPartsArray(target, 'text-part');
  const newTargetSegs = getTextPartsArray(wrapContentsSpan(newText), 'text-part');

  target.innerHTML = '';
  target.innerHTML += oldTargetSegs.map((s) => { s.className += ' oldText'; return s.outerHTML; }).join('');
  target.innerHTML += newTargetSegs.map((s) => { s.className += ' newText'; return s.outerHTML.replace(s.innerHTML, ''); }).join('');

  return [oldTargetSegs, newTargetSegs];
}

export function createTextTweens(target, newText, ops) {
  if (target.playing) return false;

  const options = ops || {};
  options.duration = 1000;

  if (ops.duration === 'auto') {
    options.duration = 'auto';
  } else if (Number.isFinite(ops.duration * 1)) {
    options.duration = ops.duration * 1;
  }

  const TweenContructor = connect.tween;
  const segs = setSegments(target, newText);
  const oldTargetSegs = segs[0];
  const newTargetSegs = segs[1];
  const oldTargets = [].slice.call(target.getElementsByClassName('oldText')).reverse();
  const newTargets = [].slice.call(target.getElementsByClassName('newText'));

  let textTween = [];
  let totalDelay = 0;

  textTween = textTween.concat(oldTargets.map((el, i) => {
    options.duration = options.duration === 'auto'
      ? oldTargetSegs[i].innerHTML.length * 75
      : options.duration;
    options.delay = totalDelay;
    options.onComplete = null;

    totalDelay += options.duration;
    return new TweenContructor(el, { text: el.innerHTML }, { text: '' }, options);
  }));
  textTween = textTween.concat(newTargets.map((el, i) => {
    function onComplete() {
      target.innerHTML = newText;
      target.playing = false;
    }

    options.duration = options.duration === 'auto' ? newTargetSegs[i].innerHTML.length * 75 : options.duration;
    options.delay = totalDelay;
    options.onComplete = i === newTargetSegs.length - 1 ? onComplete : null;
    totalDelay += options.duration;

    return new TweenContructor(el, { text: '' }, { text: newTargetSegs[i].innerHTML }, options);
  }));

  textTween.start = function startTweens() {
    if (!target.playing) {
      textTween.forEach((tw) => tw.start());
      target.playing = true;
    }
  };

  return textTween;
}

// Component Functions
function getWrite(/* tweenProp, value */) {
  return this.element.innerHTML;
}

function prepareText(tweenProp, value) {
  if (tweenProp === 'number') {
    return parseFloat(value);
  }
  // empty strings crash the update function
  return value === '' ? ' ' : value;
}

// All Component Functions
export const textWriteFunctions = {
  prepareStart: getWrite,
  prepareProperty: prepareText,
  onStart: onStartWrite,
};

/* textWrite = {
  category: 'textWrite',
  defaultValues: {},
  interpolators: {numbers},
  functions = { prepareStart, prepareProperty, onStart }
} */

// Full Component
export const textWrite = {
  component: 'textWriteProperties',
  category: 'textWrite',
  properties: ['text', 'number'],
  defaultValues: { text: ' ', numbers: '0' },
  defaultOptions: { textChars: 'alpha' },
  Interpolate: { numbers },
  functions: textWriteFunctions,
  // export to global for faster execution
  Util: { charSet, createTextTweens },
};

export default textWrite;
