export function onStartSVGMorph(tweenProp: any): void;
export default baseSVGMorph;
declare namespace baseSVGMorph {
    export const component: string;
    export const property: string;
    export { coords as Interpolate };
    export namespace functions {
        export { onStartSVGMorph as onStart };
    }
}
import coords from "../interpolation/coords.js";
