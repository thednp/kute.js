/*  OPACITY EXAMPLE  */
var opacityProperty = document.getElementById('opacityProperty'),
		button = opacityProperty.getElementsByClassName('btn')[0],
		heart = opacityProperty.getElementsByClassName('example-box')[0],
		// fade out
		fadeOutTween = KUTE.to(heart,{opacity:0},{duration:2000}),
		// fade in
		fadeInTween = KUTE.to(heart,{opacity:1},{duration:2000}),

		isHidden = true;

button.addEventListener('click', function(e){
	e.preventDefault();
    if ( !isHidden && !fadeOutTween.playing && !fadeInTween.playing ) {
			fadeOutTween.start();
			isHidden = !isHidden;

		} else if ( isHidden && !fadeOutTween.playing && !fadeInTween.playing ) {
			fadeInTween.start();
			isHidden = !isHidden;
    }
},false);
/*  OPACITY EXAMPLE  */
