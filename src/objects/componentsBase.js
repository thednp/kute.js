import Animation from '../animation/animationBase';

// kute-base supported components
import baseTransform from '../components/transformFunctionsBase';
import baseBoxModel from '../components/boxModelBase';
import baseOpacity from '../components/opacityPropertyBase';
// import {baseCrossBrowserMove} from '../components/crossBrowserMove'
// support for kute-base ends here

const Components = {
  Transform: new Animation(baseTransform),
  BoxModel: new Animation(baseBoxModel),
  Opacity: new Animation(baseOpacity),
};

export default Components;
