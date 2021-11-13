export default scrollProperty;
declare namespace scrollProperty {
    export const component: string;
    export const property: string;
    export const defaultValue: number;
    export namespace Interpolate {
        export { numbers };
    }
    export { scrollFunctions as functions };
    export namespace Util {
        export { preventScroll };
        export { scrollIn };
        export { scrollOut };
        export { getScrollTargets };
        export { toggleScrollEvents };
        export { supportPassive };
    }
}
import numbers from "../interpolation/numbers.js";
declare namespace scrollFunctions {
    export { getScroll as prepareStart };
    export { prepareScroll as prepareProperty };
    export { onStartScroll as onStart };
    export { onCompleteScroll as onComplete };
}
import { preventScroll } from "./scrollPropertyBase.js";
import { scrollIn } from "./scrollPropertyBase.js";
import { scrollOut } from "./scrollPropertyBase.js";
import { getScrollTargets } from "./scrollPropertyBase.js";
import { toggleScrollEvents } from "./scrollPropertyBase.js";
import supportPassive from "shorter-js/src/boolean/supportPassive.js";
declare function getScroll(): number;
declare class getScroll {
    element: HTMLElement | undefined;
}
declare function prepareScroll(prop: any, value: any): number;
import { onStartScroll } from "./scrollPropertyBase.js";
import { onCompleteScroll } from "./scrollPropertyBase.js";
