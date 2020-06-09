/*  SCROLL EXAMPLE  */
var scrollProperty = document.getElementById('scrollProperty'),
		button = scrollProperty.getElementsByClassName('btn')[0],
		target = scrollProperty.getElementsByClassName('example-item')[0]

button.addEventListener('click', function(e){
	e.preventDefault();
	let scrollTween = target.scrollTop !==0 ?
		KUTE.to(target,{scroll:0},{duration:2000, easing: "easingCircularOut"}) :
		KUTE.to(target,{scroll:(target.scrollHeight-target.offsetHeight+10)},{duration:2000, easing: "easingCircularOut"})
	!scrollTween.playing && scrollTween.start()
},false);
/*  SCROLL EXAMPLE  */
