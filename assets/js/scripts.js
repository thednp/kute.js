// common demo JS
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// utility functions
function addClass(el,c) { // where modern browsers fail, use classList	
    if (el.classList) { el.classList.add(c); } else { el.className += ' '+c; el.offsetWidth; }
}
function removeClass(el,c) {
    if (el.classList) { el.classList.remove(c); } else { el.className = el.className.replace(c,'').replace(/^\s+|\s+$/g,''); el.offsetWidth; }
}

//scroll top?
var toTop = document.getElementById('toTop'),
    toTopTween = KUTE.to( 'window', { scroll: 0 }, {easing: 'easingQuarticOut', duration : 1500  } );

toTop.addEventListener('click',topHandler,false);

function topHandler(e){
	e.preventDefault(); 
    toTopTween.start();
}

// toggles utility
var toggles = document.querySelectorAll('[data-function="toggle"]');
for (var i = 0, l = toggles.length; i< l; i ++ ){
    toggles[i].addEventListener('click', toggleClass, false);
}

function toggleClass(e){
    e.preventDefault();
    var pr = this.parentNode;
    if (!/open/.test(pr.className)){
        addClass(pr,'open');
    } else {
        removeClass(pr,'open');
    }
}

function closeToggles(el){
    var pr = el.parentNode;
    if (/open/.test(pr.className)){
        removeClass(pr,'open');
    }
}

document.addEventListener('click', function(e){
    for (var i = 0, l = toggles.length; i< l; i ++ ){
        if (toggles[i]!==e.target) closeToggles(toggles[i]);
    }
}, false);