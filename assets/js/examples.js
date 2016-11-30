// some regular checking
var isIE = (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null) ? parseFloat( RegExp.$1 ) : false,
	isIE8 = isIE === 8,
	isIE9 = isIE === 9;


/* TRANSFORMS EXAMPLES */
var translateExamples = document.getElementById('translate-examples'),
    translateBtn = translateExamples.querySelector('.btn'),
    tr2d = translateExamples.getElementsByTagName('div')[0],
    trx = translateExamples.getElementsByTagName('div')[1],
    trry = translateExamples.getElementsByTagName('div')[2],
    trz = translateExamples.getElementsByTagName('div')[3],
    tr2dTween = KUTE.to(tr2d, {translate:[170,0]}, {easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500}),
    trxTween = KUTE.to(trx, {translateX:-170}, {easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500}),
    trryTween = KUTE.to(trry, {translate3d:[0,170,0]}, {easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500}),
    trzTween = KUTE.to(trz, {translate3d:[0,0,-100]}, {perspective:200, easing:'easingCubicOut', yoyo:true, repeat: 1, duration:1500});
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
    ryTween = KUTE.to(ry, {rotateY:-180,scale:1.5}, {perspective:200, easing:'easingCubicInOut', yoyo:true, repeat: 1, duration:1500}),
    rzTween = KUTE.to(rz, {rotateZ:360}, {easing:'easingBounceOut', yoyo:true, repeat: 1, duration:1500});
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
    syTween = KUTE.to(sy, {skewY:25}, {easing:'easingCircularInOut', yoyo:true, repeat: 1, duration:1500});
skewBtn.addEventListener('click', function(){
    !sxTween.playing && sxTween.start();
    !syTween.playing && syTween.start();
}, false);

var mixTransforms = document.getElementById('mixTransforms'),
    skewBtn = mixTransforms.querySelector('.btn'),
    mt1 = mixTransforms.querySelectorAll('div')[0],
    mt2 = mixTransforms.querySelectorAll('div')[1],
    pp = KUTE.property('perspective'),
    tfp = KUTE.property('transform'),
    tfo = KUTE.property('transformOrigin'),
    mt1Tween = KUTE.to(mt1, {translateX:200,rotateX:360,rotateY:15,rotateZ:5}, { perspective:400, easing:'easingCubicInOut', yoyo:true, repeat: 1, duration:1500}),
    mt2Tween = KUTE.to(mt2, {translateX:-200,rotateX:360,rotateY:15,rotateZ:5}, { easing:'easingCubicInOut', yoyo:true, repeat: 1, duration:1500});
    
mt1.style[tfo] = '50% 50% 0px'; mt1.style[tfp] = 'perspective(400px) translateX(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
mt2.style[tfo] = '50% 50% -200px'; mt2.parentNode.style[pp] = '400px';
skewBtn.addEventListener('click', function(){
    !mt1Tween.playing && mt1Tween.start();
    !mt2Tween.playing && mt2Tween.start();
}, false);



/* TRANSFORMS EXAMPLES */


/*  CHAINED TWEENS EXAMPLE  */
var chainedTweens = document.getElementById('chainedTweens'),
	el1 = chainedTweens.querySelectorAll('.example-item')[0],
	el2 = chainedTweens.querySelectorAll('.example-item')[1],
	el3 = chainedTweens.querySelectorAll('.example-item')[2],
	ctb = chainedTweens.querySelector('.btn');

// built the tween objects for element1
var tween11 = KUTE.fromTo(el1, {translateX:0, rotateX: 0}, {translateX:100, rotateX: 25}, {perspective:100, duration: 2000});
var tween12 = KUTE.fromTo(el1, {translateY:0, rotateY: 0}, {translateY:20, rotateY: 15}, {perspective:100, duration: 2000});
var tween13 = KUTE.fromTo(el1, {translate3d:[100,20,0], rotateX: 25, rotateY:15}, {translate3d:[0,0,0], rotateX: 0, rotateY:0}, {perspective:100, duration: 2000});

// chain tweens
tween11.chain(tween12);
tween12.chain(tween13);

