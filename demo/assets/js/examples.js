// some regular checking
var isIE = (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null) ? parseFloat( RegExp.$1 ) : false,
	isIE8 = isIE === 8,
	isIE9 = isIE === 9;
		


/* TRANSFORMS EXAMPLES */
var featurettes = document.querySelectorAll('.featurettes'), fl = featurettes.length;

for ( var i=0; i<fl; i++){
	var example = featurettes[i];
	if ( example.querySelector('[data-]') !== undefined ) {
		var items = example.querySelectorAll('.example-item'), bl = items.length, tweens = [];
		for (var j=0;j<bl;j++) {
			var data = processData(items[j]), 
				pp = data.options.perspective, 
				ppp = data.options.parentPerspective,
				to = data.properties, fr = getFrom(data.properties,items[j]),
				tween1 = KUTE.fromTo(items[j], fr, to, {easing: 'easingCubicInOut', yoyo: true, repeat: 1, duration: 1500, perspective: pp, parentPerspective: ppp} );
			tweens.push(tween1);
		}
		addListener(example,tweens);	
	}
}

function addListener(example,tweens){
	example.querySelector('.btn').addEventListener('click',function(e){
		e.preventDefault();
		for (var i=0;i<tweens.length;i++) {				
			tweens[i].start();			
		}
	},false);	
}

function getFrom(to,el) {
	var start = {}, css = window.getComputedStyle(el);
	for (var p in to) {
		if (p==='translate3d') { 
			start[p] = [0,0,0];
		} else if (p==='color' || p==='backgroundColor' || p==='border-color') {
			start[p] = css[p] || 'rgba(0,0,0,0)';
		} else if ( p === 'backgroundPosition' ){
			start[p] = [50,50];
		} else if ( p === 'clip' ){
			start[p] = css[p] || [0,0,0,0];
		} else if ( p === 'borderRadius' ){
			start[p] = '5px';							
		} else if ( p === 'scale' || p === 'opacity' ){
			start[p] = 1;							
		} else {
			start[p] = css[p] || 0;
		}
	} 
	return start;
}

//make a sort of data-api animation
function processData(el){
	var options = {}, properties = {}, l=0, attr=el.attributes;
	for (l;l<attr.length;l++){
		if (/^data-/.test(attr[l].nodeName)) {
			if (/option/.test(attr[l].nodeName)) {
				var op = attr[l].nodeName.replace('data-option-','').replace(/\s/,'').split('-');
				for (var i=0;i<op.length;i++) { 
					if (i>0 && op[i]!==undefined) { 
						 op[i] = op[i].charAt(0).toUpperCase() + op[i].slice(1);
					}
				}
				op = op.join('');
				options[op] = attr[l].value;			
			} else if (/property/.test(attr[l].nodeName)) {
				var pp = attr[l].nodeName.replace('data-property-','').replace(/\s/,'').split('-');
				for (var j=0;j<pp.length;j++) {
					if (j>0 && pp[j]!==undefined) {  
						pp[j] = pp[j].charAt(0).toUpperCase() + pp[j].slice(1);
					}
				}	
				pp = pp.join('');
				properties[pp] = pp === 'translate3d' || pp === 'translate' ? attr[l].value.replace(/\[|\]/g,'').split(',') : attr[l].value;
			}
		}		
	}
	return {options: options, properties: properties};
}
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
tween31.chain(tween32);
tween32.chain(tween33);

