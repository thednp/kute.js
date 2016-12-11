# KUTE.js
A fully fledged native Javascript animation engine with most essential features for web developers, designers and animators, delivering easy to use methods to set up high performance, cross-browser animations. The focus is code quality, flexibility, performance and size (core engine is 17k min and 5.5k gzipped). 

Along with a simple jQuery plugin, KUTE.js packs plugins for presentation attributes, SVG transform, draw SVG strokes and path morphing, text string write up or number countdowns, plus additional CSS properties like colors, border-radius or typographic properties.

Because of it's modularity, KUTE.js makes it super easy to extend or override functionality, making it unique among Javascript animation engines.

# Demo / CDN
For documentation, examples and other cool tips, check the <a href="http://thednp.github.io/kute.js/">demo</a>. Thanks to jsdelivr, we have a CDN link <a target="_blank" href="http://www.jsdelivr.com/#!kute.js">here</a>. We also have cdnjs link <a href="https://cdnjs.com/libraries/kute.js" target="_blank">right here</a>. Sweet!

# Core Engine - [visit page](http://thednp.github.io/kute.js/examples.html)
* tween object methods: `.to()`, `.fromTo()`, `.allTo()`, `.allFromTo()`
* tween control methods: `.start()`, `.stop()`, `.pause()`, `.play()`
* 2D and 3D transforms: all except `matrix`, `matrix3d`, `scale3d`, `rotate3d`
* box model properties: `top`, `left`, `width`, `height`
* colors: `color`, `backgroundColor`
* scroll: vertical scroll animation for `window` or any element with `overflow: auto|scroll`
* options: `yoyo`, `duration`, `easing`, `repeat`, `delay`, `offset` (for tween collections), `repeatDelay` and other transform/plugins related options
* Robert Penner's easing functions
* extensible prototypes and utility methods
 
# SVG Plugin - [visit page](http://thednp.github.io/kute.js/svg.html)
* morphs SVGs with the `path` tween property, updating the `d` attribute of `<path>` or `<glyph>` elements
* cross-browser SVG `transform` via the `svgTransform` property and the `transform` presentation attribute, this feature also helps stacking transform functions on chained tweens
* draws SVG stroke with the `draw` tween property for most SVG elements: `<path>`, `<glyph>`, `<polygon>` or `<polyline>`, `<ellipse>` or `<circle>`, `<rect>`

# CSS Plugin - [visit page](http://thednp.github.io/kute.js/css.html)
* all box model properties: `margin`, `padding`, with all their variations like `marginTop`, all variations for `width` or `height` like `maxHeight` or `minWidth`, `outlineWidth`, `borderWidth` with all side variations, except short-hand notations
* `borderRadius` properties and all side variations, shorthand notations and early implementations are not supported
* color properties: `outlineColor`, `borderColor` with all side variations except shorthands, etc
* `clip` property only for `rect` type of values
* `backgroundPosition` property with the ability to understand strings like `top left` and such
* typographic properties: `fontSize`, `lineHeight`,  `lettersSpacing` and `wordSpacing` 

# Text Plugin - [visit page](http://thednp.github.io/kute.js/text.html)
* animated number increments/decreases
* writing text with a cool effect
 
# Attributes Plugin - [visit page](http://thednp.github.io/kute.js/attr.html)
* animates any numeric presentation attribute with suffixed value
* animates any other non-suffixed numeric presentation attribute
* animates `fill`, `stroke` and `stop-color` color properties
* handles attributes namespaces properly with `stroke-opacity` or `strokeOpacity`
* properly handles the suffixes for you and depends very much on the current values then values you input

