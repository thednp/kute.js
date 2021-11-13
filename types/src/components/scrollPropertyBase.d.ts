export function preventScroll(e: any): void;
export function getScrollTargets(): {
    el: any;
    st: any;
};
export function toggleScrollEvents(action: any, element: any): void;
export function scrollIn(): void;
export function scrollOut(): void;
export function onStartScroll(tweenProp: any): void;
export class onStartScroll {
    constructor(tweenProp: any);
    element: HTMLElement | undefined;
}
export function onCompleteScroll(): void;
export const scrollContainer: HTMLElement;
export default baseScroll;
declare namespace baseScroll {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers };
    }
    namespace functions {
        export { onStartScroll as onStart };
        export { onCompleteScroll as onComplete };
    }
    namespace Util {
        export { preventScroll };
        export { scrollIn };
        export { scrollOut };
        export { getScrollTargets };
        export { supportPassive };
    }
}
import numbers from "../interpolation/numbers.js";
import supportPassive from "shorter-js/src/boolean/supportPassive.js";