// built the tween objects for element2
var tween21 = KUTE.fromTo(el2, {translateX:0, translateY:0, rotateX: 0, rotateY:0 }, {translateX:150, translateY:0, rotateX: 25, rotateY:0}, {perspective:100, duration: 2000});
var tween22 = KUTE.fromTo(el2, {translateX:150, translateY:0, rotateX: 25, rotateY: 0}, {translateX:150, translateY:20, rotateX: 25, rotateY: 15}, {perspective:100, duration: 2000});
var tween23 = KUTE.fromTo(el2, {translate3d:[150,20,0], rotateX: 25, rotateY:15}, {translate3d:[0,0,0], rotateX: 0, rotateY:0}, {perspective:100, duration: 2000});

// chain tweens
tween21.chain(tween22);
tween22.chain(tween23);

// built the tween objects for element3
var tween31 = KUTE.to(el3,{translateX:200, rotateX: 25}, {perspective:100, duration: 2000});
var tween32 = KUTE.to(el3,{translate3d:[200,20,0], rotateY: 15}, {perspective:100, duration: 2000});
var tween33 = KUTE.to(el3,{translate3d:[0,0,0], rotateX: 0, rotateY:0}, {perspective:100, duration: 2000});

// chain tweens
tween31.chain(tween32); tween32.chain(tween33);

ctb.addEventListener('click',function(e){
	e.preventDefault();
	!tween11.playing && !tween12.playing && !tween13.playing && tween11.start(); 
    !tween21.playing && !tween22.playing && !tween23.playing && tween21.start(); 
    !tween31.playing && !tween32.playing && !tween33.playing && tween31.start();
},false);
/*  CHAINED TWEENS EXAMPLE  */


/*  BOX MODEL EXAMPLE  */
var boxModel = document.getElementById('boxModel'),
	btb = boxModel.querySelector('.btn'),
	box = boxModel.querySelector('.example-box');

// built the tween objects
var bm1 = KUTE.to(box,{width:250},{ yoyo: true, repeat: 1, duration: 1500, update: onWidth});
var bm2 = KUTE.to(box,{height:250},{ yoyo: true, repeat: 1, duration: 1500, update: onHeight});
var bm3 = KUTE.to(box,{left:250},{ yoyo: true, repeat: 1, duration: 1500, update: onLeft});
var bm4 = KUTE.to(box,{top:-250},{ yoyo: true, repeat: 1, duration: 1500, update: onTop, complete: onComplete});

// chain the bms
bm1.chain(bm2);
bm2.chain(bm3);
bm3.chain(bm4);


//callback functions
function onWidth() { box.innerHTML = 'WIDTH<br>'+parseInt(box.offsetWidth)+'px'; }
function onHeight() { box.innerHTML = 'HEIGHT<br>'+parseInt(box.offsetHeight)+'px'; }
function onLeft() { box.innerHTML = 'LEFT<br>'+parseInt(box.offsetLeft)+'px'; }
function onTop() { box.innerHTML = 'TOP<br>'+parseInt(box.offsetTop)+'px'; }

function onComplete() { box.innerHTML = 'BOX<br>MODEL'; }

btb.addEventListener('click', function(e){
	e.preventDefault();
	!bm1.playing && !bm2.playing && !bm3.playing && !bm4.playing && bm1.start();
},false);
/*  BOX MODEL EXAMPLE  */


/*  COLORS EXAMPLE  */
var colBox = document.getElementById('colBox'),
	colBoxElement = colBox.querySelector('.example-box'),
	colbtn = colBox.querySelector('.btn');	

var colTween1 = KUTE.to(colBoxElement, {color: '#9C27B0'}, {duration: 1000});
var colTween2 = KUTE.to(colBoxElement, {backgroundColor: '#069'}, {duration: 1000, keepHex: true});
var colTween3 = KUTE.to(colBoxElement, {color: '#fff'}, {duration: 1000});
var colTween4 = KUTE.to(colBoxElement, {backgroundColor: '#9C27B0'}, {duration: 1000, keepHex: true});

colTween1.chain(colTween2);
colTween2.chain(colTween3);
colTween3.chain(colTween4);

colbtn.addEventListener('click', function(e){
	e.preventDefault();
	!colTween1.playing && !colTween2.playing && !colTween3.playing && !colTween4.playing && colTween1.start();
},false);
/*  COLORS EXAMPLE  */


/* CROSS BROWSER EXAMPLE */
// grab an HTML element to build a tween object for it 
var element = document.getElementById("myElement");

// create values and options objects
var startValues = {}, endValues = {}, options = {};

// here we define properties that are commonly supported
startValues.backgroundColor = 'rgba(255,214,38,1)'; endValues.backgroundColor = 'rgba(236,30,113,0.1)';

