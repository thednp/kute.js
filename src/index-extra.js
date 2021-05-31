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

import Animation from './animation/animationDevelopment.js';

// components
import BackgroundPosition from './components/backgroundPosition.js';
import BorderRadius from './components/borderRadius.js';
import BoxModel from './components/boxModel.js';
import ClipProperty from './components/clipProperty.js';
import ColorProperties from './components/colorProperties.js';
import FilterEffects from './components/filterEffects';
import HTMLAttributes from './components/htmlAttributes.js';
import OpacityProperty from './components/opacityProperty.js';
import SVGDraw from './components/svgDraw.js';
import SVGCubicMorph from './components/svgCubicMorph.js';
import SVGTransform from './components/svgTransform.js';
import ScrollProperty from './components/scrollProperty.js';
import ShadowProperties from './components/shadowProperties.js';
import TextProperties from './components/textProperties.js';
import TextWriteProperties from './components/textWrite.js';
import MatrixTransform from './components/transformMatrix.js';

import { version as Version } from '../package.json';

const Components = {
  BackgroundPosition,
  BorderRadius,
  BoxModel,
  ClipProperty,
  ColorProperties,
  FilterEffects,
  HTMLAttributes,
  OpacityProperty,
  SVGDraw,
  SVGCubicMorph,
  SVGTransform,
  ScrollProperty,
  ShadowProperties,
  TextProperties,
  TextWriteProperties,
  MatrixTransform,
};

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
