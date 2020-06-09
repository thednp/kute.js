import {version as Version} from './../package.json'
import Objects,{Util,Components} from './core/objects.js'
import Interpolate from './core/interpolate.js'
import Process from './core/process.js'
import Internals,{Render} from './core/internals.js'
import CubicBezier from 'cubic-bezier-easing'
import Easing from './easing/easing-bezier.js'
import Selector from './util/selector.js'

// TweenConstructor
import TweenExtra from './tween/tweenExtra.js'
import TweenCollection from './tween/tweenCollection.js'
import ProgressBar from './util/progress.js'
import {to,fromTo,allTo,allFromTo} from './core/interface.js'

import {default as Animation} from './animation/animationDevelopment.js'

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

const BackgroundPosition = new Animation(bgPosOps)
const BorderRadius = new Animation(radiusOps)
const BoxModel = new Animation(boxModelOps)
const ColorProperties = new Animation(colorsOps)
const ClipProperty = new Animation(clipOps)
const FilterEffects = new Animation(filterOps)
const HTMLAttributes = new Animation(attrOps)
const OpacityProperty = new Animation(opacityOps)
const TextProperties = new Animation(textOps)
const TextWrite = new Animation(textWriteOps)
const TransformMatrix = new Animation(matrixTransformOps)
const ScrollProperty = new Animation(scrollOps)
const ShadowProperties = new Animation(shadowOps)
const SVGCubicMorph = new Animation(svgCubicMorphOps)
const SVGDraw = new Animation(svgDrawOps)
const SVGTransform = new Animation(svgTransformOps)

// for (let component in Components) {
//   let compOps = Components[component]
//   Components[component] = new Animation(compOps)
// }

export default {
  Animation,
  // Components,
  Components: {
    BackgroundPosition,
    BorderRadius,
    BoxModel,
    ColorProperties,
    ClipProperty,
    FilterEffects,
    HTMLAttributes,
    OpacityProperty,
    TextProperties,
    TextWrite,
    TransformMatrix,
    ScrollProperty,
    ShadowProperties,
    SVGCubicMorph,
    SVGDraw,
    SVGTransform
  },

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