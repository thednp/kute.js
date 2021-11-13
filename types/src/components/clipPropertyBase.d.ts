export function onStartClip(tweenProp: any): void;
export default baseClip;
declare namespace baseClip {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers };
    }
    namespace functions {
        export { onStartClip as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
