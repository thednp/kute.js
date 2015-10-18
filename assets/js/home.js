// vars
var block = document.getElementById('blocks'),
	bs = block.querySelectorAll('.bg'),
	b = block.querySelector('.bg'),
	isIE = /ie/.test(document.documentElement.className),
	isIE8 = /ie8/.test(document.documentElement.className),
	isIE10 = /MSIE|10.0/.test(navigator.userAgent),
	replay = document.querySelector('.btn.replay');


// resize and show the blocks
window.addEventListener('load',resizeHandler,false);
window.addEventListener('load',showBlocks,false);
window.addEventListener('resize',resizeHandler,false);
replay.addEventListener('click',runOnClick,false);

function resizeHandler(e) {
	var css = window.getComputedStyle(b),
		bw = parseInt(css.width), i = 0;
	for (i;i<9;i++){
		bs[i].style.minHeight = bw+'px';
		if (e.type==='load'){
			bs[i].style.left = -bw+'px';
		}	
	}
}

function showBlocks() {
	var i = 0, dl, css = window.getComputedStyle(b),
		bw = parseInt(css.width), d = isIE || (/%/.test(css.width)) ? 300 : bw*3, ra, fn;
	for (i;i<9;i++){
		if ( i === 0 || i === 3 || i === 6 ) {
			dl = 200 + i*bw;
		} else if ( i === 1 || i === 4 || i === 7 ) {
			dl = 400 + i*bw;
		} else if ( i === 2 || i === 5 || i === 8 ) {
			dl = 600 + i*bw;
		}
		fn = i === 0 ? openTheAnimations : null;
		ra = i === 8 ? runAnimations : null;
		KUTE.to(bs[i], {opacity:1,left:0}, {duration: d, delay: dl, complete: ra, easing: 'easingQuadraticOut', start: fn}).start();
	}
}

function runOnClick() {
	if ( !/animating/.test(block.className) ) {
		runAnimations();
	}
}

function doBlockAnimations() {
	var i = 0;
	for (i;i<9;i++){
		var rd = getRandomInt(-300,300), rs = getRandomInt(0.1,5), sc = parseFloat(rs*0.5),
			fn = i===8 ? closeTheAnimations : null,
			t1 = KUTE.to(bs[i], { translate:rd}, { duration:1500, easing: 'easingQuadraticInOut', delay: 1500 }),
			t2 = KUTE.to(bs[i], { rotate:720}, { duration:1500, easing: 'easingQuadraticOut' }),
			t3 = KUTE.fromTo(bs[i], { translate:rd, borderRadius: '0%', scale:1, rotate:720}, { borderRadius: '100%', translate:rd, scale:rs, rotate:0}, { duration:1000, easing: 'easingQuadraticOut' }),
			t4 = KUTE.to(bs[i], { scale: sc}, { duration:1000, easing: 'easingQuadraticIn' }),
			t5 = KUTE.fromTo(bs[i], { translate:rd, borderRadius: '100%', scale:sc }, { translate:0, borderRadius: '0%', scale:1 }, { delay: 100, duration:1500, easing: 'easingBounceOut' }),
			t6 = KUTE.to(bs[i], { backgroundColor: '#fff'}, { easing: 'easingCircularOut', delay: 550+i*50, duration:450, yoyo: true, repeat: 1, complete: fn });
			
		
		// t6.start();
		t1.start();
		t1.chain(t2);
		t2.chain(t3);
		t3.chain(t4);
		t4.chain(t5);
		t5.chain(t6);

	}	
}
function openTheAnimations() {
	if (!/animating/.test(block.className)){
		replay.style.display = 'none';
		block.className += ' animating';
	}
}
function closeTheAnimations() {
	if (/animating/.test(block.className)){
		replay.style.display = 'inline';
		block.className = block.className.replace( ' animating', '');
	}
}

function runAnimations() {
	var t1 = KUTE.fromTo(block,{left:0},{left:150},{duration:1000, easing: 'easingCubicIn', start: openTheAnimations}).start(),
		t2 = KUTE.fromTo(block,{left:150},{left:0},{duration:2500, easing: 'easingElasticOut', start: openTheAnimations}),
		t3 = KUTE.fromTo(block,{rotateZ:0,rotateY:-10},{rotateZ:-20,rotateY:25},{duration:2500, easing: 'easingQuadraticInOut'}).start(),
		t4 = KUTE.fromTo(block,{rotateZ:-20,rotateY:385},{rotateZ:0,rotateY:-10},{duration:3500, delay: 3600, easing: 'easingQuadraticInOut'});	

	t1.chain(t2);
	t3.chain(t4);

	doBlockAnimations();
}