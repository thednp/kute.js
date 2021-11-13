export default essentialBoxModel;
declare namespace essentialBoxModel {
    export const component: string;
    export const category: string;
    export { essentialBoxProps as properties };
    export { essentialBoxPropsValues as defaultValues };
    export namespace Interpolate {
        export { numbers };
    }
    export { essentialBoxModelFunctions as functions };
    export namespace Util {
        export { trueDimension };
    }
}
declare const essentialBoxProps: string[];
declare namespace essentialBoxPropsValues {
    const top: number;
    const left: number;
    const width: number;
    const height: number;
}
import numbers from "../interpolation/numbers.js";
declare namespace essentialBoxModelFunctions {
    export { getBoxModel as prepareStart };
    export { prepareBoxModel as prepareProperty };
    export { essentialBoxOnStart as onStart };
}
import trueDimension from "../util/trueDimension.js";
declare function getBoxModel(tweenProp: any): any;
declare function prepareBoxModel(tweenProp: any, value: any): number;
declare const essentialBoxOnStart: {};
