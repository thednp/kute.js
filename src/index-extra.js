import CubicBezier from '@thednp/bezier-easing';
import Render from './core/render';
import Interpolate from './objects/interpolate';
import Objects from './objects/objects';
import Util from './objects/util';
import Internals from './core/internals';
import Process from './process/process';
import Easing from './easing/easing-bezier';
import Selector from './util/selector';

// TweenConstructor
import Tween from './tween/tweenExtra';
import TweenCollection from './tween/tweenCollection';
import ProgressBar from './util/progressBar';
// interface
import to from './interface/to';
import fromTo from './interface/fromTo';
import allTo from './interface/allTo';
import allFromTo from './interface/allFromTo';

// Animation
import Animation from './animation/animationDevelopment';

// Components Extra
import Components from './objects/componentsExtra';

import Version from './util/version';

export default {
  Animation,
  Components,

  // Tween Interface
  Tween,
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
  Version,
};
