export function onStartCubicMorph(tweenProp: any): void;
export default baseSvgCubicMorph;
declare namespace baseSvgCubicMorph {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers };
        export { pathToString };
    }
    namespace functions {
        export { onStartCubicMorph as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
import pathToString from "svg-path-commander/src/convert/pathToString.js";
