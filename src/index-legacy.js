import Render from './core/render';
import Interpolate from './objects/interpolate';
import Objects from './objects/objects';
import Util from './objects/util';
import Internals from './core/internals';
import Process from './process/process';
import Easing from './easing/easing';
import Selector from './util/selector';

// TweenConstructor
import Tween from './tween/tween';
import TweenCollection from './tween/tweenCollection';
// interface
import to from './interface/to';
import fromTo from './interface/fromTo';
import allTo from './interface/allTo';
import allFromTo from './interface/allFromTo';
import Animation from './animation/animation';

// components
import BoxModel from './components/boxModelEssential';
import ColorProperties from './components/colorProperties';
import HTMLAttributes from './components/htmlAttributes';
import OpacityProperty from './components/opacityProperty';
import TextWriteProp from './components/textWrite';
import TransformLegacy from './components/transformLegacy';
import SVGDraw from './components/svgDraw';
import SVGMorph from './components/svgMorph';

import Version from './util/version';

const Components = {
  BoxModel,
  ColorProperties,
  HTMLAttributes,
  OpacityProperty,
  TextWriteProp,
  TransformLegacy,
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
  Render,
  Interpolate,
  Process,
  Internals,
  Selector,
  Version,
};
