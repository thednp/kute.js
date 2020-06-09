// basic morph
var morphTween = KUTE.to('#rectangle', { path: '#star' }, {
  duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
});
var morphTween1 = KUTE.to('#rectangle1', { path: '#star1' }, {
  duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'
});

var morphBtn = document.getElementById('morphBtn');
morphBtn.addEventListener('click', function(){
  !morphTween.playing && morphTween.start() && morphTween1.start()
}, false);

// multishape morph 
var multiMorphBtn = document.getElementById('multiMorphBtn');
var multiMorph1 = KUTE.fromTo('#w11', { path: '#w11', attr:{ fill: "rgb(233,27,31)" }  }, { path: '#w21', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph2 = KUTE.fromTo('#w12', { path: '#w12', attr:{ fill: "rgb(255,87,34)" }  }, { path: '#w22', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph3 = KUTE.fromTo('#w13', { path: '#w13', attr:{ fill: "rgb(76,175,80)" }  }, { path: '#w23', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph4 = KUTE.fromTo('#w14', { path: '#w14', attr:{ fill: "rgb(33,150,243)" } }, { path: '#w24', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

var multiMorph11 = KUTE.fromTo('#w111', { path: '#w111', attr:{ fill: "rgb(233,27,31)" }  }, { path: '#w211', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph21 = KUTE.fromTo('#w121', { path: '#w121', attr:{ fill: "rgb(255,87,34)" }  }, { path: '#w221', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph31 = KUTE.fromTo('#w131', { path: '#w131', attr:{ fill: "rgb(76,175,80)" }  }, { path: '#w231', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph41 = KUTE.fromTo('#w141', { path: '#w141', attr:{ fill: "rgb(33,150,243)" } }, { path: '#w241', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

var multiMorph1s = KUTE.fromTo('#s11', { path: '#s11', attr:{ fill: "rgb(233,27,31)" }  }, { path: '#s23', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph2s = KUTE.fromTo('#s12', { path: '#s12', attr:{ fill: "rgb(255,87,34)" }  }, { path: '#s21', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph3s = KUTE.fromTo('#s13', { path: '#s13', attr:{ fill: "rgb(76,175,80)" }  }, { path: '#s24', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var multiMorph4s = KUTE.fromTo('#s14', { path: '#s14', attr:{ fill: "rgb(33,150,243)" } }, { path: '#s22', attr:{ fill: "#56C5FF" } }, { reverseSecondPath: true, duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

multiMorphBtn.addEventListener('click', function(){
  !multiMorph1.playing && multiMorph1.start() && multiMorph11.start() && multiMorph1s.start();
  !multiMorph2.playing && multiMorph2.start() && multiMorph21.start() && multiMorph2s.start();
  !multiMorph3.playing && multiMorph3.start() && multiMorph31.start() && multiMorph3s.start();
  !multiMorph4.playing && multiMorph4.start() && multiMorph41.start() && multiMorph4s.start();
}, false);

// complex multi morph
var compliMorphBtn = document.getElementById('compliMorphBtn');
var compliMorph1 = KUTE.fromTo('#rectangle-container', {path: '#rectangle-container', attr:{ fill: "#2196F3"} }, { path: '#circle-container', attr:{ fill: "#FF5722"} }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph2 = KUTE.fromTo('#symbol-left', {path: '#symbol-left'},  { path: '#eye-left' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph3 = KUTE.fromTo('#symbol-left-clone', {path: '#symbol-left-clone'},  { path: '#mouth' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph4 = KUTE.fromTo('#symbol-right', {path: '#symbol-right'},  { path: '#eye-right' }, {  duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

var compliMorph11 = KUTE.fromTo('#rectangle-container1', {path: '#rectangle-container1', attr:{ fill: "#9C27B0"} }, { path: '#circle-container1', attr:{ fill: "#FF5722"} }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph21 = KUTE.fromTo('#symbol-left1', {path: '#symbol-left1'},  { path: '#eye-left1' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph31 = KUTE.fromTo('#symbol-left-clone1', {path: '#symbol-left-clone1'},  { path: '#mouth1' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph41 = KUTE.fromTo('#symbol-right1', {path: '#symbol-right1'},  { path: '#eye-right1' }, {  duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

var compliMorph12 = KUTE.fromTo('#rectangle-container2', {path: '#rectangle-container2', attr:{ fill: "#e91b1f"} }, { path: '#circle-container2', attr:{ fill: "#FF5722"} }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph22 = KUTE.fromTo('#symbol-left2', {path: '#symbol-left2'},  { path: '#eye-left2' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph32 = KUTE.fromTo('#sample-shape2', {path: '#sample-shape2'},  { path: '#mouth2' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});
var compliMorph42 = KUTE.fromTo('#symbol-right2', {path: '#symbol-right2'},  { path: '#eye-right2' }, { duration: 2000, repeat: 1, yoyo: true, easing: 'easingCubicOut'});

compliMorphBtn.addEventListener('click', function(){
  !compliMorph1.playing && compliMorph1.start() && compliMorph11.start() && compliMorph12.start();
  !compliMorph2.playing && compliMorph2.start() && compliMorph21.start() && compliMorph22.start();
  !compliMorph3.playing && compliMorph3.start() && compliMorph31.start() && compliMorph32.start();
  !compliMorph4.playing && compliMorph4.start() && compliMorph41.start() && compliMorph42.start();
}, false);