# Easing Functions - [visit page](http://thednp.github.io/kute.js/easing.html)
**NOTE:** Starting with KUTE.js v 1.6.0 the Physics and Cubic Bezier Functions are removed from the distribution folder and from CDN repositories, but you can find them in the [Experiments repository on Github](https://github.com/thednp/kute.js/tree/experiments). The reasons for that is to make it easy to maintain what's more important: core code quality and the ability to create custom builds.</p>

* optimized dynamics easing functions
* optimized cubic-bezier easing functions

# jQuery Plugin
This aims to make the KUTE.js script work native within other jQuery apps but it's not always really needed as we will see in the second subchapter here. Since the demos don't insist on this particular plugin, we'll write some basics [right here](https://github.com/thednp/kute.js#using-the-jquery-plugin).

The plugin is just a few bits of code to bridge all of the `KUTE.js` methods to your jQuery apps. The plugin can be found in the [/master](https://github.com/thednp/kute.js/blob/master/kute-jquery.js) folder, CDN repositories and npm packages.

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
// CommonJS style
//grab the core
var kute = require("kute.js");
// Add SVG Plugin
require("kute.js/kute-svg");
// Add CSS Plugin
require("kute.js/kute-css");
// Add Attributes Plugin
require("kute.js/kute-attr");
// Add Text Plugin
require("kute.js/kute-text");

// AMD style
define([
    "kute.js", // core engine
    "kute.js/kute-jquery.js", // optional for jQuery apps
    "kute.js/kute-svg.js", // optional for SVG morph, draw and other SVG related CSS
    "kute.js/kute-css.js", // optional for additional CSS properties
    "kute.js/kute-attr.js", // optional for animating presentation attributes
    "kute.js/kute-text.js" // optional for string write and number incrementing animations
], function(KUTE){
    // your stuff happens here, for instance
    // KUTE.fromTo('some-selector',{translateX:150}).start();
});
```

# Basic Usage
At a glance, you can write one line and you're done.
```javascript
//vanilla js
KUTE.fromTo('selector', fromValues, toValues, options).start();

//with jQuery plugin
$('selector').fromTo(fromValues, toValues, options).start();
```

# Advanced Usage
Quite easily, you can write 'bit more lines and you're making the earth go round.
```javascript
//vanilla js is always the coolest
KUTE.fromTo(el,
    { translate: 0, opacity: 1 }, // fromValues
    { translate: 150, opacity: 0 }, // toValues
    
    // tween options object
    { duration: 500, delay: 0, easing	: 'exponentialInOut', // basic options

      // callbacks
      start: functionOne, // run function when tween starts
      complete: functionTwo, // run function when tween animation is finished
      update: functionFour // run function while tween running    
      stop: functionFive // run function when tween stopped    
      pause: functionSix // run function when tween paused    
      resume: functionSeven // run function when resuming tween    
    }
).start(); // this is to start animation right away
```

## Using the jQuery Plugin
Here's a KUTE.js jQuery Plugin example that showcases most common usage in future apps:
```javascript
// first we define the object(s)
$('selector').fromTo( // apply fromTo() method to selector
  
    { translate: 0, opacity: 1 }, // fromValues
    { translate: 150, opacity: 0 }, // toValues
    
    // tween options object
    { duration: 500, delay: 0, easing	: 'exponentialInOut', // basic options

      //callbacks
      start: functionOne, // run function when tween starts
      complete: functionTwo, // run function when tween animation is finished
      update: functionFour // run function while tween running    
      stop: functionFive // run function when tween stopped    
      pause: functionSix // run function when tween paused    
      resume: functionSeven // run function when resuming tween       
    }
).start(); // then we apply the tween control methods, like start
```

Starting with KUTE.js 1.5.7, the jQuery Plugin got lighter and uses the proper method automatically based on how many elements are returned from selector. If one element the proper single object method is used `fromTo()` or `to()` but if more than one elements are returned it will use `allFromTo()` or `allTo()`.

## Alternative usage in jQuery powered applications
When size matters, you can handle animations inside jQuery applications without the plugin. Here's how:
```javascript
var tween = KUTE.fromTo($('selector')[0], fromValues, toValues, options);

// or simply provide a class|id selector, just like the usual
var tween = KUTE.fromTo('#myElement', fromValues, toValues, options);

tween.start();
```
Pay attention to that `$('selector')[0]` as jQuery always creates an array of selected objects and not a single object, that is why we need to target a single HTML object for our tween object and not a colection of objects. 

HTMLCollection objects should be handled with `allFromTo()` or `allTo()` methods.

```javascript
var tween = KUTE.allFromTo($('selector'), fromValues, toValues, options);
tween.start();
```

# How it works
* it computes all the values before starting the animation, then caches them to avoid layout thrashing that occur during animation
* handles all kinds of `transform` properties and makes sure to always use the same order of the `transform` properties (`translate`, `rotate`, `skew`, `scale`)
* allows you to set `perspective` for an element or it's parent for 3D transforms
* computes properties' values properly according to their measurement unit (px,%,deg,etc)
* properly handles cross browser 3D `transform` with `perspective` and `perspective-origin` for element or it's parent
* converts `HEX` colors to `RGB` and tweens the numeric values, then ALWAYS updates color via `RGB`
* properly replaces `top`, `centered` or any other background position with proper value to be able to tween
* for most supported properties it reads the current element computed style property value as initial value (via `currentStyle || getComputedStyle`)
* because it can read properties values from previous tween animations, KUTE.js can do some awesome chaining with it's `.to()` method
* allows you to add many callbacks: `start`, `update`, `complete`, `pause`, `stop`, and they can be set as tween options
* since `translate3D` is best for movement animation performance, `kute.js` will always use it
* accepts "nice & easy string" easing functions, like `linear` or `easingExponentialOut` (removes the use of the evil `eval`, making development safer, easier and closer to standards :)
* uses all 31 Robert Penner's easing functions, as well as any other custom functions such as bezier and physics based easing functions
* handles browser prefixes for you for `transform`, `perspective`, `perspective-origin` and `requestAnimationFrame`
* all this is possible with a core script of less than 20k size!

# Browser Support
Since most modern browsers can handle pretty much everything, legacy browsers need some help, so give them <a href="https://cdn.polyfill.io/v2/docs/">polyfills</a>. I also packed a small polyfill set with most essential features required by KUTE.js to work, it's called [minifill](https://github.com/thednp/minifill), try it.

# Contributions
* Dav aka [@dalisoft](https://github.com/dalisoft) contributed a great deal for the performance and functionality of KUTE.js
* [Ingwie Phoenix](https://github.com/IngwiePhoenix): RequireJS/CommonJS compatibility and usability with common package managers
* Others who [contribute](https://github.com/thednp/kute.js/graphs/contributors) to the project

# License
<a href="https://github.com/thednp/kute.js/blob/master/LICENSE">MIT License</a>