import selector from '../util/selector';
import TweenCollection from '../tween/tweenCollection';

/**
 * The `KUTE.allFromTo()` static method creates a new Tween object
 * for multiple `HTMLElement`s, `HTMLCollection` or `NodeListat`
 * at a given state.
 *
 * @param {Element[] | HTMLCollection | NodeList} elements target elements
 * @param {KUTE.tweenProps} startObject
 * @param {KUTE.tweenProps} endObject
 * @param {KUTE.tweenOptions} optionsObj tween options
 * @returns {TweenCollection} the Tween object collection
 */
export default function allFromTo(elements, startObject, endObject, optionsObj) {
  const options = optionsObj || {};
  return new TweenCollection(selector(elements, true), startObject, endObject, options);
}
