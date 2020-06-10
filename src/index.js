import {version as Version} from './../package.json'
import Util from './objects/Util.js'
import Components from './objects/Components.js'
import Objects from './objects/Objects.js'
import Process from './process/Process.js'
import Internals from './core/Internals.js'
import Render from './core/Render.js'
import Interpolate from './objects/Interpolate.js'
import CubicBezier from 'cubic-bezier-easing'
import Easing from './easing/easing-bezier.js' // and CubicBezier easing functions
import Selector from './util/selector.js'

// TweenConstructor
import Tween from './tween/tween.js'
import TweenCollection from './tween/tweenCollection.js'
// interface
import to from './interface/to.js'
import fromTo from './interface/fromTo.js'
import allTo from './interface/allTo.js'
import allFromTo from './interface/allFromTo.js'

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