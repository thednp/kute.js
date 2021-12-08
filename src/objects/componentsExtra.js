import Animation from '../animation/animationDevelopment';

import BackgroundPosition from '../components/backgroundPosition';
import BorderRadius from '../components/borderRadius';
import BoxModel from '../components/boxModel';
import ClipProperty from '../components/clipProperty';
import ColorProperties from '../components/colorProperties';
import FilterEffects from '../components/filterEffects';
import HTMLAttributes from '../components/htmlAttributes';
import OpacityProperty from '../components/opacityProperty';
import SVGDraw from '../components/svgDraw';
import SVGCubicMorph from '../components/svgCubicMorph';
import SVGTransform from '../components/svgTransform';
import ScrollProperty from '../components/scrollProperty';
import ShadowProperties from '../components/shadowProperties';
import TextProperties from '../components/textProperties';
import TextWriteProperties from '../components/textWrite';
import MatrixTransform from '../components/transformMatrix';

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
