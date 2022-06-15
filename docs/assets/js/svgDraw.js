// draw example
var drawBtn = document.getElementById('drawBtn');
var drawExample = document.getElementById('draw-example');
var drawEls = drawExample.querySelectorAll('*');

var draw1 = KUTE.allFromTo(drawEls,{draw:'0% 0%'}, {draw:'0% 10%'}, {duration: 1500, easing: "easingCubicIn", offset: 250}); 
var draw2 = KUTE.allFromTo(drawEls,{draw:'0% 10%'}, {draw:'90% 105%'}, {duration: 2500, easing: "easingCubicOut", offset: 250}); 
var draw3 = KUTE.allFromTo(drawEls,{draw:'90% 105%'}, {draw:'100% 105%'}, {duration: 1500, easing: "easingCubicIn", offset: 250}); 
var draw4 = KUTE.allFromTo(drawEls,{draw:'0% 0%'}, {draw:'0% 103%'}, {duration: 3500, easing: "easingBackOut", offset: 250});
var draw5 = KUTE.allFromTo(drawEls,{draw:'0% 105%'}, {draw:'50% 50%'}, {duration: 2500, easing: "easingExponentialInOut", offset: 250});

try{
  draw1.chain(draw2); 
  draw2.chain(draw3);
  draw3.chain(draw4); 
  draw4.chain(draw5);
}catch(e){
	console.error(e+"TweenBase doesn\'t support chain method")
}

drawBtn.addEventListener('click', function(){
  !draw1.tweens[0].playing && !draw1.tweens[1].playing && !draw1.tweens[2].playing && !draw1.tweens[3].playing && !draw1.tweens[4].playing
  && !draw2.tweens[0].playing && !draw2.tweens[1].playing && !draw2.tweens[2].playing && !draw2.tweens[3].playing && !draw2.tweens[4].playing
  && !draw3.tweens[0].playing && !draw3.tweens[1].playing && !draw3.tweens[2].playing && !draw3.tweens[3].playing && !draw3.tweens[4].playing
  && !draw4.tweens[0].playing && !draw4.tweens[1].playing && !draw4.tweens[2].playing && !draw4.tweens[3].playing && !draw4.tweens[4].playing
  && !draw5.tweens[0].playing && !draw5.tweens[1].playing && !draw5.tweens[2].playing && !draw5.tweens[3].playing && !draw5.tweens[4].playing

  && draw1.start();
}, false);