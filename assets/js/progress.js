(function(){

    // invalidate for unsupported browsers
    var isIE = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) !== null ? parseFloat( RegExp.$1 ) : false;
    if (isIE&&isIE<9) { (function(){return; }()) } // return if SVG API is not supported

    // basic morph, only fromTo and allFromTo should work
    var morphTween = KUTE.fromTo('#rectangle', { path: '#rectangle' }, { path: '#star' }, { morphIndex: 127 });

    // the range slider
    var rangeSlider = document.querySelector('input[type="range"');

    rangeSlider.addEventListener('input',function(){
        var tick = 0.00001; // we need a value that's slightly above 0, math is hard in JavaScript
        KUTE.update.call(morphTween, this.value * morphTween.options.duration + tick)
    })

}())