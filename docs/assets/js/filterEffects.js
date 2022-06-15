
/*  FILTER EFFECTS EXAMPLES */
var filterExamples = document.getElementById('filter-examples'),
    filterBtn = filterExamples.querySelector('.btn'),
    fe1 = filterExamples.getElementsByTagName('div')[0],
    fe2 = filterExamples.getElementsByTagName('div')[1],
    fe3 = filterExamples.getElementsByTagName('div')[2],
    fe4 = filterExamples.getElementsByTagName('div')[3],
    fe1Tween = KUTE.to(fe1, {filter :{ url: '#mySVGFilter', blur: 0.05, saturate: 10 }}, {easing: 'easingCubicOut', duration: 1500, repeat:1, yoyo: true}),
    fe2Tween = KUTE.to(fe2, {filter :{ url: '#mySVGFilter', sepia: 50, invert: 80 }}, {easing: 'easingCubicOut', duration: 1500, repeat:1, yoyo: true}),
    fe3Tween = KUTE.to(fe3, {filter :{ url: '#mySVGFilter', saturate: 150, brightness: 60 }}, {easing: 'easingCubicOut', duration: 1500, repeat:1, yoyo: true}),   
    fe4Tween = KUTE.to(fe4, {filter :{ url: '#mySVGFilter', opacity: 40, hueRotate: 45, dropShadow:[-10,-10,5,{r:0,g:0,b:0,a:1}] }}, {easing: 'easingCubicOut', duration: 1500, repeat:1, yoyo: true});
filterBtn.addEventListener('click', function(){
    !fe1Tween.playing && fe1Tween.start();
    !fe2Tween.playing && fe2Tween.start();
    !fe3Tween.playing && fe3Tween.start();
    !fe4Tween.playing && fe4Tween.start();
}, false);