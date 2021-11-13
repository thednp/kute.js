export function getTextProp(prop: any): any;
export function prepareTextProp(prop: any, value: any): {
    v: number;
    u: string;
};
export default textProperties;
declare namespace textProperties {
    export const component: string;
    export const category: string;
    export { textProps as properties };
    export namespace defaultValues {
        const fontSize: number;
        const lineHeight: number;
        const letterSpacing: number;
        const wordSpacing: number;
    }
    export namespace Interpolate {
        export { units };
    }
    export { textPropFunctions as functions };
    export namespace Util {
        export { trueDimension };
    }
}
declare const textProps: string[];
import units from "../interpolation/units.js";
declare namespace textPropFunctions {
    export { getTextProp as prepareStart };
    export { prepareTextProp as prepareProperty };
    export { textOnStart as onStart };
}
import trueDimension from "../util/trueDimension.js";
declare const textOnStart: {};
