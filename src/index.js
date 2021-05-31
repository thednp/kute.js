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

import Animation from './animation/animation.js';

// components
import EssentialBoxModel from './components/boxModelEssential.js';
import ColorsProperties from './components/colorProperties.js';
import HTMLAttributes from './components/htmlAttributes.js';
import OpacityProperty from './components/opacityProperty.js';
import TextWrite from './components/textWrite.js';
import TransformFunctions from './components/transformFunctions.js';
import SVGDraw from './components/svgDraw.js';
import SVGMorph from './components/svgMorph.js';

import { version as Version } from '../package.json';

const Components = {
  EssentialBoxModel,
  ColorsProperties,
  HTMLAttributes,
  OpacityProperty,
  TextWrite,
  TransformFunctions,
  SVGDraw,
  SVGMorph,
};

// init components
Object.keys(Components).forEach((component) => {
  const compOps = Components[component];
  Components[component] = new Animation(compOps);
});

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
  Version,
};
