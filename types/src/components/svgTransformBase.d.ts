export function svgTransformOnStart(tweenProp: any): void;
export default baseSVGTransform;
declare namespace baseSVGTransform {
    const component: string;
    const property: string;
    namespace defaultOptions {
        const transformOrigin: string;
    }
    namespace Interpolate {
        export { numbers };
    }
    namespace functions {
        export { svgTransformOnStart as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
