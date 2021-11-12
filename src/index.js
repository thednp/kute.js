import CubicBezier from 'cubic-bezier-easing';
import Render from './core/render.js';
import Interpolate from './objects/interpolate.js';
import Objects from './objects/objects.js';
import Util from './objects/util.js';
import Internals from './core/internals.js';
import Process from './process/process.js';
import Easing from './easing/easing-bezier.js';
import Selector from './util/selector.js';

// TweenConstructor
import Tween from './tween/tween.js';
import TweenCollection from './tween/tweenCollection.js';
// interface
import to from './interface/to.js';
import fromTo from './interface/fromTo.js';
import allTo from './interface/allTo.js';
import allFromTo from './interface/allFromTo.js';

// Animation
import Animation from './animation/animation.js';

// Default Components
import Components from './objects/componentsDefault.js';

import { version as Version } from '../package.json';

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
