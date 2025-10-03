// testing grounds
"use strict";

function isMobile() {
	// Primary check: User-Agent Client Hints (supported in modern Chromium browsers)
	if (navigator.userAgentData && navigator.userAgentData.mobile) {
		return navigator.userAgentData.mobile;
	}

	// Fallback 1: Feature detection for touch/coarse pointers and small screens
	const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
	if (hasTouch && isSmallScreen) {
		return true;
	}

	// Fallback 2: Legacy UA regex (use sparingly, as it's not future-proof)
	const ua = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

// protect phones, older / low end devices
if (isMobile()) {
	var explain = '';
	explain += 'For safety reasons this page does not work on your machine because it might be very old. In other cases the browser window size is not enough for the animation to work properly, so if that\'s the case, maximize the window, refresh and proceed with the tests.';
	var warning = '<div style="padding: 20px;">';
	warning += '<h1 class="text-danger">Warning!</h1>';
	warning += '<p class="lead text-danger">This web page is only for high-end desktop computers.</p>';
	warning += '<p class="text-danger">We do not take any responsibility and we are not liable for any damage caused through use of this website, be it indirect, special, incidental or consequential damages to your devices.</p>';
	warning += '<p class="text-info">' + explain + '</p>';
	warning += '</div>';
	document.body.innerHTML = warning;
	throw new Error('This page is only for high-end desktop computers. ' + explain);
}

// the variables
var infoContainer = document.getElementById('info');
var container = document.getElementById('container');
var tws = [];

for (var i=0; i<21; i++){
	container.innerHTML += 
	'<div class="cube">'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
		+'<div class="cube__side"></div>'
	+'</div>'
}

var collection = document.getElementsByClassName('cube');
var lastIdx = collection.length-1;

function complete(){
	infoContainer.style.display = 'block';
	container.style.display = 'none';
}

var engine	= document.getElementById('kute'),
		fromCSS	= { 					  rotate3d: [ 0,  0,0 ], perspective:600 },
		fromMX	= { transform: { rotate3d: [ 0,  0,0 ], perspective:600 }},
		toCSS		= { 						  rotate3d: [ 360,0,0 ], perspective:600 },
		toMX		= { transform: { rotate3d: [ 0,360,0 ], perspective:600 }},
		ops			= { duration: 2000, repeat: 5 }

// since our engines don't do sync, we make it our own here
if (!engine.src.includes('extra')) {
	[].slice.call(collection).map((el,i) => { i===lastIdx && (ops.onComplete = complete); tws.push ( KUTE.fromTo(el,fromCSS,toCSS,ops) ) })
}
if (engine.src.includes('extra')) {
	[].slice.call(collection).map((el,i) => { i===lastIdx && (ops.onComplete = complete); tws.push ( KUTE.fromTo(el,fromMX,toMX,ops) ) })
}


function startTest(){
	infoContainer.style.display = 'none';
	container.style.display = 'block'

	tws.length && !tws[0].playing && startKUTE();	
}


function startKUTE() {
	var now = window.performance.now(), count = tws.length;
	tws.forEach((t) => t.start(now));
}

// the start  button handle
document.getElementById('start').addEventListener('click', startTest, false);
