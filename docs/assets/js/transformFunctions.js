
/* TRANSFORMS EXAMPLES */
var translateExamples = document.getElementById('translate-examples'),
    translateBtn = translateExamples.querySelector('.btn'),
    tr2d = translateExamples.getElementsByTagName('div')[0],
    trx = translateExamples.getElementsByTagName('div')[1],
    trry = translateExamples.getElementsByTagName('div')[2],
    trz = translateExamples.getElementsByTagName('div')[3],
    tr2dTween = KUTE.to(tr2d, {translate:[170,170]}, {easing:'easingElasticOut', yoyo:true, repeat: 1, duration:1500}),
    trxTween = KUTE.to(trx, {translateX:-170}, {easing:'easingElasticOut', yoyo:true, repeat: 1, duration:1500}),
    trryTween = KUTE.to(trry, {translate3d:[0,170,0]}, {easing:'easingElasticOut', yoyo:true, repeat: 1, duration:1500}),
    trzTween = KUTE.to(trz, {perspective:200, translate3d:[0,0,-100]}, {easing:'easingElasticOut', yoyo:true, repeat: 1, duration:1500});

translateBtn.addEventListener('click', function(){
    !tr2dTween.playing && tr2dTween.start();
    !trxTween.playing && trxTween.start();
    !trryTween.playing && trryTween.start();
    !trzTween.playing && trzTween.start();
}, false);

var rotExamples = document.getElementById('rotExamples'),
    rotBtn = rotExamples.querySelector('.btn'),
    r2d = rotExamples.querySelectorAll('div')[0],
    rx = rotExamples.querySelectorAll('div')[1],
    ry = rotExamples.querySelectorAll('div')[2],
    rz = rotExamples.querySelectorAll('div')[3],
    r2dTween = KUTE.to(r2d, {rotate:-720}, {easing:'easingCircularInOut', yoyo:true, repeat: 1, duration:1500}),
    rxTween = KUTE.to(rx, {rotateX:180}, {easing:'linear', yoyo:true, repeat: 1, duration:1500}),
    ryTween = KUTE.to(ry, {perspective:200, rotate3d:[0,-180,0],scale:1.2}, {easing:'easingCubicInOut', yoyo:true, repeat: 1, duration:1500}),
    rzTween = KUTE.to(rz, {rotateZ:360}, {easing:'easingBackOut', yoyo:true, repeat: 1, duration:1500});

rotBtn.addEventListener('click', function(){
    !r2dTween.playing && r2dTween.start();
    !rxTween.playing && rxTween.start();
    !ryTween.playing && ryTween.start();
    !rzTween.playing && rzTween.start();
}, false);

var skewExamples = document.getElementById('skewExamples'),
    skewBtn = skewExamples.querySelector('.btn'),
    sx = skewExamples.querySelectorAll('div')[0],
    sy = skewExamples.querySelectorAll('div')[1],
    sxTween = KUTE.to(sx, {skewX:-25}, {easing:'easingCircularInOut', yoyo:true, repeat: 1, duration:1500}),
    syTween = KUTE.to(sy, {skew:[0,25]}, {easing:'easingCircularInOut', yoyo:true, repeat: 1, duration:1500});
skewBtn.addEventListener('click', function(){
    !sxTween.playing && sxTween.start();
    !syTween.playing && syTween.start();
}, false);

var mixTransforms = document.getElementById('mixTransforms'),
    mixBtn = mixTransforms.querySelector('.btn'),
    mt1 = mixTransforms.querySelectorAll('div')[0],
    mt2 = mixTransforms.querySelectorAll('div')[1],
    // pp = KUTE.Util.trueProperty('perspective'),
    // tfp = KUTE.Util.trueProperty('transform'),
    // tfo = KUTE.Util.trueProperty('transformOrigin'),
    mt1Tween = KUTE.to(mt1, {perspective:200,translateX:300,rotateX:360,rotateY:15,rotateZ:5}, { easing:'easingCubicInOut', yoyo:true, repeat: 1, duration:1500}),
    mt2Tween = KUTE.to(mt2, {translateX:300,rotateX:360,rotateY:15,rotateZ:5}, { easing:'easingCubicInOut', yoyo:true, repeat: 1, duration:1500});

