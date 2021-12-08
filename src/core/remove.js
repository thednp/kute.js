import Tweens from '../objects/tweens';

/**
 * KUTE.remove(Tween)
 *
 * @param {KUTE.Tween} tw a new tween to add
 */
const remove = (tw) => {
  const i = Tweens.indexOf(tw);
  if (i !== -1) Tweens.splice(i, 1);
};

export default remove;
