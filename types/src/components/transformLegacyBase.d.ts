export function onStartLegacyTransform(tweenProp: any): void;
export default BaseLegacyTransform;
declare namespace BaseLegacyTransform {
    const component: string;
    const property: string;
    namespace functions {
        export { onStartLegacyTransform as onStart };
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
    namespace Util {
        export { transformProperty };
    }
}
import perspective from "../interpolation/perspective.js";
import translate3d from "../interpolation/translate3d.js";
import rotate3d from "../interpolation/rotate3d.js";
import translate from "../interpolation/translate.js";
import rotate from "../interpolation/rotate.js";
import scale from "../interpolation/scale.js";
import skew from "../interpolation/skew.js";
import transformProperty from "../util/transformProperty.js";
