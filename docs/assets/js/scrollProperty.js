/*  SCROLL EXAMPLE  */
var scrollProperty = document.getElementById('scrollProperty'),
		button = scrollProperty.getElementsByClassName('btn')[0],
		target = scrollProperty.getElementsByClassName('example-item')[0]

button.addEventListener('click', function(e){
	e.preventDefault();
	var scrollTween = target.scrollTop !==0 ?
		KUTE.to(target,{scroll:0},{duration:2000, easing: "easingCircularOut"}) :
		KUTE.to(target,{scroll:(target.scrollHeight-target.offsetHeight+10)},{duration:2000, easing: "easingCircularOut"})
	!scrollTween.playing && scrollTween.start()
},false);
/*  SCROLL EXAMPLE  */

// scroll top?
var toTop = document.getElementById('toTop'),
    toTopTween = KUTE.to( window, { scroll: 0 }, {easing: 'easingQuarticOut', duration : 1500  } );

function topHandler(e){
	e.preventDefault(); 
  toTopTween.start();
}
toTop.addEventListener('click',topHandler,false);
