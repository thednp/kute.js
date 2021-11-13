declare namespace _default {
    export { add };
    export { remove };
    export { getAll };
    export { removeAll };
    export { stop };
    export { linkInterpolation };
}
export default _default;
import add from "./add.js";
import remove from "./remove.js";
import getAll from "./getAll.js";
import removeAll from "./removeAll.js";
import { stop } from "./render.js";
import linkInterpolation from "./linkInterpolation.js";
