/*  BOX MODEL EXAMPLE  */
var boxModel = document.getElementById('boxModel'),
	btb = boxModel.querySelector('.btn'),
    box = boxModel.querySelector('.example-box-model');
    
// built the tween objects
var bm1 = KUTE.to(box,{width:250},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onWidth});
var bm2 = KUTE.to(box,{height:250},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onHeight});
var bm3 = KUTE.to(box,{left:250},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onLeft});
var bm4 = KUTE.to(box,{top:-250},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onTop, onComplete: onComplete});

var bm5 = KUTE.to(box,{marginTop:50},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onMarginTop});
var bm6 = KUTE.to(box,{marginBottom:50},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onMarginBottom});
var bm7 = KUTE.to(box,{paddingTop:15},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onPadding});
var bm8 = KUTE.to(box,{marginTop:50,marginLeft:50,marginBottom:70},{ yoyo: true, repeat: 1, duration: 1500, onUpdate: onMargin, onComplete: onComplete});

// chain the bms
try{
	bm1.chain(bm2);
	bm2.chain(bm3);
	bm3.chain(bm4);
	bm4.chain(bm5);
	bm5.chain(bm6);
	bm6.chain(bm7);
	bm7.chain(bm8);
}catch(e){
	console.error(e+". TweenBase doesn\'t support chain method")
}

//callback functions
function onWidth() { box.innerHTML = 'WIDTH<br>'+parseInt(box.offsetWidth)+'px'; }
function onHeight() { box.innerHTML = 'HEIGHT<br>'+parseInt(box.offsetHeight)+'px'; }
function onLeft() { box.innerHTML = 'LEFT<br>'+parseInt(box.offsetLeft)+'px'; }
function onTop() { box.innerHTML = 'TOP<br>'+parseInt(box.offsetTop)+'px'; }

function onMarginTop() { box.innerHTML = parseInt(box.style.marginTop)+'px'+'<br>MARGIN'; }
function onMarginBottom() { box.innerHTML = 'MARGIN<br>'+parseInt(box.style.marginBottom)+'px'; }
function onPadding() { box.innerHTML = parseInt(box.style.paddingTop)+'px<br>PADDING'; }
function onMargin() { box.innerHTML = 'MARGIN<br>'+parseInt(box.style.marginTop)+'px'; }

function onComplete() { box.innerHTML = 'BOX<br>&nbsp;MODEL&nbsp;'; }

btb.addEventListener('click', function(e){
	e.preventDefault();
	!bm1.playing && !bm2.playing && !bm3.playing && !bm4.playing 
    !bm5.playing && !bm6.playing && !bm7.playing && !bm8.playing 
    && bm1.start();
},false);
/*  BOX MODEL EXAMPLE  */