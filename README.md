# KUTE.js
A minimal <b>native Javascript</b> tweening engine with <b>jQuery</b> plugin, forked from <a href="https://github.com/tweenjs/tween.js">tween.js</a> with most essential options for web developers, designers and animators. Unlike the original script, KUTE.js delivers easy to use methods to set up high performance animations on the fly.

<b>KUTE.js</b> is like a merge of my own <a href="https://github.com/thednp/jQueryTween">jQueryTween</a> with tween.js, but generally it's a much more smarter build. You link the script at your ending <code>&lt;/body&gt;</code> tag and write one line to do just about any animation you can think of.

# CDN
Thanks to jsdelivr, we have CDN link <a target="_blank" href="http://www.jsdelivr.com/#!kute.js">here</a>.

# Demo
For documentation, examples and other cool tips, check the <a href="http://thednp.github.io/kute.js/">demo</a>.

# NPM/Bower
You can install this through NPM or bower respectively:
```
    $ npm install kute.js
    # or
    $ bower install kute.js
```

# CommonJS/AMD support
You can use this module through any of the common javascript module systems. For instance:

```javascript
// NodeJS/CommonJS style
var kute = require("kute.js");
// Add Bezier Easing
require("kute.js/kute-bezier");
// Add Physics Easing
require("kute.js/kute-physics");

// AMD
define([
    "kute.js",
    "kute.js/kute-bezier.js",
    "kute.js/kute-physics.js"
], function(KUTE){
    // ...
});
```

# Basic Usage
At a glance, you can write one line and you're done.
```javascript
//vanilla js
new KUTE.fromTo('selector', fromValues, toValues, options);

//with jQuery plugin
$('selector').KUTE('fromTo', fromValues, toValues, options);
```

# Advanced Usage
Quite easily, you can write 'bit more lines and you're making the earth go round.
```javascript
//vanilla js is always the coolest
KUTE.fromTo(el, {
  //options
    { translate: 0, opacity: 1 }, // fromValues
    { translate: 150, opacity: 0 }, // toValues
    { duration: 500, delay: 0, easing	: 'exponentialInOut', // basic options

      //callbacks
      start: functionOne, // run function when tween starts
      complete: functionTwo, // run function when tween animation is finished
      update: functionThree // run function while tween running    
      stop: functionThree // run function when tween stopped    
      pause: functionThree // run function when tween paused    
      resume: functionThree // run function when resuming tween    
    }
  }
).start();
```

#jQuery Plugin
That's right, there you have it, just a few bits of code to bridge the awesome `kute.js` to your jQuery powered projects/apps. The plugin can be found in the [/master](https://github.com/thednp/kute.js/blob/master/kute-jquery.js) folder.

# What else it does
* it computes all the values before starting the animation, then caches them to avoid layout thrashing that could occur during animation
* handles all kinds of `transform` properties and makes sure to always use the same order of the `transform functions` (`translate`, `rotate`, `skew`, `scale`)
* computes properties' values properly according to their measurement unit (px,%,deg,etc)
* properly handles cross browser 3D `transform` with `perspective` and `perspective-origin` for element or it's parent
* converts `HEX` colors to `RGB` and tweens the numeric values, then ALWAYS updates color via `RGB`
* properly replaces `top`, `centered` or any other background position with proper value to be able to tween
* for most supported properties it reads the current element computed style property value as initial value (via `currentStyle || getComputedStyle`)
* because it can read properties values from previous tween animations, KUTE.js can do some awesome chaining with it's `.to()` method
* allows you to add many callbacks: `start`, `update`, `complete`, `pause`, `stop`, and they can be set as tween options
* since `translate3D` is best for movement animation performance, `kute.js` will always use it
* accepts "nice & easy string" easing functions, like `linear` or `easingExponentialOut` (removes the use of the evil `eval`, making development safer easier and closer to standards :)
* uses all 31 Robert Penner's easing functions, as well as bezier and physics easing functions
* handles browser prefixes for you for `transform`, `perspective`, `perspective-origin`, `border-radius` and `requestAnimationFrame`
* all this is possible with a core script of less than 20k size!

# Browser Support
Since most modern browsers can handle pretty much everything, legacy browsers need some help, so give them <a href="https://cdn.polyfill.io/v2/docs/">polyfills</a>. I also packed a small polyfill set with most essential features required by KUTE.js to work, it's called [minifill](https://github.com/thednp/minifill), try it.

# Contributions
* Dav aka [@dalisoft](https://github.com/dalisoft) contributed a great deal for the performance and functionality of KUTE.js
* [Ingwie Phoenix](https://github.com/IngwiePhoenix): RequireJS/CommonJS compatibility and usability with common package managers
* Others who [contribute](https://github.com/thednp/kute.js/graphs/contributors) to the project

# License
<a href="https://github.com/thednp/kute.js/blob/master/LICENSE">MIT License</a>
