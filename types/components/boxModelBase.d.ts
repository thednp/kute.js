export function boxModelOnStart(tweenProp: any): void;
export default baseBoxModel;
declare namespace baseBoxModel {
    export const component: string;
    export const category: string;
    export { baseBoxProps as properties };
    export namespace Interpolate {
        export { numbers };
    }
    export namespace functions {
        export { baseBoxOnStart as onStart };
    }
}
declare const baseBoxProps: string[];
import numbers from "../interpolation/numbers.js";
declare const baseBoxOnStart: {};
