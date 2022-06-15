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
