import selector from '../util/selector';
import connect from '../objects/connect';

const { tween: TweenConstructor } = connect;

/**
 * The `KUTE.fromTo()` static method returns a new Tween object
 * for a single `HTMLElement` at a given state.
 *
 * @param {Element} element target element
 * @param {KUTE.tweenProps} startObject
 * @param {KUTE.tweenProps} endObject
 * @param {KUTE.tweenOptions} optionsObj tween options
 * @returns {KUTE.Tween} the resulting Tween object
 */
export default function fromTo(element, startObject, endObject, optionsObj) {
  const options = optionsObj || {};
  return new TweenConstructor(selector(element), startObject, endObject, options);
}
