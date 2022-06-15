// basic morph
var morphTween = KUTE.to('#rectangle', {path: '#star'}, {
  duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
}); 

var morphBtn = document.getElementById('morphBtn');
morphBtn.addEventListener('click', function(){
  !morphTween.playing && morphTween.start();
}, false);

// line to circle
var lineMorph = KUTE.to('#line',{path:'#circle'},{ yoyo:true, repeat:1, duration:2000, easing: 'easingCubicOut'}),
    lineMorph1 = KUTE.to('#line1',{path:'#circle1'},{ yoyo:true, repeat:1, duration:2000, easing: 'easingCubicOut'}),
    morphBtnClosed = document.getElementById('morphBtnClosed');
morphBtnClosed.addEventListener('click', function(){
  !lineMorph.playing && lineMorph.start()
  !lineMorph1.playing && lineMorph1.start()
}, false);


// polygon morph
var morphTween21 = KUTE.fromTo('#triangle', {attr: { fill: '#673AB7'}, path: '#triangle' }, { attr: { fill: '#2196F3' }, path: '#square' }, {
  duration: 1500, easing: 'easingCubicOut'
}); 
var morphTween22 = KUTE.fromTo('#triangle', {path: '#square', attr:{ fill: '#2196F3'} }, { path: '#star2', attr:{ fill: 'deeppink' } }, {
  delay: 500, duration: 1500, easing: 'easingCubicOut'
}); 
var morphTween23 = KUTE.fromTo('#triangle', {path: '#star2', attr:{ fill: 'deeppink'} }, { path: '#triangle', attr:{ fill: '#673AB7' } }, {
  delay: 500, duration: 1500, easing: 'easingCubicOut'
});
var morphTween24 = KUTE.fromTo('#triangle', {path: '#triangle', attr:{ fill: '#673AB7'} }, { path: '#cat', attr:{ fill: 'darkorange' } }, {
  delay: 500, duration: 1500, easing: 'easingCubicOut'
});
var morphTween25 = KUTE.fromTo('#triangle', {path: '#cat', attr:{ fill: 'darkorange'} }, { path: '#triangle', attr:{ fill: '#673AB7' } }, {
  delay: 500, duration: 1500, easing: 'easingCubicOut'
});

try{
  morphTween21.chain(morphTween22);
  morphTween22.chain(morphTween23);
  morphTween23.chain(morphTween24);
  morphTween24.chain(morphTween25);
  morphTween25.chain(morphTween21);
}catch(e){
	console.error(e+"TweenBase doesn\'t support chain method")
}


var morphBtn2 = document.getElementById('morphBtn2');
morphBtn2.addEventListener('click', function(){
  if ( !morphTween21.playing && !morphTween22.playing && !morphTween23.playing && !morphTween24.playing && !morphTween25.playing ) {  
    morphTween21.start(); morphTween21._dl = 500;
    morphBtn2.innerHTML = 'Stop';
    morphBtn2.className = 'btn btn-pink';
  } else {
    morphTween21.playing && morphTween21.stop(); morphTween21._dl = 0;
    morphTween22.playing && morphTween22.stop();
    morphTween23.playing && morphTween23.stop();
    morphTween24.playing && morphTween24.stop();
    morphTween25.playing && morphTween25.stop();
    morphBtn2.innerHTML = 'Start'; 
    morphBtn2.className = 'btn btn-green';
  }
}, false);


// simple multi morph
var multiMorphBtn = document.getElementById('multiMorphBtn');
var multiMorph1 = KUTE.fromTo('#w11', { path: '#w11', attr:{ fill: "rgb(233,27,31)" }  }, { path: '#w21', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph2 = KUTE.fromTo('#w12', { path: '#w12', attr:{ fill: "rgb(255,87,34)" }  }, { path: '#w22', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph3 = KUTE.fromTo('#w13', { path: '#w13', attr:{ fill: "rgb(76,175,80)" }  }, { path: '#w23', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph4 = KUTE.fromTo('#w14', { path: '#w14', attr:{ fill: "rgb(33,150,243)" } }, { path: '#w24', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

var multiMorph1s = KUTE.fromTo('#s11', { path: '#s11', attr:{ fill: "rgb(233,27,31)" }  }, { path: '#s23', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph2s = KUTE.fromTo('#s12', { path: '#s12', attr:{ fill: "rgb(255,87,34)" }  }, { path: '#s21', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph3s = KUTE.fromTo('#s13', { path: '#s13', attr:{ fill: "rgb(76,175,80)" }  }, { path: '#s24', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph4s = KUTE.fromTo('#s14', { path: '#s14', attr:{ fill: "rgb(33,150,243)" } }, { path: '#s22', attr:{ fill: "#56C5FF" } }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

multiMorphBtn.addEventListener('click', function(){
  !multiMorph1.playing && multiMorph1.start() && multiMorph1s.start();
  !multiMorph2.playing && multiMorph2.start() && multiMorph2s.start();
  !multiMorph3.playing && multiMorph3.start() && multiMorph3s.start();
  !multiMorph4.playing && multiMorph4.start() && multiMorph4s.start();
}, false);



// complex multi morph
var compliMorphBtn = document.getElementById('compliMorphBtn');
var compliMorph1 = KUTE.fromTo('#rectangle-container', {path: '#rectangle-container', attr:{ fill: "#2196F3"} }, { path: '#circle-container', attr:{ fill: "#FF5722"} }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph2 = KUTE.fromTo('#symbol-left', {path: '#symbol-left'},  { path: '#eye-left' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph3 = KUTE.fromTo('#symbol-left-clone', {path: '#symbol-left-clone'},  { path: '#mouth' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph4 = KUTE.fromTo('#symbol-right', {path: '#symbol-right'},  { path: '#eye-right' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

var compliMorph11 = KUTE.fromTo('#rectangle-container1', {path: '#rectangle-container1', attr:{ fill: "#9C27B0"} }, { path: '#circle-container', attr:{ fill: "#FF5722"} }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph21 = KUTE.fromTo('#symbol-left1', {path: '#symbol-left1'},  { path: '#eye-left1' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph31 = KUTE.fromTo('#sample-shape', {path: '#sample-shape'},  { path: '#mouth1' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph41 = KUTE.fromTo('#symbol-right1', {path: '#symbol-right1'},  { path: '#eye-right1' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

compliMorphBtn.addEventListener('click', function(){
  !compliMorph1.playing && compliMorph1.start() && compliMorph11.start();
  !compliMorph2.playing && compliMorph2.start() && compliMorph21.start();
  !compliMorph3.playing && compliMorph3.start() && compliMorph31.start();
  !compliMorph4.playing && compliMorph4.start() && compliMorph41.start();
}, false);