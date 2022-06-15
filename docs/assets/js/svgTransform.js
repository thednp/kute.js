// invalidate for unsupported browsers
var isIE = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) !== null ? parseFloat( RegExp.$1 ) : false;
if (isIE&&isIE<9) { (function(){return; }()) } // return if SVG API is not supported


// svgTransform examples

// rotation around shape center point
var svgRotate = document.getElementById('svgRotate');
var rotateBtn = document.getElementById('rotateBtn');
var svgr1 = svgRotate.getElementsByTagName('path')[0];
var svgr2 = svgRotate.getElementsByTagName('path')[1];

var svgTween11 = KUTE.to(svgr1, { transform: {rotateZ: 360} }, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
// var svgTween11 = KUTE.to(svgr1, { rotateZ: 360}, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
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

var svgTween111 = KUTE.to(svgr11, { transform: {rotateZ: 360} }, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
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
var svgTween21 = KUTE.to(svgt1, { transform: {translateX: 580} }, {yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
var svgTween22 = KUTE.to(svgt2, { svgTransform: { translate: [0,0] } }, {yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

translateBtn.addEventListener('click', function(){
  !svgTween21.playing && svgTween21.start();
  !svgTween22.playing && svgTween22.start();
}, false);

// skews in chain
var svgSkew = document.getElementById('svgSkew');
var skewBtn = document.getElementById('skewBtn');
var svgsk1 = svgSkew.getElementsByTagName('path')[0];
var svgsk2 = svgSkew.getElementsByTagName('path')[1];
var svgTween31 = KUTE.to(svgsk1, { transform: {skew: [-15,0]} }, { duration: 1500, easing: "easingCubicInOut"});
var svgTween311 = KUTE.to(svgsk1, { transform: {skew: [-15,15]} }, { duration: 2500, easing: "easingCubicInOut"});
var svgTween313 = KUTE.to(svgsk1, { transform: {skew: [0, 0]} }, { duration: 1500, easing: "easingCubicInOut"});

var svgTween32 = KUTE.to(svgsk2, {svgTransform: { translate: 580, skewX: -15 } }, { transformOrigin: '50% 50%', duration: 1500, easing: "easingCubicInOut"});
var svgTween322 = KUTE.to(svgsk2, {svgTransform: { translate: 580, skewY: 15 } }, { transformOrigin: '50% 50%', duration: 2500, easing: "easingCubicInOut"});
var svgTween323 = KUTE.to(svgsk2, {svgTransform: { translate: 580, skewY: 0, skewX: 0 } }, { transformOrigin: '50% 50%', duration: 1500, easing: "easingCubicInOut"});

try{
  svgTween31.chain(svgTween311);
  svgTween311.chain(svgTween313);

  svgTween32.chain(svgTween322);
  svgTween322.chain(svgTween323);
}catch(e){
	console.error(e+"TweenBase doesn\'t support chain method")
}  


skewBtn.addEventListener('click', function(){
  !svgTween31.playing && !svgTween311.playing && !svgTween313.playing && svgTween31.start();
  !svgTween32.playing && !svgTween322.playing && !svgTween323.playing && svgTween32.start();
}, false);

// scale
var svgScale = document.getElementById('svgScale');
var scaleBtn = document.getElementById('scaleBtn');
var svgs1 = svgScale.getElementsByTagName('path')[0];
var svgs2 = svgScale.getElementsByTagName('path')[1];
var svgTween41 = KUTE.to(svgs1, { transform: {scale3d: [1.5,1.5,1] } }, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});
var svgTween42 = KUTE.to(svgs2, { svgTransform: { translate: 580, scale: 0.5,} }, {transformOrigin: '50% 50%', yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

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
  transform: {
    translateX: 250,
    scale3d: [1.5,1.5,1],
    rotateZ: 320,
    skewX: -15
  }
}, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

var svgTween52 = KUTE.to(svgm2, {
svgTransform: {
  translate: 830,
  scale: 1.5,
  rotate: 320,
  skewX: -15
}
}, { yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

mixedBtn.addEventListener('click', function(){
  !svgTween51.playing && svgTween51.start();
  !svgTween52.playing && svgTween52.start();
}, false);

// chained transforms
var svgChained = document.getElementById('svgChained');
var chainedBtn = document.getElementById('chainedBtn');
var svgc = svgChained.getElementsByTagName('path')[0];
var svgcTransform = svgc.getAttribute('transform');
var resetSVGTransform = function(){
  svgc.setAttribute('transform',svgcTransform);
};

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
{transformOrigin: [256,256], complete: resetSVGTransform, yoyo: true, repeat: 1, duration: 1500, easing: "easingCubicOut"});

chainedBtn.addEventListener('click', function(){
  !svgTween6.playing && svgTween6.start();
}, false);
