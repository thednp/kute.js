import selector from '../util/selector';
import TweenCollection from '../tween/tweenCollection';

/**
 * The `KUTE.allTo()` static method creates a new Tween object
 * for multiple `HTMLElement`s, `HTMLCollection` or `NodeListat`
 * at their current state.
 *
 * @param {Element[] | HTMLCollection | NodeList} elements target elements
 * @param {KUTE.tweenProps} endObject
 * @param {KUTE.tweenProps} optionsObj progress
 * @returns {TweenCollection} the Tween object collection
 */
export default function allTo(elements, endObject, optionsObj) {
  const options = optionsObj || {};
  options.resetStart = endObject;
  return new TweenCollection(selector(elements, true), endObject, endObject, options);
}
