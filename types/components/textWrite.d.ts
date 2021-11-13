export function createTextTweens(target: any, newText: any, ops: any): false | any[];
export namespace textWriteFunctions {
    export { getWrite as prepareStart };
    export { prepareText as prepareProperty };
    export { onStartWrite as onStart };
}
export namespace textWrite {
    export const component: string;
    export const category: string;
    export const properties: string[];
    export namespace defaultValues {
        const text: string;
        const number: string;
    }
    export namespace defaultOptions {
        const textChars: string;
    }
    export namespace Interpolate {
        export { numbers };
    }
    export { textWriteFunctions as functions };
    export namespace Util {
        export { charSet };
        export { createTextTweens };
    }
}
export default textWrite;
declare function getWrite(): any;
declare function prepareText(tweenProp: any, value: any): any;
import { onStartWrite } from "./textWriteBase.js";
import numbers from "../interpolation/numbers.js";
import { charSet } from "./textWriteBase.js";
