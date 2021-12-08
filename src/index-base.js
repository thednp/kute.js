import Render from './core/render';
import Interpolate from './objects/interpolate';
import Objects from './objects/objectsBase';
import Util from './objects/util';
import Easing from './easing/easing-base';
import Internals from './core/internals';
import Selector from './util/selector';

// Animation
import Animation from './animation/animationBase';
// Base Components
import Components from './objects/componentsBase';

// TweenConstructor
import Tween from './tween/tweenBase';
// Interface only fromTo
import fromTo from './interface/fromTo';

import Version from './util/version';

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
