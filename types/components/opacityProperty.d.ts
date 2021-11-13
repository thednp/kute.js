export default opacityProperty;
declare namespace opacityProperty {
    export const component: string;
    export const property: string;
    export const defaultValue: number;
    export namespace Interpolate {
        export { numbers };
    }
    export { opacityFunctions as functions };
}
import numbers from "../interpolation/numbers.js";
declare namespace opacityFunctions {
    export { getOpacity as prepareStart };
    export { prepareOpacity as prepareProperty };
    export { onStartOpacity as onStart };
}
declare function getOpacity(tweenProp: any): any;
declare function prepareOpacity(tweenProp: any, value: any): number;
import { onStartOpacity } from "./opacityPropertyBase.js";
