export default colorProperties;
declare namespace colorProperties {
    export const component: string;
    export const category: string;
    export { supportedColors as properties };
    export { defaultColors as defaultValues };
    export namespace Interpolate {
        export { numbers };
        export { colors };
    }
    export { colorFunctions as functions };
    export namespace Util {
        export { trueColor };
    }
}
declare const supportedColors: string[];
declare const defaultColors: {};
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
declare namespace colorFunctions {
    export { getColor as prepareStart };
    export { prepareColor as prepareProperty };
    export { colorsOnStart as onStart };
}
import trueColor from "../util/trueColor.js";
declare function getColor(prop: any): any;
declare function prepareColor(prop: any, value: any): {
    r: number;
    g: number;
    b: number;
    a?: undefined;
} | {
    r: number;
    g: number;
    b: number;
    a: number;
} | undefined;
declare const colorsOnStart: {};
