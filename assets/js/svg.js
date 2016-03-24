// basic morph
var morphTween = KUTE.to('#rectangle', { path: '#star' }, {
    duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
}); 

var morphBtn = document.getElementById('morphBtn');
morphBtn.addEventListener('click', function(){
    !morphTween.playing && morphTween.start();
}, false);

var morphTween1 = KUTE.to('#rectangle1', { path: '#star1' }, {
    showMorphInfo: true, morphIndex: 73,
    duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
}); 

var morphBtn1 = document.getElementById('morphBtn1');
morphBtn1.addEventListener('click', function(){
    !morphTween1.playing && morphTween1.start();
}, false);

// polygon morph
var morphTween21 = KUTE.fromTo('#triangle', {path: '#triangle', fill: '#673AB7'}, { path: '#square', fill: '#2196F3' }, {
    duration: 1500, easing: 'easingCubicOut',
}); 
var morphTween22 = KUTE.fromTo('#triangle', {path: '#square', fill: '#2196F3'}, { path: '#star2', fill: 'deeppink' }, {
    morphIndex: 9, 
    delay: 500, duration: 1500, easing: 'easingCubicOut'
}); 
var morphTween23 = KUTE.fromTo('#triangle', {path: '#star2', fill: 'deeppink'}, { path: '#triangle', fill: '#673AB7' }, {
    delay: 500, duration: 1500, easing: 'easingCubicOut'
});

morphTween21.chain(morphTween22);
morphTween22.chain(morphTween23);
morphTween23.chain(morphTween21);

var morphBtn2 = document.getElementById('morphBtn2');
morphBtn2.addEventListener('click', function(){
    if ( !morphTween21.playing && !morphTween22.playing && !morphTween23.playing ) {  
      morphTween21.start(); morphTween21._dl = 500;
      morphBtn2.innerHTML = 'Stop';
      morphBtn2.className = 'btn btn-pink';
    } else {
      morphTween21.playing && morphTween21.stop(); morphTween21._dl = 0;
      morphTween22.playing && morphTween22.stop();
      morphTween23.playing && morphTween23.stop();
      morphBtn2.innerHTML = 'Start'; 
      morphBtn2.className = 'btn btn-green';
    }
}, false);


// simple multi morph
var multiMorphBtn = document.getElementById('multiMorphBtn');
var multiMorph1 = KUTE.to('#w11', { path: '#w24', fill: "#56C5FF" }, { morphPrecision: 10, morphIndex: 17, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph2 = KUTE.to('#w13', { path: '#w21', fill: "#56C5FF" }, { morphPrecision: 10, morphIndex: 13, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph3 = KUTE.to('#w14', { path: '#w22', fill: "#56C5FF" }, { morphPrecision: 10, morphIndex: 76, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph4 = KUTE.to('#w12', { path: '#w23', fill: "#56C5FF" }, { morphPrecision: 10, morphIndex: 35, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

multiMorphBtn.addEventListener('click', function(){
    !multiMorph1.playing && multiMorph1.start();
    !multiMorph2.playing && multiMorph2.start();
    !multiMorph3.playing && multiMorph3.start();
    !multiMorph4.playing && multiMorph4.start();
}, false);


// complex multi morph
var compliMorphBtn = document.getElementById('compliMorphBtn');
var compliMorph1 = KUTE.fromTo('#rectangle-container', {path: '#rectangle-container', fill: "#2196F3"}, { path: '#circle-container', fill: "#FF5722" }, { morphPrecision: 10, morphIndex: 161, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph2 = KUTE.fromTo('#symbol-left', {path: '#symbol-left', fill: "#fff"},  { path: '#eye-left', fill: "#fff" }, { morphPrecision: 10, morphIndex: 20, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph3 = KUTE.fromTo('#symbol-left-clone', {path: '#symbol-left-clone', fill: "#fff"},  { path: '#mouth', fill: "#fff" }, { morphPrecision: 10, morphIndex: 8, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph4 = KUTE.fromTo('#symbol-right', {path: '#symbol-right', fill: "#CDDC39"},  { path: '#eye-right', fill: "#fff" }, { morphPrecision: 10, morphIndex: 55, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

compliMorphBtn.addEventListener('click', function(){
    !compliMorph1.playing && compliMorph1.start();
    !compliMorph2.playing && compliMorph2.start();
    !compliMorph3.playing && compliMorph3.start();
    !compliMorph4.playing && compliMorph4.start();
}, false);


// draw example
var drawBtn = document.getElementById('drawBtn');
var draw1 = KUTE.fromTo('#drawSVG',{draw:'0% 0%'}, {draw:'0% 10%'}, {duration: 1500, easing: "easingCubicIn"}); 
var draw2 = KUTE.fromTo('#drawSVG',{draw:'0% 10%'}, {draw:'90% 100%'}, {duration: 2500, easing: "easingCubicOut"}); 
var draw3 = KUTE.fromTo('#drawSVG',{draw:'90% 100%'}, {draw:'100% 100%'}, {duration: 1500, easing: "easingCubicIn"}); 
var draw4 = KUTE.fromTo('#drawSVG',{draw:'0% 0%'}, {draw:'0% 100%'}, {duration: 3500, easing: "easingBounceOut"});
var draw5 = KUTE.fromTo('#drawSVG',{draw:'0% 100%'}, {draw:'50% 50%'}, {duration: 2500, easing: "easingExponentialInOut"});

draw1.chain(draw2); draw2.chain(draw3); draw3.chain(draw4); draw4.chain(draw5);

drawBtn.addEventListener('click', function(){
    !draw1.playing && !draw2.playing && !draw3.playing && !draw4.playing && !draw5.playing && draw1.start();
}, false);



// fill HEX/RGBa
var tween1 = KUTE.to('#fillSVG', {fill: '#069'}, {duration: 1500, yoyo:true, repeat: 1});
    
// stroke HEX/RGBa
var tween2 = KUTE.to('#fillSVG',{stroke: '#069'}, {delay: 200, yoyo:true, repeat: 1});
    
// strokeOpacity Number 0-1
var tween3 = KUTE.to('#fillSVG',{strokeOpacity: 0.6}, {duration: 1500, yoyo:true, repeat: 1});
    
// fillOpacity Number 0-1
var tween4 = KUTE.to('#fillSVG',{fillOpacity: 0.2}, {yoyo:true, repeat: 1});
    
// strokeWidth Number
var tween5 = KUTE.to('#fillSVG',{strokeWidth: 0}, {duration: 1500, yoyo:true, repeat: 1});

tween1.chain(tween4);
tween2.chain(tween3,tween5);

var cssBtn = document.getElementById('cssBtn');
cssBtn.addEventListener('click',function(){
    !tween1.playing && !tween3.playing && !tween4.playing && !tween5.playing && tween1.start();
    !tween2.playing && !tween3.playing && !tween4.playing && !tween5.playing && tween2.start();
}, false);

// stopColor HEX/RGBa
var tween6 = KUTE.to('#stopCSVG',{stopColor: 'rgb(00,66,99)'}, {duration: 1500, yoyo:true, repeat: 1});
    
// stopOpacity Number 0-1
var tween7 = KUTE.to('#stopOSVG',{stopOpacity: 0}, {duration: 1500, yoyo:true, repeat: 1});

tween6.chain(tween7)

var gradBtn = document.getElementById('gradBtn');
gradBtn.addEventListener('click', function(){
    !tween6.playing && !tween7.playing && tween6.start();
});
