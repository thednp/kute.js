// common demo JS

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//scroll top?
var toTop = document.getElementById('toTop');
toTop.addEventListener('click',topHandler,false);

function topHandler(e){
	e.preventDefault(); 
	KUTE.to( 'window', { scroll: 0 }, {easing: 'easingQuarticOut', duration : 1500  } ).start();
}