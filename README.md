# KUTE.js
[![ci](https://github.com/thednp/kute.js/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/kute.js/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/kute.js.svg)](https://www.npmjs.com/package/kute.js)
[![NPM Downloads](https://img.shields.io/npm/dm/kute.js.svg)](http://npm-stat.com/charts.html?package=kute.js)
[![jsDeliver](https://img.shields.io/jsdelivr/npm/hw/kute.js)](https://www.jsdelivr.com/package/npm/kute.js)
[![CDNJS](https://img.shields.io/cdnjs/v/kute.js.svg)](https://cdnjs.com/libraries/kute.js)
![svg-path-commander version](https://img.shields.io/badge/svg--path--commander-1.0.4-brightgreen)
![@thednp/bezier-easing version](https://img.shields.io/badge/@thednp/bezier--easing-1.0.1-brightgreen)
![typescript version](https://img.shields.io/badge/typescript-4.5.2-brightgreen)

A modern JavaScript animation engine built on ES6+ standards with strong TypeScript definitions and most essential features for the web with easy to use methods to set up high performance, cross-browser animations. The focus is code quality, flexibility, performance and size. 



KUTE.js packs a series of components for presentation attributes, SVG transform, draw SVG strokes and path morphing, text string write up or number countdowns, plus additional CSS properties like colors, border-radius or typographic properties.

For components documentation, examples and other cool tips, check the [demo](http://thednp.github.io/kute.js/).


# Components
KUTE.js includes 18 components, but not all of them are bundled with the default distribution package:

* [backgroundPosition](http://thednp.github.io/kute.js/backgroundPosition.html) - enables the animation for the `backgroundPosition` CSS property
* [borderRadius](http://thednp.github.io/kute.js/borderRadius.html) - enables the animation for all the **borderRadius** properties
* [boxModel](http://thednp.github.io/kute.js/boxModel.html) - enables the animation for the **boxModel** properties like `top` , `left`, `width`, etc
* [clipProperty](http://thednp.github.io/kute.js/clipProperty.html) - enables the animation for the `clip` property
* [colorProperties](http://thednp.github.io/kute.js/colorProperties.html) - enables the animation for the **color** properties like `color`, `backgroundColor`
* [filterEffects](http://thednp.github.io/kute.js/filterEffects.html) - enables the animation for the `filter` property
* [htmlAttributes](http://thednp.github.io/kute.js/htmlAttributes.html) - enables the animation for any numeric as well as some color based **HTML Attributes** 
* [opacityProperty](http://thednp.github.io/kute.js/opacityProperty.html) - enables the animation for the `opacity` property
* [scrollProperty](http://thednp.github.io/kute.js/scrollProperty.html) - enables the animation for the window/Element `scrollTop` Object property
* [shadowProperties](http://thednp.github.io/kute.js/shadowProperties.html) - enables the animation for the **shadowProperties** properties: `textShadow` &amp; `boxShadow`
* [svgCubicMorph](http://thednp.github.io/kute.js/svgCubicMorph.html) - enables the animation for the `d` Presentation Attribute of the `<path>` SVGElement targets; this implements some [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/) functionality
* [svgMorph](http://thednp.github.io/kute.js/svgMorph.html) - enables the animation for the `d` Presentation Attribute of the `<path>` SVGElement targets; this component implements some [D3.js](https://github.com/d3/d3) and [flubber](https://github.com/veltman/flubber) functionality
* [svgDraw](http://thednp.github.io/kute.js/svgDraw.html) - enables the animation for the `strokeDasharray` and `strokeDashoffset` CSS properties specific to `<path>` SVGElement
* [svgTransform](http://thednp.github.io/kute.js/svgTransform.html) - enables the animation for the `transform` presentation attribute
* [textProperties](http://thednp.github.io/kute.js/textProperties.html) - enables the animation for numeric `HTMLTextElement` related CSS properties like `fontSize` or `letterSpacing`
* [textWrite](http://thednp.github.io/kute.js/textWrite.html) - enables the animation for the content of various strings
* [transformFunctions](http://thednp.github.io/kute.js/transformFunctions.html) - enables the animation for the `transform` CSS3 property, the default component bundled with the official build
* transformLegacy - enables the animation for the `transform` CSS3 property on legacy browsers IE9+, not included with the official build, but can be used in your custom builds
* [transformMatrix](http://thednp.github.io/kute.js/transformMatrix.html) - enables the animation for the `transform` CSS3 property; this component implements `DOMMatrix()` API and is super light

All above mentioned components have a BASE version which doesn't include value processing, and their purpose is to provide a way to ship your super light version of your application.


# Wiki
For a complete developer guide, usage and stuff like npm, visit [the wiki](https://github.com/thednp/kute.js/wiki).


# Browser Support
KUTE.js is redeveloped for maximum performance on modern browsers. Some legacy browsers might some help, so give them a small polyfill set with most essential features required by KUTE.js to work, powered by [minifill](https://github.com/thednp/minifill), try it. For broader projects you might want to consider <a href="https://cdn.polyfill.io/v2/docs/">polyfills</a>. 


# Special Thanks
* [Mike Bostock](https://bost.ocks.org/mike/) for his awesome [D3.js](https://github.com/d3/d3), one of the sources for our reworked [SVGMorph](http://thednp.github.io/kute.js/svgMorph.html) component.
* [Noah Veltman](https://github.com/veltman) for his awesome [flubber](https://github.com/veltman/flubber), another one of the sources for the SVGMorph component.
* [Andrew Willems](https://stackoverflow.com/users/5218951/andrew-willems) for his awesome [Stackoverflow answer](https://stackoverflow.com/questions/35560989/javascript-how-to-determine-a-svg-path-draw-direction) resulting in the creation of our [SVGCubicMorph](http://thednp.github.io/kute.js/svgCubicMorph.html) component.
* [Dmitry Baranovskiy](https://dmitry.baranovskiy.com/) for his awesome [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/), another source for our SVGCubicMorph component.
* [@dalisoft](https://github.com/dalisoft) contributed a great deal to the performance and functionality of previous versions of KUTE.js.


# Contributions
* [Contributors &amp; Collaborators](https://github.com/thednp/kute.js/graphs/contributors)


# License
[MIT License](https://github.com/thednp/kute.js/blob/master/LICENSE)
