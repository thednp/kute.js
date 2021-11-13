export function onStartShadow(tweenProp: any): void;
export default baseShadow;
declare namespace baseShadow {
    const component: string;
    namespace Interpolate {
        export { numbers };
        export { colors };
    }
    namespace functions {
        export { shadowPropOnStart as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
declare const shadowPropOnStart: {};
