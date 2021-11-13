export default boxModel;
declare namespace boxModel {
    export const component: string;
    export const category: string;
    export { boxModelProperties as properties };
    export { boxModelValues as defaultValues };
    export namespace Interpolate {
        export { numbers };
    }
    export { boxModelFunctions as functions };
}
declare const boxModelProperties: string[];
declare const boxModelValues: {};
import numbers from "../interpolation/numbers.js";
declare namespace boxModelFunctions {
    export { getBoxModel as prepareStart };
    export { prepareBoxModel as prepareProperty };
    export { boxPropsOnStart as onStart };
}
declare function getBoxModel(tweenProp: any): any;
declare function prepareBoxModel(tweenProp: any, value: any): number;
declare const boxPropsOnStart: {};
