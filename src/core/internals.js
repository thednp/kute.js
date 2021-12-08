import add from './add';
import remove from './remove';
import getAll from './getAll';
import removeAll from './removeAll';
import { stop } from './render';
import linkInterpolation from './linkInterpolation';

const internals = {
  add,
  remove,
  getAll,
  removeAll,
  stop,
  linkInterpolation,
};

export default internals;
