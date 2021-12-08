import selector from '../util/selector';
import connect from '../objects/connect';

const { tween: TweenConstructor } = connect;

/**
 * The `KUTE.to()` static method returns a new Tween object
 * for a single `HTMLElement` at its current state.
 *
 * @param {Element} element target element
 * @param {KUTE.tweenProps} endObject
 * @param {KUTE.tweenOptions} optionsObj tween options
 * @returns {KUTE.Tween} the resulting Tween object
 */
export default function to(element, endObject, optionsObj) {
  const options = optionsObj || {};
  options.resetStart = endObject;
  return new TweenConstructor(selector(element), endObject, endObject, options);
}
