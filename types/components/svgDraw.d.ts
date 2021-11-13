export default svgDraw;
declare namespace svgDraw {
    export const component: string;
    export const property: string;
    export const defaultValue: string;
    export namespace Interpolate {
        export { numbers };
    }
    export { svgDrawFunctions as functions };
    export namespace Util {
        export { getRectLength };
        export { getPolyLength };
        export { getLineLength };
        export { getCircleLength };
        export { getEllipseLength };
        export { getTotalLength };
        export { resetDraw };
        export { getDraw };
        export { percent };
    }
}
import numbers from "../interpolation/numbers.js";
declare namespace svgDrawFunctions {
    export { getDrawValue as prepareStart };
    export { prepareDraw as prepareProperty };
    export { onStartDraw as onStart };
}
declare function getRectLength(el: any): number;
declare function getPolyLength(el: any): number;
declare function getLineLength(el: any): number;
declare function getCircleLength(el: any): number;
declare function getEllipseLength(el: any): number;
declare function getTotalLength(el: any): number;
declare function resetDraw(elem: any): void;
declare function getDraw(element: any, value: any): any;
declare function percent(v: any, l: any): number;
declare function getDrawValue(): any;
declare function prepareDraw(a: any, o: any): any;
import { onStartDraw } from "./svgDrawBase.js";
