var frontpage = document.getElementsByClassName('frontpage'),
		rectangle = document.getElementById('rectangle'),
		star = document.getElementById('star'),
		hexagon = document.getElementById('hexagon'),
		cat = document.getElementById('cat'),
		circle = document.getElementById('circle'),
		head = document.getElementById('head'),
		winkyFace = document.getElementById('winky-face'),
		dropInitial = document.getElementById('drop-initial'),
		drop = document.getElementById('drop'),
		mouth = document.getElementById('mouth'),
		eyeLeft = document.getElementById('eye-left'),
		eyeRight = document.getElementById('eye-right'),
		heading = document.querySelector('h2.nomargin'),
		plead = document.querySelector('p.lead')

var t0 = KUTE.to(rectangle,{translateX:0, opacity:1 }, { easing:'easingCubicOut'}),
		t1 = KUTE.fromTo(rectangle,{path:rectangle, attr: {fill: rectangle.getAttribute('fill') }}, {path:star, attr: {fill: star.getAttribute('fill') }}, {morphPrecision: 5, easing:'easingCubicOut'}),
		t2 = KUTE.fromTo(rectangle,{path:star, rotateZ: 0, attr: {fill: rectangle.getAttribute('fill') }}, {path:hexagon, rotateZ: 360, attr: {fill: hexagon.getAttribute('fill') }}, {morphPrecision: 5, easing:'easingCubicOut'}),
		t3 = KUTE.fromTo(rectangle,{path:hexagon, attr: {fill: rectangle.getAttribute('fill') }}, {path:cat, attr: {fill: cat.getAttribute('fill') }}, {morphPrecision: 5, easing:'easingCubicOut'}),
		t4 = KUTE.fromTo(rectangle,{path:cat, attr: {fill: rectangle.getAttribute('fill') }}, {path:circle, attr: {fill: circle.getAttribute('fill') }}, {morphPrecision: 5, easing:'easingCubicOut'}),
		t5 = KUTE.fromTo(rectangle,{path:circle, attr: {fill: rectangle.getAttribute('fill') }}, {path:head, attr: {fill: head.getAttribute('fill') }}, {morphPrecision: 5, easing:'easingCubicOut'}),
		t6 = KUTE.fromTo(dropInitial,{path: dropInitial,opacity:1},{path: drop,opacity:1}, {morphPrecision: 5, easing:'easingCubicOut', onComplete: mergeLogo}),
		t7 = KUTE.to(mouth,{opacity:1}),
		t8 = KUTE.to(eyeLeft,{opacity:1}),
		t9 = KUTE.to(eyeRight,{opacity:1}),
		t10 = KUTE.fromTo(winkyFace,{opacity:0,translateY:50},{opacity:1,translateY:0},{easing:'easingCubicOut'}),
		t11 = KUTE.to(eyeLeft,{path:'#eye-left-closed'}, {morphPrecision: 5}, {easing:'easingCubicOut'}),
		t12 = KUTE.to(eyeRight,{path:'#eye-right-closed'}, {morphPrecision: 5}, {easing:'easingCubicOut'}),
		t13 = KUTE.to(mouth,{path:'#mouth-happy'}, {morphPrecision: 5, easing:'easingCubicOut', duration:3500}),
		loop1 = KUTE.to(rectangle,{ attr: {fill: '#52aef7' }}, {duration: 1500}),
		loop2 = KUTE.to(rectangle,{ attr: {fill: '#f98f6d' }}, {duration: 1500}),
		loop3 = KUTE.to(rectangle,{ attr: {fill: '#f95054' }}, {duration: 1500}),
		loop4 = KUTE.to(rectangle,{ attr: {fill: '#ffd626' }}, {duration: 1500}),
		loop5 = KUTE.to(rectangle,{ attr: {fill: '#d661ea' }}, {duration: 1500}),
		showText = KUTE.to(heading,{opacity: 1},{duration: 3000}),
		showText1 = KUTE.fromTo(heading,{ text: ''},{ text:heading.getAttribute('data-text')},{duration: 1500}),
		showText2 = KUTE.fromTo(plead,{ text:''}, { text:plead.getAttribute('data-text')},{duration: 3500, onComplete: textComplete}),
		showBTNS = KUTE.allFromTo('.btns .btn',{opacity: 0, translate3d: [150,50,0]}, {opacity: 1, translate3d: [0,0,0]},{duration: 500, offset: 250, delay: 500, easing: 'easingBackOut'})

function mergeLogo(){
	rectangle.setAttribute('d', rectangle.getAttribute('d')+ drop.getAttribute('d') )
	dropInitial.style.opacity = 0
}
function textComplete(){
	heading.removeAttribute('data-text')
	plead.removeAttribute('data-text')
	showBTNS.start()
}

t0.chain(t1)
t1.chain(t2)
t2.chain(t3)
t3.chain(t4)
t4.chain([t5,t6])
t6.chain([t7,t8,t9])
t9.chain([t10,t11,t12,t13])

t8.chain([loop1,showText,showText1])
showText1.chain(showText2)

loop1.chain(loop2)
loop2.chain(loop3)
loop3.chain(loop4)
loop4.chain(loop5)
loop5.chain(loop1)

t0.start()