export function dropShadow(a: any, b: any, v: any): string;
export function onStartFilter(tweenProp: any): void;
export default baseFilter;
declare namespace baseFilter {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers as opacity };
        export { numbers as blur };
        export { numbers as saturate };
        export { numbers as grayscale };
        export { numbers as brightness };
        export { numbers as contrast };
        export { numbers as sepia };
        export { numbers as invert };
        export { numbers as hueRotate };
        export namespace dropShadow {
            export { numbers };
            export { colors };
            export { dropShadow };
        }
    }
    namespace functions {
        export { onStartFilter as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
