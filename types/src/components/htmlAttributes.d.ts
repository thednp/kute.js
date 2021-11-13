export function getAttr(tweenProp: any, value: any): {};
export function prepareAttr(tweenProp: any, attrObj: any): {};
export default htmlAttributes;
declare namespace htmlAttributes {
    export { ComponentName as component };
    export const property: string;
    export const subProperties: string[];
    export const defaultValue: {
        fill: string;
        stroke: string;
        'stop-color': string;
        opacity: number;
        'stroke-opacity': number;
        'fill-opacity': number;
    };
    export namespace Interpolate {
        export { numbers };
        export { colors };
    }
    export { attrFunctions as functions };
    export namespace Util {
        export { replaceUppercase };
        export { trueColor };
        export { trueDimension };
    }
}
declare const ComponentName: "htmlAttributes";
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
declare namespace attrFunctions {
    export { getAttr as prepareStart };
    export { prepareAttr as prepareProperty };
    export { onStartAttr as onStart };
}
declare function replaceUppercase(a: any): any;
import trueColor from "../util/trueColor.js";
import trueDimension from "../util/trueDimension.js";
import { onStartAttr } from "./htmlAttributesBase.js";
