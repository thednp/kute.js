
/*  CLIP EXAMPLE  */
var clipExample = document.getElementById('clip'),
	clipElement = clipExample.querySelector('.example-box'),
	clpbtn = clipExample.querySelector('.btn');

var clp1 = KUTE.to(clipElement, {clip: [0,20,150,0]}, {duration:500, easing: 'easingCubicOut'});
var clp2 = KUTE.to(clipElement, {clip: [0,150,150,130]}, {duration:600, easing: 'easingCubicOut'});
var clp3 = KUTE.to(clipElement, {clip: [0,150,20,0]}, {duration:800, easing: 'easingCubicOut'});
var clp4 = KUTE.to(clipElement, {clip: [0,150,150,0]}, {duration:1200, easing: 'easingExponentialInOut'});

//chain some clps
try{
	clp1.chain(clp2);
	clp2.chain(clp3);
	clp3.chain(clp4);
}catch(e){
	console.error(e+". TweenBase doesn\'t support chain method")
}

clpbtn.addEventListener('click', function(e){
	e.preventDefault();	
	!clp1.playing && !clp2.playing && !clp3.playing && !clp4.playing && clp1.start();
},false);
/*  CLIP EXAMPLE  */
