/*  COLORS EXAMPLE  */
var colBox = document.getElementById('colBox'),
	colBoxElement = colBox.querySelector('.example-box'),
	colbtn = colBox.querySelector('.btn');	

var colTween1 = KUTE.to(colBoxElement, {color: '#9C27B0'}, {duration: 1000});
var colTween2 = KUTE.to(colBoxElement, {backgroundColor: '#069'}, {duration: 1000});
var colTween3 = KUTE.to(colBoxElement, {color: '#fff'}, {duration: 1000});
var colTween4 = KUTE.to(colBoxElement, {backgroundColor: '#9C27B0'}, {duration: 1000});
var colTween5 = KUTE.to(colBoxElement, {borderColor: '#069'}, {duration: 1000});
var colTween6 = KUTE.to(colBoxElement, {borderTopColor: '#9C27B0'}, {duration: 1000});
var colTween7 = KUTE.to(colBoxElement, {borderRightColor: '#9C27B0'}, {duration: 1000});
var colTween8 = KUTE.to(colBoxElement, {borderBottomColor: '#9C27B0'}, {duration: 1000});
var colTween9 = KUTE.to(colBoxElement, {borderLeftColor: '#9C27B0'}, {duration: 1000});
var colTween10 = KUTE.to(colBoxElement, {outlineColor: '#9C27B0'}, {duration: 1000, repeat: 1, yoyo: true});


try {
	colTween1.chain(colTween2);
	colTween2.chain(colTween3);
	colTween3.chain(colTween4);
	colTween4.chain(colTween5);
	colTween5.chain(colTween6);
	colTween6.chain(colTween7);
	colTween7.chain(colTween8);
	colTween8.chain(colTween9);
	colTween9.chain(colTween10);
} catch(e){
	console.error(e+". TweenBase doesn\'t support chain method")
}


colbtn.addEventListener('click', function(e){
	e.preventDefault();
	!colTween1.playing && !colTween2.playing && !colTween3.playing && !colTween4.playing 
	!colTween5.playing && !colTween6.playing && !colTween7.playing && !colTween8.playing 
	!colTween9.playing && !colTween10.playing && colTween1.start();
},false);
/*  COLORS EXAMPLE  */