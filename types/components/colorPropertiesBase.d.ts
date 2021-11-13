export function onStartColors(tweenProp: any): void;
export namespace baseColors {
    const component: string;
    const category: string;
    namespace Interpolate {
        export { numbers };
        export { colors };
    }
    namespace functions {
        export { colorsOnStart as onStart };
    }
}
export default baseColors;
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
declare const colorsOnStart: {};
