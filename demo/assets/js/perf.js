//returns browser prefix
function getPrefix() {
	var div = document.createElement('div'), i = 0,	pf = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'], pl = pf.length,
		s = ['MozTransform', 'mozTransform', 'WebkitTransform', 'webkitTransform', 'OTransform', 'oTransform', 'MsTransform', 'msTransform'];
		
	for (i; i < pl; i++) { if (s[i] in div.style) { return pf[i]; }	}
	div = null;
}

// generate a random number within a given range
function random(min, max) {
	return Math.random() * (max - min) + min;
}

// vendor prefix handle 
var prefix = getPrefix(), // prefix
	prefixRequired = (!('transform' in document.getElementsByTagName('div')[0].style)) ? true : false, // is prefix required for transform
	transformProperty = prefixRequired ? prefix + 'Transform' : 'transform';

// the variables
var container = document.getElementById('container'),
	easing = 'easingQuadraticInOut',
	tweens = [];

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
			tweens.push(KUTE.fromTo(div, fromValues, toValues, { delay: 100, easing: easing, repeat: repeat, yoyo: true, duration: 1000, complete: fn }));
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
			
			tweens.push(new TWEEN.Tween(fromValues).to(toValues,1000).easing( TWEEN.Easing.Quadratic.InOut ).onComplete( complete ).onUpdate( update).repeat(repeat).yoyo(true));		
		}
	}
	if (engine==='tween') {
		animate();
		function animate( time ) {
			requestAnimationFrame( animate );
			TWEEN.update( time );
		}
	}
}

function complete(){
	document.getElementById('info').style.display = 'block';
	container.innerHTML = '';
	tweens = [];
}


function updateLeft(){
    this.div.style['left'] = this.left+'px';
}					

function updateTranslate(){
    this.div.style[transformProperty] = 'translate3d('+this.x + 'px,0px,0px)';
}	

//some button toggle 
var btnGroups = document.querySelectorAll('.btn-group'), l = btnGroups.length;

for (var i=0; i<l; i++) {
	var g = btnGroups[i], links = g.querySelectorAll('a'), ll = links.length; 
	for (var j=0; j<ll; j++) {
		links[j].onclick = function() {
			var link = this, b = link.parentNode.parentNode.parentNode.querySelector('.btn');
			b.innerHTML = link.id.toUpperCase() + ' <span class="caret"></span>';
			b.setAttribute('data-'+link.parentNode.parentNode.parentNode.id,link.id);
		}
	}
}


// the start  button handle
document.getElementById('start').addEventListener('click', buildObjects, false);

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
    var now = window.performance.now(), count = tweens.length;
    for (var t =0; t<count; t++){
        tweens[t].start(now+count/16)
    }
}