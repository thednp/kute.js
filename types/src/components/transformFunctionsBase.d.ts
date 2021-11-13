export function onStartTransform(tweenProp: any): void;
export default BaseTransform;
declare namespace BaseTransform {
    const component: string;
    const property: string;
    namespace functions {
        export { onStartTransform as onStart };
    }
    namespace Interpolate {
        export { perspective };
        export { translate3d };
        export { rotate3d };
        export { translate };
        export { rotate };
        export { scale };
        export { skew };
    }
}
import perspective from "../interpolation/perspective.js";
import translate3d from "../interpolation/translate3d.js";
import rotate3d from "../interpolation/rotate3d.js";
import translate from "../interpolation/translate.js";
import rotate from "../interpolation/rotate.js";
import scale from "../interpolation/scale.js";
import skew from "../interpolation/skew.js";
