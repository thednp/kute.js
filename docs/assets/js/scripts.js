// common demo JS
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// toggles utility
var toggles = document.querySelectorAll('[data-function="toggle"]');

function closeToggles(el){
  el.classList.remove('open');
}

function classToggles(el){
  el.classList.toggle('open');
}

document.addEventListener('click', function(e){
  if (e && !e.target.classList) {return;}

  var target = e.target.parentNode.tagName === 'LI' || e.target.parentNode.classList && e.target.parentNode.classList.contains('btn-group') ? e.target : e.target.parentNode, 
      parent = target.parentNode;
  for (var i = 0, l = toggles.length; i<l; i++ ){
    if ( (parent && parent.tagName === 'LI' || parent && parent.classList && parent.classList.contains('btn-group')) && toggles[i] === target ) {
      classToggles(parent);
    } else {
      closeToggles(toggles[i].parentNode);
    }
  }
  
  target instanceof Element && target.getAttribute('data-function') && /^#$/.test(target.getAttribute('href')) && e.preventDefault();
}, false);