// here we define the properties according to the target browsers
if (isIE8) { // or any other browser that doesn"t support transforms		
    startValues.opacity = 1; endValues.opacity = 0.1;
	startValues.left = 0; endValues.left = 250;
    startValues.backgroundColor = '#ffd626'; endValues.backgroundColor = '#ec1e71';
} else if (isIE9) { // or any other browser that only support 2d transforms
	startValues.translate = 0; endValues.translate = 250; // 2d translate on X axis	
	startValues.rotate = 0; endValues.rotate = 180; // 2d rotation on Z axis	
	startValues.scale = 1; endValues.scale = 1.5; // 2d scale
} else { // most modern browsers
	startValues.translate3d = [0,0,0]; endValues.translate3d = [250,0,0]; //3d translation on X axis					
	startValues.rotateZ = 0; endValues.rotateZ = 180; // 3d rotation on Z axis	
	startValues.rotateX = 0; endValues.rotateX = -70; // 3d rotation on X axis					
	startValues.scale = 1; endValues.scale = 1.5; // 2d scale	
	options.perspective = 600; // 3d transform option
}

// common tween options
options.easing = "easingSinusoidalInOut";
options.yoyo = true;
options.repeat = 1;
options.duration = 2500;

// the cached object
var myTween = KUTE.fromTo(element, startValues, endValues, options);

// trigger buttons
var startButton = document.getElementById('startButton'),
	stopButton = document.getElementById('stopButton'),
	playPauseButton = document.getElementById('playPauseButton');

// add handlers for the trigger buttons
startButton.addEventListener('click', function(e){
	e.preventDefault();
	if (!myTween.playing) { myTween.start(); }
}, false);
stopButton.addEventListener('click', function(e){
	e.preventDefault();
	if (myTween.playing) { myTween.stop(); }
}, false);
playPauseButton.addEventListener('click', function(e){
	e.preventDefault();	
	if (!myTween.paused && myTween.playing) { 
		myTween.pause(); playPauseButton.innerHTML = 'Resume';
		playPauseButton.className = playPauseButton.className.replace('btn-orange','btn-olive');
	} else { 
		myTween.resume(); 
		playPauseButton.innerHTML = 'Pause';
		playPauseButton.className = playPauseButton.className.replace('btn-olive','btn-orange');
	}  
}, false);

/* CROSS BROWSER EXAMPLE */


/* MULTI TWEENS EXAMPLE */
var tweenMulti = KUTE.allFromTo('.example-multi',
    {translate:[0,0], rotate: 0}, 
    {translate:[0,-150], rotate: 360}, 
    {transformOrigin: '10% 10%', offset: 300, duration: 1000, easing: 'easingCubicOut', repeat: 1, repeatDelay: 1000, yoyo: true}
);
function startMultiTween() {
    !tweenMulti.tweens[0].playing && !tweenMulti.tweens[tweenMulti.tweens.length-1].playing && tweenMulti.start();
}
/* MULTI TWEENS EXAMPLE */


/* EASINGS EXAMPLE */
var esProp1 = isIE && isIE < 9 ? { left:0 } : { translate: 0},
    esProp2 = isIE && isIE < 9 ? { left:250 } : { translate: 250},
    tweenEasingElements = document.querySelectorAll('.easing-example'), 
    easings = document.getElementById('easings'),
    startEasingTween = document.getElementById('startEasingTween'),
    easingSelectButton = document.getElementById('easingSelectButton'),
    tweenEasing1 = KUTE.fromTo(tweenEasingElements[0], esProp1, esProp2, 
        { duration: 1000, easing: 'linear', repeat: 1, yoyo: true}),
    tweenEasing2 = KUTE.fromTo(tweenEasingElements[1], esProp1, esProp2, 
        { duration: 1000, easing: 'linear', repeat: 1, yoyo: true});

easings.addEventListener('click',function(e){
    if (!e.target.className){
        var es = e.target.innerHTML, g = window;
        easingSelectButton.innerHTML = es;
        tweenEasingElements[1].innerHTML = es;
      tweenEasing2.options.easing = KUTE.processEasing(es) || KUTE.processEasing('linear'); 
    }
}, false);

startEasingTween.addEventListener('click', function(e) {
    e.preventDefault();
    !tweenEasing1.playing && tweenEasing1.start();
    !tweenEasing2.playing && tweenEasing2.start();
}, false);
/* EASINGS EXAMPLE */