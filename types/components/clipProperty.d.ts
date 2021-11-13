export default clipProperty;
declare namespace clipProperty {
    export const component: string;
    export const property: string;
    export const defaultValue: number[];
    export namespace Interpolate {
        export { numbers };
    }
    export { clipFunctions as functions };
    export namespace Util {
        export { trueDimension };
    }
}
import numbers from "../interpolation/numbers.js";
declare namespace clipFunctions {
    export { getClip as prepareStart };
    export { prepareClip as prepareProperty };
    export { onStartClip as onStart };
}
import trueDimension from "../util/trueDimension.js";
declare function getClip(tweenProp: any): any;
declare function prepareClip(tweenProp: any, value: any): any;
import { onStartClip } from "./clipPropertyBase.js";
