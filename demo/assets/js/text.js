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
    headTween = KUTE.to(headText, {text: "This is a <strong>super simple</strong> write text demo."}, {repeat: 1, yoyo: true, duration: 5000, easing: 'easingBounceOut'});
headBtn.addEventListener('click', function(){
    !headTween.playing && headTween.start();
}, false);   

// combo wombo
var comText = document.getElementById('comText'),
    comNum = document.getElementById('comNum'),
    comBtn = document.getElementById('comBtn'),
    comTween11 = KUTE.to(comNum, {number: 2500}, {duration: 2000, easing: 'easingCubicOut'}),
    comTween12 = KUTE.to(comText, {text: "People <strong>following</strong> on Github."}, { textChars: 'symbols', duration: 3000, easing: 'easingCubicInOut'}),
    comTween21 = KUTE.to(comNum, {number: 7500}, {delay: 3000, duration: 2000, easing: 'easingCubicInOut'}),
    comTween22 = KUTE.to(comText, {text: "More <em class='red'>crazy tricks</em> coming soon."}, {textChars: 'all', delay: 2000, duration: 3000, easing: 'easingCubicInOut'});
comTween11.chain(comTween21); comTween12.chain(comTween22);    
comBtn.addEventListener('click', function(){
    if (!comTween11.playing && !comTween21.playing && !comTween12.playing && !comTween22.playing) {
        comTween11.start();
        comTween12.start();  
    } 
}, false);   