/*  TEXT PROPERTIES EXAMPLE  */
var textProperties = document.getElementById('textProperties'),
	heading = textProperties.querySelector('h1'),
	button = textProperties.querySelectorAll('.btn')[0],                                            

	// let's split the heading text by character
	chars = heading.innerHTML.split('');

// wrap the splits into spans and build an object with these spans 
heading.innerHTML = '<span>' + chars.join('</span><span>') + '</span>';
var charsObject = heading.getElementsByTagName('SPAN'), l = charsObject.length;


// built the tween objects
var	tps = KUTE.allFromTo(charsObject, 
        { fontSize:50, letterSpacing: 0, color: '#333'}, 
        { fontSize:80, letterSpacing: 10, color: 'red'}, 
				{ offset: 75, duration: 250, repeat: 1, yoyo:true, repeatDelay: 150, easing: 'easingCubicOut'});
				

button.addEventListener('click', function(e){
	e.preventDefault();
    if ( !tps.playing() ) {
			tps.start();
    }
},false);
/*  TEXT PROPERTIES EXAMPLE  */