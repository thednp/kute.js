// number increment
var numText = document.getElementById('numText'),
  numBtn = document.getElementById('numBtn'),
  numTween = KUTE.to(numText, {number: 1550}, {duration: 3000, easing: 'easingCubicOut'});
  numBtn.addEventListener('click', function(){
  
  if (!numTween.playing) { 
    if (numText.innerHTML === '1550') { numTween.valuesEnd['number'] = 0; } else { numTween.valuesEnd['number'] = 1550; }
   numTween.start(); 
  }
}, false); 

// write text
var headText = document.getElementById('headText'),
  headBtn = document.getElementById('headBtn'),
  initText = headText.innerHTML,
  whichTw = false,
  nextText = "This is a <strong>super simple</strong> write text demo.",
  headTween = KUTE.to(headText, {text: nextText}, {textChars: 'alpha', duration: 5000, easing: 'easingBounceOut'}),
  headTween1 = KUTE.to(headText, {text: initText}, {textChars: 'alpha', duration: 5000, easing: 'easingBounceOut'});
headBtn.addEventListener('click', function(){
  !whichTw && !headTween.playing && !headTween1.playing && (headTween.start(), whichTw = !whichTw);
  whichTw && !headTween.playing && !headTween1.playing && (headTween1.start(), whichTw = !whichTw);
}, false);


// improved write text
var textTweenBTN = document.getElementById('textExampleBtn');
var textTarget = document.getElementById('textExample');
var textOriginal = textTarget.innerHTML;
var anotherText = 'This text has a <a href="index.html">link to homepage</a> inside.';
var options = {duration: 'auto', textChars: 'alphanumeric'}

textTweenBTN.addEventListener('click', function(){
  var newContent = textTarget.innerHTML === textOriginal ? anotherText : textOriginal;
  !textTarget.playing && KUTE.Util.createTextTweens(textTarget,newContent,options).start()
})


// combo wombo
var comText = document.getElementById('comText'),
  comNum = document.getElementById('comNum'),
  comBtn = document.getElementById('comBtn'),
  comTween11 = KUTE.to(comNum, {number: 2500}, {duration: 2000, easing: 'easingCubicOut'}),
  comTween12 = KUTE.to(comText, {text: "People following on Github."}, { textChars: 'symbols', duration: 3000, easing: 'easingCubicInOut'}),
  comTween21 = KUTE.to(comNum, {number: 7500}, {delay: 3000, duration: 2000, easing: 'easingCubicInOut'}),
  comTween22 = KUTE.to(comText, {text: "More crazy tricks coming soon."}, {textChars: 'all', delay: 2000, duration: 3000, easing: 'easingCubicInOut'});

try{
  comTween11.chain(comTween21); 
  comTween12.chain(comTween22);
}catch(e){
  console.error(`${e} TweenBase doesn't support chain method`)
}  

comBtn.addEventListener('click', function(){
  if (!comTween11.playing && !comTween21.playing && !comTween12.playing && !comTween22.playing) {
    comTween11.start();
    comTween12.start();  
  } 
}, false);   