ctb.addEventListener('click',function(e){
	e.preventDefault();
	tween11.start(); tween21.start(); tween31.start();
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
var bm4 = KUTE.to(box,{top:-250},{ yoyo: true, repeat: 1, duration: 1500, update: onTop});
var bm5 = KUTE.fromTo(box,{padding:0},{padding:20},{ yoyo: true, repeat: 1, duration: 1500, update: onPadding});
var bm6 = KUTE.to(box,{marginTop:50,marginLeft:50,marginBottom:70},{ yoyo: true, repeat: 1, duration: 1500, update: onMargin, complete: onComplete});

// chain the bms
bm1.chain(bm2);
bm2.chain(bm3);
bm3.chain(bm4);
bm4.chain(bm5);
bm5.chain(bm6);

//callback functions
function onWidth() { var css = box.currentStyle || window.getComputedStyle(box); box.innerHTML = 'WIDTH<br>'+parseInt(css.width)+'px'; }
function onHeight() { var css = box.currentStyle || window.getComputedStyle(box); box.innerHTML = 'HEIGHT<br>'+parseInt(css.height)+'px'; }
function onLeft() { var css = box.currentStyle || window.getComputedStyle(box); box.innerHTML = 'LEFT<br>'+parseInt(css.left)+'px'; }
function onTop() { var css = box.currentStyle || window.getComputedStyle(box); box.innerHTML = 'TOP<br>'+parseInt(css.top)+'px'; }
function onPadding() { var css = box.currentStyle || window.getComputedStyle(box); box.innerHTML = 'PADDING<br>'+(parseInt(css.padding)+'px')||'auto'; }
function onMargin() { var css = box.currentStyle || window.getComputedStyle(box); box.innerHTML = 'MARGIN<br>'+parseInt(css.marginTop)+'px'; }
function onComplete() { box.innerHTML = 'BOX<br>MODEL'; btb.style.display='inline'; }

btb.addEventListener('click', function(e){
	e.preventDefault();
	bm1.start();
	btb.style.display='none';
},false);
/*  BOX MODEL EXAMPLE  */


/*  TEXT PROPERTIES EXAMPLE  */
var textProperties = document.getElementById('textProperties'),
	heading = textProperties.querySelector('h1'),
	button = textProperties.querySelectorAll('.btn')[0],                                            
	tbt = textProperties.querySelectorAll('.btn')[1],                                           

	// let's split the heading text by character
	chars = heading.innerHTML.split('');

// wrap the splits into spans and build an object with these spans 
heading.innerHTML = '<span>' + chars.join('</span><span>') + '</span>';
var charsObject = heading.getElementsByTagName('SPAN'), l = charsObject.length;


// built the tween objects
var tp1 = KUTE.fromTo(
    button, 
    {width: 150, opacity:0, height: 70, lineHeight:70, fontSize: 40}, 
    {width: 100, opacity:1, height: 35, lineHeight:35, fontSize: 20});

function runHeadingAnimation() {
	for (var i=0; i<l; i++){    
		var fn = i === l-1 ? startButtonAnimation : null,
			delay = 250*i;
		
		KUTE.fromTo(charsObject[i], 
			{opacity:0, height: 50, fontSize:80, letterSpacing: 20}, 
			{opacity:1, height: 35, fontSize:50, letterSpacing: 0}, 
			{complete: fn, delay: delay, duration: 500, easing: 'easingCubicOut'}
		).start()
	
	}
	function startButtonAnimation(){
		tp1.start();
	}	
}

tbt.addEventListener('click', function(e){
	e.preventDefault();	
	for (var i=0;i<l; i++) {
		charsObject[i].style.opacity ="";
	}
	button.style.opacity = '';
	runHeadingAnimation();
},false);
/*  TEXT PROPERTIES EXAMPLE  */


/*  COLORS EXAMPLE  */
var colBox = document.getElementById('colBox'),
	colBoxElement = colBox.querySelector('.example-box'),
	colbtn = colBox.querySelector('.btn');	

var colTween1 = KUTE.to(colBoxElement, {color: '#9C27B0'}, {duration: 1000});
var colTween2 = KUTE.to(colBoxElement, {backgroundColor: '#069'}, {duration: 1000});
var colTween3 = KUTE.to(colBoxElement, {borderColor: '#069'}, {duration: 1000});
var colTween4 = KUTE.to(colBoxElement, {color: '#fff'}, {duration: 1000});
var colTween5 = KUTE.to(colBoxElement, {borderTopColor: '#9C27B0'}, {duration: 1000});
var colTween6 = KUTE.to(colBoxElement, {borderRightColor: '#9C27B0'}, {duration: 1000});
var colTween7 = KUTE.to(colBoxElement, {borderBottomColor: '#9C27B0'}, {duration: 1000});
var colTween8 = KUTE.to(colBoxElement, {borderLeftColor: '#9C27B0'}, {duration: 1000});
var colTween9 = KUTE.to(colBoxElement, {backgroundColor: '#9C27B0'}, {duration: 1000});

colTween1.chain(colTween2);
colTween2.chain(colTween3);
colTween3.chain(colTween4);
colTween4.chain(colTween5);
colTween5.chain(colTween6);
colTween6.chain(colTween7);
colTween7.chain(colTween8);
colTween8.chain(colTween9);

colbtn.addEventListener('click', function(e){
	e.preventDefault();
	colTween1.start();
},false);
/*  COLORS EXAMPLE  */


/*  CLIP EXAMPLE  */
var clipExample = document.getElementById('clip'),
	clipElement = clipExample.querySelector('.example-box'),
	clpbtn = clipExample.querySelector('.btn');	

var clp1 = KUTE.fromTo(clipElement, {clip: [0,150,150,0]}, {clip: [0,20,150,0]}, {duration:500, easing: 'easingCubicOut'});
var clp2 = KUTE.fromTo(clipElement, {clip: [0,20,150,0]}, {clip: [0,150,150,130]}, {duration:600, easing: 'easingCubicOut'});
var clp3 = KUTE.fromTo(clipElement, {clip: [0,150,150,130]}, {clip: [0,150,20,0]}, {duration:800, easing: 'easingCubicOut'});
var clp4 = KUTE.fromTo(clipElement, {clip: [0,150,20,0]}, {clip: [0,150,150,0]}, {duration:1200, easing: 'easingExponentialInOut'});

//chain some clps
clp1.chain(clp2);
clp2.chain(clp3);
clp3.chain(clp4);

clpbtn.addEventListener('click', function(e){
	e.preventDefault();	
	clp1.start();
},false);
/*  CLIP EXAMPLE  */


/*  BACKGROUND POSITION EXAMPLE  */
var bgPos = document.getElementById('bgPos'),
	bgBox = bgPos.querySelector('.example-box'),
	bgb = bgPos.querySelector('.btn'),	
	bpTween1 = KUTE.fromTo(bgBox, {backgroundPosition: ['50%','50%']}, {backgroundPosition: ['0%','50%']}, { yoyo: true, repeat: 1, duration: 1500, easing: 'easingCubicOut'});
	
bgb.addEventListener('click', function(e){
	e.preventDefault();
	bpTween1.start();
},false);	
/*  BACKGROUND POSITION EXAMPLE  */




/* CROSS BROWSER EXAMPLE */
// grab an HTML element to build a tween object for it 
var element = document.getElementById("myElement");

// create values and options objects
var startValues = {}, endValues = {}, options = {};

// here we define properties that are commonly supported
startValues.opacity = 1; endValues.opacity = 0.1;
startValues.backgroundColor = '#ffd626'; endValues.backgroundColor = '#ec1e71';

// here we define the properties according to the target browsers
if (isIE8) { // or any other browser that doesn"t support transforms		
	startValues.left = 0; endValues.left = 250;
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
    {translate:[0,-50], rotate: 360}, 
    {transformOrigin: '10% 10%', offset: 300, duration: 1000, easing: 'easingCubicOut', repeat: 1, repeatDelay: 1000, yoyo: true}
);
function startMultiTween() {
    tweenMulti.start();
}
/* MULTI TWEENS EXAMPLE */