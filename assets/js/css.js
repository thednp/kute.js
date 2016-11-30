// some regular checking
var isIE = (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null) ? parseFloat( RegExp.$1 ) : false,
	isIE8 = isIE === 8,
	isIE9 = isIE === 9;


/* RADIUS EXAMPLES */
var radiusBtn = document.getElementById('radiusBtn');
var allRadius = KUTE.to('#allRadius',{borderRadius:80},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var tlRadius = KUTE.to('#tlRadius',{borderTopLeftRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var trRadius = KUTE.to('#trRadius',{borderTopRightRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var blRadius = KUTE.to('#blRadius',{borderBottomLeftRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var brRadius = KUTE.to('#brRadius',{borderBottomRightRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
radiusBtn.addEventListener('click',function(){
    if (!allRadius.playing) { allRadius.start(); tlRadius.start(); trRadius.start(); blRadius.start(); brRadius.start(); }
}, false);
/* RADIUS EXAMPLES */


/*  BOX MODEL EXAMPLE  */
var boxModel = document.getElementById('boxModel'),
	btb = boxModel.querySelector('.btn'),
	box = boxModel.querySelector('.example-box-model');

// built the tween objects
var bm1 = KUTE.to(box,{marginTop:50},{ yoyo: true, repeat: 1, duration: 1500, update: onMarginTop});
var bm2 = KUTE.to(box,{marginBottom:50},{ yoyo: true, repeat: 1, duration: 1500, update: onMarginBottom});
var bm3 = KUTE.to(box,{paddingTop:15},{ yoyo: true, repeat: 1, duration: 1500, update: onPadding});
var bm4 = KUTE.to(box,{marginTop:50,marginLeft:50,marginBottom:70},{ yoyo: true, repeat: 1, duration: 1500, update: onMargin, complete: onComplete});

// chain the bms
bm1.chain(bm2);
bm2.chain(bm3);
bm3.chain(bm4);


//callback functions
function onMarginTop() { box.innerHTML = parseInt(box.style.marginTop)+'px'+'<br>MARGIN'; }
function onMarginBottom() { box.innerHTML = 'MARGIN<br>'+parseInt(box.style.marginBottom)+'px'; }
function onPadding() { box.innerHTML = parseInt(box.style.paddingTop)+'px<br>PADDING'; }
function onMargin() { box.innerHTML = 'MARGIN<br>'+parseInt(box.style.marginTop)+'px'; }

function onComplete() { box.innerHTML = 'BOX<br>&nbsp;MODEL&nbsp;'; }

btb.addEventListener('click', function(e){
	e.preventDefault();
	!bm1.playing && !bm2.playing && !bm3.playing && !bm4.playing && bm1.start();
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
heading.innerHTML = '<span style="filter: alpha(opacity:0)">' + chars.join('</span><span>') + '</span>';
var charsObject = heading.getElementsByTagName('SPAN'), l = charsObject.length;


// built the tween objects
var buttonTween = KUTE.fromTo(button, 
		{width: 150, opacity:0, height: 70, lineHeight:70, fontSize: 40}, 
		{width: 100, opacity:1, height: 35, lineHeight:35, fontSize: 20}),
	headingTween = KUTE.fromTo(heading, {opacity:0}, {opacity:1}),
	tps = KUTE.allFromTo(charsObject, 
        { height: 50, fontSize:80, letterSpacing: 20}, 
        { height: 35, fontSize:50, letterSpacing: 0}, 
        { offset: 250, duration: 500, easing: 'easingCubicOut'});

	tps.tweens[tps.tweens.length-1].chain(buttonTween);

tbt.addEventListener('click', function(e){
	e.preventDefault();
    if (!headingTween.playing && !tps.playing ) {
        if (isIE8) { button.style.filter ="alpha(opacity=0)"; heading.style.filter ="alpha(opacity=0)"; } else { button.style.opacity = ''; heading.style.opacity = ''; }
		headingTween.start();
		tps.start();
    }
},false);
/*  TEXT PROPERTIES EXAMPLE  */


/*  COLORS EXAMPLE  */
var colBox = document.getElementById('colBox'),
	colBoxElement = colBox.querySelector('.example-box'),
	colbtn = colBox.querySelector('.btn');	

var colTween1 = KUTE.to(colBoxElement, {borderColor: '#069'}, {duration: 1000});
var colTween2 = KUTE.to(colBoxElement, {borderTopColor: '#9C27B0'}, {duration: 1000});
var colTween3 = KUTE.to(colBoxElement, {borderRightColor: '#9C27B0'}, {duration: 1000});
var colTween4 = KUTE.to(colBoxElement, {borderBottomColor: '#9C27B0'}, {duration: 1000});
var colTween5 = KUTE.to(colBoxElement, {borderLeftColor: '#9C27B0'}, {duration: 1000});
var colTween6 = KUTE.to(colBoxElement, {outlineColor: '#9C27B0'}, {duration: 1000, repeat: 1, yoyo: true});

colTween1.chain(colTween2);
colTween2.chain(colTween3);
colTween3.chain(colTween4);
colTween4.chain(colTween5);
colTween5.chain(colTween6);


colbtn.addEventListener('click', function(e){
	e.preventDefault();
	!colTween1.playing && !colTween2.playing && !colTween3.playing && !colTween4.playing && !colTween5.playing && !colTween6.playing && colTween1.start();
},false);
/*  COLORS EXAMPLE  */


/*  CLIP EXAMPLE  */
var clipExample = document.getElementById('clip'),
	clipElement = clipExample.querySelector('.example-box'),
	clpbtn = clipExample.querySelector('.btn');

var clp1 = KUTE.to(clipElement, {clip: [0,20,150,0]}, {duration:500, easing: 'easingCubicOut'});
var clp2 = KUTE.to(clipElement, {clip: [0,150,150,130]}, {duration:600, easing: 'easingCubicOut'});
var clp3 = KUTE.to(clipElement, {clip: [0,150,20,0]}, {duration:800, easing: 'easingCubicOut'});
var clp4 = KUTE.to(clipElement, {clip: [0,150,150,0]}, {duration:1200, easing: 'easingExponentialInOut'});

//chain some clps
clp1.chain(clp2);
clp2.chain(clp3);
clp3.chain(clp4);

clpbtn.addEventListener('click', function(e){
	e.preventDefault();	
	!clp1.playing && !clp2.playing && !clp3.playing && !clp4.playing && clp1.start();
},false);
/*  CLIP EXAMPLE  */


/*  BACKGROUND POSITION EXAMPLE  */
var bgPos = document.getElementById('bgPos'),
	bgBox = bgPos.querySelector('.example-box'),
	bgb = bgPos.querySelector('.btn'),	
	bpTween = KUTE.to(bgBox, {backgroundPosition: ['0%','50%']}, { yoyo: true, repeat: 1, duration: 1500, easing: 'easingCubicOut'});
	
bgb.addEventListener('click', function(e){
	e.preventDefault();
	!bpTween.playing && bpTween.start();
},false);	
/*  BACKGROUND POSITION EXAMPLE  */
