import Animation from '../animation/animationBase.js';

// kute-base.js supported components
import baseTransform from '../components/transformFunctionsBase.js';
import baseBoxModel from '../components/boxModelBase.js';
import baseOpacity from '../components/opacityPropertyBase.js';
// import {baseCrossBrowserMove} from '../components/crossBrowserMove.js'
// support for kute-base.js ends here

const Components = {
  Transform: new Animation(baseTransform),
  BoxModel: new Animation(baseBoxModel),
  Opacity: new Animation(baseOpacity),
};

export default Components;
