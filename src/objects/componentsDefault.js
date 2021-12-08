import Animation from '../animation/animation';

import EssentialBoxModel from '../components/boxModelEssential';
import ColorsProperties from '../components/colorProperties';
import HTMLAttributes from '../components/htmlAttributes';
import OpacityProperty from '../components/opacityProperty';
import TextWriteProp from '../components/textWrite';
import TransformFunctions from '../components/transformFunctions';
import SVGDraw from '../components/svgDraw';
import SVGMorph from '../components/svgMorph';

const Components = {
  EssentialBoxModel,
  ColorsProperties,
  HTMLAttributes,
  OpacityProperty,
  TextWriteProp,
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
