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
		
function createTest(count, property, engine, repeat, hack) {
	for (var i = 0; i < count; i++) {
		var tween,
			div = document.createElement('div'),
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
			if (hack) { div.className += ' hack'; }
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
			tween = KUTE.fromTo(div, fromValues, toValues, { delay: 100, easing: easing, repeat: repeat, yoyo: true, duration: 1000, complete: fn });
			tweens.push(tween);
		} else if (engine==='gsap') {
			if (property==="left"){
           		tween = TweenMax.fromTo(div, 1, fromValues, {left : toValues.left, repeat : repeat, yoyo : true, ease : Quad.easeInOut, onComplete: fn });							
			} else {
          		tween = TweenMax.fromTo(div, 1, fromValues, { x:toValues.x, repeat : repeat, yoyo : true, ease : Quad.easeInOut, onComplete: fn });							
			}
		} else if (engine==='tween') {
			var update; 			
			
			if (property==="left"){
				update = function(){
					this.div.style['left'] = this.left+'px';
				}					
			} else if (property==="translateX"){
				update = function(){
					this.div.style[transformProperty] = 'translate3d('+this.x + 'px,0px,0px)';
				}
			}			
			
			tween = new TWEEN.Tween(fromValues)
				.to(toValues,1000)
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onComplete( complete )
				.onUpdate( update)
				.repeat(repeat)
				.yoyo(true);
			tweens.push(tween);		
		}
	}
	if (engine==='tween') {
		animate();
		function animate( time ) {
			requestAnimationFrame( animate );
			TWEEN.update( time );
		}
	}	
	
	// since our engines don't do sync, we make it our own here
	if (engine==='tween'||engine==='kute') {
		var now = window.performance.now();
		for (var t =0; t<count; t++){
			tweens[t].start(now+count/16)
		}	
	}
}

function complete(){
	document.getElementById('info').style.display = 'block';
	container.innerHTML = '';
	tweens = [];
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
			if ( /LEFT/.test(document.getElementById('property').querySelector('.btn').innerHTML) ) {
				document.getElementById('hack').style.display = 'block';
			} else {
				document.getElementById('hack').style.display = 'none';
			}
		}
	}
}

document.getElementById('hack').querySelector('.btn').onclick = function(){
	var self= this;
	setTimeout(function(){
		if ( !self.querySelector('INPUT').checked ) {
			self.className = self.className.replace('btn-info','btn-warning');			
			self.querySelector('.state').innerHTML = 'Hack ON';
		} else if ( self.querySelector('INPUT').checked ) {
			self.className = self.className.replace('btn-warning','btn-info');
			self.querySelector('.state').innerHTML = 'Hack OFF';
		}		
	},200)
}

// the start  button handle
document.getElementById('start').onclick = function(){
	var c = document.querySelector('[data-count]'),	e = document.querySelector('[data-engine]'), r = document.querySelector('[data-repeat]'),
		p = document.querySelector('[data-property]'),	ct = c && document.querySelector('[data-count]').getAttribute('data-count'), 
		count = ct ? parseInt(ct) : null,
		engine = e && document.querySelector('[data-engine]').getAttribute('data-engine') || null,
		repeat = r && document.querySelector('[data-repeat]').getAttribute('data-repeat') || null,
		property = p && document.querySelector('[data-property]').getAttribute('data-property') || null,
		hack = document.getElementById('hack').getElementsByTagName('INPUT')[0].getAttribute('checked') ? true : false,
		warning = document.createElement('DIV');
		
	warning.className = 'text-warning padding lead';
	container.innerHTML = '';	
	if (count && engine && property && repeat) {
		document.getElementById('info').style.display = 'none';
		
		createTest(count,property,engine,repeat,hack);
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