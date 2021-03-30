import selector from '../util/selector.js';
import TweenCollection from '../tween/tweenCollection.js';

export default function allFromTo(elements, startObject, endObject, optionsObj) {
  const options = optionsObj || {};
  return new TweenCollection(selector(elements, true), startObject, endObject, options);
}
