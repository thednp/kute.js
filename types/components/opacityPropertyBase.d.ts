export function onStartOpacity(tweenProp: any): void;
export default baseOpacity;
declare namespace baseOpacity {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers };
    }
    namespace functions {
        export { onStartOpacity as onStart };
    }
}
import numbers from "../interpolation/numbers.js";
