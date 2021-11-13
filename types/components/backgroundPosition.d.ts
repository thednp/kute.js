export default BackgroundPosition;
declare namespace BackgroundPosition {
    export const component: string;
    export const property: string;
    export const defaultValue: number[];
    export namespace Interpolate {
        export { numbers };
    }
    export { bgPositionFunctions as functions };
    export namespace Util {
        export { trueDimension };
    }
}
import numbers from "../interpolation/numbers.js";
declare namespace bgPositionFunctions {
    export { getBgPos as prepareStart };
    export { prepareBgPos as prepareProperty };
    export { onStartBgPos as onStart };
}
import trueDimension from "../util/trueDimension.js";
declare function getBgPos(prop: any): any;
declare function prepareBgPos(prop: any, value: any): number[];
import { onStartBgPos } from "./backgroundPositionBase.js";
