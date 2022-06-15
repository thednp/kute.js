var SpicrMainDemo = document.getElementById('SpicrDemo');

function initMainSpicr(){
	new Spicr(SpicrMainDemo);
}

function loadCarouselMedia(){
	new dll(SpicrMainDemo,initMainSpicr)
}

document.addEventListener('DOMContentLoaded', function loadWrapper(){
	loadCarouselMedia();
	document.removeEventListener('DOMContentLoaded', loadWrapper, false)
}, false);