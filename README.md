# kute.js
A minimal Native Javascript tweening engine forked from <a href="https://github.com/tweenjs/tween.js">tween.js</a>. Since most of web developers don't actually use yoyo, repeat, play/pause/resume/timeline/whatever or tweening array values (processed with array interpolation functions), I've removed them. kute.js is like a merge of my own <a href="https://github.com/thednp/jQueryTween">jQueryTween</a> with tween.js, but generally it's a much more smarter build. You link the script at your ending <code>&lt;body&gt;</code> tag and write one line to do just about any animation you can think of.

# CDN
Thanks to jsdelivr, we have CDN link <a href="http://www.jsdelivr.com/#!kute.js">here</a>.

# Basic Usage
At a glance, you can write one line and you're done.
<pre>
//vanilla js
new KUTE.Animate(el,options);

//with jQuery plugin
$('selector').Kute(options);
</pre>


# Advanced Usage
Quite easily, you can write 'bit more lines and you're making the earth go round.
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

# Full distribution (12Kb min)
It does most of the animation work you need.
* size: width and height
* colors: text color and background-color (accepts values as HEX, RGB, RGBA, but the color is always HEX )
* transform: translate3D, scale, rotateX, rotateY, rotateZ
* position: top, left (ideal for IE9- translate3D(left,top,0) fallback)
* zoom: for scale on IE8 fallback
* backgroundPosition
* window scroll

# Base Distribution (9Kb min)
This distribution is much lighter and more suitable for most projects:
* size: width and height
* transform: translate3D, scale, rotateX, rotateY, rotateZ
* position: top, left (ideal for IE9- translate3D(left,top,0) fallback)
* zoom: for scale on IE8 fallback
* window scroll

#jQuery Plugin
That's right, there you have it, just a few bits of code to bridge the awesome kute.js to your jQuery projects.

# What else it does
* computes option values properly according to their measurement unit (px,%,deg,etc)
* properly handles IE10+ 3D transforms when elements have a perspective
* it converts RGBA & HEX colors to RGB and tweens the inner values, then ALWAYS updates color via HEX
* properly replaces top, centered or any other background position with proper value to be able to tween 
* for most supported properties it reads the current element style property value as initial value (via currentStyle || getComputedStyle)
* allows you to add 3 different callbacks: start, update, finish, and they can be set as tween options (so no more nested functions needed)
* since <code>translate3D</code> is best for performance, kute.js will always uses it
* accepts "nice & easy string" easing functions, like 'linear' or 'exponentialOut' (removes the use of the evil <code>eval</code>, making development easier and closer to fast development standards :)
* uses 31 easing functions, all Robert Penner's easing equations
* like mentioned above, for IE8 <code>zoom</code> is used for <code>transform: scale(0.5)</code>, it's not perfect as the object moves from it's floating point to the middle, and some left & top adjustments can be done, but to keep it simple and performance driven, I leave it as is, it's better than nothing. 

# Browser Support
Since most modern browsers can handle pretty much everything, legacy browsers need some help, so give them <a href="https://cdn.polyfill.io/v1/docs/">polyfills.io</a>. Also kute.js needs to know when doing stuff for IE9- like my other scripts here, I highy recommend <a href="http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/">Paul Irish's conditional stylesheets</a> guides to add <code>ie ie[version]</code> to your site's HTML tag.

# Demo 
coming soon..

# License
<a href="https://github.com/thednp/kute.js/blob/master/LICENSE">MIT License</a>
