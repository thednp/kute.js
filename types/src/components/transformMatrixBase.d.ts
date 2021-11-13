export namespace onStartTransform {
    function transform(tweenProp: any): void;
    function transform(tweenProp: any): void;
    function CSS3Matrix(prop: any): void;
    function CSS3Matrix(prop: any): void;
}
export namespace baseMatrixTransform {
    export { matrixComponent as component };
    export const property: string;
    export namespace functions {
        export { onStartTransform as onStart };
    }
    export namespace Interpolate {
        export { numbers as perspective };
        export { arrays as translate3d };
        export { arrays as rotate3d };
        export { arrays as skew };
        export { arrays as scale3d };
    }
}
export default baseMatrixTransform;
declare const matrixComponent: "transformMatrixBase";
import numbers from "../interpolation/numbers.js";
import arrays from "../interpolation/arrays.js";
