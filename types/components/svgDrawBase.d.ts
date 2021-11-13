export function onStartDraw(tweenProp: any): void;
export default baseSVGDraw;
declare namespace baseSVGDraw {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers };
    }
    namespace functions {
        export { onStartDraw as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
