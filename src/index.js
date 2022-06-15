// KUTE.js standard distribution version
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
import Tween from './tween/tween';
import TweenCollection from './tween/tweenCollection';
// interface
import to from './interface/to';
import fromTo from './interface/fromTo';
import allTo from './interface/allTo';
import allFromTo from './interface/allFromTo';

// Animation
import Animation from './animation/animation';

// Default Components
import Components from './objects/componentsDefault';

import Version from './util/version';

const KUTE = {
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
  Version,
};

export default KUTE;