mixBtn.addEventListener('click', function(){
    !mt1Tween.playing && mt1Tween.start();
    !mt2Tween.playing && mt2Tween.start();
}, false);

/* TRANSFORMS EXAMPLES */


/*  CHAINED TWEENS EXAMPLE  */
var chainedTweens = document.getElementById('chainedTweens'),
	el1 = chainedTweens.querySelectorAll('.example-item')[0],
	el2 = chainedTweens.querySelectorAll('.example-item')[1],
	el3 = chainedTweens.querySelectorAll('.example-item')[2],
	el4 = chainedTweens.querySelectorAll('.example-item')[3],
	ctb = chainedTweens.querySelector('.btn');

// built the tween objects for element1
var tween11 = KUTE.fromTo(el1, { perspective:400,translateX:0, rotateX: 0}, {perspective:400,translateX:150, rotateX: 25}, {duration: 2000});
var tween12 = KUTE.fromTo(el1, { perspective:400,translateY:0, rotateY: 0}, {perspective:400,translateY:20, rotateY: 15}, {duration: 2000});
var tween13 = KUTE.fromTo(el1, { perspective:400,translate3d:[150,20,0], rotate3d:[25,15,0]}, {perspective:400,translate3d:[0,0,0], rotate3d:[0,0,0]}, {duration: 3000});

// chain tweens
try {
    tween11.chain(tween12);
    tween12.chain(tween13);
} catch(e) {
    console.warn(e+". TweenBase doesn\'t support chain method")
}

// built the tween objects for element2
var tween21 = KUTE.fromTo(el2, { perspective:400,translateX:0, translateY:0, rotateX: 0, rotateY:0 }, {perspective:400,translateX:150, translateY:0, rotateX: 25, rotateY:0}, {duration: 2000});
var tween22 = KUTE.fromTo(el2, { perspective:400,translateX:150, translateY:0, rotateX: 25, rotateY: 0}, {perspective:400,translateX:150, translateY:20, rotateX: 25, rotateY: 15}, {duration: 2000});
var tween23 = KUTE.fromTo(el2, { perspective:400,translate3d:[150,20,0], rotateX: 25, rotateY:15}, {perspective:400,translate3d:[0,0,0], rotateX: 0, rotateY:0}, {duration: 3000});

// chain tweens
try{
    tween21.chain(tween22);
    tween22.chain(tween23);
}catch(e){
    console.warn(e+". TweenBase doesn\'t support chain method")
}

// built the tween objects for element3
var tween31 = KUTE.to(el3,{ perspective:400,translateX:150, rotateX:25}, {duration: 2000});
var tween32 = KUTE.to(el3,{ perspective:400,translateX:150,translateY:20, rotateY:15}, {duration: 2000});
var tween33 = KUTE.to(el3,{ perspective:400,translateX:0, translateY:0, rotateX: 0, rotateY:0}, {duration: 3000});

// chain tweens
try{
  tween31.chain(tween32); 
  tween32.chain(tween33);
}catch(e){
  console.warn(e+". TweenBase doesn\'t support chain method")
}

// built the tween objects for element4
var tween41 = KUTE.to(el4,{ perspective:400, translate3d:[150,0,0], rotate3d: [25,0,0]}, {duration: 2000});
var tween42 = KUTE.to(el4,{ perspective:400, translate3d:[150,20,0], rotate3d:[25,15,0]}, {duration: 2000});
var tween43 = KUTE.to(el4,{ perspective:400, translate3d:[0,0,0], rotate3d: [0,0,0]}, {duration: 3000});

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