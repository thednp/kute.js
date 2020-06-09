import {version as Version} from './../package.json'
import {Util, BaseObjects as Objects} from './core/objects.js'
import Easing from './easing/easing-base.js'
import Internals,{Render} from './core/internals.js'
import Selector from './util/selector.js'
import Interpolate from './core/interpolate.js'

import {default as Animation} from './animation/animationBase.js'

// TweenConstructor
import TweenBase from './tween/tweenBase.js'
// Interface only fromTo
import {fromTo} from './core/interface.js'

import {baseTransformOps} from './components/transformFunctions.js'
import {baseBoxModelOps} from './components/boxModel.js'
import {baseOpacityOps} from './components/opacityProperty.js'
import {baseScrollOps} from './components/scrollProperty.js'
// import {baseCrossBrowserMoveOps} from './components/crossBrowserMove.js'

const BaseTransform = new Animation(baseTransformOps)
const BaseBoxModel = new Animation(baseBoxModelOps)
const BaseOpacity = new Animation(baseOpacityOps)
const BaseScroll = new Animation(baseScrollOps)
// const BaseCrossBrowserMove = new Animation(baseCrossBrowserMoveOps)
// support for kute-base.js ends here

export default {
  Animation,
  Components: {
    BaseTransform,
    BaseBoxModel,
    BaseScroll,
    BaseOpacity,
    // BaseCrossBrowserMove
  },

  TweenBase,
  fromTo, 

  Objects,
  Easing,
  Util,
  Render,
  Interpolate,
  Internals,
  Selector,
  Version
}