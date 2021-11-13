export namespace onStartAttr {
    function attr(tweenProp: any): void;
    function attr(tweenProp: any): void;
    function attributes(tweenProp: any): void;
    function attributes(tweenProp: any): void;
}
export default baseAttributes;
export const attributes: {};
declare namespace baseAttributes {
    export { ComponentName as component };
    export const property: string;
    export namespace Interpolate {
        export { numbers };
        export { colors };
    }
    export namespace functions {
        export { onStartAttr as onStart };
    }
}
declare const ComponentName: "baseHTMLAttributes";
import numbers from "../interpolation/numbers.js";
import colors from "../interpolation/colors.js";
