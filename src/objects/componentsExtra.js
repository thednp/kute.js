import Animation from '../animation/animationDevelopment.js';

import BackgroundPosition from '../components/backgroundPosition.js';
import BorderRadius from '../components/borderRadius.js';
import BoxModel from '../components/boxModel.js';
import ClipProperty from '../components/clipProperty.js';
import ColorProperties from '../components/colorProperties.js';
import FilterEffects from '../components/filterEffects';
import HTMLAttributes from '../components/htmlAttributes.js';
import OpacityProperty from '../components/opacityProperty.js';
import SVGDraw from '../components/svgDraw.js';
import SVGCubicMorph from '../components/svgCubicMorph.js';
import SVGTransform from '../components/svgTransform.js';
import ScrollProperty from '../components/scrollProperty.js';
import ShadowProperties from '../components/shadowProperties.js';
import TextProperties from '../components/textProperties.js';
import TextWriteProperties from '../components/textWrite.js';
import MatrixTransform from '../components/transformMatrix.js';

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

// init components
Object.keys(Components).forEach((component) => {
  const compOps = Components[component];
  Components[component] = new Animation(compOps);
});

export default Components;
