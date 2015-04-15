# kute.js
A minimal Native Javascript tweening engine forked from <a href="https://github.com/tweenjs/tween.js">tween.js</a>. Since most of web developers don't actually use yoyo, repeat, play/pause/resume/timeline/whatever or tweening array values (processed with array interpolation functions), I've removed them. kute.js is like a merge of my own <a href="https://github.com/thednp/jQueryTween">jQueryTween</a> with tween.js, but generally it's a much more smarter build. You link the script at your ending <code>&lt;body&gt;</code> tag and write one line.

# Basic Usage
At a glance, you can write one line and you're done.
<pre>
//vanilla js
new Kute.Animate(el,options);

//with jQuery plugin
$('selector').Kute(options);
</pre>


# Advanced Usage
At a glance, you can write more lines and you're making the earth go round.
<pre>
//vanilla js
new KUTE.Animate(el, {
  //options
    from	: {},
    to	: {}, 
    duration: 500,
    delay	: 0,
    easing	: 'exponentialInOut',
		start			: functionOne, // run function when tween starts 
		finish			: functionTwo, // run function when tween finishes
		special			: functionThree // run function while tween runing    
  }
);

//with jQuery plugin
$('selector'). Kute({
  //options
    from	: {},
    to	: {}, 
    duration: 500,
    delay	: 0,
    easing	: 'exponentialInOut',
		start			: functionOne, // run function when tween starts 
		finish			: functionTwo, // run function when tween finishes
		special			: functionThree // run function while tween runing    
  }
);
</pre>

# Full distribution
It does most of the animation work you need.
* size: width and height
* colors: text color and background-color (values )
* transform: translate3D, scale, rotateX, rotateY, rotateZ
* position: top, right, bottom, left (ideal for IE9- fallback)
* zoom: for IE8 fallback
* backgroundPosition
* window scroll

# Base Distribution
This distribution is much lighter and more suitable for most projects:
* size: width and height
* transform: translate3D, scale, rotateX, rotateY, rotateZ
* position: top, left (ideal for IE9- fallback)
* zoom: for IE8 fallback
* window scroll

# What else it does
* computes option values properly according to their measurement unit (px,%,deg,etc)
* it converts RGBA & HEX colors to RGB and tweens the inner values, then ALWAYS updates color via HEX
* properly replaces top, centered or any other background position with proper value to be able to tween 
* for most supported properties it reads the current element property values as initial values (via currentStyle || getComputedStyle)
* allows you to add 3 different callbacks: start, update, finish, and they can be set as tween options (so no more nested functions needed)
* since translate3D is best for performance, kute.js always uses it
* accepts "nice & easy string" easing functions, like 'linear' or 'exponentialOut' (removes the use of the evil <code>eval</code>, making development easier and closer to fast development standards :)
* uses 31 easing functions, all Robert Penner's easing equations

# Demo 
coming soon..

# License
<a href="https://github.com/thednp/kute.js/blob/master/LICENSE">MIT License</a>
