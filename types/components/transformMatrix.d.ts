export default matrixTransform;
declare namespace matrixTransform {
    export { matrixComponent as component };
    export const property: string;
    export namespace defaultValue {
        const perspective: number;
        const translate3d: number[];
        const translateX: number;
        const translateY: number;
        const translateZ: number;
        const rotate3d: number[];
        const rotateX: number;
        const rotateY: number;
        const rotateZ: number;
        const skew: number[];
        const skewX: number;
        const skewY: number;
        const scale3d: number[];
        const scaleX: number;
        const scaleY: number;
        const scaleZ: number;
    }
    export { matrixFunctions as functions };
    export namespace Interpolate {
        export { numbers as perspective };
        export { arrays as translate3d };
        export { arrays as rotate3d };
        export { arrays as skew };
        export { arrays as scale3d };
    }
}
declare const matrixComponent: "transformMatrix";
declare namespace matrixFunctions {
    export { getTransform as prepareStart };
    export { prepareTransform as prepareProperty };
    export { onStartTransform as onStart };
    export { onCompleteTransform as onComplete };
    export { crossCheckTransform as crossCheck };
}
import numbers from "../interpolation/numbers.js";
import arrays from "../interpolation/arrays.js";
declare function getTransform(tweenProp: any, value: any): {};
declare function prepareTransform(tweenProp: any, value: any): {};
import { onStartTransform } from "./transformMatrixBase.js";
declare function onCompleteTransform(tweenProp: any): void;
declare function crossCheckTransform(tweenProp: any): void;
