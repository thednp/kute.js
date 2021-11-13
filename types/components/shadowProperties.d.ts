export function getShadow(tweenProp: any): any;
export function prepareShadow(tweenProp: any, propValue: any): any;
export default shadowProperties;
declare namespace shadowProperties {
    export const component: string;
    export { shadowProps as properties };
    export namespace defaultValues {
        const boxShadow: string;
        const textShadow: string;
    }
    export namespace Interpolate {
        export { numbers };
        export { colors };
    }
    export { shadowFunctions as functions };
    export namespace Util {
        export { processShadowArray };
        export { trueColor };
    }
}
declare const shadowProps: string[];
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
declare namespace shadowFunctions {
    export { getShadow as prepareStart };
    export { prepareShadow as prepareProperty };
    export { shadowPropOnStart as onStart };
}
declare function processShadowArray(shadow: any, tweenProp: any): any;
import trueColor from "../util/trueColor.js";
declare const shadowPropOnStart: {};
