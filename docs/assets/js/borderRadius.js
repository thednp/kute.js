
/* RADIUS EXAMPLES */
var radiusBtn = document.getElementById('radiusBtn');
var allRadius = KUTE.to('#allRadius',{borderRadius:80},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var tlRadius = KUTE.to('#tlRadius',{borderTopLeftRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var trRadius = KUTE.to('#trRadius',{borderTopRightRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var blRadius = KUTE.to('#blRadius',{borderBottomLeftRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
var brRadius = KUTE.to('#brRadius',{borderBottomRightRadius:150},{duration: 1500, easing:'easingCubicOut', repeat: 1, yoyo: true});
radiusBtn.addEventListener('click',function(){
    if (!allRadius.playing) { allRadius.start(); tlRadius.start(); trRadius.start(); blRadius.start(); brRadius.start(); }
}, false);
/* RADIUS EXAMPLES */