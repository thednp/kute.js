// radius attribute
// var radiusTween = KUTE.to('#circle', {attr: {r: '75px'} }, {repeat:1, yoyo: true, easing: 'easingCubicOut'});
var radiusTween = KUTE.to('#circle', {attr: {r: '75%'} }, {repeat:1, yoyo: true, easing: 'easingCubicOut'});
    
// coordinates of the circle center
var coordinatesTween1 = KUTE.to('#circle', {attr: {cx:40,cy:40,fillOpacity:0.3}}, { duration: 300, easing: 'easingCubicOut'});
var coordinatesTween2 = KUTE.to('#circle', {attr: {cx:110,cy:40}}, { duration: 400,  easing: 'linear'});
var coordinatesTween3 = KUTE.to('#circle', {attr: {cx:75,cy:75,fillOpacity:1}}, { easing: 'easingCubicOut'});

try{
    coordinatesTween1.chain(coordinatesTween2);
    coordinatesTween2.chain(coordinatesTween3);
    coordinatesTween3.chain(radiusTween);
}catch(e){
    console.error(e+". TweenBase doesn\'t support chain method")
}


var circleBtn = document.getElementById('circleBtn');
circleBtn.addEventListener('click', function(){
    !coordinatesTween1.playing && !coordinatesTween2.playing && !coordinatesTween3.playing && !radiusTween.playing && coordinatesTween1.start();
});


// coordinates of gradient
var gradBtn = document.getElementById('gradBtn');
var closingGradient = KUTE.to('#gradient',{attr: {x1:'49%', x2:'49%', y1:'49%', y2:'51%'}}, {easing: 'easingCubicInOut'});
var rotatingGradient1 = KUTE.to('#gradient',{attr: {x1:'49%', x2:'51%', y1:'51%', y2:'51%'}}, {easing: 'easingCubicInOut'});
var rotatingGradient2 = KUTE.to('#gradient',{attr: {x1:'0%', x2:'51%', y1:'100%', y2:'0%'}}, {easing: 'easingCubicInOut'});
var openingGradient = KUTE.to('#gradient',{attr: {x1:'0%', x2:'0%', y1:'0%', y2:'100%'}}, {duration: 1500, easing: 'easingCubicInOut'});

try{
    closingGradient.chain(rotatingGradient1);
    rotatingGradient1.chain(rotatingGradient2);
    rotatingGradient2.chain(openingGradient);
}catch(e){
    console.error(e+". TweenBase doesn\'t support chain method")
}

gradBtn.addEventListener('click', function(){
    !closingGradient.playing && !rotatingGradient1.playing && !rotatingGradient2.playing && !openingGradient.playing && closingGradient.start();
});

// fill color
var fillBtn = document.getElementById('fillBtn');
var fillAttribute = KUTE.to('#fill',{attr: {fill: 'red'}}, {duration: 1500, repeat: 1, yoyo: true });
fillBtn.addEventListener('click', function(){
    !fillAttribute.playing && fillAttribute.start();
});