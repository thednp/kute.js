import selector from '../util/selector.js';
import connect from '../objects/connect.js';

export default function to(element, endObject, optionsObj) {
  const options = optionsObj || {};
  const TweenConstructor = connect.tween;
  options.resetStart = endObject;
  return new TweenConstructor(selector(element), endObject, endObject, options);
}
