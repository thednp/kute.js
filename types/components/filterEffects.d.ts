export default filterEffects;
declare namespace filterEffects {
    export const component: string;
    export const property: string;
    export namespace defaultValue {
        const opacity: number;
        const blur: number;
        const saturate: number;
        const grayscale: number;
        const brightness: number;
        const contrast: number;
        const sepia: number;
        const invert: number;
        const hueRotate: number;
        const dropShadow: (number | {
            r: number;
            g: number;
            b: number;
        })[];
        const url: string;
    }
    export namespace Interpolate {
        export { numbers as opacity };
        export { numbers as blur };
        export { numbers as saturate };
        export { numbers as grayscale };
        export { numbers as brightness };
        export { numbers as contrast };
        export { numbers as sepia };
        export { numbers as invert };
        export { numbers as hueRotate };
        export namespace dropShadow_1 {
            export { numbers };
            export { colors };
            export { dropShadow };
        }
        export { dropShadow_1 as dropShadow };
    }
    export { filterFunctions as functions };
    export namespace Util {
        export { parseDropShadow };
        export { parseFilterString };
        export { replaceDashNamespace };
        export { trueColor };
    }
}
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
import { dropShadow as dropShadow_2 } from "./filterEffectsBase.js";
declare namespace filterFunctions {
    export { getFilter as prepareStart };
    export { prepareFilter as prepareProperty };
    export { onStartFilter as onStart };
    export { crossCheckFilter as crossCheck };
}
declare function parseDropShadow(shadow: any): any[] | undefined;
declare function parseFilterString(currentStyle: any): {};
declare function replaceDashNamespace(str: any): any;
import trueColor from "../util/trueColor.js";
declare function getFilter(tweenProp: any, value: any): {};
declare function prepareFilter(tweenProp: any, value: any): {};
import { onStartFilter } from "./filterEffectsBase.js";
declare function crossCheckFilter(tweenProp: any): void;
