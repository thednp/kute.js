
/*  MATRIX TRANSFORMS EXAMPLES */
/* using parent perspective */
var matrixExamples = document.getElementById('matrix-examples'),
    matrixBtn = matrixExamples.querySelector('.btn'),
    mx1 = matrixExamples.getElementsByTagName('div')[0],
    mx2 = matrixExamples.getElementsByTagName('div')[1],
    mx3 = matrixExamples.getElementsByTagName('div')[2],
    mx4 = matrixExamples.getElementsByTagName('div')[3],
    mx1Tween = KUTE.to(mx1, {transform: { translate3d:[-50,-50,-50]} }, {easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500}),
    mx2Tween = KUTE.to(mx2, {transform: { perspective: 100, translate3d:[-50,-50,-50], rotateX:180 } }, {easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500}),
    mx3Tween = KUTE.to(mx3, {transform: { translate3d:[-50,-50,-50], skew:[-15,-15] } }, { easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500}), // matrix(1, 45, 45, 1, 0, -170)    
    mx4Tween = KUTE.to(mx4, {transform: { translate3d:[-50,-50,-50], rotate3d:[0,-360,0], scaleX: 0.5 } }, { easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500});

matrixBtn.addEventListener('click', function(){
    !mx1Tween.playing && mx1Tween.start();
    !mx2Tween.playing && mx2Tween.start();
    !mx3Tween.playing && mx3Tween.start();
    !mx4Tween.playing && mx4Tween.start();
}, false);


/*  CHAINED TWEENS EXAMPLE  */
var chainedTweens = document.getElementById('chainedTweens'),
	el1 = chainedTweens.querySelectorAll('.example-item')[0],
	el2 = chainedTweens.querySelectorAll('.example-item')[1],
	el3 = chainedTweens.querySelectorAll('.example-item')[2],
	el4 = chainedTweens.querySelectorAll('.example-item')[3],
	ctb = chainedTweens.querySelector('.btn');

// built the tween objects for element1
var tween11 = KUTE.fromTo(el1, { transform: {perspective:400,translateX:0, rotateX: 0}}, {transform: {perspective:400,translateX:150, rotateX: 25}}, {duration: 2000});
var tween12 = KUTE.fromTo(el1, { transform: {perspective:400,translateY:0, rotateY: 0}}, {transform: {perspective:400,translateY:20, rotateY: 15}}, {duration: 2000});
var tween13 = KUTE.fromTo(el1, { transform: {perspective:400,translate3d:[150,20,0], rotate3d:[25,15,0]}}, {transform: {perspective:400,translate3d:[0,0,0], rotate3d:[0,0,0]}}, {duration: 3000});

// chain tweens
try {
  tween11.chain(tween12);
  tween12.chain(tween13);
} catch(e) {
  console.warn(e+". TweenBase doesn\'t support chain method")
}

// built the tween objects for element2
var tween21 = KUTE.fromTo(el2, { transform: {perspective:400,translateX:0, translateY:0, rotateX: 0, rotateY:0 }}, {transform: {perspective:400,translateX:150, translateY:0, rotateX: 25, rotateY:0}}, {duration: 2000});
var tween22 = KUTE.fromTo(el2, { transform: {perspective:400,translateX:150, translateY:0, rotateX: 25, rotateY: 0}}, {transform: {perspective:400,translateX:150, translateY:20, rotateX: 25, rotateY: 15}}, {duration: 2000});
var tween23 = KUTE.fromTo(el2, { transform: {perspective:400,translate3d:[150,20,0], rotateX: 25, rotateY:15}}, {transform: {perspective:400,translate3d:[0,0,0], rotateX: 0, rotateY:0}}, {duration: 3000});

// chain tweens
try{
  tween21.chain(tween22);
  tween22.chain(tween23);
}catch(e){
  console.warn(e+". TweenBase doesn\'t support chain method")
}

// built the tween objects for element3
var tween31 = KUTE.to(el3,{ transform: {perspective:400,translateX:150, rotateX:25}}, {duration: 2000});
var tween32 = KUTE.to(el3,{ transform: {perspective:400,translateX:150,translateY:20, rotateY:15}}, {duration: 2000});
var tween33 = KUTE.to(el3,{ transform: {perspective:400,translateX:0, translateY:0, rotateX: 0, rotateY:0}}, {duration: 3000});

// chain tweens
try{
  tween31.chain(tween32); 
  tween32.chain(tween33);
}catch(e){
  console.warn(e+". TweenBase doesn\'t support chain method")
}

// built the tween objects for element4
var tween41 = KUTE.to(el4,{ transform: {perspective:400, translate3d:[150,0,0], rotate3d: [25,0,0]}}, {duration: 2000});
var tween42 = KUTE.to(el4,{ transform: {perspective:400, translate3d:[150,20,0], rotate3d:[25,15,0]}}, {duration: 2000});
var tween43 = KUTE.to(el4,{ transform: {perspective:400, translate3d:[0,0,0], rotate3d: [0,0,0]}}, {duration: 3000});

// chain tweens
try{
  tween41.chain(tween42); 
  tween42.chain(tween43);
}catch(e){
  console.warn(e+". TweenBase doesn\'t support chain method")
}


ctb.addEventListener('click',function(e){
	e.preventDefault();
	!tween11.playing && !tween12.playing && !tween13.playing && tween11.start(); 
  !tween21.playing && !tween22.playing && !tween23.playing && tween21.start(); 
  !tween31.playing && !tween32.playing && !tween33.playing && tween31.start();
  !tween41.playing && !tween42.playing && !tween43.playing && tween41.start();
},false);
/*  CHAINED TWEENS EXAMPLE  */

