# kute.js
A minimal <b>native Javascript</b> tweening engine with <b>jQuery</b> plugin, forked from <a href="https://github.com/tweenjs/tween.js">tween.js</a> with most essential options for web developers, designers and animators. Unlike the original script, KUTE.js delivers easy to use methods to set up high performance animations on the fly.

<b>kute.js</b> is like a merge of my own <a href="https://github.com/thednp/jQueryTween">jQueryTween</a> with tween.js, but generally it's a much more smarter build. You link the script at your ending <code>&lt;/body&gt;</code> tag and write one line to do just about any animation you can think of.

# CDN
Thanks to jsdelivr, we have CDN link <a href="http://www.jsdelivr.com/#!kute.js">here</a>.

# Basic Usage
At a glance, you can write one line and you're done.
```
//vanilla js
new KUTE.fromTo('selector', fromValues, toValues, options);

//with jQuery plugin
$('selector').Kute('fromTo', fromValues, toValues, options);
```


# Advanced Usage
Quite easily, you can write 'bit more lines and you're making the earth go round.
```
//vanilla js
KUTE.fromTo(el, {
  //options
    { translate: 0, opacity: 1 }, // fromValues
    { translate: 150, opacity: 0 }, 
    { duration: 500, delay: 0, easing	: 'exponentialInOut',
      start: functionOne, // run function when tween starts 
      complete: functionTwo, // run function when tween animation is finished
      update: functionThree // run function while tween running    
      stop: functionThree // run function when tween stopped    
      pause: functionThree // run function when tween paused    
      resume: functionThree // run function when resuming tween    
    }
  }
);
```

# Demo 
For documentation, examples and other cool tips, check the <a href="http://thednp.github.io/kute.js/">demo</a>.

#jQuery Plugin
That's right, there you have it, just a few bits of code to bridge the awesome `kute.js` to your jQuery powered projects/apps. The plugin can be found in the [/dist](https://github.com/thednp/kute.js/blob/master/dist/kute-jquery.min.js) folder.

# What else it does
* computes properties values properly according to their measurement unit (px,%,deg,etc)
* properly handles cross browser 3D `transform` when elements have a `perspective`, else the animation won't run
* it converts `HEX` colors to `RGB` and tweens the inner values, then ALWAYS updates color via `RGB`
* properly replaces `top`, `centered` or any other background position with proper value to be able to tween 
* for most supported properties it reads the current element computed style property value as initial value (via `currentStyle || getComputedStyle`)
* allows you to add many callbacks: `start`, `update`, `complete`, `pause`, `stop`, and they can be set as tween options
* since `translate3D` is best for performance, `kute.js` will always uses it
* accepts "nice & easy string" easing functions, like `linear` or `easingExponentialOut` (removes the use of the evil `eval`, making development safer easier and closer to standards :)
* uses 31 easing functions, all Robert Penner's easing equations and 2 more libraries
* handles browser prefixes for you as well.

# Browser Support
Since most modern browsers can handle pretty much everything, legacy browsers need some help, so give them <a href="https://cdn.polyfill.io/v2/docs/">polyfills.io</a>. Also `kute.js` needs to know when doing stuff for IE9- like my other scripts here, I highy recommend <a href="http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/">Paul Irish's conditional stylesheets</a> guides to add <code>ie ie[version]</code> to your site's HTML tag.

# License
<a href="https://github.com/thednp/kute.js/blob/master/LICENSE">MIT License</a>
