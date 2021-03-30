import Tweens from '../objects/tweens.js';

export default (tw) => {
  const i = Tweens.indexOf(tw);
  if (i !== -1) Tweens.splice(i, 1);
};
