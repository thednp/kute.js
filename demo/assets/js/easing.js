// some regular checking
var isIE = (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null) ? parseFloat( RegExp.$1 ) : false,
	isIE8 = isIE === 8,
	isIE9 = isIE === 9;

/* EASINGS EXAMPLES */
var featurettes = document.querySelectorAll('.featurettes'), l=featurettes.length,
    esProp1 = isIE && isIE < 9 ? { left:0 } : { translate: 0},
    esProp2 = isIE && isIE < 9 ? { left:250 } : { translate: 250},
    tweenEasingElements = [], easings = [], startEasingTween = [], easingSelectButton = [], tweenEasing1 = [], tweenEasing2 = [];

// populate tween objects, triggers, elements
for (var i=0; i<l; i++) {
  tweenEasingElements.push(featurettes[i].querySelectorAll('.easing-example'));
  easings.push(featurettes[i].querySelector('.easings'));
  startEasingTween.push(featurettes[i].querySelector('.startEasingTween'));
  easingSelectButton.push(featurettes[i].querySelector('.easingSelectButton'));
  tweenEasing1.push(KUTE.fromTo(featurettes[i].querySelectorAll('.easing-example')[0], esProp1, esProp2, { duration: 1000, easing: 'linear', repeat: 1, yoyo: true}));
  tweenEasing2.push(KUTE.fromTo(featurettes[i].querySelectorAll('.easing-example')[1], esProp1, esProp2, { duration: 1000, easing: 'linear', repeat: 1, yoyo: true}));
}

// override core processEasing to be able to use predefined bezier and physics functions
KUTE.processEasing = function (fn) { //process easing function
  if ( typeof fn === 'function') {
    return fn;
  } else if ( typeof fn === 'string' ) {
    if ( /easing|linear/.test(fn) ) {
      return window.Easing[fn]; // regular Robert Penner Easing Functions
    } else if ( /bezier/.test(fn) )  { 
      var bz = fn.replace(/bezier|\s|\(|\)/g,'').split(',');
      return window.Bezier( bz[0]*1,bz[1]*1,bz[2]*1,bz[3]*1 ); //bezier fn            
    } else if ( /physics/.test(fn) )  {
      return window.Physics[fn].apply(this); // predefined physics bezier based fn functions
    } else {
      return window.Ease[fn].apply(this); // predefined bezier based fn functions
    }
  }
};

// update tween objects and update dropdown
for (var j=0; j<l; j++) {
  function cHandler(e){
    var es = e.target.innerHTML, g = window,
        _j = easingSelectButton.indexOf(e.target.parentNode.parentNode.querySelector('.easingSelectButton')); 
    easingSelectButton[_j].innerHTML = es;
    tweenEasingElements[_j][1].innerHTML = es;
    if (es === 'gravity') {
      tweenEasing2[_j].options.easing = g.gravity({elasticity:200,bounciness:600});
    } else if (es === 'forceWithGravity') {
      tweenEasing2[_j].options.easing = g.forceWithGravity({elasticity:100,bounciness:600});
    } else if (es === 'spring') {
      tweenEasing2[_j].options.easing = g.spring({friction:100,frequency:600});
    } else if (es === 'bounce') {
      tweenEasing2[_j].options.easing = g.bounce({friction:100,frequency:600});
    } else if (es === 'bezier') {
      tweenEasing2[_j].options.easing = g.BezierMultiPoint({points: [{"x":0,"y":0,"cp":[{"x":0.483,"y":0.445}]},{"x":1,"y":1,"cp":[{"x":0.009,"y":0.997}]}] });
    } else if (es === 'multiPointBezier') {
      tweenEasing2[_j].options.easing = g.BezierMultiPoint({points: [{"x":0,"y":0,"cp":[{"x":0.387,"y":0.007}]},{"x":0.509,"y":0.48,"cp":[{"x":0.069,"y":0.874},{"x":0.928,"y":0.139}]},{"x":1,"y":1,"cp":[{"x":0.639,"y":0.988}]}] });
    } else {
      tweenEasing2[_j].options.easing = KUTE.processEasing(es) || KUTE.processEasing('linear'); 
    }
  }
  easings[j].addEventListener('click', cHandler, false);
}

// attach click handlers to start buttons
for (var k=0; k<l; k++) {
  function sHandler(e){
    var _k = startEasingTween.indexOf(e.target);
    e.preventDefault();
    !tweenEasing1[_k].playing && tweenEasing1[_k].start();
    !tweenEasing2[_k].playing && tweenEasing2[_k].start();
  }
  startEasingTween[k].addEventListener('click', sHandler, false);
}

/* EASINGS EXAMPLES */