
// invalidate for unsupported browsers
var isIE = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) !== null ? parseFloat( RegExp.$1 ) : false;
if (isIE&&isIE<9) { (function(){return; }()) } // return if SVG API is not supported

// the range slider
var rangeSlider = document.querySelector('input[type="range"');

// basic morph, only fromTo and allFromTo should work
var morphTween = KUTE.fromTo('#rectangle', { path: '#rectangle' }, { path: '#star' }, { duration: 2500, /*repeat: Infinity, yoyo: true,*/ } );  

var progressBar = new KUTE.ProgressBar(rangeSlider,morphTween)

document.getElementById('rectangle').addEventListener('click',function(){
  !morphTween.playing && morphTween.start()
})