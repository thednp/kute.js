import selector from '../util/selector.js';
import connect from '../objects/connect.js';

export default function fromTo(element, startObject, endObject, optionsObj) {
  const options = optionsObj || {};
  const TweenConstructor = connect.tween;
  return new TweenConstructor(selector(element), startObject, endObject, options);
}
