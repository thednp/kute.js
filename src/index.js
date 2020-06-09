import {version as Version} from './../package.json'
import Objects, {Util,Components} from './core/objects.js'
import Process from './core/process.js'
import Internals,{Render} from './core/internals.js'
import Interpolate from './core/interpolate.js'
import CubicBezier from 'cubic-bezier-easing'
import Easing from './easing/easing-bezier.js' // and CubicBezier easing functions
import Selector from './util/selector.js'

// TweenConstructor
import Tween from './tween/tween.js'
import TweenCollection from './tween/tweenCollection.js'
import {to,fromTo,allTo,allFromTo} from './core/interface.js'

// import {default as Animation} from './animation/animationDevelopment.js'
import Animation from './animation/animation.js'

// components
import {essentialBoxModelOps} from './components/boxModel.js'
import {colorsOps} from './components/colorProperties.js'
import {attrOps} from './components/htmlAttributes.js'
import {opacityOps} from './components/opacityProperty.js'
import {textWriteOps} from './components/textWrite.js'
import {transformOps} from './components/transformFunctions.js'
import {scrollOps} from './components/scrollProperty.js'
import {svgDrawOps} from './components/svgDraw.js'
import {svgMorphOps} from './components/svgMorph.js'
import {svgTransformOps} from './components/svgTransform.js'

// init components
for (let component in Components) {
  let compOps = Components[component]
  Components[component] = new Animation(compOps)
}

export default {
  Animation,
  Components,

  // Tween Interface
  Tween,
  fromTo, 
  to, 
  // Tween Collection
  TweenCollection,
  allFromTo,
  allTo,
  // Tween Interface

  Objects,
  Util,
  Easing,
  CubicBezier,
  Render,
  Interpolate,
  Process,
  Internals,
  Selector,
  Version
}