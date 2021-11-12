import Animation from '../animation/animation.js';

import EssentialBoxModel from '../components/boxModelEssential.js';
import ColorsProperties from '../components/colorProperties.js';
import HTMLAttributes from '../components/htmlAttributes.js';
import OpacityProperty from '../components/opacityProperty.js';
import TextWrite from '../components/textWrite.js';
import TransformFunctions from '../components/transformFunctions.js';
import SVGDraw from '../components/svgDraw.js';
import SVGMorph from '../components/svgMorph.js';

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

export default Components;
