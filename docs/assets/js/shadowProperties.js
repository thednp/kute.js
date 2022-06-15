/*  BOX SHADOW EXAMPLE  */
var boxShadow = document.getElementById('boxShadow'),
    boxBtn = boxShadow.querySelector('.btn'),
    boxElement = boxShadow.getElementsByTagName('div')[0];
    
// tween to a string value
var myBSTween1 = KUTE.to(boxElement, {boxShadow: '0px 0px 10px 10px #CDDC39'}, {duration:1000, easing: 'easingCubicInOut'});

// or a fromTo with string and array, hex and rgb
var myBSTween2 = KUTE.fromTo(boxElement, {boxShadow: [0, 0, 10, 10, '#CDDC39']}, {boxShadow: '10px 10px 10px 10px rgb(0,66,99)'}, { duration:1000, easing: 'easingCubicInOut'});
var myBSTween3 = KUTE.to(boxElement, {boxShadow: '10px 10px 10px 10px rgb(0,66,99)'}, {duration:1000, easing: 'easingCubicInOut'});
var myBSTween4 = KUTE.to(boxElement, {boxShadow: '-10px -10px 10px 10px #E91E63'}, {duration:1000, easing: 'easingCubicInOut'});
var myBSTween5 = KUTE.to(boxElement, {boxShadow: '0px 0px 0px 0px rgb(0,0,0)'}, {duration:1000, easing: 'easingCubicIn'});
var myBSTween6 = KUTE.to(boxElement, {boxShadow: [10, 10, 10, '#99A52A', 'inset']}, {duration:2000, easing: 'easingCubicOut', repeat: 1, yoyo: true, onComplete: removeInset});
myBSTween1.chain(myBSTween2);
myBSTween2.chain(myBSTween3);
myBSTween3.chain(myBSTween4);
myBSTween4.chain(myBSTween5);
myBSTween5.chain(myBSTween6);

function removeInset() {
    boxElement.style.boxShadow = '0px 0px 0px 0px rgb(0,0,0)';
}

boxBtn.addEventListener('click', function(){
    !myBSTween1.playing && !myBSTween2.playing && !myBSTween3.playing && 
    !myBSTween4.playing && !myBSTween5.playing && !myBSTween6.playing && myBSTween1.start();
}, false);
/*  BOX SHADOW EXAMPLE  */

/*  TEXT SHADOW EXAMPLE  */
var textShadow = document.getElementById('textShadow'),
    textBtn = textShadow.querySelector('.btn'),
    textElement = textShadow.getElementsByTagName('div')[0];
    
// tween to a string value
var myTSTween1 = KUTE.to(textElement, {textShadow: '0px 0px 5px #000'}, {duration:1000, easing: 'easingCubicInOut'});

// or a fromTo with string and array, hex and rgb
var myTSTween2 = KUTE.fromTo(textElement, {textShadow: [0, 0, 5, '#000']}, {textShadow: '10px 10px 10px rgb(0,66,99)'}, { duration:1000, easing: 'easingCubicInOut'});
var myTSTween3 = KUTE.to(textElement, {textShadow: '10px 10px 10px rgb(0,66,99)'}, {duration:1000, easing: 'easingCubicInOut'});
var myTSTween4 = KUTE.to(textElement, {textShadow: '-10px -10px 10px #E91E63'}, {duration:1000, easing: 'easingCubicInOut'});
var myTSTween5 = KUTE.to(textElement, {textShadow: '0px 0px 0px rgb(0,0,0)'}, {duration:2000, easing: 'easingCubicIn'});
myTSTween1.chain(myTSTween2);
myTSTween2.chain(myTSTween3);
myTSTween3.chain(myTSTween4);
myTSTween4.chain(myTSTween5);

textBtn.addEventListener('click', function(){
    !myTSTween1.playing && !myTSTween2.playing && !myTSTween3.playing && 
    !myTSTween4.playing && !myTSTween5.playing && myTSTween1.start();
}, false);
/*  TEXT SHADOW EXAMPLE  */