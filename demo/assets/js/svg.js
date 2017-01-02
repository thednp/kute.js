// basic morph
var morphTween = KUTE.to('#rectangle', { path: '#star' }, {
    duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
}); 

var morphBtn = document.getElementById('morphBtn');
morphBtn.addEventListener('click', function(){
    !morphTween.playing && morphTween.start();
}, false);

var morphTween1 = KUTE.to('#rectangle1', { path: '#star1' }, {
    morphIndex: 127,
    duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
}); 

var morphBtn1 = document.getElementById('morphBtn1');
morphBtn1.addEventListener('click', function(){
    !morphTween1.playing && morphTween1.start();
}, false);

// polygon morph
var morphTween21 = KUTE.fromTo('#triangle', {attr: { fill: '#673AB7'}, path: '#triangle' }, { attr: { fill: '#2196F3' }, path: '#square' }, {
    duration: 1500, easing: 'easingCubicOut',
}); 
var morphTween22 = KUTE.fromTo('#triangle', {path: '#square', attr:{ fill: '#2196F3'} }, { path: '#star2', attr:{ fill: 'deeppink' } }, {
    morphIndex: 9,
    delay: 500, duration: 1500, easing: 'easingCubicOut'
}); 
var morphTween23 = KUTE.fromTo('#triangle', {path: '#star2', attr:{ fill: 'deeppink'} }, { path: '#triangle', attr:{ fill: '#673AB7' } }, {
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
var multiMorph1 = KUTE.to('#w11', { path: '#w24', attr:{ fill: "#56C5FF" } }, { morphPrecision: 10, morphIndex: 17, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph2 = KUTE.to('#w13', { path: '#w21', attr:{ fill: "#56C5FF" } }, { morphPrecision: 10, morphIndex: 13, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph3 = KUTE.to('#w14', { path: '#w22', attr:{ fill: "#56C5FF" } }, { morphPrecision: 10, morphIndex: 76, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph4 = KUTE.to('#w12', { path: '#w23', attr:{ fill: "#56C5FF" } }, { morphPrecision: 10, morphIndex: 35, reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

multiMorphBtn.addEventListener('click', function(){
    !multiMorph1.playing && multiMorph1.start();
    !multiMorph2.playing && multiMorph2.start();
    !multiMorph3.playing && multiMorph3.start();
    !multiMorph4.playing && multiMorph4.start();
}, false);


// complex multi morph
var compliMorphBtn = document.getElementById('compliMorphBtn');
var compliMorph1 = KUTE.fromTo('#rectangle-container', {path: '#rectangle-container', attr:{ fill: "#2196F3"} }, { path: '#circle-container', attr:{ fill: "#FF5722"} }, { morphPrecision: 10, morphIndex: 161, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph2 = KUTE.fromTo('#symbol-left', {path: '#symbol-left'},  { path: '#eye-left' }, { morphPrecision: 10, morphIndex: 20, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph3 = KUTE.fromTo('#symbol-left-clone', {path: '#symbol-left-clone'},  { path: '#mouth' }, { morphPrecision: 10, morphIndex: 8, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph4 = KUTE.fromTo('#symbol-right', {path: '#symbol-right'},  { path: '#eye-right' }, { morphPrecision: 10, morphIndex: 55, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

compliMorphBtn.addEventListener('click', function(){
    !compliMorph1.playing && compliMorph1.start();
    !compliMorph2.playing && compliMorph2.start();
    !compliMorph3.playing && compliMorph3.start();
    !compliMorph4.playing && compliMorph4.start();
}, false);


// draw example
var drawBtn = document.getElementById('drawBtn');
var drawExample = document.getElementById('draw-example');
var drawEls = drawExample.querySelectorAll('*');

var draw1 = KUTE.allFromTo(drawEls,{draw:'0% 0%'}, {draw:'0% 10%'}, {duration: 1500, easing: "easingCubicIn", offset: 250}); 
var draw2 = KUTE.allFromTo(drawEls,{draw:'0% 10%'}, {draw:'90% 100%'}, {duration: 2500, easing: "easingCubicOut", offset: 250}); 
var draw3 = KUTE.allFromTo(drawEls,{draw:'90% 100%'}, {draw:'100% 100%'}, {duration: 1500, easing: "easingCubicIn", offset: 250}); 
var draw4 = KUTE.allFromTo(drawEls,{draw:'0% 0%'}, {draw:'0% 100%'}, {duration: 3500, easing: "easingBounceOut", offset: 250});
var draw5 = KUTE.allFromTo(drawEls,{draw:'0% 100%'}, {draw:'50% 50%'}, {duration: 2500, easing: "easingExponentialInOut", offset: 250});

draw1.chain(draw2); draw2.chain(draw3); draw3.chain(draw4); draw4.chain(draw5);

drawBtn.addEventListener('click', function(){
       !draw1.tweens[0].playing && !draw1.tweens[1].playing && !draw1.tweens[2].playing && !draw1.tweens[3].playing && !draw1.tweens[4].playing
    && !draw2.tweens[0].playing && !draw2.tweens[1].playing && !draw2.tweens[2].playing && !draw2.tweens[3].playing && !draw2.tweens[4].playing
    && !draw3.tweens[0].playing && !draw3.tweens[1].playing && !draw3.tweens[2].playing && !draw3.tweens[3].playing && !draw3.tweens[4].playing
    && !draw4.tweens[0].playing && !draw4.tweens[1].playing && !draw4.tweens[2].playing && !draw4.tweens[3].playing && !draw4.tweens[4].playing
    && !draw5.tweens[0].playing && !draw5.tweens[1].playing && !draw5.tweens[2].playing && !draw5.tweens[3].playing && !draw5.tweens[4].playing
    
    && draw1.start();
}, false);


// svgTransform examples

// rotation around shape center point
var svgRotate = document.getElementById('svgRotate');
var rotateBtn = document.getElementById('rotateBtn');
var svgr1 = svgRotate.getElementsByTagName('path')[0];
var svgr2 = svgRotate.getElementsByTagName('path')[1];

var svgTween11 = KUTE.to(svgr1, { rotate: 360 }, { transformOrigin: '50% 50%', yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
var svgTween12 = KUTE.to(svgr2, { svgTransform: { translate: 580, rotate: 360 } }, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

rotateBtn.addEventListener('click', function(){
    !svgTween11.playing && svgTween11.start();
    !svgTween12.playing && svgTween12.start();
}, false);

// rotation around shape's parent center point
var svgRotate1 = document.getElementById('svgRotate1');
var rotateBtn1 = document.getElementById('rotateBtn1');
var svgr11 = svgRotate1.getElementsByTagName('path')[0];
var svgr21 = svgRotate1.getElementsByTagName('path')[1];
var bb = svgr21.getBBox(); 
var translation = [580, 0];
var svgBB = svgr21.ownerSVGElement.getBBox();
var svgOriginX = (svgBB.width * 50 / 100) - translation[0];
var svgOriginY = (svgBB.height * 50 / 100)- translation[1];

var svgTween111 = KUTE.to(svgr11, { rotate: 360 }, { transformOrigin: (svgBB.width * 50 / 100) + 'px 50%', yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
var svgTween121 = KUTE.to(svgr21, { svgTransform: { translate: translation, rotate: 360 } }, { transformOrigin: [svgOriginX, svgOriginY], yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

rotateBtn1.addEventListener('click', function(){
    !svgTween111.playing && svgTween111.start();
    !svgTween121.playing && svgTween121.start();
}, false);

// translate
var svgTranslate = document.getElementById('svgTranslate');
var translateBtn = document.getElementById('translateBtn');
var svgt1 = svgTranslate.getElementsByTagName('path')[0];
var svgt2 = svgTranslate.getElementsByTagName('path')[1];
var svgTween21 = KUTE.to(svgt1, { translate: 580 }, {yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
var svgTween22 = KUTE.to(svgt2, {svgTransform: { translate: [0,0] } }, {yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

translateBtn.addEventListener('click', function(){
    !svgTween21.playing && svgTween21.start();
    !svgTween22.playing && svgTween22.start();
}, false);

// skews in chain
var svgSkew = document.getElementById('svgSkew');
var skewBtn = document.getElementById('skewBtn');
var svgsk1 = svgSkew.getElementsByTagName('path')[0];
var svgsk2 = svgSkew.getElementsByTagName('path')[1];
var svgTween31 = KUTE.to(svgsk1, { skewX: -15 }, {transformOrigin: '50% 50% 0px', duration: 1500, easing: "easingCubicInOut"});
var svgTween311 = KUTE.to(svgsk1, { skewY: 15 }, {transformOrigin: '50% 50% 0px', duration: 2500, easing: "easingCubicInOut"});
var svgTween313 = KUTE.to(svgsk1, { skewX: 0, skewY: 0 }, {transformOrigin: '50% 50% 0px', duration: 1500, easing: "easingCubicInOut"});

var svgTween32 = KUTE.to(svgsk2, {svgTransform: { translate: 580, skewX: -15 } }, { transformOrigin: '50% 50%', duration: 1500, easing: "easingCubicInOut"});
var svgTween322 = KUTE.to(svgsk2, {svgTransform: { translate: 580, skewY: 15 } }, { transformOrigin: '50% 50%', duration: 2500, easing: "easingCubicInOut"});
var svgTween323 = KUTE.to(svgsk2, {svgTransform: { translate: 580, skewY: 0, skewX: 0 } }, { transformOrigin: '50% 50%', duration: 1500, easing: "easingCubicInOut"});

svgTween31.chain(svgTween311);
svgTween311.chain(svgTween313);

svgTween32.chain(svgTween322);
svgTween322.chain(svgTween323);

skewBtn.addEventListener('click', function(){
    !svgTween31.playing && !svgTween311.playing && !svgTween313.playing && svgTween31.start();
    !svgTween32.playing && !svgTween322.playing && !svgTween323.playing && svgTween32.start();
}, false);

// scale
var svgScale = document.getElementById('svgScale');
var scaleBtn = document.getElementById('scaleBtn');
var svgs1 = svgScale.getElementsByTagName('path')[0];
var svgs2 = svgScale.getElementsByTagName('path')[1];
var svgTween41 = KUTE.to(svgs1, { scale: 1.5 }, {transformOrigin: '50% 50%', yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
var svgTween42 = KUTE.to(svgs2, {svgTransform: { 
    translate: 580,
    scale: 0.5, 
} }, {transformOrigin: '50% 50%', yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

scaleBtn.addEventListener('click', function(){
    !svgTween41.playing && svgTween41.start();
    !svgTween42.playing && svgTween42.start();
}, false);

// mixed transforms
var svgMixed = document.getElementById('svgMixed');
var mixedBtn = document.getElementById('mixedBtn');
var svgm1 = svgMixed.getElementsByTagName('path')[0];
var svgm2 = svgMixed.getElementsByTagName('path')[1];
var svgTween51 = KUTE.to(svgm1, { // a regular CSS3 transform without svg plugin, works in modern browsers only, EXCEPT IE/Edge
        translate: 250,
        scale: 1.5,
        rotate: 320,
        skewX: -15
}, {transformOrigin: "50% 50%", yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

var svgTween52 = KUTE.to(svgm2, {
    svgTransform: {
        translate: 830,
        scale: 1.5,
        rotate: 320,
        skewX: -15
}
}, {transformOrigin: "50% 50%", yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

mixedBtn.addEventListener('click', function(){
    !svgTween51.playing && svgTween51.start();
    !svgTween52.playing && svgTween52.start();
}, false);

// chained transforms
var svgChained = document.getElementById('svgChained');
var chainedBtn = document.getElementById('chainedBtn');
var svgc = svgChained.getElementsByTagName('path')[0];

var svgTween6 = KUTE.fromTo(svgc, 
    { // from
        svgTransform: {
            translate: 0,
            scale: 0.5,
            rotate: 45,
            // skewX: 0
        },
    },
    { // to
        svgTransform: {
            translate: 450,
            scale: 1.5,
            rotate: 360,
            // skewX: -45
        }
    },
{transformOrigin: [256,256], yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

chainedBtn.addEventListener('click', function(){
    !svgTween6.playing && svgTween6.start();
}, false);