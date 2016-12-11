// testing grounds
"use strict";

var mobileType = '',
	isMobile = {
		Windows: function() {
			var checkW = /IEMobile|Windows Mobile/i.test(navigator.userAgent);
			mobileType += checkW ? 'Windows Phones.' : '';
			return checkW;
		},
		Android: function() {
			var checkA = /Android/i.test(navigator.userAgent);
			mobileType += checkA ? 'Android Phones.' : '';
			return checkA;
		},
		BlackBerry: function() {
			var checkB = /BlackBerry/i.test(navigator.userAgent);
			mobileType += checkB ? 'BlackBerry.' : '';
			return checkB;
		},
		iOS: function() {
			var checkI = /iPhone|iPad|iPod/i.test(navigator.userAgent);
			mobileType += checkI ? 'Apple iPhone, iPad or iPod.' : '';
			return checkI;
		},
		any: function() {
			return ( isMobile.Windows() || isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() );
		}
	},
	checkMOBS = isMobile.any();

// protect phones, older / low end devices
if (document.body.offsetWidth < 1200 || checkMOBS) {
	var explain = '';
		explain += checkMOBS && mobileType !== '' ? ('For safety reasons, this page does not work with ' + mobileType) : '';
		explain += !checkMOBS && document.body.offsetWidth < 1200 && mobileType === '' ? 'For safety reasons this page does not work on your machine because it might be very old. In other cases the browser window size is not enough for the animation to work properly, so if that\'s the case, maximize the window, refresh and proceed with the tests.' : '';
	var warning = '<div style="padding: 20px;">';
		warning +='<h1 class="text-danger">Warning!</h1>';
		warning +='<p class="lead text-danger">This web page is only for high-end desktop computers.</p>';
		warning +='<p class="text-danger">We do not take any responsibility and we are not liable for any damage caused through use of this website, be it indirect, special, incidental or consequential damages to your devices.</p>';
		warning +='<p class="text-info">'+explain+'</p>';
		warning +='</div>';
	document.body.innerHTML = warning;
	throw new Error('This page is only for high-end desktop computers. ' + explain); 
}

// generate a random number within a given range
function random(min, max) {
	return Math.random() * (max - min) + min;
}

// the variables
var container = document.getElementById('container');

// vendor prefix handle for Tween.js
var transformProperty = KUTE.property('transform'), tws = [];


function complete(){
	document.getElementById('info').style.display = 'block';
	container.innerHTML = '';
	tws = [];
}

function updateLeft(){
	this.div.style['left'] = Math.floor(this.left) +'px';
}					

function updateTranslate(){
	this.div.style[transformProperty] = 'translate3d('+ Math.floor(this.x * 10) / 10 + 'px,0px,0px)';
}

function buildObjects(){
	var c = document.querySelector('[data-count]'),	e = document.querySelector('[data-engine]'), r = document.querySelector('[data-repeat]'),
		p = document.querySelector('[data-property]'),	ct = c && document.querySelector('[data-count]').getAttribute('data-count'), 
		count = ct ? parseInt(ct) : null,
		engine = e && document.querySelector('[data-engine]').getAttribute('data-engine') || null,
		repeat = r && document.querySelector('[data-repeat]').getAttribute('data-repeat') || null,
		property = p && document.querySelector('[data-property]').getAttribute('data-property') || null,
		warning = document.createElement('DIV');
		
	warning.className = 'text-warning padding lead';
	container.innerHTML = '';	
	if (count && engine && property && repeat) {
		if (engine === 'gsap') {
				document.getElementById('info').style.display = 'none';
		}
		
		createTest(count,property,engine,repeat);
		// since our engines don't do sync, we make it our own here
		if (engine==='tween'||engine==='kute') {
				document.getElementById('info').style.display = 'none';
				start();	
		}
	} else {

		if (!count && !property && !repeat && !engine){
			warning.innerHTML = 'We are missing all the settings here.';
		} else {
			warning.innerHTML = 'Now missing<br>';
			warning.innerHTML += !engine ? '- engine<br>' : ''; 
			warning.innerHTML += !property ? '- property<br>' : '';
			warning.innerHTML += !repeat ? '- repeat<br>' : ''; 
			warning.innerHTML += !count ? '- count<br>' : ''; 
		}
		
		container.appendChild(warning);
	}
}

function start() {
		var now = window.performance.now(), count = tws.length;
		for (var t =0; t<count; t++){
				tws[t].start(now+count/16)
		}
}

function createTest(count, property, engine, repeat) {
	var update;
	for (var i = 0; i < count; i++) {
		var div = document.createElement('div'),
			windowHeight = document.documentElement.clientHeight - 10,
			left = random(-200, 200),
			toLeft = random(-200, 200),
			top = Math.round(Math.random() * parseInt(windowHeight)),
			background = 'rgb('+parseInt(random(0, 255))+','+parseInt(random(0, 255))+','+parseInt(random(0, 255))+')',
			fromValues, toValues, fn = i===count-1 ? complete : null;
			repeat = parseInt(repeat);
			
		div.className = 'line';
		div.style.top =  top + 'px';
		div.style.backgroundColor = background;
		
		if (property==='left') {
			div.style.left = left + 'px';
			fromValues = engine==="tween" ? { left: left, div: div } : { left: left };
			toValues = { left: toLeft }
		} else {
			div.style[transformProperty] = 'translate3d('+left + 'px,0px,0px)';
			if (engine==="kute"){
				fromValues = { translateX: left }
				toValues = { translateX: toLeft }
			} else if ((engine==="gsap") || (engine==="tween")) {
				fromValues = engine==='gsap' ? { x: left } : { x: left, div : div }
				toValues = { x: toLeft }				
			}
		}
		
		container.appendChild(div);
	
		// perf test
		if (engine==='kute') {
			tws.push(KUTE.fromTo(div, fromValues, toValues, { easing: 'easingQuadraticInOut', repeat: repeat, yoyo: true, duration: 1000, complete: fn }));
		} else if (engine==='gsap') {
			if (property==="left"){
				TweenMax.fromTo(div, 1, fromValues, {left : toValues.left, repeat : repeat, yoyo : true, ease : Quad.easeInOut, onComplete: fn });							
			} else {
				TweenMax.fromTo(div, 1, fromValues, { x:toValues.x, repeat : repeat, yoyo : true, ease : Quad.easeInOut, onComplete: fn });							
			}
		} else if (engine==='tween') {
						
			if (property==="left"){
				update = updateLeft;				
			} else if (property==="translateX"){
				update = updateTranslate;
			}			
			
			tws.push(new TWEEN.Tween(fromValues).to(toValues,1000).easing( TWEEN.Easing.Quadratic.InOut ).onComplete( complete ).onUpdate( update).repeat(repeat).yoyo(true));		
		}
	}
	if (engine==='tween') {
		var animate = function( time ) {
			requestAnimationFrame( animate );
			TWEEN.update( time );
		}
		animate();
	}

}
// the start  button handle
document.getElementById('start').addEventListener('click', buildObjects, false);

//some button toggle 
var btnGroups = document.querySelectorAll('.btn-group'), l = btnGroups.length;

for (var i=0; i<l; i++) {
	var g = btnGroups[i], links = g.querySelectorAll('a'), ll = links.length; 
	for (var j=0; j<ll; j++) {
		links[j].onclick = function() {
			"use strict";
			var link = this, b = link.parentNode.parentNode.parentNode.querySelector('.btn');
			b.innerHTML = link.id.toUpperCase() + ' <span class="caret"></span>';
			b.setAttribute('data-'+link.parentNode.parentNode.parentNode.id, link.id);
		}
	}
}