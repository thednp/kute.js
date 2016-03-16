var boxShadow = document.getElementById('boxShadow'),
    boxBtn = boxShadow.querySelector('.btn'),
    boxElement = boxShadow.getElementsByTagName('div')[0];
    
// tween to a string value
var myBSTween1 = KUTE.to(boxElement, {boxShadow: '0px 0px 15px 10px #CDDC39'}, {duration:1000, easing: 'easingCubicInOut'});

// or a fromTo with string and array, hex and rgb
var myBSTween2 = KUTE.fromTo(boxElement, {boxShadow: [0, 0, 15, 10, '#CDDC39']}, {boxShadow: '0px 0px 25px 25px rgb(0,66,99)'}, { duration:2000, easing: 'easingCubicInOut'});
var myBSTween3 = KUTE.to(boxElement, {boxShadow: '15px 15px 0px 0px rgb(0,66,99)'}, {duration:2000, easing: 'easingCubicInOut'});
var myBSTween4 = KUTE.to(boxElement, {boxShadow: '-15px 15px 0px 10px #E91E63'}, {duration:2000, easing: 'easingCubicInOut'});
var myBSTween5 = KUTE.to(boxElement, {boxShadow: '0px 0px 0px 0px rgb(0,0,0)'}, {duration:2000, easing: 'easingCubicInOut'});
var myBSTween6 = KUTE.to(boxElement, {boxShadow: [5, 5, 5, '#99A52A', 'inset']}, {duration:2000, easing: 'easingCubicInOut', repeat: 1, yoyo: true, complete: removeInset});
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