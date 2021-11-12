import Render from './core/render.js';
import Interpolate from './objects/interpolate.js';
import Objects from './objects/objectsBase.js';
import Util from './objects/util.js';
import Easing from './easing/easing-base.js';
import Internals from './core/internals.js';
import Selector from './util/selector.js';

// Animation
import Animation from './animation/animationBase.js';
// Base Components
import Components from './objects/componentsBase.js';

// TweenConstructor
import Tween from './tween/tweenBase.js';
// Interface only fromTo
import fromTo from './interface/fromTo.js';

import { version as Version } from '../package.json';

export default {
  Animation,
  Components,

  Tween,
  fromTo,

  Objects,
  Easing,
  Util,
  Render,
  Interpolate,
  Internals,
  Selector,
  Version,
};
