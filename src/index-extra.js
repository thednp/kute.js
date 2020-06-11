import {version as Version} from './../package.json'
import Objects from './objects/Objects.js'
import Util from './objects/Util.js'
import Components from './objects/Components.js'
import Interpolate from './objects/Interpolate.js'
import Process from './process/Process.js'
import Internals from './core/Internals.js'
import Render from './core/Render.js'
import CubicBezier from 'cubic-bezier-easing'
import Easing from './easing/easing-bezier.js'
import Selector from './util/selector.js'

// TweenConstructor
import TweenExtra from './tween/tweenExtra.js'
import TweenCollection from './tween/tweenCollection.js'
import ProgressBar from './util/progressBar.js'
// interface
import to from './interface/to.js'
import fromTo from './interface/fromTo.js'
import allTo from './interface/allTo.js'
import allFromTo from './interface/allFromTo.js'

import Animation from './animation/animationDevelopment.js'

// components
import {bgPosOps} from './components/backgroundPosition.js'
import {radiusOps} from './components/borderRadius.js'
import {boxModelOps} from './components/boxModel.js'
import {clipOps} from './components/clipProperty.js'
import {colorsOps} from './components/colorProperties.js'
import {attrOps} from './components/htmlAttributes.js'
import {filterOps} from './components/filterEffects'
import {opacityOps} from './components/opacityProperty.js'
import {svgDrawOps} from './components/svgDraw.js'
import {svgCubicMorphOps} from './components/svgCubicMorph.js'
import {svgTransformOps} from './components/svgTransform.js'
import {scrollOps} from './components/scrollProperty.js'
import {shadowOps} from './components/shadowProperties.js'
import {textOps} from './components/textProperties.js'
import {textWriteOps} from './components/textWrite.js'
import {matrixTransformOps} from './components/transformMatrix.js'

for (let component in Components) {
  let compOps = Components[component]
  Components[component] = new Animation(compOps)
}

export default {
  Animation,
  Components,
  // Components: {
  //   BackgroundPosition,
  //   BorderRadius,
  //   BoxModel,
  //   ColorProperties,
  //   ClipProperty,
  //   FilterEffects,
  //   HTMLAttributes,
  //   OpacityProperty,
  //   TextProperties,
  //   TextWrite,
  //   TransformMatrix,
  //   ScrollProperty,
  //   ShadowProperties,
  //   SVGCubicMorph,
  //   SVGDraw,
  //   SVGTransform
  // },

  // Tween Interface
  TweenExtra,
  fromTo, 
  to, 
  // Tween Collection
  TweenCollection,
  ProgressBar,
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