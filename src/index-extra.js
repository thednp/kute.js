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
import Tween from './tween/tweenExtra.js';
import TweenCollection from './tween/tweenCollection.js';
import ProgressBar from './util/progressBar.js';
// interface
import to from './interface/to.js';
import fromTo from './interface/fromTo.js';
import allTo from './interface/allTo.js';
import allFromTo from './interface/allFromTo.js';

// Animation
import Animation from './animation/animationDevelopment.js';

// Components Extra
import Components from './objects/componentsExtra.js';

import { version as Version } from '../package.json';

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
